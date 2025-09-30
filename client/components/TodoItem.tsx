'use client';

import { useState } from 'react';
import { Todo } from '@/app/page';
import { validateTodoText, MAX_TODO_LENGTH } from '@/lib/validation';

interface TodoItemProps {
  todo: Todo;
  onUpdate: (id: string, text: string, checked: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function TodoItem({ todo, onUpdate, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleToggle = async () => {
    setIsUpdating(true);
    try {
      await onUpdate(todo.id, todo.text, !todo.checked);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSave = async () => {
    const validation = validateTodoText(editText);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid input');
      return;
    }

    setIsUpdating(true);
    setError(null);
    try {
      await onUpdate(todo.id, editText.trim(), todo.checked);
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update todo');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setEditText(todo.text);
    setIsEditing(false);
    setError(null);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(todo.id);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const remainingChars = MAX_TODO_LENGTH - editText.length;
  const showCharCount = editText.length > MAX_TODO_LENGTH * 0.8;

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border-2 transition-all ${
        todo.checked ? 'border-green-200 bg-green-50' : 'border-gray-200'
      } ${isDeleting ? 'opacity-50' : ''}`}
    >
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3 sm:gap-4">
          <button
            onClick={handleToggle}
            disabled={isUpdating || isDeleting}
            className={`flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 mt-0.5 transition-all ${
              todo.checked
                ? 'bg-green-500 border-green-500'
                : 'border-gray-300 hover:border-blue-500'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {todo.checked && (
              <svg
                className="w-full h-full text-white p-1"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>

          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="space-y-3">
                <div>
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => {
                      setEditText(e.target.value);
                      if (error) setError(null);
                    }}
                    className={`w-full px-3 py-2 text-base border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      error ? 'border-red-500' : 'border-blue-500'
                    }`}
                    autoFocus
                    disabled={isUpdating}
                    maxLength={MAX_TODO_LENGTH}
                  />
                  {showCharCount && (
                    <p className={`text-xs mt-1 ${remainingChars < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                      {remainingChars} characters remaining
                    </p>
                  )}
                </div>
                {error && (
                  <div className="text-red-600 text-xs bg-red-50 border border-red-200 px-3 py-1 rounded">
                    {error}
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={isUpdating || !editText.trim()}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isUpdating ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={isUpdating}
                    className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p
                  className={`text-base sm:text-lg break-words ${
                    todo.checked
                      ? 'line-through text-gray-500'
                      : 'text-gray-800'
                  }`}
                >
                  {todo.text}
                </p>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  {new Date(todo.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </>
            )}
          </div>

          {!isEditing && (
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => setIsEditing(true)}
                disabled={isUpdating || isDeleting}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Edit"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isUpdating || isDeleting}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Delete"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Todo</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this todo? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
