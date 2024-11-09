// src/server/api/routers/game.ts
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";

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

  getDinoLeaderboard: publicProcedure
    .query(async ({ ctx }) => {
      // Get the highest score for each user
      const highestScores = await ctx.db.gameEvent.groupBy({
        by: ['userId'],
        where: {
          type: "DINO_GAME_PLAYED",
          score: { not: null }, // Only include events with scores
        },
        _max: {
          score: true,
          createdAt: true,
        },
      });

      // Get the full records for these highest scores
      const userIds = highestScores.map(score => score.userId);
      const gameEvents = await ctx.db.gameEvent.findMany({
        where: {
          type: "DINO_GAME_PLAYED",
          userId: { in: userIds },
          score: {
            in: highestScores.map(score => score._max.score).filter((score): score is number => score !== null)
          }
        },
        select: {
          id: true,
          score: true,
          user: {
            select: {
              id: true,
              name: true,
            },
          },
          createdAt: true,
        },
        orderBy: {
          score: 'desc',
        },
        take: 10,
      });

      return gameEvents.map(event => ({
        id: event.id,
        score: event.score ?? 0,
        user: event.user,
        date: event.createdAt,
      }));
    }),
});