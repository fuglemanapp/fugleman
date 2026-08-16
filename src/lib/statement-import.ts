import { createHash } from "crypto";

export type StatementFormat = "CSV" | "OFX";

export type CsvMapping = {
  date?: string;
  description?: string;
  amount?: string;
  credit?: string;
  debit?: string;
  category?: string;
};

export type StatementPreview = {
  date: string;
  description: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  category: string;
};

type ParsedCsv = { headers: string[]; rows: string[][] };
type ParsedStatement = { format: StatementFormat; csv?: ParsedCsv; ofx?: StatementPreview[] };

const maximumRecords = 1_000;

function normalized(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function splitCsvLine(line: string, delimiter: string) {
  const cells: string[] = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"') {
      if (quoted && line[index + 1] === '"') {
        cell += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === delimiter && !quoted) {
      cells.push(cell.trim());
      cell = "";
    } else {
      cell += character;
    }
  }

  cells.push(cell.trim());
  return cells;
}

function csvDelimiter(firstLine: string) {
  return [";", ",", "\t"].sort(
    (first, second) => splitCsvLine(firstLine, second).length - splitCsvLine(firstLine, first).length,
  )[0];
}

function parseCsv(content: string): ParsedCsv {
  const lines = content.replace(/^\uFEFF/, "").split(/\r?\n/).filter((line) => line.trim());
  if (lines.length < 2) {
    throw new Error("O CSV precisa conter um cabeçalho e ao menos uma movimentação.");
  }

  const rawHeaders = splitCsvLine(lines[0], csvDelimiter(lines[0]));
  if (rawHeaders.length < 2) {
    throw new Error("Não foi possível identificar as colunas do CSV.");
  }

  const headers = rawHeaders.map((header, index) => header || `Coluna ${index + 1}`);
  const rows = lines.slice(1, maximumRecords + 1).map((line) => {
    const cells = splitCsvLine(line, csvDelimiter(lines[0]));
    return headers.map((_, index) => cells[index] || "");
  });

  return { headers, rows };
}

function parseAmount(raw: string) {
  const value = raw.trim();
  if (!value) {
    return 0;
  }

  const negative = value.startsWith("-") || /^\(.+\)$/.test(value);
  const digits = value.replace(/[()\sR$]/g, "");
  const comma = digits.lastIndexOf(",");
  const dot = digits.lastIndexOf(".");
  let normalizedValue = digits;

  if (comma > dot) normalizedValue = digits.replace(/\./g, "").replace(",", ".");
  else if (dot > comma && comma !== -1) normalizedValue = digits.replace(/,/g, "");
  else if (comma !== -1) normalizedValue = digits.replace(",", ".");

  const amount = Number(normalizedValue.replace(/[^0-9.-]/g, ""));
  if (!Number.isFinite(amount)) {
    return 0;
  }

  return negative ? -Math.abs(amount) : amount;
}

function parseDate(raw: string) {
  const value = raw.trim();
  const ymd = value.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
  const dmy = value.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})/);
  let year: number;
  let month: number;
  let day: number;

  if (ymd) {
    [, year, month, day] = ymd.map(Number);
  } else if (dmy) {
    [, day, month, year] = dmy.map(Number);
    if (year < 100) {
      year += 2000;
    }
  } else {
    return null;
  }

  const date = new Date(Date.UTC(year, month - 1, day, 12));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day ? date : null;
}

function valueFromRow(headers: string[], row: string[], key?: string) {
  const index = key ? headers.indexOf(key) : -1;
  return index >= 0 ? row[index].trim() : "";
}

function suggestedColumn(headers: string[], aliases: string[]) {
  return headers.find((header) => aliases.some((alias) => normalized(header).includes(alias)));
}

export function suggestedCsvMapping(headers: string[]): CsvMapping {
  return {
    date: suggestedColumn(headers, ["data", "date", "lancamento", "transacao"]),
    description: suggestedColumn(headers, ["descricao", "description", "historico", "memo", "detalhe", "titulo"]),
    amount: suggestedColumn(headers, ["valor", "amount", "value", "quantia"]),
    credit: suggestedColumn(headers, ["credito", "entrada", "credit", "income"]),
    debit: suggestedColumn(headers, ["debito", "saida", "despesa", "debit", "expense"]),
    category: suggestedColumn(headers, ["categoria", "category"]),
  };
}

function parseOfx(content: string): StatementPreview[] {
  const transactions = content.match(/<STMTTRN>[\s\S]*?<\/STMTTRN>|<STMTTRN>[\s\S]*?(?=<STMTTRN>|<LEDGERBAL>|$)/gi) || [];
  const readTag = (block: string, tag: string) => block.match(new RegExp(`<${tag}>([^<\r\n]+)`, "i"))?.[1]?.trim() || "";

  return transactions.flatMap((block) => {
    const date = parseDate(readTag(block, "DTPOSTED"));
    const amount = parseAmount(readTag(block, "TRNAMT"));
    const description = readTag(block, "NAME") || readTag(block, "MEMO") || "Movimentação importada";
    if (!date || !amount) {
      return [];
    }

    return [{ date: date.toISOString(), description: description.slice(0, 140), amount: Math.abs(amount), type: amount >= 0 ? "INCOME" as const : "EXPENSE" as const, category: "Importado" }];
  }).slice(0, maximumRecords);
}

export function parseStatement(content: string, fileName: string): ParsedStatement {
  const extension = fileName.toLowerCase().split(".").pop();
  if (extension === "ofx" || extension === "qfx" || /<OFX>|OFXHEADER:/i.test(content.slice(0, 500))) {
    return { format: "OFX", ofx: parseOfx(content) };
  }
  if (extension === "csv" || extension === "txt") {
    return { format: "CSV", csv: parseCsv(content) };
  }
  throw new Error("Envie um arquivo CSV, OFX ou QFX.");
}

function recordsFromCsv(csv: ParsedCsv, mapping: CsvMapping): StatementPreview[] {
  if (!mapping.date || !mapping.description || (!mapping.amount && !mapping.credit && !mapping.debit)) {
    return [];
  }

  return csv.rows.flatMap((row) => {
    const date = parseDate(valueFromRow(csv.headers, row, mapping.date));
    const description = valueFromRow(csv.headers, row, mapping.description).slice(0, 140);
    const category = valueFromRow(csv.headers, row, mapping.category).slice(0, 80) || "Importado";
    const amountValue = mapping.amount ? parseAmount(valueFromRow(csv.headers, row, mapping.amount)) : 0;
    const credit = mapping.credit ? Math.abs(parseAmount(valueFromRow(csv.headers, row, mapping.credit))) : 0;
    const debit = mapping.debit ? Math.abs(parseAmount(valueFromRow(csv.headers, row, mapping.debit))) : 0;
    const amount = mapping.amount ? amountValue : credit || -debit;

    if (!date || !description || !amount) {
      return [];
    }

    return [{ date: date.toISOString(), description, amount: Math.abs(amount), type: amount >= 0 ? "INCOME" as const : "EXPENSE" as const, category }];
  });
}

export function previewStatement(content: string, fileName: string, mapping?: CsvMapping) {
  const statement = parseStatement(content, fileName);
  if (statement.format === "OFX") {
    return { format: statement.format, preview: statement.ofx || [], headers: [], suggestedMapping: {} as CsvMapping };
  }

  const csv = statement.csv!;
  const suggestedMapping = mapping || suggestedCsvMapping(csv.headers);
  return { format: statement.format, preview: recordsFromCsv(csv, suggestedMapping).slice(0, 8), headers: csv.headers, suggestedMapping };
}

export function importableRecords(content: string, fileName: string, mapping?: CsvMapping) {
  const statement = parseStatement(content, fileName);
  const records = statement.format === "OFX" ? statement.ofx || [] : recordsFromCsv(statement.csv!, mapping || suggestedCsvMapping(statement.csv!.headers));
  if (!records.length) {
    throw new Error("Nenhuma movimentação válida foi encontrada. Confira o arquivo e o mapeamento das colunas.");
  }
  return records;
}

export function importExternalId(contextKey: string, record: StatementPreview, occurrence = 0) {
  const fingerprint = `${contextKey}|${record.date.slice(0, 10)}|${record.type}|${record.amount.toFixed(2)}|${record.description.trim().toLocaleLowerCase("pt-BR")}|${occurrence}`;
  return `file:${createHash("sha256").update(fingerprint).digest("hex")}`;
}
