import Link from "next/link";

const updatedAt = "31 de agosto de 2026";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#f6faf7] px-6 py-12 text-[#183b2e]">
      <article className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-sm ring-1 ring-emerald-100 md:p-12">
        <Link href="/" className="text-sm font-semibold text-emerald-700 hover:underline">← WhatSpent</Link>
        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">Termos de uso</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Como usar o WhatSpent</h1>
        <p className="mt-3 text-sm text-slate-500">Atualizado em {updatedAt}</p>

        <div className="mt-10 space-y-8 text-sm leading-7 text-slate-700">
          <section><h2 className="text-lg font-bold text-[#183b2e]">1. Serviço em validação</h2><p>O WhatSpent é uma ferramenta gratuita em fase de validação para organização pessoal de finanças, agenda, tarefas e projetos. Não é serviço bancário, de pagamento, contabilidade, aconselhamento financeiro, jurídico ou médico.</p></section>
          <section><h2 className="text-lg font-bold text-[#183b2e]">2. Sua conta e seu WhatsApp</h2><p>Você deve informar dados corretos, manter sua senha em sigilo e usar apenas um número de WhatsApp que controle. O número só é vinculado após o envio do código de confirmação pelo próprio WhatsApp. Não compartilhe esse código.</p></section>
          <section><h2 className="text-lg font-bold text-[#183b2e]">3. Uso responsável</h2><p>Não use o serviço para violar a lei, acessar dados de terceiros, enviar conteúdo nocivo ou tentar interferir na segurança da plataforma. Podemos restringir o acesso em caso de uso abusivo ou risco à segurança.</p></section>
          <section><h2 className="text-lg font-bold text-[#183b2e]">4. Disponibilidade e integrações</h2><p>O serviço pode evoluir, sofrer manutenção ou ter recursos alterados durante a validação. A integração Belvo/Open Finance não está habilitada para usuários neste momento.</p></section>
          <section><h2 className="text-lg font-bold text-[#183b2e]">5. Encerramento</h2><p>Você pode solicitar a exclusão da sua conta a qualquer momento. A conclusão depende da confirmação de identidade para evitar exclusões indevidas.</p></section>
          <section><h2 className="text-lg font-bold text-[#183b2e]">6. Contato</h2><p>O controlador do tratamento de dados é Lucas Simioni. Dúvidas sobre estes termos: <a className="font-semibold text-emerald-700 hover:underline" href="mailto:suporte@whatspent.com">suporte@whatspent.com</a>.</p></section>
        </div>
        <p className="mt-10 border-t border-slate-100 pt-6 text-sm text-slate-600">Leia também a <Link href="/privacidade" className="font-semibold text-emerald-700 hover:underline">Política de Privacidade</Link> e faça uma <Link href="/excluir-conta" className="font-semibold text-emerald-700 hover:underline">solicitação de exclusão</Link>.</p>
      </article>
    </main>
  );
}
