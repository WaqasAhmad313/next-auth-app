import { PrismaAdapter } from "@auth/prisma-adapter";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/server/db/prisma";
import { ENV } from "@/server/env";
import { z } from "zod";
import { AuthController } from "@/server/modules/auth/auth.controller";
import type { NextRequest } from "next/server";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: ENV.NEXTAUTH_SECRET,

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        const mockReq = {
          json: async () => ({ email, password }),
          body: { email, password },
        } as unknown as NextRequest;

        const res = await AuthController.loginUser(mockReq);
        const response = "json" in res ? await res.json() : res;

        if (!response.success || !response.data?.user) {
          console.error("Login failed:", response);
          return null;
        }

        return response.data.user;
      },
    }),

    GoogleProvider({
      clientId: ENV.GOOGLE_CLIENT_ID!,
      clientSecret: ENV.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id,
          email: token.email,
          name: token.name,
        };
      }
      return session;
    },
  },

  pages: {
    signIn: "/signin",
    error: "/auth/error",
  },
};
