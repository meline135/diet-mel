import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { CupSoda, Coffee, Droplets, Plus, Minus, Settings2 } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

export default function HydrationPage() {
  const { userStates, setHydrationIntake, undoHydration, setHydrationGoal, resetDaily } = useAppContext();
  const [activeUser, setActiveUser] = useState('mel');
  const [addAmount, setAddAmount] = useState(250); 
  const [showGoalEditor, setShowGoalEditor] = useState(false);

  const currentUserState = userStates[activeUser] || {};
  const liquids = currentUserState.liquids || { Water: 0, Coffee: 0, Tea: 0, Whey: 0, Soda: 0, PreWorkout: 0, Creatine: 0 };
  const intakeHistory = currentUserState.intakeHistory || [];
  const goal = currentUserState.hydrationGoal || 2000;

  const totalIntake = Object.values(liquids).reduce((sum, val) => sum + val, 0);
  const totalPercentage = Math.min((totalIntake / goal) * 100, 100);

  const addHydration = (type, amount) => {
    setHydrationIntake(activeUser, type, prev => prev + amount);
  };

  const adjustGoal = (newGoal) => {
    if (newGoal >= 500) {
      setHydrationGoal(activeUser, newGoal);
    }
  };

  const liquidColors = {
    Water: '#97DE4B',
    Coffee: '#3B2F2F',
    Tea: '#E5EDD7',
    Whey: '#F3EADC',
    Soda: '#FF8A9B',
    PreWorkout: '#FF9E1B',
    Creatine: '#3A8EBA',
  };

  const drinks = [
    { id: 'Tea', name: 'Thé/Tisane', amount: 200, img: 'https://i.pinimg.com/736x/c8/57/f8/c857f8923810260f0e521257e72d12a0.jpg' , color: 'bg-[#E5EDD7] text-[#4F634D]' },
    { id: 'Coffee', name: 'Café/Latte', amount: 150, img: 'https://i.pinimg.com/736x/93/80/6b/93806b4e411c8cd9d36e753f69cdd930.jpg', color: 'bg-[#3B2F2F] text-white' },
    { id: 'Whey', name: 'Whey', amount: 350, img: 'https://i.pinimg.com/1200x/6e/2a/3a/6e2a3ad35729734bbb6cbfe53370a9d6.jpg', color: 'bg-[#F3EADC] text-[#8B7355]' },
    { id: 'Soda', name: 'Soda', amount: 250, img: 'https://i.pinimg.com/1200x/df/aa/a2/dfaaa29e51b65d49878babcc6daa2724.jpg', color: 'bg-[#FF8A9B] text-white' },
    { id: 'PreWorkout', name: 'Pré-workout', amount: 150, img: 'https://i.pinimg.com/736x/14/96/fa/1496fa87dd9c5c4bb56ec2d744e32fce.jpg', color: 'bg-[#FF9E1B] text-white' },
    { id: 'Creatine', name: 'Créatine', amount: 200, img: 'https://i.pinimg.com/736x/7d/21/c6/7d21c6f7a2582ae6cb9d5fbde8525298.jpg', color: 'bg-[#3A8EBA] text-white' },
  ];

  let currentBottom = 0;
  const renderedLayers = intakeHistory.map((item, idx) => {
    const height = (item.amount / goal) * 100;
    const bottom = currentBottom;
    currentBottom += height;
    return { ...item, height, bottom, color: liquidColors[item.type], id: idx };
  });

  const activeLiquidsCount = Object.values(liquids).filter(v => v > 0).length;
  const showDoubleLabel = activeLiquidsCount >= 1;

  return (
    <div className="pb-32 pt-8 px-4 animate-in fade-in slide-in-from-bottom-6 duration-700 max-w-md mx-auto">
      
      {/* Header */}
      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-4xl font-black text-brand-brown tracking-tighter leading-none">Eau</h1>
        
        <div className="flex bg-white/50 backdrop-blur-xl p-1 rounded-full shadow-sm border border-white/20">
          <button 
            onClick={() => setActiveUser('mel')}
            className={twMerge(
              "px-5 py-2 rounded-full text-[10px] font-black transition-all duration-300",
              activeUser === 'mel' ? "bg-brand-pink text-white shadow-md scale-105" : "text-gray-400 hover:text-brand-pink"
            )}
          >
            MEL
          </button>
          <button 
            onClick={() => setActiveUser('thomas')}
            className={twMerge(
              "px-5 py-2 rounded-full text-[10px] font-black transition-all duration-300",
              activeUser === 'thomas' ? "bg-brand-blue text-white shadow-md scale-105" : "text-gray-400 hover:text-brand-blue"
            )}
          >
            THOMAS
          </button>
        </div>
      </header>

      {/* Stacked Bottle Visual */}
      <div className="relative mb-12 flex flex-col items-center">
        <div className="relative flex items-end">
          <div className="absolute -left-12 flex flex-col items-end gap-0 h-80 py-1 justify-end">
             {showDoubleLabel && (
               <div className="absolute transition-all duration-1000 ease-out flex items-center gap-2 pr-2" style={{ bottom: `${totalPercentage}%` }}>
                  <div className="flex flex-col items-end leading-none">
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-base font-black text-brand-brown">{totalIntake}</span>
                      <span className="text-[10px] font-black text-brand-brown/40 uppercase">ml</span>
                    </div>
                    <span className="text-[8px] font-black text-brand-brown/30 uppercase tracking-widest">Total</span>
                  </div>
                  <div className="w-4 h-1 bg-brand-brown/20 rounded-full"></div>
               </div>
             )}
          </div>

          <div className="relative w-56 h-80 bg-white/40 backdrop-blur-2xl border-[10px] border-white/60 rounded-[4rem] shadow-[0_40px_80px_rgba(59,47,47,0.12)] overflow-hidden ring-1 ring-white/10">
            {renderedLayers.map((layer, idx) => {
              const isTopLayer = idx === renderedLayers.length - 1;
              return (
                <div 
                  key={layer.id}
                  className="absolute left-0 right-0 transition-all duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)]"
                  style={{ height: `${layer.height}%`, bottom: `${layer.bottom}%`, backgroundColor: layer.color, zIndex: idx + 1 }}
                >
                  {isTopLayer && (
                    <div className="absolute -top-10 left-0 w-[200%] h-12 opacity-60 animate-wave pointer-events-none">
                      <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className="w-full h-full" style={{ fill: layer.color }}>
                        <path d="M0,50 C150,100 350,0 500,50 C650,100 850,0 1000,50 L1000,100 L0,100 Z" />
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
              <span className="text-5xl font-black text-brand-brown drop-shadow-sm tracking-tighter">{totalPercentage.toFixed(0)}%</span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center gap-2">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-black text-brand-brown/40 tracking-[0.25em] uppercase">Objectif: {goal}ml</span>
            <button onClick={() => setShowGoalEditor(!showGoalEditor)} className="p-2 rounded-full bg-white shadow-md border border-brand-brown/5 text-brand-brown/50 hover:text-brand-brown transition-all">
              <Settings2 size={14} />
            </button>
          </div>
          {showGoalEditor && (
            <div className="mt-4 flex items-center justify-center gap-6 bg-white/60 backdrop-blur-xl p-3 rounded-[2rem] border border-white/30 shadow-xl animate-in fade-in zoom-in duration-300">
              <button onClick={() => adjustGoal(goal - 250)} className="w-10 h-10 rounded-full bg-brand-cream/50 flex items-center justify-center text-brand-brown hover:bg-brand-brown hover:text-white transition-all"><Minus size={18} /></button>
              <span className="font-black text-sm text-brand-brown min-w-[70px] text-center">{goal}ML</span>
              <button onClick={() => adjustGoal(goal + 250)} className="w-10 h-10 rounded-full bg-brand-cream flex items-center justify-center text-brand-brown hover:bg-brand-brown hover:text-white transition-all"><Plus size={18} /></button>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center gap-10 mb-12">
        <div className="flex items-center gap-8 bg-white/50 backdrop-blur-xl p-4 rounded-[4rem] border border-white/30 shadow-2xl relative">
           <button onClick={() => setAddAmount(prev => Math.max(50, prev - 50))} className="w-14 h-14 rounded-full bg-brand-cream/50 flex items-center justify-center text-brand-brown hover:scale-110 active:scale-95 transition-all">
             <Minus size={24} strokeWidth={3} />
           </button>
           <button onClick={() => addHydration('Water', addAmount)} className="w-32 h-32 rounded-full bg-brand-green shadow-[0_20px_50px_rgba(151,222,75,0.4)] flex flex-col items-center justify-center hover:scale-105 active:scale-90 transition-all border-8 border-white ring-8 ring-brand-green/20 group">
             <Droplets size={40} className="text-white group-hover:animate-bounce mb-1" fill="currentColor" />
             <span className="text-[12px] font-black text-white uppercase tracking-widest">{addAmount}ml</span>
           </button>
           <button onClick={() => setAddAmount(prev => Math.min(1000, prev + 50))} className="w-14 h-14 rounded-full bg-brand-cream flex items-center justify-center text-brand-brown hover:scale-110 active:scale-95 transition-all">
             <Plus size={24} strokeWidth={3} />
           </button>
           <button onClick={() => undoHydration(activeUser)} disabled={intakeHistory.length === 0} className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-white text-red-400 disabled:opacity-20 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-xl transition-all active:scale-95 whitespace-nowrap z-30">
             Annuler
           </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 px-2">
        {drinks.map(drink => (
          <button key={drink.id} onClick={() => addHydration(drink.id, drink.amount)} className={twMerge("relative h-32 flex flex-col items-center justify-center gap-1 rounded-[3rem] transition-all hover:scale-[1.05] active:scale-95 shadow-xl border-4 border-white/40 backdrop-blur-md overflow-hidden group", drink.color.replace('bg-', 'bg-opacity-40 bg-'))}>
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/50 mb-1 group-hover:scale-110 transition-transform">
              <img src={drink.img} alt={drink.name} className="w-full h-full object-cover" />
            </div>
            <span className="font-black text-[10px] uppercase leading-none tracking-tight">{drink.name}</span>
            <span className="text-[9px] font-black opacity-60">+{drink.amount}ml</span>
          </button>
        ))}
      </div>

      <button onClick={() => resetDaily()} className="mt-16 py-5 px-8 rounded-[2.5rem] bg-white border border-brand-brown/10 shadow-sm text-[11px] font-black text-brand-brown/30 hover:text-red-500 uppercase tracking-[0.3em] block text-center w-full transition-all">
        Réinitialiser
      </button>

      <style dangerouslySetInnerHTML={{ __html: `@keyframes wave { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } } .animate-wave { animation: wave 4s linear infinite; }`}} />
    </div>
  );
}
