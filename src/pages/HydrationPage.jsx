import React from 'react';
import { useAppContext } from '../context/AppContext';
import { CupSoda, Coffee, Droplets } from 'lucide-react';

export default function HydrationPage() {
  const { hydrationIntake, setHydrationIntake, hydrationGoal } = useAppContext();

  const addHydration = (amount) => {
    setHydrationIntake(prev => prev + amount);
  };

  const percentage = Math.min((hydrationIntake / hydrationGoal) * 100, 100);

  const drinks = [
    { name: 'Water', amount: 250, icon: <Droplets size={24} />, bg: 'bg-blue-100 text-blue-500' },
    { name: 'Herbal Tea', amount: 200, icon: <CupSoda size={24} />, bg: 'bg-green-100 text-green-500' },
    { name: 'Pre-workout', amount: 300, icon: <CupSoda size={24} />, bg: 'bg-orange-100 text-orange-500' },
    { name: 'Coffee', amount: 150, icon: <Coffee size={24} />, bg: 'bg-amber-100 text-amber-700' }
  ];

  return (
    <div className="pb-24 pt-6 px-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Hydration Tracker</h1>
        <p className="text-gray-500 font-medium tracking-wide">Stay on top of your fluids.</p>
      </header>
      
      {/* Progress Circle Visual (Simple bar for now) */}
      <div className="soft-card p-6 mb-8 text-center bg-white rounded-3xl relative overflow-hidden">
        <div 
          className="absolute bottom-0 left-0 right-0 bg-blue-100 transition-all duration-700 ease-in-out opacity-40 z-0" 
          style={{ height: `${percentage}%` }}
        ></div>
        
        <div className="relative z-10 flex flex-col items-center justify-center">
            <span className="text-6xl font-black text-gray-800 tracking-tighter mb-1">
                {hydrationIntake} <span className="text-2xl text-gray-400">ml</span>
            </span>
            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                of {hydrationGoal} ml Goal
            </span>
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Add</h2>
      
      {/* Hydration Grid based on User Reference images (pastel squares) */}
      <div className="grid grid-cols-2 gap-4">
        {drinks.map(drink => (
          <button
            key={drink.name}
            onClick={() => addHydration(drink.amount)}
            className={`pastel-card ${drink.bg} p-6 flex flex-col items-center justify-center gap-2 hover:scale-105 transition-transform active:scale-95 border-none shadow-sm h-32`}
          >
            {drink.icon}
            <span className="font-bold tracking-tight text-sm">{drink.name}</span>
            <span className="text-xs opacity-70 font-semibold">+{drink.amount}ml</span>
          </button>
        ))}
      </div>

      <button 
        onClick={() => setHydrationIntake(0)}
        className="mt-8 text-xs font-bold text-gray-400 hover:text-red-500 uppercase tracking-widest block text-center w-full transition-colors"
      >
        Reset Hydration
      </button>

    </div>
  );
}
