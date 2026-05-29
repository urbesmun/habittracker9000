import { useState, useEffect } from 'react';
import { Habit, HabitLog, Frequency } from '../types';
import { getTodayStr } from '../utils/date';

const HABITS_KEY = 'minimal_habits_v1';
const LOGS_KEY = 'minimal_logs_v1';

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem(HABITS_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [logs, setLogs] = useState<HabitLog[]>(() => {
    const saved = localStorage.getItem(LOGS_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
  }, [logs]);

  const addHabit = (name: string, frequency: Frequency) => {
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      name,
      frequency,
      createdAt: new Date().toISOString(),
    };
    setHabits([...habits, newHabit]);
  };

  const deleteHabit = (id: string) => {
    setHabits(habits.filter((h) => h.id !== id));
    setLogs(logs.filter((l) => l.habitId !== id)); // Clean up logs
  };

  const toggleLog = (habitId: string, date: string = getTodayStr()) => {
    const existingLogIndex = logs.findIndex(
      (l) => l.habitId === habitId && l.date === date
    );

    if (existingLogIndex >= 0) {
      // Remove it
      setLogs((prev) => prev.filter((_, i) => i !== existingLogIndex));
    } else {
      // Add it
      setLogs((prev) => [...prev, { habitId, date }]);
    }
  };

  const isCompleted = (habitId: string, date: string = getTodayStr()): boolean => {
    return logs.some((l) => l.habitId === habitId && l.date === date);
  };

  // Get completed logs for a specific habit within a list of dates
  const countCompletions = (habitId: string, dates: string[]): number => {
    return logs.filter((l) => l.habitId === habitId && dates.includes(l.date)).length;
  };

  return {
    habits,
    logs,
    addHabit,
    deleteHabit,
    toggleLog,
    isCompleted,
    countCompletions
  };
}
