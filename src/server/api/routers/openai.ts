import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { zodResponseFormat } from "openai/helpers/zod";
import OpenAI from "openai";
import { env } from "@/env";
const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

const oceanModelScale = z.object({
  openness: z.number().min(0).max(1), 
  conscientiousness: z.number().min(0).max(1),
  extraversion: z.number().min(0).max(1),
  agreeableness: z.number().min(0).max(1),
  neuroticism: z.number().min(0).max(1),
});

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
    .input(z.object({ response: z.string() }))
    .mutation(async ({ input }) => {
      const prompt = `
        You are a psychotherapist.
        Evaluate the following response from a user: ${input.response}
        Return a score on the ocean model scale.
        The score should be a decimal between 0 and 1.
        The response should be in JSON format.
        { 
          openness: decimal,
          conscientiousness: decimal,
          extraversion: decimal,
          agreeableness: decimal,
          neuroticism: decimal
        }
      `;

      const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-3.5-turbo",
        response_format: zodResponseFormat(oceanModelScale, "ocean model scale"),
      });

      return {
        response: completion.choices[0]?.message?.content ?? "No response",
      };
    }),
});
