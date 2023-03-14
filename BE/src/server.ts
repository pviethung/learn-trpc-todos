import * as trpcExpress from '@trpc/server/adapters/express';
import cors from 'cors';
import express from 'express';
import { createContext } from './context';
import { todosRouter } from './router';
import { router } from './trpc';


const appRouter = router({
  todos: todosRouter
});
const app = express();


app.use(cors());
app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);
app.listen(4000);

// export type definition of API
export type AppRouter = typeof appRouter;
