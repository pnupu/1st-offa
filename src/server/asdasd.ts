// // src/server/auth.ts
// import { type GetServerSidePropsContext } from "next";
// import { getServerSession, type DefaultSession, type NextAuthOptions } from "next-auth";
// import { PrismaAdapter } from "@next-auth/prisma-adapter";
// import GoogleProvider from "next-auth/providers/google";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { db } from "@/server/db";
// import { env } from "@/env";
// import { type UserRole } from "@prisma/client";

// declare module "next-auth" {
//   interface Session extends DefaultSession {
//     user: {
//       id: string;
//       role: UserRole;
//       companyId?: string | null;
//     } & DefaultSession["user"];
//   }

//   interface User {
//     role: UserRole;
//     companyId?: string | null;
//   }
// }

// export const authOptions: NextAuthOptions = {
//   adapter: PrismaAdapter(db),
//   session: {
//     strategy: "jwt",
//   },
//   pages: {
//     signIn: '/auth/signin',
//   },
//   callbacks: {
//     session: ({ session, token }) => {
//       if (session.user) {
//         session.user.id = token.sub!;
//         session.user.role = token.role as UserRole;
//         session.user.companyId = token.companyId as string | undefined;
//       }
//       return session;
//     },
//     jwt: ({ token, user }) => {
//       if (user) {
//         token.role = user.role;
//         token.companyId = user.companyId;
//       }
//       return token;
//     },
//   },
//   providers: [
//     GoogleProvider({
//       clientId: env.AUTH_GOOGLE_ID,
//       clientSecret: env.AUTH_GOOGLE_SECRET,
//     }),
//     CredentialsProvider({
//       name: "Company Login",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         name: { label: "Name", type: "text" },
//         companyId: { label: "Company ID", type: "text" },
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.name || !credentials?.companyId) {
//           return null;
//         }

//         try {
//           const user = await db.user.upsert({
//             where: { email: credentials.email },
//             update: {
//               name: credentials.name,
//               employeeAt: {
//                 connect: { id: credentials.companyId }
//               },
//               role: "COMPANY_EMPLOYEE" as const
//             },
//             create: {
//               email: credentials.email,
//               name: credentials.name,
//               employeeAt: {
//                 connect: { id: credentials.companyId }
//               },
//               role: "COMPANY_EMPLOYEE" as const
//             },
//           });

//           return {
//             id: user.id,
//             email: user.email,
//             name: user.name,
//             role: user.role,
//             companyId: credentials.companyId,
//             image: null,
//             emailVerified: null,
//           };
//         } catch (error) {
//           console.error("Auth error:", error);
//           return null;
//         }
//       },
//     }),
//   ],
// };

// export const getServerAuthSession = (ctx?: {
//   req: GetServerSidePropsContext["req"];
//   res: GetServerSidePropsContext["res"];
// }) => {
//   if (!ctx) return null;
//   return getServerSession(ctx.req, ctx.res, authOptions);
// };

// // For use in client components
// export const auth = () => {
//   return getServerSession(authOptions);
// };