import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
  updateProfile: protectedProcedure
    .input(z.object({
      name: z.string().min(2).max(100),
      imageUrl: z.string().url().optional(),
      imageKey: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { name, imageUrl, imageKey } = input;
      
      // Create file record if image is provided
      let fileId: string | undefined;
      if (imageUrl && imageKey) {
        const file = await ctx.db.file.create({
          data: {
            url: imageUrl,
            key: imageKey,
            userId: ctx.session.user.id,
          },
        });
        fileId = file.id;
      }

      return ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: {
          name,
          ...(fileId && { files: { connect: { id: fileId } } }),
        },
        include: {
          files: true,
        },
      });
    }),

  getProfile: protectedProcedure
    .query(async ({ ctx }) => {
      console.log(ctx.session);
      return ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
        include: {
          files: true,
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