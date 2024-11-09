import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const emailRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.gameEmail.findMany({
      orderBy: { order: 'asc' },
      include: {
        replies: true,
      },
    });
  }),

  markAsRead: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.gameEmail.update({
        where: { id: input.id },
        data: { read: true },
      });
    }),

  reply: protectedProcedure
    .input(z.object({
      emailId: z.string(),
      content: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.gameEmailReply.create({
        data: {
          emailId: input.emailId,
          content: input.content,
        },
      });
    }),

  archive: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.gameEmail.update({
        where: { id: input.id },
        data: { archived: true },
      });
    }),
}); 