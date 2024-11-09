import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import OpenAI from "openai";
import { env } from "@/env";
const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

type OceanScores = {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
};

export const openaiRouter = createTRPCRouter({
  chat: protectedProcedure
    .input(
      z.object({
        message: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const completion = await openai.chat.completions.create({
          messages: [{ role: "user", content: input.message }],
          model: "gpt-3.5-turbo",
        });

        return {
          response: completion.choices[0]?.message?.content ?? "No response",
        };
      } catch (error) {
        console.error("OpenAI API error:", error);
        throw new Error("Failed to get response from OpenAI");
      }
    }),
  evaluateResponse: protectedProcedure
    .input(z.object({ 
      replyId: z.string(),
      response: z.string() 
    }))
    .mutation(async ({ ctx, input }) => {
      console.log("Evaluating response:", input.response);
      const prompt = `
        You are a psychotherapist.
        Evaluate the following response from a user: "${input.response}"
        Return a score on the ocean model scale.
        The score should be a decimal between 0 and 1.
        Return only a JSON object in this exact format, nothing else:
        {
          "openness": 0.5,
          "conscientiousness": 0.5,
          "extraversion": 0.5,
          "agreeableness": 0.5,
          "neuroticism": 0.5
        }
      `;

      try {
        const completion = await openai.chat.completions.create({
          messages: [{ role: "user", content: prompt }],
          model: "gpt-3.5-turbo",
          temperature: 0.7,
        });

        const content = completion.choices[0]?.message?.content;
        console.log("OpenAI response:", content);

        if (!content) {
          throw new Error("No response from OpenAI");
        }

        const oceanScores = JSON.parse(content) as OceanScores;

        // Validate the scores
        const scores = ["openness", "conscientiousness", "extraversion", "agreeableness", "neuroticism"] as const;
        for (const score of scores) {
          if (typeof oceanScores[score] !== 'number' || oceanScores[score] < 0 || oceanScores[score] > 1) {
            throw new Error(`Invalid ${score} score: ${oceanScores[score]}`);
          }
        }

        // Update the reply with OCEAN scores
        await ctx.db.gameEmailReply.update({
          where: { id: input.replyId },
          data: oceanScores,
        });

        // Get all evaluated replies
        const allReplies = await ctx.db.gameEmailReply.findMany({
          where: {
            email: {
              replies: {
                some: {
                  openness: { not: null },
                }
              }
            }
          },
          select: {
            openness: true,
            conscientiousness: true,
            extraversion: true,
            agreeableness: true,
            neuroticism: true,
          }
        });

        if (allReplies.length > 0) {
          const sums = allReplies.reduce<OceanScores>((acc, reply) => ({
            openness: acc.openness + (reply.openness ?? 0),
            conscientiousness: acc.conscientiousness + (reply.conscientiousness ?? 0),
            extraversion: acc.extraversion + (reply.extraversion ?? 0),
            agreeableness: acc.agreeableness + (reply.agreeableness ?? 0),
            neuroticism: acc.neuroticism + (reply.neuroticism ?? 0),
          }), {
            openness: 0,
            conscientiousness: 0,
            extraversion: 0,
            agreeableness: 0,
            neuroticism: 0,
          });

          const replyCount = allReplies.length;
          const finalScores: OceanScores = {
            openness: sums.openness / replyCount,
            conscientiousness: sums.conscientiousness / replyCount,
            extraversion: sums.extraversion / replyCount,
            agreeableness: sums.agreeableness / replyCount,
            neuroticism: sums.neuroticism / replyCount,
          };

          // Update user's OCEAN profile
          await ctx.db.oceanProfile.update({
            where: { userId: ctx.session.user.id },
            data: finalScores,
          });
        }

        return oceanScores;
      } catch (error) {
        console.error('Error evaluating response:', error);
        throw error;
      }
    }),
});
