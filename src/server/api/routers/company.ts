// src/server/api/routers/company.ts
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const companyRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({
      name: z.string().min(1),
      description: z.string().optional(),
      website: z.string().url().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== "ADMIN") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      return ctx.db.company.create({
        data: {
          name: input.name,
          description: input.description,
          website: input.website,
        }
      });
    }),

  modify: protectedProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().min(1).optional(),
      description: z.string().optional(),
      website: z.string().url().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const company = await ctx.db.company.findUnique({
        where: { id: input.id },
      });

      if (!company) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      if (ctx.session.user.role !== "ADMIN") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      return ctx.db.company.update({
        where: { id: input.id },
        data: {
          name: input.name,
          description: input.description,
          website: input.website,
        }
      });
    }),

  getAll: protectedProcedure
    .query(async ({ ctx }) => {
      return ctx.db.company.findMany({
        include: {
          oceanProfile: true,
          logo: true,
        },
      });
    }),

  getAllCompanyNames: publicProcedure
    .query(async ({ ctx }) => {
      return ctx.db.company.findMany({
        select: {
          name: true,
          id: true,
        },
      });
    }),

  getById: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const company = await ctx.db.company.findUnique({
        where: { id: input },
        include: {
          oceanProfile: true,
          employees: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              oceanProfile: true
            }
          }
        }
      });

      if (!company) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Company not found"
        });
      }

      return company;
    }),

  addEmployee: protectedProcedure
    .input(z.object({
      companyId: z.string(),
      userId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const company = await ctx.db.company.findUnique({
        where: { id: input.companyId },
      });

      if (!company) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      if (ctx.session.user.role !== "ADMIN") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      return ctx.db.user.update({
        where: { id: input.userId },
        data: {
          role: "COMPANY_EMPLOYEE" as const,
          employeeAt: {
            connect: { id: input.companyId }
          }
        }
      });
    }),
});