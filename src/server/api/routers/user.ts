import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({
  updateProfile: protectedProcedure
    .input(z.object({
      name: z.string().min(2).max(100),
      imageKey: z.string().optional(),
      imageData: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { name, imageKey, imageData } = input;
      
      // Create file record if image is provided
      let fileId: string | undefined;
      if (imageKey && imageData) {
        // Extract base64 data
        const base64Data = imageData.split('base64,')[1];
        if (!base64Data) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Invalid image data format',
          });
        }

        const file = await ctx.db.file.create({
          data: {
            key: imageKey,
            userId: ctx.session.user.id,
            blob: Buffer.from(base64Data, 'base64'), // Convert base64 to Buffer
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