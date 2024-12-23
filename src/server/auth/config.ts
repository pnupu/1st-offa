// src/server/auth/config.ts

import { PrismaAdapter } from "@auth/prisma-adapter";
import { type NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/server/db";
import { type UserRole } from "@prisma/client";
import { env } from "@/env";
import type { JWT } from "next-auth/jwt";

// Extend NextAuth.js types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      companyId?: string | null;
      email?: string | null;
      name?: string | null;
      image?: string | null;
    };
    expires: string;
  }

  interface User {
    role: UserRole;
    companyId?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: UserRole;
    companyId?: string | null;
    sub?: string;
    name?: string | null;
    email?: string | null;
    picture?: string | null;
  }
}

declare module "@auth/core/types" {
  interface User {
    role: UserRole;
    companyId?: string | null;
  }
}

declare module "@auth/core/adapters" {
  interface AdapterUser {
    role: UserRole;
    companyId?: string | null;
  }
}

type Credentials = {
  email: string;
  name?: string;
  companyId: string;
};

const isDev = process.env.NODE_ENV === "development";
const baseUrl = isDev ? "http://localhost:3000" : "https://1statoffa.com";

export const authConfig: NextAuthConfig = {
  debug: isDev,
  trustHost: true,

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.role = token.role!;
        session.user.companyId = token.companyId;
        session.user.email = token.email ?? "";
        session.user.name = token.name;
        session.user.image = token.picture;

        // Create or update session in database
        await db.session.upsert({
          where: {
            sessionToken: token.jti ?? '',
          },
          create: {
            sessionToken: token.jti ?? '',
            userId: token.sub!,
            expires: new Date(token.exp! * 1000),
          },
          update: {
            expires: new Date(token.exp! * 1000),
          },
        });
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        token = {
          ...token,
          role: user.role,
          companyId: user.companyId,
          email: user.email,
          name: user.name,
          picture: user.image,
          jti: crypto.randomUUID(), // Add a unique session ID
          exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 days from now
        };
      }
      return token;
    },
  },

  adapter: PrismaAdapter(db),
  providers: [
    GoogleProvider({
      clientId: env.AUTH_GOOGLE_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET,
    }),
    CredentialsProvider({
      name: "Company Login",
      credentials: {
        email: { label: "Email", type: "email" },
        name: { label: "Name", type: "text" },
        companyId: { label: "Company ID", type: "text" },
      },
      async authorize(credentials) {
        const creds = credentials as Credentials;
        if (!creds?.email || !creds?.companyId) {
          throw new Error("Missing email or company ID");
        }

        try {
          // Start a transaction to ensure data consistency
          const result = await db.$transaction(async (tx) => {
            const user = await tx.user.upsert({
              where: { email: creds.email },
              update: {
                name: creds.name ?? null,
                employeeAt: {
                  connect: { id: creds.companyId }
                },
                role: "COMPANY_EMPLOYEE",
              },
              create: {
                email: creds.email,
                name: creds.name ?? null,
                employeeAt: {
                  connect: { id: creds.companyId }
                },
                role: "COMPANY_EMPLOYEE",
              },
              include: {
                employeeAt: true,
              },
            });

            if (!user) {
              throw new Error("Failed to create user");
            }

            return user;
          });

          return {
            id: result.id,
            email: result.email,
            name: result.name,
            image: result.image,
            emailVerified: result.emailVerified,
            role: result.role,
            companyId: result.companyId,
          };
        } catch (error) {
          console.error("Authorize error:", error);
          throw new Error("Failed to log in");
        }
      },
    }),
  ],
  pages: {
    signIn: `${baseUrl}/auth/signin`,
    error: `${baseUrl}/auth/signin`,
  },
  cookies: {
    pkceCodeVerifier: {
      name: "next-auth.pkce.code_verifier",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: !isDev,
      },
    },
  },
};
