import { useState } from 'react';
import { Habit, Frequency } from '../types';
import { motion } from 'motion/react';
import { Trash2, Plus } from 'lucide-react';

interface Props {
  habits: Habit[];
  addHabit: (name: string, frequency: Frequency) => void;
  deleteHabit: (id: string) => void;
}

export default function Settings({ habits, addHabit, deleteHabit }: Props) {
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitFreq, setNewHabitFreq] = useState<Frequency>('daily');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newHabitName.trim()) {
      addHabit(newHabitName.trim(), newHabitFreq);
      setNewHabitName('');
    }
  };

  const frequencyLabels = {
    daily: 'Diario',
    weekly: 'Semanal',
    monthly: 'Mensual'
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="pb-24 pt-4 space-y-8"
    >
      <div className="bg-white p-6 rounded-3xl shadow-sm">
        <h2 className="text-xl font-bold tracking-tight text-stone-900 mb-6">Añadir Nuevo Hábito</h2>
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">Nombre del hábito</label>
            <input 
              type="text" 
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              placeholder="Ej. Meditar 10 minutos"
              className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900 transition-shadow"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">Frecuencia</label>
            <div className="flex bg-stone-50 rounded-xl p-1 border border-stone-100">
              {(['daily', 'weekly', 'monthly'] as Frequency[]).map((freq) => (
                <button
                  key={freq}
                  type="button"
                  onClick={() => setNewHabitFreq(freq)}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                    newHabitFreq === freq 
                      ? 'bg-white text-stone-900 shadow-sm' 
                      : 'text-stone-400 hover:text-stone-600'
                  }`}
                >
                  {frequencyLabels[freq]}
                </button>
              ))}
            </div>
          </div>
          <button 
            type="submit"
            disabled={!newHabitName.trim()}
            className="w-full flex items-center justify-center gap-2 bg-stone-900 text-stone-50 font-medium py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-stone-800 transition-colors"
          >
            <Plus size={18} />
            Añadir Hábito
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm">
        <h2 className="text-xl font-bold tracking-tight text-stone-900 mb-6">Tus Hábitos</h2>
        {habits.length === 0 ? (
          <p className="text-stone-400 text-sm text-center py-4">No hay hábitos configurados.</p>
        ) : (
          <div className="space-y-3">
            {habits.map(habit => (
              <div key={habit.id} className="flex justify-between items-center p-3 sm:p-4 rounded-xl border border-stone-100">
                <div>
                  <p className="font-medium text-stone-900">{habit.name}</p>
                  <p className="text-xs font-medium text-stone-400 mt-0.5">{frequencyLabels[habit.frequency]}</p>
                </div>
                <button 
                  onClick={() => deleteHabit(habit.id)}
                  className="p-2 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
