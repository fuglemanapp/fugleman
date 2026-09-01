import Link from "next/link";

export const metadata = { title: "Política de privacidade" };

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#f4f8f5] px-4 py-10 text-[#17372b] sm:px-6 lg:py-16">
      <article className="mx-auto max-w-3xl rounded-[2rem] border border-[#dcebe2] bg-white p-7 shadow-[0_24px_60px_-44px_rgba(12,100,53,.42)] sm:p-10">
        <Link href="/" className="text-sm font-bold text-[#087d3c] hover:text-[#056c35]">← Voltar ao WhatSpent</Link>
        <p className="mt-8 text-xs font-bold uppercase tracking-[.16em] text-[#079347]">WhatSpent</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-[-.06em]">Política de privacidade</h1>
        <p className="mt-3 text-sm text-[#789083]">Atualizado em 1º de setembro de 2026</p>
        <div className="mt-9 space-y-6 text-[15px] leading-relaxed text-[#506e5e]">
          <p>Esta política explica como o WhatSpent trata dados durante a fase de validação gratuita.</p>
          <section><h2 className="text-xl font-semibold tracking-[-.03em] text-[#17372b]">Dados tratados</h2><p className="mt-2">Podemos tratar dados da conta, como nome e e-mail; o número de WhatsApp que você decidir vincular; e os conteúdos que você registrar no painel ou enviar ao agente, como lançamentos financeiros, cartões e compromissos.</p></section>
          <section><h2 className="text-xl font-semibold tracking-[-.03em] text-[#17372b]">Finalidade</h2><p className="mt-2">Usamos esses dados para autenticar sua conta, associar mensagens ao usuário correto, registrar o que você solicitar e manter o funcionamento, a segurança e a melhoria do serviço.</p></section>
          <section><h2 className="text-xl font-semibold tracking-[-.03em] text-[#17372b]">Fornecedores</h2><p className="mt-2">O funcionamento depende de fornecedores de infraestrutura, banco de dados, monitoramento e mensageria. Eles recebem somente o necessário para operar seus serviços. O WhatSpent não vende suas informações pessoais.</p></section>
          <section><h2 className="text-xl font-semibold tracking-[-.03em] text-[#17372b]">Seu controle</h2><p className="mt-2">Você pode alterar o número vinculado no painel. Para solicitar informações, correções ou a exclusão da conta e dos dados associados, contate <a href="mailto:suporte@whatspent.com" className="font-semibold text-[#087d3c] hover:text-[#056c35]">suporte@whatspent.com</a>.</p></section>
          <section><h2 className="text-xl font-semibold tracking-[-.03em] text-[#17372b]">Segurança</h2><p className="mt-2">Aplicamos controles técnicos e operacionais para reduzir acessos indevidos. Nenhum serviço online elimina totalmente os riscos: use uma senha exclusiva e não compartilhe seu acesso.</p></section>
        </div>
      </article>
    </main>
  );
}
