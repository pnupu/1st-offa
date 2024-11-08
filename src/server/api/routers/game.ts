// src/server/api/routers/game.ts
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

// Define specific types for game settings and scores
const gameSettingsSchema = z.object({
  timeLimit: z.number().optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  // Add other specific settings as needed
});

const gameScoreSchema = z.object({
  score: z.number(),
  timeSpent: z.number(),
  accuracy: z.number(),
  // Add other specific score fields as needed
});

export const gameRouter = createTRPCRouter({
  createTask: protectedProcedure
    .input(z.object({
      name: z.string(),
      description: z.string(),
      type: z.string(),
      settings: gameSettingsSchema,
      weight: z.number().min(0).max(1).default(1.0),
    }))
    .mutation(({ ctx, input }) => {
      return ctx.db.gameTask.create({
        data: {
          name: input.name,
          description: input.description,
          type: input.type,
          settings: input.settings,
          weight: input.weight,
        }
      });
    }),

  submitScore: protectedProcedure
    .input(z.object({
      taskId: z.string(),
      rawScore: gameScoreSchema,
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.gameScore.create({
        data: {
          taskId: input.taskId,
          userId: ctx.session.user.id,
          rawScore: input.rawScore,
        }
      });
    }),

  getUserScores: protectedProcedure
    .query(({ ctx }) => {
      return ctx.db.gameScore.findMany({
        where: { userId: ctx.session.user.id },
        include: { task: true }
      });
    }),
});