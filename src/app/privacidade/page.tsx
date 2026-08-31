import Link from "next/link";

const updatedAt = "31 de agosto de 2026";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#f6faf7] px-6 py-12 text-[#183b2e]">
      <article className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-sm ring-1 ring-emerald-100 md:p-12">
        <Link href="/" className="text-sm font-semibold text-emerald-700 hover:underline">← WhatSpent</Link>
        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">Privacidade</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Política de Privacidade</h1>
        <p className="mt-3 text-sm text-slate-500">Atualizada em {updatedAt}</p>

        <div className="mt-10 space-y-8 text-sm leading-7 text-slate-700">
          <section><h2 className="text-lg font-bold text-[#183b2e]">Quem controla os dados</h2><p>Lucas Simioni é o controlador dos dados pessoais tratados pelo WhatSpent. Para assuntos de privacidade, use <a className="font-semibold text-emerald-700 hover:underline" href="mailto:suporte@whatspent.com">suporte@whatspent.com</a>.</p></section>
          <section><h2 className="text-lg font-bold text-[#183b2e]">Dados tratados</h2><p>Tratamos dados de cadastro, autenticação, número de WhatsApp confirmado, lançamentos financeiros que você registra, cartões, agenda, tarefas, projetos, notas e mensagens enviadas ao assistente. Senhas são armazenadas em formato protegido; não armazenamos sua senha em texto.</p></section>
          <section><h2 className="text-lg font-bold text-[#183b2e]">Finalidades e bases</h2><p>Usamos esses dados para criar e proteger sua conta, disponibilizar o painel, responder às mensagens do seu agente no WhatsApp, evitar fraude e manter registros técnicos de segurança. O tratamento ocorre para executar o serviço solicitado, cumprir obrigações legais quando aplicáveis e atender interesses legítimos de segurança.</p></section>
          <section><h2 className="text-lg font-bold text-[#183b2e]">Compartilhamento</h2><p>Usamos provedores de infraestrutura, autenticação, e-mail, monitoramento de erros e mensageria necessários para operar o serviço. Eles recebem apenas o necessário para essa finalidade. A integração Belvo/Open Finance não está habilitada ao público e não é usada para coletar dados bancários.</p></section>
          <section><h2 className="text-lg font-bold text-[#183b2e]">Retenção e segurança</h2><p>Guardamos os dados enquanto sua conta estiver ativa ou pelo período necessário para segurança, atendimento e obrigações legais. Aplicamos controles de acesso, confirmação de e-mail e WhatsApp, limites contra abuso e registros técnicos. Nenhum sistema elimina totalmente riscos; mantenha sua senha e códigos de confirmação em sigilo.</p></section>
          <section><h2 className="text-lg font-bold text-[#183b2e]">Seus direitos</h2><p>Você pode solicitar confirmação de tratamento, acesso, correção, portabilidade, anonimização, bloqueio, eliminação quando cabível e informações sobre compartilhamento. Você também pode exportar seus dados pelo painel quando o recurso estiver disponível.</p></section>
        </div>
        <p className="mt-10 border-t border-slate-100 pt-6 text-sm text-slate-600">Consulte os <Link href="/termos" className="font-semibold text-emerald-700 hover:underline">Termos de Uso</Link> ou <Link href="/excluir-conta" className="font-semibold text-emerald-700 hover:underline">solicite a exclusão da conta</Link>.</p>
      </article>
    </main>
  );
}
