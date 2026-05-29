/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { useHabits } from './hooks/useHabits';
import HabitTracker from './components/HabitTracker';
import Analytics from './components/Analytics';
import Settings from './components/Settings';
import { ListChecks, LineChart, Settings2 } from 'lucide-react';
import { AnimatePresence } from 'motion/react';

type Tab = 'tracker' | 'analytics' | 'settings';

export default function App() {
  const { habits, logs, addHabit, deleteHabit, toggleLog } = useHabits();
  const [activeTab, setActiveTab] = useState<Tab>('tracker');

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 selection:bg-stone-200">
      <div className="max-w-xl mx-auto min-h-screen px-4 sm:px-6 relative flex flex-col pt-8">
        
        {/* Header */}
        <header className="flex items-center justify-between py-4 mb-4">
          <h1 className="text-2xl font-bold tracking-tight">Hábitos</h1>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {activeTab === 'tracker' && (
              <HabitTracker key="tracker" habits={habits} logs={logs} toggleLog={toggleLog} />
            )}
            {activeTab === 'analytics' && (
              <Analytics key="analytics" habits={habits} logs={logs} />
            )}
            {activeTab === 'settings' && (
              <Settings key="settings" habits={habits} addHabit={addHabit} deleteHabit={deleteHabit} />
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 p-4 pb-6 sm:pb-4 flex justify-center z-50 pointer-events-none">
          <nav className="bg-stone-900/90 backdrop-blur-md text-stone-400 p-2 rounded-full flex gap-2 shadow-2xl pointer-events-auto">
            <button 
              onClick={() => setActiveTab('tracker')}
              className={`p-3 rounded-full transition-colors ${activeTab === 'tracker' ? 'bg-white text-stone-900' : 'hover:text-stone-200 hover:bg-stone-800'}`}
            >
              <ListChecks size={22} />
            </button>
            <button 
              onClick={() => setActiveTab('analytics')}
              className={`p-3 rounded-full transition-colors ${activeTab === 'analytics' ? 'bg-white text-stone-900' : 'hover:text-stone-200 hover:bg-stone-800'}`}
            >
              <LineChart size={22} />
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`p-3 rounded-full transition-colors ${activeTab === 'settings' ? 'bg-white text-stone-900' : 'hover:text-stone-200 hover:bg-stone-800'}`}
            >
              <Settings2 size={22} />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
