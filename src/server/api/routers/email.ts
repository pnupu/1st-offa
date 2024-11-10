import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const emailRouter = createTRPCRouter({
  getAll: protectedProcedure
    .query(async ({ ctx }) => {
      const emails = await ctx.db.gameEmail.findMany({
        include: {
          reads: {
            where: {
              userId: ctx.session.user.id,
            },
          },
          replies: {
            where: {
              userId: ctx.session.user.id,
            },
          },
        },
        orderBy: {
          order: 'asc',
        },
      });

      return emails.map((email) => ({
        ...email,
        replies: email.replies.map((reply) => ({
          ...reply,
          createdAt: reply.createdAt.getTime(),
        })),
      }));
    }),

  markAsRead: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Create a read record for this user and email
      return ctx.db.gameEmailRead.create({
        data: {
          emailId: input.id,
          userId: ctx.session.user.id,
        },
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
          userId: ctx.session.user.id,
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