import { inferAsyncReturnType } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';

export const createContext = ({}: trpcExpress.CreateExpressContextOptions) => ({});
export type Context = inferAsyncReturnType<typeof createContext>;