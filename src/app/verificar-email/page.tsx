import { VerifyEmailCard } from "@/components/auth/verify-email-card";

export default async function VerificarEmailPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  return <VerifyEmailCard token={token} />;
}
