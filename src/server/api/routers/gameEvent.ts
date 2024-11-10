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
            // Get all events, email replies, and task events
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

            // Track tasks that were started but not completed
            const taskStatus = new Map<string, { started: boolean, completed: boolean }>();
            
            // First pass to identify incomplete tasks
            taskEvents.forEach(event => {
                const taskId = event.taskId;
                if (!taskId) return;
                
                if (!taskStatus.has(taskId)) {
                    taskStatus.set(taskId, { started: false, completed: false });
                }
                
                const status = taskStatus.get(taskId)!;
                if (event.type === 'TASK_STARTED') {
                    status.started = true;
                } else if (event.type === 'TASK_COMPLETED') {
                    status.completed = true;
                }
            });

            // Process task events with special handling for completion times and penalties
            scores = taskEvents.reduce((scores, event) => {
                let conscientiousnessModifier = 0;
                
                if (event.type === 'TASK_COMPLETED') {
                    conscientiousnessModifier = 0.1; // Base completion bonus
                    
                    // Add efficiency bonus for quick completions
                    if (event.completionTime && event.completionTime < 300) { // Less than 5 minutes
                        conscientiousnessModifier += 0.05;
                    }
                } else if (event.type === 'TASK_STARTED') {
                    // Check if this task was never completed
                    const taskId = event.taskId;
                    if (taskId && taskStatus.has(taskId)) {
                        const status = taskStatus.get(taskId)!;
                        if (status.started && !status.completed) {
                            conscientiousnessModifier = -0.15; // Penalty for unfinished task
                            scores.neuroticism = updateScore(scores.neuroticism, 0.1);
                        }
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

    saveDrawing: protectedProcedure
        .input(z.object({
            imageData: z.string(),
            type: z.string()
        }))
        .mutation(async ({ ctx, input }) => {
            try {
                // Remove base64 prefix if present
                const base64Data = input.imageData.replace(/^data:image\/\w+;base64,/, '');
                
                // Convert base64 to Buffer
                const buffer = Buffer.from(base64Data, 'base64');

                // Create both file and game event in a transaction
                const result = await ctx.db.$transaction(async (tx) => {
                    // Create the file first
                    const file = await tx.file.create({
                        data: {
                            blob: buffer,
                            key: `drawing-${Date.now()}-${ctx.session.user.id}`,
                            userId: ctx.session.user.id,
                        }
                    });

                    // Create the game event with the file reference
                    const gameEvent = await tx.gameEvent.create({
                        data: {
                            type: input.type,
                            userId: ctx.session.user.id,
                            fileId: file.id,
                            openness: 0.1,
                            conscientiousness: 0.05
                        }
                    });

                    return { file, gameEvent };
                });

                return result.gameEvent;
            } catch (error) {
                console.error('Error saving drawing:', error);
                throw error;
            }
        }),

    getDrawings: protectedProcedure
        .query(async ({ ctx }) => {
            try {
                const files = await ctx.db.file.findMany({
                    where: {
                        userId: ctx.session.user.id,
                        gameEvent: {
                            type: "GOAL_DRAWING"
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                });

                return files.map(file => ({
                    id: file.id,
                    dataUrl: `data:image/png;base64,${file.blob.toString('base64')}`
                }));
            } catch (error) {
                console.error('Error fetching drawings:', error);
                throw error;
            }
        })
}); 