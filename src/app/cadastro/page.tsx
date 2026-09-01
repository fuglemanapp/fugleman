import { Suspense } from "react";

import { AuthShell } from "@/components/auth/auth-shell";
import { SignUpForm } from "@/components/auth/sign-up-form";

export const metadata = { title: "Criar conta" };

export default function CadastroPage() {
  return <AuthShell eyebrow="Validação gratuita" title="Organize os gastos sem mudar a sua rotina." description="Crie sua conta, conecte o seu número e envie mensagens naturais para registrar despesas, cartões e compromissos."><Suspense fallback={<AuthFormLoading />}><SignUpForm /></Suspense></AuthShell>;
}

function AuthFormLoading() {
  return <div className="mx-auto w-full max-w-md animate-pulse space-y-4"><div className="h-4 w-28 rounded bg-[#e4f1e8]" /><div className="h-9 w-64 rounded bg-[#e4f1e8]" /><div className="mt-8 h-12 rounded-xl bg-[#edf5ef]" /><div className="h-12 rounded-xl bg-[#edf5ef]" /><div className="h-12 rounded-xl bg-[#edf5ef]" /><div className="h-12 rounded-xl bg-[#d7f0df]" /></div>;
}
