import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/prisma"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { getServerSession } from "next-auth"
import { Adapter } from "next-auth/adapters"
import { verifyPassword } from "@/lib/password"
import { canAuthenticateWithPassword } from "@/lib/credential-access"
import { GOOGLE_CALENDAR_SCOPES } from "@/lib/google-calendar"
import { consumeRateLimit } from "@/lib/rate-limit"
import { reportSecurityEvent } from "@/lib/security-events"

const googleClientId = process.env.GOOGLE_CLIENT_ID
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET
const authSecret = process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET

export const authOptions: NextAuthOptions = {
  secret: authSecret,
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    CredentialsProvider({
      name: "E-mail e senha",
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password;

        if (!email || !password) {
          return null;
        }

        const attempt = await consumeRateLimit(`credentials:${email}`, { limit: 5, windowMs: 15 * 60 * 1_000 });
        if (!attempt.allowed) {
          reportSecurityEvent("rate_limit_reached", { route: "/api/auth/callback/credentials", scope: "credentials" });
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email },
          select: { id: true, name: true, email: true, image: true, passwordHash: true, emailVerified: true },
        });

        if (!user || !canAuthenticateWithPassword(user) || !user.passwordHash) {
          return null;
        }

        if (!(await verifyPassword(password, user.passwordHash))) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
    ...(googleClientId && googleClientSecret
      ? [GoogleProvider({
        clientId: googleClientId,
        clientSecret: googleClientSecret,
        authorization: {
          params: {
            scope: `openid email profile ${GOOGLE_CALENDAR_SCOPES.join(" ")}`,
            access_type: "offline",
            prompt: "consent",
            include_granted_scopes: "true",
          },
        },
      })]
      : []),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.id) {
        await prisma.account.updateMany({
          where: { userId: user.id, provider: "google", providerAccountId: account.providerAccountId },
          data: {
            access_token: account.access_token,
            expires_at: account.expires_at,
            scope: account.scope,
            ...(account.refresh_token ? { refresh_token: account.refresh_token } : {}),
          },
        });
      }
      return true;
    },
  },
}

export const getAuthSession = () => getServerSession(authOptions)
