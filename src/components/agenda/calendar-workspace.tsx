"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CalendarDays, ChevronLeft, ChevronRight, Clock3, LoaderCircle, Pencil, Plus, RefreshCw, ShieldCheck, Trash2, Users, X } from "lucide-react";

import { DashboardNav } from "@/components/dashboard/dashboard-nav";

type Owner = { id: string; name: string | null; email: string | null };
type AgendaEvent = { id: string; title: string; description: string | null; startTime: string; endTime: string; userId: string; isOwner: boolean; owner?: Owner };
type EventForm = { title: string; description: string; date: string; startTime: string; endTime: string };
type Family = { id: string; name: string; partner: { id: string; name: string; email: string | null } | null; memberCount: number; own: { enabled: boolean; lastError: string | null; sharingConnected: boolean }; partnerSharingEnabled: boolean; status: "NEEDS_TWO_MEMBERS" | "NEEDS_RECONNECT" | "WAITING_FOR_YOU" | "WAITING_FOR_PARTNER" | "ACTIVE" | "ATTENTION" };

const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const monthFormatter = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" });
const dayFormatter = new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "numeric", month: "long" });
const timeFormatter = new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" });

function startOfMonth(date: Date) { return new Date(date.getFullYear(), date.getMonth(), 1); }
function dateKey(date: Date) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`; }
function isSameDate(first: Date, second: Date) { return dateKey(first) === dateKey(second); }
function calendarDays(month: Date) {
  const first = startOfMonth(month);
  const gridStart = new Date(first);
  gridStart.setDate(first.getDate() - first.getDay());
  return Array.from({ length: 42 }, (_, index) => { const day = new Date(gridStart); day.setDate(gridStart.getDate() + index); return day; });
}
function initialForm(date: Date): EventForm { return { title: "", description: "", date: dateKey(date), startTime: "09:00", endTime: "10:00" }; }
function formFromEvent(event: AgendaEvent): EventForm {
  const start = new Date(event.startTime); const end = new Date(event.endTime);
  return { title: event.title, description: event.description || "", date: dateKey(start), startTime: start.toTimeString().slice(0, 5), endTime: end.toTimeString().slice(0, 5) };
}

function familyStatus(family: Family) {
  if (family.status === "ACTIVE") return { label: "Compartilhamento ativo", detail: `Você e ${family.partner?.name || "seu parceiro"} podem ver as agendas um do outro no Google Calendar.`, tone: "text-[#087d3c]" };
  if (family.status === "NEEDS_RECONNECT") return { label: "Reconexão necessária", detail: "Reconecte o Google Calendar para autorizar o compartilhamento de leitura.", tone: "text-[#a67020]" };
  if (family.status === "WAITING_FOR_PARTNER") return { label: "Aguardando parceiro", detail: `${family.partner?.name || "A outra pessoa"} ainda precisa autorizar o compartilhamento.`, tone: "text-[#a67020]" };
  if (family.status === "ATTENTION") return { label: "Atenção necessária", detail: family.own.lastError || "Tente ativar novamente após reconectar sua conta Google.", tone: "text-[#a1453f]" };
  if (family.status === "NEEDS_TWO_MEMBERS") return { label: "Convide uma segunda pessoa", detail: "O compartilhamento funciona quando a família tiver exatamente duas pessoas.", tone: "text-[#a67020]" };
  return { label: "Aguardando você", detail: "Autorize o compartilhamento para iniciar a agenda familiar.", tone: "text-[#a67020]" };
}

export function CalendarWorkspace() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const today = useMemo(() => new Date(), []);
  const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(today));
  const [selectedDate, setSelectedDate] = useState(() => today);
  const [events, setEvents] = useState<AgendaEvent[]>([]);
  const [families, setFamilies] = useState<Family[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<AgendaEvent | null>(null);
  const [form, setForm] = useState<EventForm>(() => initialForm(today));
  const [formError, setFormError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isChangingShare, setIsChangingShare] = useState(false);

  const view = searchParams.get("view") === "family" ? "family" : "personal";
  const selectedFamilyId = searchParams.get("teamId") || families[0]?.id || "";
  const selectedFamily = families.find((family) => family.id === selectedFamilyId) || null;
  const days = useMemo(() => calendarDays(visibleMonth), [visibleMonth]);
  const rangeStart = days[0];
  const rangeEnd = useMemo(() => { const end = new Date(days[days.length - 1]); end.setDate(end.getDate() + 1); return end; }, [days]);

  const loadFamilies = useCallback(async () => {
    const response = await fetch("/api/agenda/sharing", { cache: "no-store" });
    const body = await response.json() as { families?: Family[] };
    if (response.ok) setFamilies(body.families || []);
  }, []);

  useEffect(() => { void loadFamilies(); }, [loadFamilies]);
  useEffect(() => {
    if (view === "family" && !searchParams.get("teamId") && families[0]) updateView("family", families[0].id);
  // The family selector is canonicalized once its asynchronous data arrives.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [families, searchParams, view]);
  useEffect(() => {
    const controller = new AbortController();
    async function loadEvents() {
      setIsLoading(true); setLoadError("");
      try {
        const params = new URLSearchParams({ from: rangeStart.toISOString(), to: rangeEnd.toISOString(), view });
        if (view === "family") { if (!selectedFamilyId) { setEvents([]); return; } params.set("teamId", selectedFamilyId); }
        const response = await fetch(`/api/events?${params.toString()}`, { signal: controller.signal });
        const body = await response.json() as { events?: AgendaEvent[]; error?: string };
        if (!response.ok) throw new Error(body.error || "Não foi possível carregar a agenda.");
        setEvents(body.events || []);
      } catch (error) { if ((error as Error).name !== "AbortError") setLoadError(error instanceof Error ? error.message : "Não foi possível carregar a agenda."); }
      finally { if (!controller.signal.aborted) setIsLoading(false); }
    }
    void loadEvents(); return () => controller.abort();
  }, [rangeEnd, rangeStart, selectedFamilyId, view]);

  const eventsByDate = useMemo(() => events.reduce<Record<string, AgendaEvent[]>>((groups, event) => { const key = dateKey(new Date(event.startTime)); groups[key] = [...(groups[key] || []), event]; return groups; }, {}), [events]);
  const selectedEvents = eventsByDate[dateKey(selectedDate)] || [];
  const updateView = (nextView: "personal" | "family", teamId?: string) => { const params = new URLSearchParams(searchParams.toString()); params.set("view", nextView); if (nextView === "family" && (teamId || selectedFamilyId)) params.set("teamId", teamId || selectedFamilyId); else params.delete("teamId"); router.replace(`/dashboard/agenda?${params.toString()}`); };
  const changeMonth = (offset: number) => setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
  const selectDay = (day: Date) => { setSelectedDate(day); if (day.getMonth() !== visibleMonth.getMonth() || day.getFullYear() !== visibleMonth.getFullYear()) setVisibleMonth(startOfMonth(day)); };
  const openComposer = (date = selectedDate, event: AgendaEvent | null = null) => { setEditingEvent(event); setForm(event ? formFromEvent(event) : initialForm(date)); setFormError(""); setIsComposerOpen(true); };

  async function saveEvent(submitEvent: FormEvent<HTMLFormElement>) {
    submitEvent.preventDefault(); setFormError("");
    const start = new Date(`${form.date}T${form.startTime}:00`); const end = new Date(`${form.date}T${form.endTime}:00`);
    if (!form.title.trim()) return setFormError("Informe um título para o compromisso.");
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) return setFormError("Escolha um horário de término posterior ao início.");
    setIsSaving(true);
    try {
      const response = await fetch("/api/events", { method: editingEvent ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...(editingEvent ? { id: editingEvent.id } : {}), title: form.title, description: form.description, startTime: start.toISOString(), endTime: end.toISOString() }) });
      const body = await response.json() as { event?: AgendaEvent; error?: string };
      if (!response.ok || !body.event) throw new Error(body.error || "Não foi possível salvar o compromisso.");
      const saved = { ...body.event, isOwner: true };
      setEvents((current) => [...current.filter((event) => event.id !== saved.id), saved].sort((first, second) => first.startTime.localeCompare(second.startTime)));
      setSelectedDate(new Date(saved.startTime)); setVisibleMonth(startOfMonth(new Date(saved.startTime))); setIsComposerOpen(false);
    } catch (error) { setFormError(error instanceof Error ? error.message : "Não foi possível salvar o compromisso."); }
    finally { setIsSaving(false); }
  }

  async function deleteEvent(id: string) {
    setIsDeleting(true);
    try { const response = await fetch(`/api/events?id=${encodeURIComponent(id)}`, { method: "DELETE" }); if (!response.ok) { const body = await response.json() as { error?: string }; throw new Error(body.error || "Não foi possível excluir o compromisso."); } setEvents((current) => current.filter((event) => event.id !== id)); setPendingDeleteId(null); }
    catch (error) { setLoadError(error instanceof Error ? error.message : "Não foi possível excluir o compromisso."); }
    finally { setIsDeleting(false); }
  }

  async function toggleSharing() {
    if (!selectedFamily) return;
    setIsChangingShare(true); setLoadError("");
    try {
      const response = await fetch("/api/agenda/sharing", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ teamId: selectedFamily.id, enabled: !selectedFamily.own.enabled }) });
      const body = await response.json() as { families?: Family[]; error?: string };
      if (!response.ok) throw new Error(body.error || "Não foi possível atualizar o compartilhamento.");
      setFamilies(body.families || []);
    } catch (error) { setLoadError(error instanceof Error ? error.message : "Não foi possível atualizar o compartilhamento."); }
    finally { setIsChangingShare(false); }
  }

  return <div className="min-h-[100dvh] bg-[#f6faf7] text-[#17372b]"><DashboardNav activePath="/dashboard/agenda" /><main className="px-4 py-6 sm:px-6 lg:px-10 lg:py-8"><div className="mx-auto max-w-7xl"><header className="mb-6 flex flex-col gap-5 border-b border-[#dcebe2] pb-6 sm:flex-row sm:items-end sm:justify-between"><div><Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-[#638072] transition-colors hover:text-[#087d3c]"><span aria-hidden="true">←</span> Visão geral</Link><p className="mt-5 text-sm font-semibold uppercase tracking-[0.14em] text-[#079347]">Agenda</p><h1 className="mt-2 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">Seu tempo, com espaço para respirar.</h1><p className="mt-2 max-w-xl text-sm leading-relaxed text-[#678176] sm:text-base">Sua agenda continua pessoal — e, quando quiserem, fica visível para os dois sem misturar os compromissos.</p></div><button onClick={() => openComposer()} className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#0b9d4e] px-5 text-sm font-semibold text-white shadow-[0_14px_28px_-14px_rgba(11,157,78,0.7)] transition-transform hover:-translate-y-0.5 hover:bg-[#078940]"><Plus className="h-4 w-4" /> Novo compromisso</button></header>

  <section className="mb-6 rounded-[1.6rem] border border-[#dcebe2] bg-white p-5 shadow-[0_18px_48px_-36px_rgba(12,100,53,0.35)]"><div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div><div className="flex items-center gap-2"><Users className="h-5 w-5 text-[#087d3c]" /><h2 className="font-semibold">Agenda familiar</h2></div><p className="mt-1 text-sm text-[#678176]">No Google, o parceiro recebe acesso somente para visualizar. Aqui, cada um edita somente o que criou.</p></div><div className="inline-flex self-start rounded-xl bg-[#edf8f1] p-1"><button onClick={() => updateView("personal")} className={`rounded-lg px-3 py-2 text-sm font-bold transition-colors ${view === "personal" ? "bg-white text-[#087d3c] shadow-sm" : "text-[#638072]"}`}>Minha agenda</button><button onClick={() => updateView("family")} disabled={!families.length} className={`rounded-lg px-3 py-2 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-45 ${view === "family" ? "bg-white text-[#087d3c] shadow-sm" : "text-[#638072]"}`}>Agenda familiar</button></div></div>
  {selectedFamily ? <div className="mt-5 flex flex-col gap-4 rounded-2xl bg-[#f7fbf8] p-4 lg:flex-row lg:items-center lg:justify-between"><div><p className={`text-sm font-bold ${familyStatus(selectedFamily).tone}`}>{familyStatus(selectedFamily).label}</p><p className="mt-1 text-sm text-[#678176]">{familyStatus(selectedFamily).detail}</p>{selectedFamily.own.lastError && <p className="mt-2 text-xs font-medium text-[#a1453f]">{selectedFamily.own.lastError}</p>}</div><div className="flex flex-wrap items-center gap-3">{families.length > 1 && <select value={selectedFamilyId} onChange={(event) => updateView(view, event.target.value)} className="h-10 rounded-xl border border-[#cfe1d6] bg-white px-3 text-sm font-semibold text-[#315f48]"><option value="">Selecione a família</option>{families.map((family) => <option key={family.id} value={family.id}>{family.name}</option>)}</select>}{selectedFamily.status === "NEEDS_RECONNECT" ? <Link href="/dashboard/agenda/integracoes" className="inline-flex h-10 items-center rounded-xl bg-[#087d3c] px-4 text-sm font-bold text-white">Reconectar Google</Link> : <button onClick={() => void toggleSharing()} disabled={isChangingShare || selectedFamily.status === "NEEDS_TWO_MEMBERS"} className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#b9ddc6] bg-white px-4 text-sm font-bold text-[#087d3c] disabled:opacity-50">{isChangingShare ? <LoaderCircle className="h-4 w-4 animate-spin" /> : selectedFamily.own.enabled ? <ShieldCheck className="h-4 w-4" /> : <RefreshCw className="h-4 w-4" />}{selectedFamily.own.enabled ? "Parar de compartilhar" : "Compartilhar meu calendário"}</button>}</div></div> : <div className="mt-5 rounded-2xl bg-[#f7fbf8] p-4 text-sm text-[#678176]">Crie uma Família em <Link href="/dashboard/conta" className="font-bold text-[#087d3c]">Minha conta</Link> para compartilhar a agenda com uma segunda pessoa.</div>}</section>

  <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_23rem]"><section className="rounded-[2rem] border border-[#dcebe2] bg-white p-5 shadow-[0_26px_70px_-48px_rgba(12,100,53,0.4)] sm:p-7"><div className="mb-7 flex items-center justify-between gap-3"><div className="flex items-center gap-2"><button type="button" onClick={() => changeMonth(-1)} aria-label="Mês anterior" className="grid h-10 w-10 place-items-center rounded-xl border border-[#dcebe2] text-[#527062] hover:border-[#a9d8ba] hover:bg-[#f1faf4]"><ChevronLeft className="h-5 w-5" /></button><button type="button" onClick={() => changeMonth(1)} aria-label="Próximo mês" className="grid h-10 w-10 place-items-center rounded-xl border border-[#dcebe2] text-[#527062] hover:border-[#a9d8ba] hover:bg-[#f1faf4]"><ChevronRight className="h-5 w-5" /></button></div><h2 className="text-lg font-semibold capitalize tracking-[-0.02em] text-[#17372b] sm:text-xl">{monthFormatter.format(visibleMonth)}</h2><button type="button" onClick={() => { setVisibleMonth(startOfMonth(today)); setSelectedDate(today); }} className="rounded-xl px-3 py-2 text-sm font-semibold text-[#087d3c] hover:bg-[#edf8f1]">Hoje</button></div><div className="grid grid-cols-7 border-b border-[#e3eee7] pb-2">{weekDays.map((day) => <div key={day} className="py-1 text-center text-[11px] font-bold uppercase tracking-[0.1em] text-[#88a095]">{day}</div>)}</div><div className="grid grid-cols-7">{days.map((day) => { const key = dateKey(day); const eventsForDay = eventsByDate[key] || []; const currentMonth = day.getMonth() === visibleMonth.getMonth(); return <button key={key} type="button" onClick={() => selectDay(day)} className={`relative min-h-[4.8rem] border-b border-r border-[#edf3ef] p-2 text-left transition-colors sm:min-h-[6.3rem] sm:p-3 ${isSameDate(day, selectedDate) ? "bg-[#edf9f1]" : "hover:bg-[#f7fcf8]"} ${!currentMonth ? "text-[#b0c0b7]" : "text-[#315f48]"}`}><span className={`grid h-7 w-7 place-items-center rounded-full text-sm font-semibold ${isSameDate(day, today) ? "bg-[#087d3c] text-white" : ""}`}>{day.getDate()}</span>{eventsForDay.length > 0 && <span className={`mt-1 block truncate text-[10px] font-semibold sm:text-xs ${view === "family" && eventsForDay.some((event) => !event.isOwner) ? "text-[#7b5eb4]" : "text-[#087d3c]"}`}>{eventsForDay.length === 1 ? eventsForDay[0].title : `${eventsForDay.length} compromissos`}</span>}</button>; })}</div></section>
  <aside className="rounded-[2rem] border border-[#dcebe2] bg-white p-6 shadow-[0_26px_70px_-48px_rgba(12,100,53,0.4)] sm:p-7"><div className="flex items-start justify-between gap-4 border-b border-[#e3eee7] pb-5"><div><p className="text-xs font-bold uppercase tracking-[0.13em] text-[#079347]">{view === "family" ? "Agenda familiar" : "Dia selecionado"}</p><h2 className="mt-2 text-xl font-semibold capitalize tracking-[-0.03em] text-[#17372b]">{dayFormatter.format(selectedDate)}</h2></div><button type="button" onClick={() => openComposer(selectedDate)} aria-label="Adicionar compromisso neste dia" className="grid h-10 w-10 place-items-center rounded-xl bg-[#edf9f1] text-[#087d3c] hover:bg-[#dff5e7]"><Plus className="h-5 w-5" /></button></div>{loadError && <p className="mt-5 rounded-xl bg-[#fff1f1] px-4 py-3 text-sm text-[#a93636]">{loadError}</p>}<div className="mt-5 space-y-3">{isLoading ? Array.from({ length: 3 }, (_, index) => <div key={index} className="h-20 animate-pulse rounded-2xl bg-[#f3f8f5]" />) : selectedEvents.length > 0 ? selectedEvents.map((event) => <article key={event.id} className={`rounded-2xl border p-4 ${event.isOwner ? "border-[#dcebe2] bg-[#fbfdfb]" : "border-[#e6ddf5] bg-[#fcfaff]"}`}><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="flex items-center gap-1.5 text-xs font-semibold text-[#087d3c]"><Clock3 className="h-3.5 w-3.5" />{timeFormatter.format(new Date(event.startTime))} – {timeFormatter.format(new Date(event.endTime))}</p><h3 className="mt-2 truncate text-sm font-semibold text-[#214235]">{event.title}</h3>{view === "family" && <p className={`mt-1 text-xs font-semibold ${event.isOwner ? "text-[#638072]" : "text-[#7b5eb4]"}`}>{event.isOwner ? "Seu compromisso" : `De ${event.owner?.name || event.owner?.email || "seu parceiro"} · somente leitura`}</p>}</div>{event.isOwner && <span className="flex gap-1"><button type="button" onClick={() => openComposer(selectedDate, event)} className="rounded-lg p-1.5 text-[#8ba096] hover:bg-[#edf8f1] hover:text-[#087d3c]" aria-label={`Editar ${event.title}`}><Pencil className="h-4 w-4" /></button><button type="button" onClick={() => setPendingDeleteId(event.id)} className="rounded-lg p-1.5 text-[#8ba096] hover:bg-[#fff1f1] hover:text-[#b44747]" aria-label={`Excluir ${event.title}`}><Trash2 className="h-4 w-4" /></button></span>}</div>{event.description && <p className="mt-2 text-sm leading-relaxed text-[#718b7e]">{event.description}</p>}{pendingDeleteId === event.id && <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-[#fff6f5] p-3 text-xs text-[#8a4b45]"><span>Excluir este compromisso?</span><span className="flex gap-2"><button type="button" onClick={() => setPendingDeleteId(null)} className="font-semibold">Cancelar</button><button type="button" disabled={isDeleting} onClick={() => void deleteEvent(event.id)} className="font-semibold text-[#b44747]">{isDeleting ? "Excluindo..." : "Excluir"}</button></span></div>}</article>) : <div className="py-12 text-center"><div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#edf9f1] text-[#079347]"><CalendarDays className="h-6 w-6" /></div><h3 className="mt-4 text-sm font-semibold text-[#315f48]">Nada marcado por aqui</h3><p className="mx-auto mt-2 max-w-[15rem] text-sm leading-relaxed text-[#718b7e]">{view === "family" ? "Os compromissos da família aparecerão aqui." : "Crie um compromisso para começar a organizar este dia."}</p><button type="button" onClick={() => openComposer(selectedDate)} className="mt-5 text-sm font-semibold text-[#087d3c] hover:text-[#056c35]">Adicionar compromisso</button></div>}</div></aside></div>
  {isComposerOpen && <div className="fixed inset-0 z-50 flex items-end bg-[#17372b]/30 p-0 backdrop-blur-sm sm:items-center sm:justify-center sm:p-6"><div role="dialog" aria-modal="true" aria-labelledby="event-composer-title" className="w-full rounded-t-[2rem] bg-white p-6 shadow-2xl sm:max-w-lg sm:rounded-[2rem] sm:p-8"><div className="flex items-start justify-between gap-5"><div><p className="text-xs font-bold uppercase tracking-[0.13em] text-[#079347]">{editingEvent ? "Editar compromisso" : "Novo compromisso"}</p><h2 id="event-composer-title" className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#17372b]">{editingEvent ? "Ajuste o seu horário." : "Reserve um horário."}</h2>{view === "family" && <p className="mt-2 text-sm text-[#678176]">Será criado na sua agenda e ficará visível para a sua família.</p>}</div><button type="button" onClick={() => setIsComposerOpen(false)} aria-label="Fechar" className="rounded-xl p-2 text-[#718b7e] hover:bg-[#edf8f1]"><X className="h-5 w-5" /></button></div><form onSubmit={saveEvent} className="mt-7 space-y-5"><div><label htmlFor="event-title" className="mb-2 block text-sm font-semibold text-[#315f48]">Título</label><input id="event-title" autoFocus value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} placeholder="Ex.: Revisar orçamento" className="h-12 w-full rounded-xl border border-[#d6e7dd] bg-[#fbfdfb] px-4 text-sm outline-none focus:border-[#079347] focus:ring-4 focus:ring-[#dff6e7]" /></div><div><label htmlFor="event-description" className="mb-2 block text-sm font-semibold text-[#315f48]">Descrição <span className="font-normal text-[#91a89a]">(opcional)</span></label><textarea id="event-description" value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} rows={3} placeholder="Adicione um contexto rápido." className="w-full resize-none rounded-xl border border-[#d6e7dd] bg-[#fbfdfb] px-4 py-3 text-sm outline-none focus:border-[#079347] focus:ring-4 focus:ring-[#dff6e7]" /></div><div className="grid gap-4 sm:grid-cols-3"><div className="sm:col-span-3"><label htmlFor="event-date" className="mb-2 block text-sm font-semibold text-[#315f48]">Data</label><input id="event-date" type="date" value={form.date} onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))} className="h-12 w-full rounded-xl border border-[#d6e7dd] bg-[#fbfdfb] px-4 text-sm outline-none focus:border-[#079347] focus:ring-4 focus:ring-[#dff6e7]" /></div><div><label htmlFor="event-start" className="mb-2 block text-sm font-semibold text-[#315f48]">Início</label><input id="event-start" type="time" value={form.startTime} onChange={(event) => setForm((current) => ({ ...current, startTime: event.target.value }))} className="h-12 w-full rounded-xl border border-[#d6e7dd] bg-[#fbfdfb] px-3 text-sm outline-none focus:border-[#079347] focus:ring-4 focus:ring-[#dff6e7]" /></div><div><label htmlFor="event-end" className="mb-2 block text-sm font-semibold text-[#315f48]">Término</label><input id="event-end" type="time" value={form.endTime} onChange={(event) => setForm((current) => ({ ...current, endTime: event.target.value }))} className="h-12 w-full rounded-xl border border-[#d6e7dd] bg-[#fbfdfb] px-3 text-sm outline-none focus:border-[#079347] focus:ring-4 focus:ring-[#dff6e7]" /></div></div>{formError && <p className="rounded-xl bg-[#fff1f1] px-4 py-3 text-sm text-[#a93636]" role="alert">{formError}</p>}<div className="flex justify-end gap-3 pt-2"><button type="button" onClick={() => setIsComposerOpen(false)} className="h-11 rounded-xl px-4 text-sm font-semibold text-[#678176] hover:bg-[#f1f7f3]">Cancelar</button><button type="submit" disabled={isSaving} className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#0b9d4e] px-5 text-sm font-semibold text-white hover:bg-[#078940] disabled:opacity-70">{isSaving && <LoaderCircle className="h-4 w-4 animate-spin" />}{isSaving ? "Salvando..." : editingEvent ? "Salvar alterações" : "Salvar compromisso"}</button></div></form></div></div>}</div></main></div>;
}
