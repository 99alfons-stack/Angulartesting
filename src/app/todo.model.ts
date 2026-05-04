export type TodoCategory = 'work' | 'training' | 'lessons' | 'other';

export interface TodoItem {
  id: string;
  title: string;
  category: TodoCategory;
  dueDate: string;   // ISO date string (YYYY-MM-DD)
  dueTime: string;   // HH:MM
  completed: boolean;
  createdAt: string; // ISO date-time string
}

export const CATEGORY_LABELS: Record<TodoCategory, string> = {
  work: '💼 Work',
  training: '🏋️ Training',
  lessons: '📚 Lessons',
  other: '📌 Other',
};

export const CATEGORY_COLORS: Record<TodoCategory, string> = {
  work: '#4f8ef7',
  training: '#f76b4f',
  lessons: '#4fc97a',
  other: '#a64ff7',
};
