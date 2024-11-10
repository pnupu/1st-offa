import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
  updateProfile: protectedProcedure
    .input(z.object({
      name: z.string().min(2).max(100),
    }))
    .mutation(async ({ ctx, input }) => {
      const { name } = input;
      
      // Create file record if image is provided

      return ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: {
          name,
        }
      });
    }),

  getProfile: protectedProcedure
    .query(async ({ ctx }) => {
      return ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
        include: {
          gameScores: {
            include: {
              task: true,
            },
            orderBy: {
              createdAt: 'desc',
            },
            take: 3,
          },
          oceanProfile: true,
          employeeAt: true,
        },
      });
    }),

  registerCompanyUser: publicProcedure
    .input(z.object({
      name: z.string(),
      email: z.string().email(),
      companyId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.create({
        data: {
          name: input.name,
          email: input.email,
          companyId: input.companyId,
        },
      });
      return user;
    }),
}); 