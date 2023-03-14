import { createTRPCReact } from '@trpc/react-query';
import { AppRouter } from './../../../BE/src/server';

export const trpc = createTRPCReact<AppRouter>();