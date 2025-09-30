'use client';

import { useState, FormEvent } from 'react';

interface AddTodoProps {
  onAdd: (text: string) => Promise<void>;
}

export default function AddTodo({ onAdd }: AddTodoProps) {
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsSubmitting(true);
    try {
      await onAdd(text.trim());
      setText('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What needs to be done?"
          disabled={isSubmitting}
          className="flex-1 px-4 py-3 sm:py-4 text-base sm:text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
        />
        <button
          type="submit"
          disabled={isSubmitting || !text.trim()}
          className="px-6 py-3 sm:py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all text-base sm:text-lg"
        >
          {isSubmitting ? 'Adding...' : 'Add Todo'}
        </button>
      </div>
    </form>
  );
}