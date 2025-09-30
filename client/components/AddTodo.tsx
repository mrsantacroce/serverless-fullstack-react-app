'use client';

import { useState, FormEvent } from 'react';
import { validateTodoText, MAX_TODO_LENGTH } from '@/lib/validation';

interface AddTodoProps {
  onAdd: (text: string) => Promise<void>;
}

export default function AddTodo({ onAdd }: AddTodoProps) {
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    setText(newText);
    if (error) setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const validation = validateTodoText(text);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid input');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onAdd(text.trim());
      setText('');
    } catch (err) {
      setError('Failed to add todo. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const remainingChars = MAX_TODO_LENGTH - text.length;
  const showCharCount = text.length > MAX_TODO_LENGTH * 0.8;

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={text}
              onChange={handleChange}
              placeholder="What needs to be done?"
              disabled={isSubmitting}
              maxLength={MAX_TODO_LENGTH}
              className={`w-full px-4 py-3 sm:py-4 text-base sm:text-lg border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {showCharCount && (
              <p className={`text-sm mt-1 ${remainingChars < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                {remainingChars} characters remaining
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting || !text.trim()}
            className="px-6 py-3 sm:py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all text-base sm:text-lg"
          >
            {isSubmitting ? 'Adding...' : 'Add Todo'}
          </button>
        </div>
        {error && (
          <div className="text-red-600 text-sm bg-red-50 border border-red-200 px-4 py-2 rounded-lg">
            {error}
          </div>
        )}
      </div>
    </form>
  );
}