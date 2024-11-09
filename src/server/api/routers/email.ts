import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const emailRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const emails = await ctx.db.gameEmail.findMany({
      orderBy: [{ order: 'asc' }],
      include: {
        replies: true,
        reads: {
          where: {
            userId: ctx.session.user.id
          }
        }
      },
    });

    // Transform the data to include a simple read boolean
    return emails.map(email => ({
      ...email,
      read: email.reads.length > 0
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