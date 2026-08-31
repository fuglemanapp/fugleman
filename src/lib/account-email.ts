import { Resend } from "resend";

type AccountEmail = {
  to: string;
  subject: string;
  html: string;
};

export function buildAccountUrl(path: string, token: string, origin = process.env.NEXTAUTH_URL) {
  if (!origin || !path.startsWith("/")) {
    throw new Error("Configuração de URL da conta inválida.");
  }

  const base = new URL(origin);
  const url = new URL(path, base);
  if (url.origin !== base.origin) {
    throw new Error("Configuração de URL da conta inválida.");
  }

  url.searchParams.set("token", token);
  return url;
}

export async function sendAccountEmail({ to, subject, html }: AccountEmail) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    throw new Error("E-mail transacional não está configurado.");
  }

  const response = await new Resend(apiKey).emails.send({ from, to, subject, html });
  if (response.error) {
    throw new Error("Não foi possível enviar o e-mail transacional.");
  }
}
