// auth.ts — Node.js only. Never imported by middleware.ts.
// Adds the Credentials provider (needs Prisma + bcrypt) and PrismaAdapter
// on top of the Edge-safe base config from auth.config.ts.
import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import authConfig from "./auth.config"
import prisma from "@/lib/prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,

  // PrismaAdapter: safe here because this file never runs on Edge.
  adapter: PrismaAdapter(prisma),

  providers: [
    Credentials({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) return null;

        const passwordsMatch = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!passwordsMatch) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role as string,
          department: user.department ?? undefined,
        };
      },
    }),
  ],
})
