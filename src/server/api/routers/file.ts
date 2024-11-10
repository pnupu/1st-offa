import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const fileRouter = createTRPCRouter({
  getFileById: protectedProcedure
    .input(z.object({
      fileId: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      const file = await ctx.db.file.findUnique({
        where: {
          id: input.fileId,
        },
      });

      if (!file) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "File not found",
        });
      }

      // Convert the Bytes buffer to base64 string
      const base64Data = file.blob.toString('base64');
      return {
        id: file.id,
        dataUrl: `data:image/png;base64,${base64Data}`,
        key: file.key,
        createdAt: file.createdAt,
      };
    }),
}); 