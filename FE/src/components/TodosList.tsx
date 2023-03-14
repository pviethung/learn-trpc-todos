import { Todo } from '../../../BE/src/router';
import { trpc } from '../utils/trpc';

const TodosList = ({ data }: { data: Todo[] }) => {
  const utils = trpc.useContext();
  const { mutate } = trpc.todos.changeStatus.useMutation({
    onSuccess(todo) {
      utils.todos.filterTodos.invalidate();
    },
  });
  return (
    <ul>
      {data.map((todo) => (
        <li key={todo.id}>
          <label>{todo.title}</label>
          <input
            onChange={(e) => {
              mutate({ id: todo.id });
            }}
            type="checkbox"
            checked={todo.isCompleted}
          />
        </li>
      ))}
    </ul>
  );
};

export default TodosList;
