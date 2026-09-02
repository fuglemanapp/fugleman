import Link from "next/link";
import { PUBLIC_BRAND_NAME } from "../../lib/public-brand";

export const metadata = { title: "Termos de uso" };

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#f4f8f5] px-4 py-10 text-[#17372b] sm:px-6 lg:py-16">
      <article className="mx-auto max-w-3xl rounded-[2rem] border border-[#dcebe2] bg-white p-7 shadow-[0_24px_60px_-44px_rgba(12,100,53,.42)] sm:p-10">
        <Link href="/" className="text-sm font-bold text-[#087d3c] hover:text-[#056c35]">← Voltar ao {PUBLIC_BRAND_NAME}</Link>
        <p className="mt-8 text-xs font-bold uppercase tracking-[.16em] text-[#079347]">{PUBLIC_BRAND_NAME}</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-[-.06em]">Termos de uso</h1>
        <p className="mt-3 text-sm text-[#789083]">Atualizado em 1º de setembro de 2026</p>
        <div className="mt-9 space-y-6 text-[15px] leading-relaxed text-[#506e5e]">
          <p>Estes termos regulam o uso do {PUBLIC_BRAND_NAME} durante a fase de validação gratuita.</p>
          <section><h2 className="text-xl font-semibold tracking-[-.03em] text-[#17372b]">Uso do serviço</h2><p className="mt-2">O {PUBLIC_BRAND_NAME} permite que você registre informações pelo painel e, após vincular o seu número, por mensagens no WhatsApp. Você é responsável pela veracidade dos dados enviados e por proteger o acesso à sua conta.</p></section>
          <section><h2 className="text-xl font-semibold tracking-[-.03em] text-[#17372b]">Fase de validação</h2><p className="mt-2">O serviço está sendo validado com usuários e pode ser alterado, limitado ou interrompido enquanto aprimoramos a experiência. Não há cobrança nesta fase e não é garantida disponibilidade ininterrupta.</p></section>
          <section><h2 className="text-xl font-semibold tracking-[-.03em] text-[#17372b]">Informações financeiras</h2><p className="mt-2">O {PUBLIC_BRAND_NAME} é uma ferramenta de organização. Ele não presta aconselhamento financeiro, contábil, jurídico ou de investimento. Confirme valores, datas e decisões importantes diretamente com as fontes adequadas.</p></section>
          <section><h2 className="text-xl font-semibold tracking-[-.03em] text-[#17372b]">Uso indevido</h2><p className="mt-2">Não use o serviço para acessar dados de terceiros, enviar conteúdo ilícito ou interferir no funcionamento da plataforma. O acesso pode ser restringido quando houver risco à segurança ou uso indevido.</p></section>
          <section><h2 className="text-xl font-semibold tracking-[-.03em] text-[#17372b]">Contato</h2><p className="mt-2">Dúvidas sobre estes termos podem ser enviadas para <a href="mailto:suporte@whatspent.com" className="font-semibold text-[#087d3c] hover:text-[#056c35]">suporte@whatspent.com</a>.</p></section>
        </div>
      </article>
    </main>
  );
}
