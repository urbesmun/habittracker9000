export type Frequency = 'daily' | 'weekly' | 'monthly';

export interface Habit {
  id: string;
  name: string;
  frequency: Frequency;
  createdAt: string; // ISO representation of creation time
}

export interface HabitLog {
  habitId: string;
  date: string; // Local date string in format YYYY-MM-DD
}
