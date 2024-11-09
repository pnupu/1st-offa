import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { companyRouter } from "./routers/company";
import { gameRouter } from "./routers/game";
import { profileRouter } from "./routers/profile";
import { userRouter } from "./routers/user";
import { openaiRouter } from "./routers/openai";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  company: companyRouter,
  game: gameRouter,
  profile: profileRouter,
  user: userRouter,
  openai: openaiRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
