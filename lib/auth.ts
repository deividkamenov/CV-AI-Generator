import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import GoogleProvider from "next-auth/providers/google"
import EmailProvider from "next-auth/providers/email"
import { prisma } from "./prisma"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    // Google provider (optional - only if credentials are set)
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
      ]
      : []),
    // Email provider is disabled by default because it requires SMTP configuration
    // Uncomment and configure SMTP settings in .env to enable email login
  ],
  events: {
    async createUser({ user }) {
      // Create free subscription for new users
      await prisma.subscription.create({
        data: {
          userId: user.id,
          plan: "free",
          status: "free",
          applicationsLimit: 5,
          applicationsUsed: 0,
        },
      })
    },
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        const subscription = await prisma.subscription.findUnique({
          where: { userId: user.id },
        })
        session.user.subscription = subscription
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
}
