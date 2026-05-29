import { Habit, HabitLog } from '../types';
import { getTodayStr, isDateInThisWeek, isDateInThisMonth } from '../utils/date';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';

interface Props {
  habits: Habit[];
  logs: HabitLog[];
  toggleLog: (id: string, date: string) => void;
}

export default function HabitTracker({ habits, logs, toggleLog }: Props) {
  const today = getTodayStr();
  
  const daily = habits.filter(h => h.frequency === 'daily');
  const weekly = habits.filter(h => h.frequency === 'weekly');
  const monthly = habits.filter(h => h.frequency === 'monthly');

  const isHabitCompleted = (h: Habit) => {
    if (h.frequency === 'daily') {
      return logs.some(l => l.habitId === h.id && l.date === today);
    }
    if (h.frequency === 'weekly') {
      return logs.some(l => l.habitId === h.id && isDateInThisWeek(l.date));
    }
    if (h.frequency === 'monthly') {
      return logs.some(l => l.habitId === h.id && isDateInThisMonth(l.date));
    }
    return false;
  };

  const completedCount = habits.filter(isHabitCompleted).length;
  const totalCount = habits.length;
  const progressPercent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  const renderList = (list: Habit[], title: string) => {
    if (list.length === 0) return null;

    return (
      <div className="mb-8">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-3">{title}</h3>
        <div className="space-y-2">
          {list.map((habit) => {
            const completed = isHabitCompleted(habit);
            return (
              <motion.button
                key={habit.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleLog(habit.id, today)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ${
                  completed 
                    ? 'bg-stone-900 text-stone-50 shadow-md' 
                    : 'bg-white text-stone-700 shadow-sm hover:shadow-md'
                }`}
              >
                <span className={`font-medium ${completed ? 'opacity-90' : ''}`}>
                  {habit.name}
                </span>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                  completed ? 'border-stone-50 bg-stone-50 text-stone-900' : 'border-stone-200'
                }`}>
                  {completed && <Check size={14} className="stroke-[3]" />}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="pb-24 pt-4"
    >
      {/* Progress Bar */}
      <div className="mb-10 bg-white p-6 rounded-3xl shadow-sm">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-stone-900 mb-1">Progreso</h2>
            <p className="text-sm font-medium text-stone-500">
              {completedCount} de {totalCount} completados
            </p>
          </div>
          <span className="text-3xl font-bold text-stone-900 tracking-tighter">
            {progressPercent}%
          </span>
        </div>
        <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-stone-900 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ type: 'spring', stiffness: 50 }}
          />
        </div>
      </div>

      {habits.length === 0 ? (
        <div className="text-center py-20 text-stone-400">
          <p>No tienes ningún hábito todavía.</p>
          <p className="text-sm mt-2">Ve a Configuración para añadir uno.</p>
        </div>
      ) : (
        <>
          {renderList(daily, 'Hoy (Diario)')}
          {renderList(weekly, 'Esta Semana (Semanal)')}
          {renderList(monthly, 'Este Mes (Mensual)')}
        </>
      )}
    </motion.div>
  );
}
