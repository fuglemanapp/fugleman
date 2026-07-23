import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/prisma"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { getServerSession } from "next-auth"
import { Adapter } from "next-auth/adapters"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "WhatsApp",
      credentials: {
        phone: { label: "WhatsApp Number", type: "text", placeholder: "+5511999999999" }
      },
      async authorize(credentials) {
        if (!credentials?.phone) return null
        
        const user = await prisma.user.findUnique({
          where: { phone: credentials.phone }
        })
        
        if (user) {
          return { id: user.id, name: user.name, email: user.email, image: user.image }
        } else {
          const newUser = await prisma.user.create({
            data: { phone: credentials.phone, name: "Usuário WhatsApp" }
          })
          return { id: newUser.id, name: newUser.name, email: newUser.email, image: newUser.image }
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
}

export const getAuthSession = () => getServerSession(authOptions)
