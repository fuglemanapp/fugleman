import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/current-user";
import { resolveFinancialContext } from "@/lib/financial-context";
import { importExternalId, importableRecords, previewStatement, type CsvMapping } from "@/lib/statement-import";
import prisma from "@/lib/prisma";
import { applyTransactionRule } from "@/lib/transaction-rules";

export const dynamic = "force-dynamic";

const maximumFileSize = 2 * 1024 * 1024;

type ImportPayload = {
  action?: unknown;
  content?: unknown;
  fileName?: unknown;
  mapping?: unknown;
  context?: unknown;
};

function validMapping(value: unknown): CsvMapping | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  const mapping = value as Record<string, unknown>;
  const field = (key: keyof CsvMapping) => typeof mapping[key] === "string" ? mapping[key] : undefined;
  return { date: field("date"), description: field("description"), amount: field("amount"), credit: field("credit"), debit: field("debit"), category: field("category") };
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Faça login para importar um extrato." }, { status: 401 });

  const payload = await request.json().catch(() => null) as ImportPayload | null;
  const content = typeof payload?.content === "string" ? payload.content : "";
  const fileName = typeof payload?.fileName === "string" ? payload.fileName.trim() : "";
  const mapping = validMapping(payload?.mapping);
  const context = await resolveFinancialContext(user.id, typeof payload?.context === "string" ? payload.context : null);
  if (!context) return NextResponse.json({ error: "Espaço financeiro inválido ou sem acesso." }, { status: 403 });

  if (!content || !fileName) return NextResponse.json({ error: "Selecione um arquivo CSV, OFX ou QFX." }, { status: 400 });
  if (Buffer.byteLength(content, "utf8") > maximumFileSize) return NextResponse.json({ error: "O arquivo deve ter no máximo 2 MB." }, { status: 413 });

  try {
    const enrich = async () => {
      const records = importableRecords(content, fileName, mapping);
      return Promise.all(records.map(async (record) => {
        const suggestion = await applyTransactionRule(user.id, record.description, { category: record.category, type: record.type });
        return { ...record, category: suggestion.category, type: suggestion.type || record.type, matchedBy: suggestion.matchedBy };
      }));
    };
    if (payload?.action === "inspect") {
      const preview = previewStatement(content, fileName, mapping);
      const records = await enrich();
      return NextResponse.json({ ...preview, preview: records.slice(0, 8) });
    }
    if (payload?.action !== "import") return NextResponse.json({ error: "Ação de importação inválida." }, { status: 400 });

    const records = await enrich();
    const occurrences = new Map<string, number>();
    const candidates = records.map((record) => {
      const fingerprint = `${record.date}|${record.type}|${record.amount}|${record.description.trim().toLocaleLowerCase("pt-BR")}`;
      const occurrence = occurrences.get(fingerprint) || 0;
      occurrences.set(fingerprint, occurrence + 1);
      return { ...record, externalId: importExternalId(context.key, record, occurrence) };
    });
    const existing = await prisma.transaction.findMany({ where: { externalId: { in: candidates.map((record) => record.externalId) } }, select: { externalId: true } });
    const existingIds = new Set(existing.flatMap((record) => record.externalId ? [record.externalId] : []));
    const newRecords = candidates.filter((record) => !existingIds.has(record.externalId));

    if (newRecords.length) {
      await prisma.transaction.createMany({
        data: newRecords.map((record) => ({ userId: user.id, teamId: context.teamId, amount: record.amount, description: record.description, category: record.category, type: record.type, date: new Date(record.date), source: "FILE_IMPORT", externalId: record.externalId })),
      });
    }

    return NextResponse.json({ imported: newRecords.length, skipped: records.length - newRecords.length, total: records.length });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Não foi possível ler o extrato." }, { status: 400 });
  }
}
