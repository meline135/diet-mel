import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { CupSoda, Coffee, Droplets } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

export default function HydrationPage() {
  const { userStates, setHydrationIntake, hydrationGoal } = useAppContext();
  const [activeUser, setActiveUser] = useState('mel');

  const currentUserState = userStates[activeUser] || {};
  const hydrationIntake = currentUserState.hydrationIntake || 0;

  const addHydration = (amount) => {
    setHydrationIntake(activeUser, prev => prev + amount);
  };

  const percentage = Math.min((hydrationIntake / hydrationGoal) * 100, 100);

  const drinks = [
    { name: 'Water', amount: 250, icon: <Droplets size={24} />, bg: 'bg-blue-100 text-blue-500' },
    { name: 'Herbal Tea', amount: 200, icon: <CupSoda size={24} />, bg: 'bg-green-100 text-green-500' },
    { name: 'Pre-workout', amount: 300, icon: <CupSoda size={24} />, bg: 'bg-orange-100 text-orange-500' },
    { name: 'Coffee', amount: 150, icon: <Coffee size={24} />, bg: 'bg-amber-100 text-amber-700' }
  ];

  const accentColor = activeUser === 'thomas' ? 'text-[#3A8EBA]' : 'text-pink-500';
  const bgColor = activeUser === 'thomas' ? 'bg-blue-50' : 'bg-pink-50';

  return (
    <div className="pb-24 pt-6 px-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Hydration</h1>
          <p className="text-gray-500 font-medium tracking-wide">Suivi des liquides</p>
        </div>
        
        {/* User Toggle */}
        <div className="flex bg-white/50 p-1 rounded-full shadow-inner ring-1 ring-black/5">
          <button 
            onClick={() => setActiveUser('mel')}
            className={twMerge(
              "px-3 py-1.5 rounded-full text-xs font-bold transition-all",
              activeUser === 'mel' ? "bg-pink-500 text-white shadow-sm" : "text-gray-400"
            )}
          >
            Mel
          </button>
          <button 
            onClick={() => setActiveUser('thomas')}
            className={twMerge(
              "px-3 py-1.5 rounded-full text-xs font-bold transition-all",
              activeUser === 'thomas' ? "bg-[#3A8EBA] text-white shadow-sm" : "text-gray-400"
            )}
          >
            Thomas
          </button>
        </div>
      </header>
      
      {/* Progress Visual */}
      <div className={twMerge("soft-card p-6 mb-8 text-center bg-white rounded-3xl relative overflow-hidden ring-1 ring-black/5 shadow-sm")}>
        <div 
          className={twMerge("absolute bottom-0 left-0 right-0 transition-all duration-700 ease-in-out opacity-20 z-0", activeUser === 'thomas' ? 'bg-blue-300' : 'bg-pink-300')} 
          style={{ height: `${percentage}%` }}
        ></div>
        
        <div className="relative z-10 flex flex-col items-center justify-center">
            <span className="text-6xl font-black text-gray-800 tracking-tighter mb-1">
                {hydrationIntake} <span className="text-2xl text-gray-400">ml</span>
            </span>
            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                sur {hydrationGoal} ml
            </span>
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-800 mb-4">Ajout Rapide</h2>
      
      <div className="grid grid-cols-2 gap-4">
        {drinks.map(drink => (
          <button
            key={drink.name}
            onClick={() => addHydration(drink.amount)}
            className={twMerge(
              "pastel-card p-6 flex flex-col items-center justify-center gap-2 hover:scale-105 transition-transform active:scale-95 border-none shadow-sm h-32 rounded-3xl",
              drink.bg
            )}
          >
            {drink.icon}
            <span className="font-bold tracking-tight text-sm">{drink.name}</span>
            <span className="text-xs opacity-70 font-semibold">+{drink.amount}ml</span>
          </button>
        ))}
      </div>

      <button 
        onClick={() => setHydrationIntake(activeUser, 0)}
        className="mt-8 text-xs font-bold text-gray-400 hover:text-red-500 uppercase tracking-widest block text-center w-full transition-colors"
      >
        Réinitialiser {activeUser === 'mel' ? 'Mel' : 'Thomas'}
      </button>

    </div>
  );
}

