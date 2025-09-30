'use client';

import { useState, useEffect } from 'react';
import TodoList from '@/components/TodoList';
import AddTodo from '@/components/AddTodo';

export interface Todo {
  id: string;
  text: string;
  checked: boolean;
  createdAt: number;
  updatedAt: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/todos`);
      if (!response.ok) throw new Error('Failed to fetch todos');
      const data = await response.json();
      setTodos(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAddTodo = async (text: string) => {
    try {
      const response = await fetch(`${API_URL}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) throw new Error('Failed to create todo');
      await fetchTodos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add todo');
    }
  };

  const handleUpdateTodo = async (id: string, text: string, checked: boolean) => {
    try {
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, checked }),
      });
      if (!response.ok) throw new Error('Failed to update todo');
      await fetchTodos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update todo');
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete todo');
      await fetchTodos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete todo');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-800 mb-3 sm:mb-4">
              📝 Todo App
            </h1>
            <p className="text-base sm:text-lg text-gray-600">
              Manage your tasks with ease
            </p>
          </div>

          {/* Add Todo Form */}
          <div className="mb-6 sm:mb-8">
            <AddTodo onAdd={handleAddTodo} />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Todo List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading todos...</p>
            </div>
          ) : (
            <TodoList
              todos={todos}
              onUpdate={handleUpdateTodo}
              onDelete={handleDeleteTodo}
            />
          )}
        </div>
      </div>
    </main>
  );
}