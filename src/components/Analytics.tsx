import { Habit, HabitLog } from '../types';
import { getPast7Days, formatDateShort } from '../utils/date';
import { motion } from 'motion/react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface Props {
  habits: Habit[];
  logs: HabitLog[];
}

export default function Analytics({ habits, logs }: Props) {
  const displayDays = getPast7Days(); // last 7 days from today backwards

  // Calculate stats for daily habits across the last 7 days
  const dailyHabits = habits.filter(h => h.frequency === 'daily');
  
  const chartData = displayDays.map((date, index) => {
    const completedThatDay = dailyHabits.filter(h => 
      logs.some(l => l.habitId === h.id && l.date === date)
    ).length;

    return {
      dayStr: date,
      name: index === displayDays.length - 1 ? 'Hoy' : formatDateShort(date),
      completados: completedThatDay,
      total: dailyHabits.length
    };
  });

  const totalCompletionsThisWeek = chartData.reduce((acc, curr) => acc + curr.completados, 0);
  const possibleCompletions = dailyHabits.length * 7;
  const healthPercent = possibleCompletions === 0 ? 0 : Math.round((totalCompletionsThisWeek / possibleCompletions) * 100);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="pb-24 pt-4 space-y-8"
    >
      <div className="bg-stone-900 text-stone-50 p-6 rounded-3xl shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-400 mb-1">Tendencia de los últimos 7 días</h2>
        <div className="mt-4 flex items-end justify-between">
          <div>
            <p className="text-4xl font-bold tracking-tighter">{healthPercent}%</p>
            <p className="text-sm font-medium text-stone-400 mt-1">Consistencia</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{totalCompletionsThisWeek} <span className="text-sm font-normal text-stone-400">/ {possibleCompletions}</span></p>
            <p className="text-sm font-medium text-stone-400 mt-1">Hábitos diarios completados</p>
          </div>
        </div>
      </div>

      {dailyHabits.length > 0 ? (
        <div className="bg-white p-6 rounded-3xl shadow-sm h-80">
          <h3 className="text-lg font-bold tracking-tight text-stone-900 mb-6">Gráfico de progreso</h3>
          <ResponsiveContainer width="100%" height="80%">
            <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCompletados" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1c1917" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#1c1917" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f4" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#a8a29e', fontSize: 12, fontWeight: 500 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#a8a29e', fontSize: 12 }} 
                allowDecimals={false}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                cursor={{ stroke: '#e7e5e4', strokeWidth: 2, strokeDasharray: '4 4' }}
              />
              <Area 
                type="monotone" 
                dataKey="completados" 
                stroke="#1c1917" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorCompletados)" 
                activeDot={{ r: 6, fill: '#1c1917', stroke: '#fff', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-3xl shadow-sm text-center py-12">
          <p className="text-stone-400">Añade hábitos diarios para ver tus estadísticas semanales.</p>
        </div>
      )}
    </motion.div>
  );
}
