import { GoogleCalendarIntegration } from "@/components/integrations/google-calendar-integration";

export default function AgendaIntegrationsPage() {
  return (
    <main className="min-h-[calc(100dvh-4rem)] bg-[#f6faf7] px-4 py-8 text-[#17372b] sm:px-6 lg:px-10 lg:py-12">
      <div className="mx-auto max-w-4xl">
        <header className="rounded-[2rem] border border-[#dcebe2] bg-white px-6 py-7 shadow-[0_18px_48px_-34px_rgba(12,100,53,0.42)] sm:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#079347]">Agenda</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">Sua agenda, em um só lugar.</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#648273] sm:text-base">
            Conecte o Google Calendar para trazer seus próximos compromissos ao WhatSpent e enviar automaticamente os eventos criados por aqui.
          </p>
        </header>

        <section className="mt-6">
          <GoogleCalendarIntegration />
        </section>

        <aside className="mt-6 rounded-2xl border border-[#dcebe2] bg-[#edf9f1] p-5 text-sm leading-6 text-[#315f48]">
          <strong>Como funciona:</strong> após autorizar sua conta Google, os próximos eventos são importados e os compromissos que você criar no WhatSpent são enviados ao seu calendário principal.
        </aside>
      </div>
    </main>
  );
}
