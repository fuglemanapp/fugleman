import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade · WhatSpent",
  description:
    "Como o WhatSpent coleta, usa, armazena e protege seus dados, incluindo os dados obtidos via Google (perfil e Google Calendar).",
};

const LAST_UPDATED = "2 de setembro de 2026";
const CONTACT_EMAIL = "lucas@fugleman.com.br";

export default function PrivacidadePage() {
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-16 text-slate-800">
      <p className="text-sm font-bold uppercase tracking-widest text-emerald-700">WhatSpent</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight">Política de Privacidade</h1>
      <p className="mt-3 text-sm text-slate-500">Última atualização: {LAST_UPDATED}</p>

      <p className="mt-6 leading-7">
        Esta Política de Privacidade descreve como o WhatSpent (&quot;nós&quot;) coleta, usa, armazena,
        compartilha e protege as suas informações quando você utiliza nosso aplicativo e serviços.
        Ao criar uma conta ou entrar com o Google, você concorda com as práticas descritas aqui.
      </p>

      <section aria-labelledby="dados" className="mt-10">
        <h2 id="dados" className="text-2xl font-semibold">Quais dados coletamos</h2>
        <ul className="mt-4 list-disc space-y-2 pl-6 leading-7">
          <li>
            <strong>Dados da sua Conta do Google</strong> (quando você entra com o Google): nome,
            endereço de e-mail e foto de perfil, usados para criar e identificar sua conta.
          </li>
          <li>
            <strong>Dados do Google Calendar</strong>: quando você autoriza, acessamos e gerenciamos
            eventos (<code>calendar.events</code>) e listas de compartilhamento/permissões de agenda
            (<code>calendar.acls</code>) para oferecer a agenda inteligente e a agenda familiar
            compartilhada.
          </li>
          <li>
            <strong>Dados que você insere</strong>: informações financeiras, categorias, tarefas,
            projetos e demais conteúdos que você registra no aplicativo.
          </li>
          <li>
            <strong>Dados técnicos</strong>: informações básicas de uso e segurança necessárias para
            operar e proteger o serviço (por exemplo, registros de acesso e limitação de tentativas).
          </li>
        </ul>
      </section>

      <section aria-labelledby="uso" className="mt-10">
        <h2 id="uso" className="text-2xl font-semibold">Como usamos os dados</h2>
        <p className="mt-4 leading-7">
          Usamos os dados exclusivamente para fornecer e melhorar as funcionalidades que você solicita:
          autenticar seu acesso, exibir e organizar suas finanças, sincronizar e gerenciar eventos da
          sua agenda e habilitar o compartilhamento de agenda entre membros da família que você
          autorizar. Não usamos dados do Google para publicidade.
        </p>
      </section>

      <section aria-labelledby="google-limited-use" className="mt-10 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-6">
        <h2 id="google-limited-use" className="text-2xl font-semibold">
          Uso dos dados das APIs do Google (Limited Use)
        </h2>
        <p className="mt-4 leading-7">
          O uso e a transferência, pelo WhatSpent, das informações recebidas das APIs do Google
          seguem a{" "}
          <a
            href="https://developers.google.com/terms/api-services-user-data-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-emerald-700 underline"
          >
            Política de Dados do Usuário dos Serviços de API do Google
          </a>
          , incluindo os requisitos de Uso Limitado (Limited Use). Especificamente:
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-6 leading-7">
          <li>Usamos os dados apenas para fornecer os recursos visíveis ao usuário no WhatSpent.</li>
          <li>Não transferimos os dados a terceiros, exceto quando necessário para operar o serviço, por exigência legal ou com o seu consentimento explícito.</li>
          <li>Não usamos os dados para publicidade nem os vendemos.</li>
          <li>Nenhuma pessoa humana lê os seus dados do Google, salvo com seu consentimento explícito, para segurança, para cumprir a lei, ou quando os dados forem agregados e anonimizados.</li>
        </ul>
      </section>

      <section aria-labelledby="compartilhamento" className="mt-10">
        <h2 id="compartilhamento" className="text-2xl font-semibold">Compartilhamento</h2>
        <p className="mt-4 leading-7">
          Não vendemos seus dados. Compartilhamos informações apenas com provedores de infraestrutura
          estritamente necessários para operar o serviço, com membros da sua família que você autorizar
          explicitamente na agenda compartilhada, ou quando exigido por lei.
        </p>
      </section>

      <section aria-labelledby="armazenamento" className="mt-10">
        <h2 id="armazenamento" className="text-2xl font-semibold">Armazenamento e segurança</h2>
        <p className="mt-4 leading-7">
          Seus dados são armazenados em banco de dados protegido e os tokens de acesso do Google são
          guardados de forma restrita, usados somente para as sincronizações que você autoriza. Adotamos
          medidas técnicas e organizacionais para proteger as informações contra acesso não autorizado.
        </p>
      </section>

      <section aria-labelledby="retencao" className="mt-10">
        <h2 id="retencao" className="text-2xl font-semibold">Retenção e exclusão</h2>
        <p className="mt-4 leading-7">
          Você pode revogar o acesso do WhatSpent à sua Conta do Google a qualquer momento em{" "}
          <a
            href="https://myaccount.google.com/permissions"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-emerald-700 underline"
          >
            myaccount.google.com/permissions
          </a>
          . Para excluir sua conta e os dados associados, entre em contato conosco pelo e-mail abaixo.
          Removemos os dados quando deixam de ser necessários para os fins descritos nesta política.
        </p>
      </section>

      <section aria-labelledby="contato" className="mt-10">
        <h2 id="contato" className="text-2xl font-semibold">Contato</h2>
        <p className="mt-4 leading-7">
          Dúvidas sobre privacidade ou solicitações sobre seus dados:{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-emerald-700 underline">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </section>
    </main>
  );
}
