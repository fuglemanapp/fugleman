import { PublicAuthCard } from "@/components/auth/public-auth-form";

export default async function RedefinirSenhaPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  return <PublicAuthCard mode="reset-confirm" token={token} />;
}
