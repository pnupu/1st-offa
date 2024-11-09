import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const gameEventRouter = createTRPCRouter({
    create: protectedProcedure
        .input(z.object({
            type: z.string(),
            oceanScores: z.object({
                openness: z.number().optional(),
                conscientiousness: z.number().optional(),
                extraversion: z.number().optional(),
                agreeableness: z.number().optional(),
                neuroticism: z.number().optional(),
            }),
            taskId: z.number().optional(),
            taskTitle: z.string().optional(),
            completionTime: z.number().optional(), // in seconds
            score: z.number().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
            return ctx.db.gameEvent.create({
                data: {
                    type: input.type,
                    userId: ctx.session.user.id,
                    openness: input.oceanScores.openness,
                    conscientiousness: input.oceanScores.conscientiousness,
                    extraversion: input.oceanScores.extraversion,
                    agreeableness: input.oceanScores.agreeableness,
                    neuroticism: input.oceanScores.neuroticism,
                    taskId: input.taskId?.toString(),
                    score: input.score,
                    taskTitle: input.taskTitle,
                    completionTime: input.completionTime,
                },
            });
        }),

    calculateFinalScores: protectedProcedure
        .mutation(async ({ ctx }) => {
            // Get all events, email replies, and task completions
            const [events, emailReplies, taskEvents] = await Promise.all([
                ctx.db.gameEvent.findMany({
                    where: {
                        userId: ctx.session.user.id,
                        taskId: null, // Regular events only
                    },
                }),
                ctx.db.gameEmailReply.findMany({
                    where: {
                        email: {
                            reads: {
                                some: {
                                    userId: ctx.session.user.id,
                                }
                            }
                        }
                    },
                }),
                ctx.db.gameEvent.findMany({
                    where: {
                        userId: ctx.session.user.id,
                        taskId: { not: null }, // Task-related events only
                    },
                }),
            ]);

            // Initialize base scores
            const baseScores = {
                openness: 0.5,
                conscientiousness: 0.5,
                extraversion: 0.5,
                agreeableness: 0.5,
                neuroticism: 0.5,
            };

            // Calculate weights
            const totalInteractions = events.length + emailReplies.length + taskEvents.length;
            const impactWeight = Math.max(0.1, 1 / Math.sqrt(totalInteractions));

            // Helper function for sigmoid score update
            const updateScore = (current: number, change: number | null) => {
                if (change === null || change === undefined) return current;
                const weightedChange = change * impactWeight;
                const newScore = current + weightedChange;
                return 1 / (1 + Math.exp(-5 * (newScore - 0.5)));
            };

            // Process regular game events
            let scores = events.reduce((scores, event) => ({
                openness: updateScore(scores.openness, event.openness),
                conscientiousness: updateScore(scores.conscientiousness, event.conscientiousness),
                extraversion: updateScore(scores.extraversion, event.extraversion),
                agreeableness: updateScore(scores.agreeableness, event.agreeableness),
                neuroticism: updateScore(scores.neuroticism, event.neuroticism),
            }), baseScores);

            // Process email replies
            scores = emailReplies.reduce((scores, reply) => ({
                openness: updateScore(scores.openness, reply.openness),
                conscientiousness: updateScore(scores.conscientiousness, reply.conscientiousness),
                extraversion: updateScore(scores.extraversion, reply.extraversion),
                agreeableness: updateScore(scores.agreeableness, reply.agreeableness),
                neuroticism: updateScore(scores.neuroticism, reply.neuroticism),
            }), scores);

            // Process task events with special handling for completion times
            scores = taskEvents.reduce((scores, event) => {
                let conscientiousnessModifier = 0;
                
                // Add conscientiousness bonus for completing tasks
                if (event.type === 'TASK_COMPLETED') {
                    conscientiousnessModifier = 0.1; // Base completion bonus
                    
                    // Add efficiency bonus for quick completions
                    if (event.completionTime && event.completionTime < 300) { // Less than 5 minutes
                        conscientiousnessModifier += 0.05;
                    }
                }

                return {
                    openness: updateScore(scores.openness, event.openness),
                    conscientiousness: updateScore(scores.conscientiousness, 
                        (event.conscientiousness ?? 0) + conscientiousnessModifier),
                    extraversion: updateScore(scores.extraversion, event.extraversion),
                    agreeableness: updateScore(scores.agreeableness, event.agreeableness),
                    neuroticism: updateScore(scores.neuroticism, event.neuroticism),
                };
            }, scores);

            // Update or create profile
            return ctx.db.oceanProfile.upsert({
                where: {
                    userId: ctx.session.user.id,
                },
                create: {
                    userId: ctx.session.user.id,
                    profileType: "USER",
                    ...scores,
                },
                update: scores,
            });
        }),
}); 