import { useState } from 'react';
import { trpc } from '../utils/trpc';

const TodosForm = () => {
  const utils = trpc.useContext();
  const { mutate, data } = trpc.todos.addTodo.useMutation({
    onSuccess(todo) {
      utils.todos.filterTodos.invalidate();
    },
  });
  const [todo, setTodo] = useState('');
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        mutate({
          title: todo,
        });
      }}
    >
      <input
        type="text"
        value={todo}
        onChange={(e) => setTodo(e.target.value)}
      />
      {data && JSON.stringify(data)}
    </form>
  );
};

export default TodosForm;
