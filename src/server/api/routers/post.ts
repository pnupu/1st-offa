import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const postRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({
      content: z.string().min(1).max(280),
      imageData: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Content moderation using OpenAI
      const moderation = await openai.moderations.create({
        input: input.content,
      });

      const isFlagged = moderation.results[0]?.flagged;

      if (isFlagged) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Your post contains inappropriate content",
        });
      }

      // First create the file if we have image data
      let fileId = undefined;
      if (input.imageData?.includes('base64,')) {
        const base64Data = input.imageData.split('base64,')[1];
        if (base64Data) {
          const file = await ctx.db.file.create({
            data: {
              blob: Buffer.from(base64Data, 'base64'),
              key: `post-image-${Date.now()}`,
              userId: ctx.session.user.id
            }
          });
          fileId = file.id;
        }
      }

      // Then create the post with the file reference
      const post = await ctx.db.post.create({
        data: {
          content: input.content,
          authorId: ctx.session.user.id,
          approved: true, // Auto-approve if passed moderation
          fileId: fileId // Link to the file if we created one
        },
      });

      return post;
    }),

  getAll: protectedProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(50),
      cursor: z.string().nullish(),
    }))
    .query(async ({ ctx, input }) => {
      const posts = await ctx.db.post.findMany({
        take: input.limit + 1,
        where: {
          approved: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          author: {
            select: {
              name: true,
              image: true,
            },
          },
          file: true,
        },
        cursor: input.cursor ? { id: input.cursor } : undefined,
      });

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (posts.length > input.limit) {
        const nextItem = posts.pop();
        nextCursor = nextItem!.id;
      }

      // Transform the posts to include base64 image data
      const transformedPosts = posts.map(post => {
        const { file, ...restPost } = post;
        return {
          ...restPost,
          file: file ? {
            id: file.id,
            key: file.key,
            createdAt: file.createdAt,
            dataUrl: `data:image/png;base64,${Buffer.from(file.blob).toString('base64')}`,
          } : null,
        };
      });

      return {
        posts: transformedPosts,
        nextCursor,
      };
    }),
}); 