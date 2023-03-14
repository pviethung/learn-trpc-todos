import { useState } from 'react';
import { FilterBy } from '../../../BE/src/router';
import { trpc } from '../utils/trpc';
import TodosList from './TodosList';

const TodosFilter = () => {
  const [filterBy, setFilterBy] = useState<FilterBy>('all');
  const { data } = trpc.todos.filterTodos.useQuery({
    filterBy,
  });

  return (
    <div>
      {data && <TodosList data={data} />}

      <select
        onChange={(e) => {
          setFilterBy(e.target.value as FilterBy);
        }}
      >
        <option value="all">All</option>
        <option value="active">Active</option>
        <option value="completed">Completed</option>
      </select>
    </div>
  );
};

export default TodosFilter;
