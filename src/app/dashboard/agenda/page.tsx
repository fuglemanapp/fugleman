import { Suspense } from "react";
import { CalendarWorkspace } from "@/components/agenda/calendar-workspace";

export default function MinhaAgendaPage() {
  return <Suspense fallback={<div className="min-h-screen bg-[#f6faf7]" />}><CalendarWorkspace /></Suspense>;
}
