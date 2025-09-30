// Validation constants - must match backend (serverless.yml MAX_TODO_LENGTH)
export const MAX_TODO_LENGTH = 500;

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateTodoText(text: string): ValidationResult {
  // Check if empty
  if (!text || text.trim().length === 0) {
    return {
      isValid: false,
      error: 'Todo text cannot be empty',
    };
  }

  // Check max length
  if (text.length > MAX_TODO_LENGTH) {
    return {
      isValid: false,
      error: `Todo text must be ${MAX_TODO_LENGTH} characters or less`,
    };
  }

  return { isValid: true };
}