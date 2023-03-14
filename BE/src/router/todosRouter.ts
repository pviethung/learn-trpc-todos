import { TRPCError } from '@trpc/server';
import fs from 'fs/promises';
import path from 'path';
import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { getRandomId } from '../utils';

const todoSchema = z.object({
  id: z.string(),
  title: z.string(),
  isCompleted: z.boolean(),
});
const filterBy = z.enum(['all', 'active', 'completed']).optional();

export type Todo = z.infer<typeof todoSchema>;
export type FilterBy = z.infer<typeof filterBy>;

const getTodos = async () => {
  const rawData = await fs.readFile(
    path.resolve('src/data/todos.json'),
    'utf-8'
  );

  if (rawData.trim() === '') return [];
  const todos = JSON.parse(rawData) as Todo[];
  return todos;
};

export const todosRouter = router({
  getTodos: publicProcedure.output(z.array(todoSchema)).query(() => {
    try {
      return getTodos();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }),
  addTodo: publicProcedure
    .input(z.object({ title: z.string() }))
    .output(todoSchema)
    .mutation(async ({ input }) => {
      const todos = await getTodos();
      const todo = {
        id: getRandomId(),
        title: input.title,
        isCompleted: false,
      };
      todos.push(todo);
      console.log(todos);

      try {
        await fs.writeFile(
          path.resolve('src/data/todos.json'),
          JSON.stringify(todos),
          'utf-8'
        );
        return todo;
      } catch (error) {
        console.log(error);
        throw error;
      }
    }),
  filterTodos: publicProcedure
    .input(
      z.object({
        filterBy: filterBy,
      })
    )
    .query(async ({ input }) => {
      const filterBy = input.filterBy;
      const todos = await getTodos();

      if (filterBy === 'all') return todos;
      if (filterBy === 'active')
        return todos.filter((todo) => {
          return !todo.isCompleted;
        });
      if (filterBy === 'completed')
        return todos.filter((todo) => {
          return todo.isCompleted;
        });

      return [];
    }),
  changeStatus: publicProcedure
    .input(todoSchema.pick({ id: true }))
    .mutation(async ({ input }) => {
      const todos = await getTodos();
      const { id } = input;

      const todo = todos.find((todo) => todo.id === id);
      if (todo) {
        todo.isCompleted = !todo.isCompleted;
        try {
          await fs.writeFile(
            path.resolve('src/data/todos.json'),
            JSON.stringify(todos),
            'utf-8'
          );
          return todo;
        } catch (error) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Something went wrong',
          });
        }
      }

      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Todo not found',
      });
    }),
});
