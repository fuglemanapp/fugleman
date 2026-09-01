import { Suspense } from "react";

import { AuthShell } from "@/components/auth/auth-shell";
import { SignInForm } from "@/components/auth/sign-in-form";

export const metadata = { title: "Entrar" };

export default function LoginPage() {
  return <AuthShell eyebrow="Sua conta" title="Seu painel, seu número, seus dados." description="Entre para ver seus lançamentos e conversar com o WhatSpent pelo número que você vinculou."><Suspense fallback={<AuthFormLoading />}><SignInForm /></Suspense></AuthShell>;
}

function AuthFormLoading() {
  return <div className="mx-auto w-full max-w-md animate-pulse space-y-4"><div className="h-4 w-28 rounded bg-[#e4f1e8]" /><div className="h-9 w-64 rounded bg-[#e4f1e8]" /><div className="mt-8 h-12 rounded-xl bg-[#edf5ef]" /><div className="h-12 rounded-xl bg-[#edf5ef]" /><div className="h-12 rounded-xl bg-[#d7f0df]" /></div>;
}
