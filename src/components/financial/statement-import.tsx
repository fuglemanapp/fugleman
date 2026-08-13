"use client";

import { ChangeEvent, useRef, useState } from "react";
import { FileSpreadsheet, LoaderCircle, Upload, X } from "lucide-react";

type CsvMapping = { date?: string; description?: string; amount?: string; credit?: string; debit?: string; category?: string };
type Preview = { date: string; description: string; amount: number; type: "INCOME" | "EXPENSE"; category: string; matchedBy?: string };
type Inspection = { format: "CSV" | "OFX"; headers: string[]; preview: Preview[]; suggestedMapping: CsvMapping };

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const emptyValue = "__none__";

export function StatementImport({ onImported, context = "personal" }: { onImported: () => void; context?: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [fileName, setFileName] = useState("");
  const [content, setContent] = useState("");
  const [inspection, setInspection] = useState<Inspection | null>(null);
  const [mapping, setMapping] = useState<CsvMapping>({});
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function close() {
    setIsOpen(false);
    setFileName("");
    setContent("");
    setInspection(null);
    setMapping({});
    setMessage("");
    if (inputRef.current) inputRef.current.value = "";
  }

  async function inspectFile(file: File) {
    if (file.size > 2 * 1024 * 1024) {
      setMessage("O arquivo deve ter no máximo 2 MB.");
      return;
    }

    setIsLoading(true);
    setMessage("");
    try {
      const nextContent = await file.text();
      const response = await fetch("/api/transactions/import", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "inspect", content: nextContent, fileName: file.name, context }) });
      const body = await response.json() as Inspection & { error?: string };
      if (!response.ok) throw new Error(body.error || "Não foi possível ler o arquivo.");
      setFileName(file.name);
      setContent(nextContent);
      setInspection(body);
      setMapping(body.suggestedMapping || {});
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Não foi possível ler o arquivo.");
    } finally {
      setIsLoading(false);
    }
  }

  function selectFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) void inspectFile(file);
  }

  function selectMapping(field: keyof CsvMapping, value: string) {
    setMapping((current) => ({ ...current, [field]: value === emptyValue ? undefined : value }));
  }

  const csvReady = Boolean(mapping.date && mapping.description && (mapping.amount || mapping.credit || mapping.debit));
  const readyToImport = inspection?.format === "OFX" ? Boolean(inspection.preview.length) : csvReady;

  async function importStatement() {
    if (!inspection || !readyToImport) return;
    setIsLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/transactions/import", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "import", content, fileName, mapping, context }) });
      const body = await response.json() as { imported?: number; skipped?: number; error?: string };
      if (!response.ok) throw new Error(body.error || "Não foi possível importar o extrato.");
      const imported = body.imported || 0;
      const skipped = body.skipped || 0;
      setMessage(imported ? `${imported} movimentação(ões) importada(s)${skipped ? `; ${skipped} já existia(m).` : "."}` : "Nenhuma movimentação nova foi encontrada; os itens já existem no painel.");
      onImported();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Não foi possível importar o extrato.");
    } finally {
      setIsLoading(false);
    }
  }

  return <>
    <button type="button" onClick={() => setIsOpen(true)} className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-[#b9dcc6] bg-white px-5 text-sm font-semibold text-[#087d3c] transition-colors hover:bg-[#edf9f1]"><Upload className="h-4 w-4" /> Importar extrato</button>
    {isOpen && <div className="fixed inset-0 z-50 flex items-end bg-[#17372b]/35 backdrop-blur-sm sm:items-center sm:justify-center sm:p-6"><div role="dialog" aria-modal="true" aria-label="Importar extrato" className="max-h-[94dvh] w-full overflow-y-auto rounded-t-[2rem] bg-white p-6 shadow-2xl sm:max-w-2xl sm:rounded-[2rem] sm:p-8"><div className="flex items-start justify-between gap-5"><div><p className="text-xs font-bold uppercase tracking-[0.13em] text-[#079347]">Importar extrato</p><h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#17372b]">Traga suas movimentações.</h2><p className="mt-2 max-w-lg text-sm leading-6 text-[#678176]">Aceitamos CSV, OFX e QFX. O arquivo é usado apenas nesta importação e não fica guardado.</p></div><button type="button" onClick={close} className="rounded-xl p-2 text-[#718b7e] hover:bg-[#edf8f1]" aria-label="Fechar"><X className="h-5 w-5" /></button></div>
      {!inspection ? <div className="mt-7"><input ref={inputRef} onChange={selectFile} type="file" accept=".csv,.ofx,.qfx,.txt,text/csv,application/x-ofx" className="sr-only" id="statement-file" /><label htmlFor="statement-file" className="flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#c9dfd0] bg-[#f7fbf8] px-6 text-center transition-colors hover:border-[#72bd8c] hover:bg-[#f1faf4]"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-[#087d3c] shadow-sm"><FileSpreadsheet className="h-6 w-6" /></span><span className="mt-4 text-sm font-semibold text-[#315f48]">Selecione um extrato</span><span className="mt-1 text-xs text-[#789083]">CSV, OFX ou QFX · até 2 MB</span></label></div> : <div className="mt-7 space-y-5"><div className="flex items-center justify-between gap-3 rounded-2xl bg-[#f1faf4] p-4"><div className="min-w-0"><p className="truncate text-sm font-semibold text-[#315f48]">{fileName}</p><p className="mt-1 text-xs text-[#6f887b]">Formato {inspection.format} · {inspection.preview.length ? `${inspection.preview.length} item(ns) na prévia` : "configure as colunas abaixo"}</p></div><button type="button" onClick={() => { setInspection(null); setContent(""); setFileName(""); setMapping({}); }} className="text-sm font-semibold text-[#087d3c]">Trocar</button></div>
        {inspection.format === "CSV" && <div className="rounded-2xl border border-[#dcebe2] p-5"><p className="text-sm font-semibold text-[#315f48]">Confira as colunas do arquivo</p><p className="mt-1 text-xs leading-5 text-[#718b7e]">Mapeamos automaticamente quando possível. “Valor” usa positivo para entrada e negativo para saída; se o arquivo separar os dois, preencha Entrada e Saída.</p><div className="mt-4 grid gap-3 sm:grid-cols-2"><ColumnSelect label="Data" value={mapping.date} headers={inspection.headers} onChange={(value) => selectMapping("date", value)} required /><ColumnSelect label="Descrição" value={mapping.description} headers={inspection.headers} onChange={(value) => selectMapping("description", value)} required /><ColumnSelect label="Valor" value={mapping.amount} headers={inspection.headers} onChange={(value) => selectMapping("amount", value)} /><ColumnSelect label="Categoria (opcional)" value={mapping.category} headers={inspection.headers} onChange={(value) => selectMapping("category", value)} /><ColumnSelect label="Entrada / crédito" value={mapping.credit} headers={inspection.headers} onChange={(value) => selectMapping("credit", value)} /><ColumnSelect label="Saída / débito" value={mapping.debit} headers={inspection.headers} onChange={(value) => selectMapping("debit", value)} /></div>{!csvReady && <p className="mt-4 text-xs font-medium text-[#a35c32]">Escolha Data, Descrição e uma coluna de valor — ou as colunas de Entrada e Saída.</p>}</div>}
        {inspection.preview.length > 0 && <div className="overflow-hidden rounded-2xl border border-[#dcebe2]"><div className="border-b border-[#e7f0ea] bg-[#fbfdfb] px-4 py-3"><p className="text-sm font-semibold text-[#315f48]">Prévia da importação</p></div><div className="divide-y divide-[#edf3ef]">{inspection.preview.slice(0, 5).map((item, index) => <div key={`${item.date}-${item.description}-${index}`} className="flex items-center justify-between gap-4 px-4 py-3"><div className="min-w-0"><p className="truncate text-sm font-medium text-[#315f48]">{item.description}</p><p className="mt-0.5 text-xs text-[#789083]">{new Intl.DateTimeFormat("pt-BR").format(new Date(item.date))} · {item.category}{item.matchedBy ? <span className="ml-1 rounded-full bg-[#e7f8ed] px-1.5 py-0.5 text-[10px] font-bold text-[#087d3c]">Regra: {item.matchedBy}</span> : null}</p></div><p className={`shrink-0 text-sm font-semibold ${item.type === "INCOME" ? "text-[#087d3c]" : "text-[#b35445]"}`}>{item.type === "INCOME" ? "+" : "−"}{currency.format(item.amount)}</p></div>)}</div></div>}
      </div>}
      {message && <p className={`mt-5 rounded-xl px-4 py-3 text-sm ${message.includes("importada") || message.includes("já existem") ? "bg-[#edf9f1] text-[#315f48]" : "bg-[#fff1f1] text-[#a93636]"}`}>{message}</p>}
      <div className="mt-7 flex justify-end gap-3"><button type="button" onClick={close} className="h-11 rounded-xl px-4 text-sm font-semibold text-[#678176] hover:bg-[#f1f7f3]">Cancelar</button>{inspection && <button type="button" disabled={!readyToImport || isLoading} onClick={() => void importStatement()} className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#0b9d4e] px-5 text-sm font-semibold text-white hover:bg-[#078940] disabled:cursor-not-allowed disabled:opacity-60">{isLoading && <LoaderCircle className="h-4 w-4 animate-spin" />}{isLoading ? "Importando..." : "Confirmar importação"}</button>}</div>
    </div></div>}
  </>;
}

function ColumnSelect({ label, value, headers, onChange, required }: { label: string; value?: string; headers: string[]; onChange: (value: string) => void; required?: boolean }) {
  return <label className="block"><span className="mb-1.5 block text-xs font-semibold text-[#567465]">{label}{required ? " *" : ""}</span><select value={value || emptyValue} onChange={(event) => onChange(event.target.value)} className="h-11 w-full rounded-xl border border-[#d6e7dd] bg-[#fbfdfb] px-3 text-sm text-[#315f48] outline-none focus:border-[#079347] focus:ring-4 focus:ring-[#dff6e7]"><option value={emptyValue}>Não selecionar</option>{headers.map((header) => <option key={header} value={header}>{header}</option>)}</select></label>;
}
