// src/server/api/routers/profile.ts
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { ProfileType } from "@prisma/client";

const oceanScoreSchema = z.object({
  openness: z.number().min(0).max(1),
  conscientiousness: z.number().min(0).max(1),
  extraversion: z.number().min(0).max(1),
  agreeableness: z.number().min(0).max(1),
  neuroticism: z.number().min(0).max(1),
});

export const profileRouter = createTRPCRouter({
  createOceanProfile: protectedProcedure
    .input(z.object({
      profileType: z.enum(['USER', 'COMPANY']),
      ...oceanScoreSchema.shape
    }))
    .mutation(async ({ ctx, input }) => {
      const { profileType, ...scores } = input;

      return ctx.db.oceanProfile.create({
        data: {
          ...scores,
          profileType,
          user: {
            connect: {
              id: ctx.session?.user.id
            }
          },
        }
      });
    }),

  calculateCompanyProfile: protectedProcedure
    .input(z.string()) // companyId
    .mutation(async ({ ctx, input }) => {
      const employees = await ctx.db.user.findMany({
        where: { 
          companyId: input,
          oceanProfile: { isNot: null }
        },
        include: { oceanProfile: true }
      });

      if (employees.length === 0) {
        throw new TRPCError({ 
          code: "BAD_REQUEST",
          message: "No employee profiles found"
        });
      }

      // Calculate median scores
      const validProfiles = employees
        .map(emp => emp.oceanProfile)
        .filter((profile): profile is NonNullable<typeof profile> => profile !== null);

      const medianScores = {
        openness: calculateMedian(validProfiles.map(p => p.openness)),
        conscientiousness: calculateMedian(validProfiles.map(p => p.conscientiousness)),
        extraversion: calculateMedian(validProfiles.map(p => p.extraversion)),
        agreeableness: calculateMedian(validProfiles.map(p => p.agreeableness)),
        neuroticism: calculateMedian(validProfiles.map(p => p.neuroticism)),
      };

      return ctx.db.oceanProfile.upsert({
        where: { companyId: input },
        update: medianScores,
        create: {
          ...medianScores,
          profileType: ProfileType.COMPANY,
          company: { connect: { id: input } }
        }
      });
    }),

  getUserProfile: protectedProcedure
    .query(({ ctx }) => {
      return ctx.db.oceanProfile.findUnique({
        where: { userId: ctx.session.user.id }
      });
    }),

  getCompanyProfile: protectedProcedure
    .input(z.string()) // companyId
    .query(({ ctx, input }) => {
      return ctx.db.oceanProfile.findUnique({
        where: { companyId: input }
      });
    }),
});

function calculateMedian(numbers: number[]): number {
  if (numbers.length === 0) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Cannot calculate median of empty array"
    });
  }

  const sorted = [...numbers].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    const lowerMiddle = sorted[middle - 1]!;
    const upperMiddle = sorted[middle]!;
    return (lowerMiddle + upperMiddle) / 2;
  }

  return sorted[middle]!;
}