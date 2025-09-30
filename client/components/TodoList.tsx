'use client';

import { Todo } from '@/app/page';
import TodoItem from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  onUpdate: (id: string, text: string, checked: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function TodoList({ todos, onUpdate, onDelete }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-sm">
        <p className="text-xl text-gray-500">No todos yet. Add one above to get started!</p>
      </div>
    );
  }

  const activeTodos = todos.filter((t) => !t.checked);
  const completedTodos = todos.filter((t) => t.checked);

  return (
    <div className="space-y-6">
      {/* Active Todos */}
      {activeTodos.length > 0 && (
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-4">
            Active ({activeTodos.length})
          </h2>
          <div className="space-y-3">
            {activeTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onUpdate={onUpdate}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed Todos */}
      {completedTodos.length > 0 && (
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-4">
            Completed ({completedTodos.length})
          </h2>
          <div className="space-y-3">
            {completedTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onUpdate={onUpdate}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}