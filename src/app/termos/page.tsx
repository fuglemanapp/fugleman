import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Termos de Uso · WhatSpent",
  description:
    "Termos e condições de uso do WhatSpent: sua conta, uso do serviço, integrações com o Google e responsabilidades.",
};

const LAST_UPDATED = "2 de setembro de 2026";
const CONTACT_EMAIL = "lucas@fugleman.com.br";

export default function TermosPage() {
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-16 text-slate-800">
      <p className="text-sm font-bold uppercase tracking-widest text-emerald-700">WhatSpent</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight">Termos de Uso</h1>
      <p className="mt-3 text-sm text-slate-500">Última atualização: {LAST_UPDATED}</p>

      <p className="mt-6 leading-7">
        Estes Termos de Uso regem o acesso e o uso do WhatSpent (&quot;serviço&quot;). Ao criar uma
        conta, entrar com o Google ou utilizar qualquer funcionalidade, você concorda com estes termos.
        Se não concordar, não utilize o serviço.
      </p>

      <section aria-labelledby="conta" className="mt-10">
        <h2 id="conta" className="text-2xl font-semibold">Sua conta</h2>
        <p className="mt-4 leading-7">
          Você é responsável por manter a confidencialidade das suas credenciais e por toda atividade
          realizada na sua conta. Ao entrar com o Google, você autoriza o WhatSpent a acessar as
          informações da sua Conta do Google conforme descrito na nossa{" "}
          <Link href="/privacidade" className="font-medium text-emerald-700 underline">
            Política de Privacidade
          </Link>
          .
        </p>
      </section>

      <section aria-labelledby="uso" className="mt-10">
        <h2 id="uso" className="text-2xl font-semibold">Uso do serviço</h2>
        <p className="mt-4 leading-7">
          O WhatSpent oferece ferramentas de organização financeira, agenda inteligente e agenda
          familiar compartilhada. Você concorda em usar o serviço apenas para fins lícitos e a não
          tentar comprometer sua segurança, integridade ou disponibilidade.
        </p>
      </section>

      <section aria-labelledby="google" className="mt-10">
        <h2 id="google" className="text-2xl font-semibold">Integrações com o Google</h2>
        <p className="mt-4 leading-7">
          Quando você conecta sua Conta do Google, o WhatSpent utiliza os escopos autorizados de Google
          Calendar apenas para sincronizar e gerenciar eventos e permissões de agenda a seu pedido. Você
          pode revogar esse acesso a qualquer momento em{" "}
          <a
            href="https://myaccount.google.com/permissions"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-emerald-700 underline"
          >
            myaccount.google.com/permissions
          </a>
          . O uso desses dados segue a nossa Política de Privacidade e a Política de Dados do Usuário
          dos Serviços de API do Google.
        </p>
      </section>

      <section aria-labelledby="responsabilidade" className="mt-10">
        <h2 id="responsabilidade" className="text-2xl font-semibold">Responsabilidade</h2>
        <p className="mt-4 leading-7">
          O serviço é fornecido &quot;no estado em que se encontra&quot;. Nos esforçamos para manter o
          WhatSpent disponível e seguro, mas não garantimos operação ininterrupta ou livre de erros. Na
          extensão permitida por lei, não nos responsabilizamos por perdas indiretas decorrentes do uso
          do serviço. As informações financeiras que você registra são de sua responsabilidade.
        </p>
      </section>

      <section aria-labelledby="encerramento" className="mt-10">
        <h2 id="encerramento" className="text-2xl font-semibold">Encerramento</h2>
        <p className="mt-4 leading-7">
          Você pode encerrar sua conta a qualquer momento. Podemos suspender ou encerrar o acesso em
          caso de violação destes termos. Após o encerramento, tratamos seus dados conforme a Política
          de Privacidade.
        </p>
      </section>

      <section aria-labelledby="alteracoes" className="mt-10">
        <h2 id="alteracoes" className="text-2xl font-semibold">Alterações</h2>
        <p className="mt-4 leading-7">
          Podemos atualizar estes termos periodicamente. Mudanças relevantes serão comunicadas pelos
          canais do serviço. O uso continuado após a atualização implica concordância com os novos
          termos.
        </p>
      </section>

      <section aria-labelledby="contato" className="mt-10">
        <h2 id="contato" className="text-2xl font-semibold">Contato</h2>
        <p className="mt-4 leading-7">
          Dúvidas sobre estes termos:{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-emerald-700 underline">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </section>
    </main>
  );
}
