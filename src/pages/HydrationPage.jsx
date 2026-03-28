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
  const waterPercentage = Math.min((liquids.Water / goal) * 100, 100);

  const addHydration = (type, amount) => {
    setHydrationIntake(activeUser, type, prev => prev + amount);
  };

  const adjustGoal = (newGoal) => {
    if (newGoal >= 500) {
      setHydrationGoal(activeUser, newGoal);
    }
  };

  const liquidColors = {
    Water: '#CDE8E7',
    Coffee: '#A5836A',
    Tea: '#E5EDD7',
    Whey: '#F3EADC',
    Soda: '#ED80CD',
    PreWorkout: '#EAEB42',
    Creatine: '#FFA800',
  };

  const drinks = [
    { id: 'Tea', name: 'Thé/Tisane', amount: 200, img: 'https://i.pinimg.com/736x/c8/57/f8/c857f8923810260f0e521257e72d12a0.jpg' , color: 'bg-[#E5EDD7] text-[#4F634D]' },
    { id: 'Coffee', name: 'Café/Latte', amount: 150, img: 'https://i.pinimg.com/736x/93/80/6b/93806b4e411c8cd9d36e753f69cdd930.jpg', color: 'bg-[#A5836A] text-white' },
    { id: 'Whey', name: 'Whey', amount: 350, img: 'https://i.pinimg.com/1200x/6e/2a/3a/6e2a3ad35729734bbb6cbfe53370a9d6.jpg', color: 'bg-[#F3EADC] text-[#8B7355]' },
    { id: 'Soda', name: 'Soda', amount: 250, img: 'https://i.pinimg.com/1200x/df/aa/a2/dfaaa29e51b65d49878babcc6daa2724.jpg', color: 'bg-[#ED80CD] text-white' },
    { id: 'PreWorkout', name: 'Pré-workout', amount: 150, img: 'https://i.pinimg.com/736x/14/96/fa/1496fa87dd9c5c4bb56ec2d744e32fce.jpg', color: 'bg-[#EAEB42] text-[#424200]' },
    { id: 'Creatine', name: 'Créatine', amount: 200, img: 'https://i.pinimg.com/736x/7d/21/c6/7d21c6f7a2582ae6cb9d5fbde8525298.jpg', color: 'bg-[#FFA800] text-white' },
  ];

  // Calculate cumulative heights BASED ON CHRONOLOGICAL HISTORY for real stacking
  let currentBottom = 0;
  const renderedLayers = intakeHistory.map((item, idx) => {
    const height = (item.amount / goal) * 100;
    const bottom = currentBottom;
    currentBottom += height;
    return { ...item, height, bottom, color: liquidColors[item.type], id: idx };
  });

  // Side Indicators Logic
  const activeLiquidsCount = Object.values(liquids).filter(v => v > 0).length;
  const showSingleLabel = activeLiquidsCount === 1;
  const showDoubleLabel = activeLiquidsCount > 1;

  return (
    <div className="pb-24 pt-6 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-md mx-auto">
      
      {/* Header */}
      <header className="mb-4 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Hydratation</h1>
        </div>
        
        <div className="flex bg-white/40 backdrop-blur-sm p-1 rounded-full shadow-inner ring-1 ring-black/5">
          <button 
            onClick={() => setActiveUser('mel')}
            className={twMerge(
              "px-4 py-2 rounded-full text-xs font-black transition-all duration-300",
              activeUser === 'mel' ? "bg-pink-500 text-white shadow-lg scale-105" : "text-gray-400"
            )}
          >
            MEL
          </button>
          <button 
            onClick={() => setActiveUser('thomas')}
            className={twMerge(
              "px-4 py-2 rounded-full text-xs font-black transition-all duration-300",
              activeUser === 'thomas' ? "bg-[#3A8EBA] text-white shadow-lg scale-105" : "text-gray-400"
            )}
          >
            THOMAS
          </button>
        </div>
      </header>

      {/* Stacked Bottle Visual */}
      <div className="relative mb-4 flex flex-col items-center scale-95 origin-top">
        
        <div className="relative flex items-end">
          
          {/* Side Indicators */}
          <div className="absolute -left-10 flex flex-col items-end gap-0 h-72 py-1 justify-end">
             
             {/* Case 1: Multiple liquids -> Show Water vs Total */}
             {showDoubleLabel && (
               <>
                 <div 
                   className="absolute transition-all duration-1000 ease-out flex items-center gap-1.5 pr-1.5"
                   style={{ bottom: `${totalPercentage}%` }}
                 >
                    <div className="flex flex-col items-end leading-none">
                      <div className="flex items-baseline gap-0.5">
                        <span className="text-[13px] font-black text-gray-800">{totalIntake}</span>
                        <span className="text-[8px] font-black text-gray-500 uppercase">ml</span>
                      </div>
                      <span className="text-[7px] font-black text-gray-400 uppercase tracking-tighter">Total</span>
                    </div>
                    <div className="w-3 h-[1.5px] bg-gray-300 rounded-full"></div>
                 </div>

                 {liquids.Water > 0 && (
                   <div 
                     className="absolute transition-all duration-1000 ease-out flex items-center gap-1.5 pr-1.5 opacity-60"
                     style={{ bottom: `${waterPercentage}%` }}
                   >
                      <div className="flex flex-col items-end leading-none">
                        <div className="flex items-baseline gap-0.5">
                          <span className="text-[12px] font-black text-[#5ba19f]">{liquids.Water}</span>
                          <span className="text-[7px] font-black text-[#5ba19f] uppercase">ml</span>
                        </div>
                        <span className="text-[6px] font-black text-[#89b8b6] uppercase tracking-tighter">EAU</span>
                      </div>
                      <div className="w-3 h-[1px] bg-[#CDE8E7] rounded-full"></div>
                   </div>
                 )}
               </>
             )}

             {/* Case 2: Only one liquid -> Show only that label */}
             {showSingleLabel && (
               <div 
                 className="absolute transition-all duration-1000 ease-out flex items-center gap-1.5 pr-1.5"
                 style={{ bottom: `${totalPercentage}%` }}
               >
                  <div className="flex flex-col items-end leading-none">
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-[13px] font-black text-gray-800">{totalIntake}</span>
                      <span className="text-[8px] font-black text-gray-500 uppercase">ml</span>
                    </div>
                    <span className="text-[7px] font-black text-gray-400 uppercase tracking-tighter">
                      {liquids.Water > 0 ? 'EAU' : Object.keys(liquids).find(k => liquids[k] > 0)}
                    </span>
                  </div>
                  <div className="w-3 h-[1.5px] bg-gray-300 rounded-full"></div>
               </div>
             )}
          </div>

          {/* The Bottle Shape */}
          <div className="relative w-48 h-72 bg-white/40 backdrop-blur-md border-[6px] border-white rounded-[2.5rem] shadow-2xl overflow-hidden ring-4 ring-black/5">
            
            {/* Liquid Layers (Rendered Chronologically) */}
            {renderedLayers.map((layer, idx) => {
              const isTopLayer = idx === renderedLayers.length - 1;
              return (
                <div 
                  key={layer.id}
                  className="absolute left-0 right-0 transition-all duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)]"
                  style={{ 
                    height: `${layer.height}%`, 
                    bottom: `${layer.bottom}%`,
                    backgroundColor: layer.color,
                    zIndex: idx + 1
                  }}
                >
                  {/* Wave effect only on the very top of all liquids */}
                  {isTopLayer && (
                    <>
                      <div className="absolute -top-6 left-0 w-[200%] h-8 opacity-60 animate-wave pointer-events-none">
                        <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className="w-full h-full" style={{ fill: layer.color }}>
                          <path d="M0,50 C150,100 350,0 500,50 C650,100 850,0 1000,50 L1000,100 L0,100 Z" />
                        </svg>
                      </div>
                      <div className="absolute -top-4 left-[-50%] w-[200%] h-8 opacity-40 animate-wave-slow pointer-events-none">
                        <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className="w-full h-full" style={{ fill: layer.color }}>
                          <path d="M0,50 C150,100 350,0 500,50 C650,100 850,0 1000,50 L1000,100 L0,100 Z" />
                        </svg>
                      </div>
                    </>
                  )}
                </div>
              );
            })}

            {/* Progress Text Overflowing Bottle Center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
              <span className="text-4xl font-black text-gray-800 drop-shadow-sm">{totalPercentage.toFixed(0)}%</span>
            </div>
          </div>
        </div>

        {/* Goal Indicator & Editor Toggle */}
        <div className="mt-4 flex flex-col items-center gap-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-gray-400 tracking-widest uppercase">
              Objectif: {goal}ml
            </span>
            <button 
              onClick={() => setShowGoalEditor(!showGoalEditor)}
              className="p-1.5 rounded-full bg-white shadow-sm border text-gray-400 hover:text-gray-600 transition-all"
            >
              <Settings2 size={12} />
            </button>
          </div>
          
          {showGoalEditor && (
            <div className="mt-2 flex items-center justify-center gap-4 bg-white/60 p-2 rounded-2xl border shadow-sm animate-in fade-in zoom-in duration-300">
              <button onClick={() => adjustGoal(goal - 250)} className="w-8 h-8 rounded-full bg-white flex items-center justify-center border shadow-sm"><Minus size={14} /></button>
              <span className="font-black text-xs text-gray-700 min-w-[60px] text-center">{goal}ML</span>
              <button onClick={() => adjustGoal(goal + 250)} className="w-8 h-8 rounded-full bg-white flex items-center justify-center border shadow-sm"><Plus size={14} /></button>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-6 mb-8 mt-2">
        <div className="flex items-center gap-6 bg-white/40 p-2 rounded-full border shadow-inner relative">
           <button 
             onClick={() => setAddAmount(prev => Math.max(50, prev - 50))}
             className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center hover:scale-110 active:scale-95 transition-all outline-none"
           >
             <Minus size={20} className="text-gray-400" />
           </button>
           
           <button 
             onClick={() => addHydration('Water', addAmount)}
             className="w-28 h-28 rounded-full bg-[#CDE8E7] shadow-[0_15px_35px_rgba(205,232,231,0.6)] flex flex-col items-center justify-center hover:scale-105 active:scale-90 transition-all border-4 border-white ring-8 ring-[#CDE8E7]/20 group"
           >
             <Droplets size={32} className="text-[#5ba19f] group-hover:animate-bounce mb-1" />
             <span className="text-[10px] font-black text-[#427a78] uppercase">{addAmount}ml</span>
           </button>

           <button 
             onClick={() => setAddAmount(prev => Math.min(1000, prev + 50))}
             className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center hover:scale-110 active:scale-95 transition-all outline-none"
           >
             <Plus size={20} className="text-gray-400" />
           </button>

           <button 
             onClick={() => undoHydration(activeUser)}
             disabled={intakeHistory.length === 0}
             className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-white/90 text-red-400 hover:text-red-500 disabled:opacity-30 disabled:pointer-events-none px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border shadow-md transition-all active:scale-90 whitespace-nowrap z-30"
           >
             Retirer la boisson
           </button>
        </div>
      </div>

      {/* Quick Add Other Drinks (2-column layout) */}
      <div className="grid grid-cols-2 gap-3 px-2">
        {drinks.map(drink => (
          <button
            key={drink.id}
            onClick={() => addHydration(drink.id, drink.amount)}
            className={twMerge(
              "relative h-28 flex flex-col items-center justify-center gap-0.5 rounded-[2rem] transition-all hover:scale-[1.03] active:scale-95 shadow-sm border border-transparent overflow-hidden group",
              drink.color
            )}
          >
            {/* Pinterest Image as rounded element */}
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/50 mb-0.5 group-hover:scale-110 transition-transform">
              <img src={drink.img} alt={drink.name} className="w-full h-full object-cover" />
            </div>
            
            <span className="font-black text-[9px] uppercase leading-tight text-center px-1">{drink.name}</span>
            <span className="text-[8px] font-black opacity-70 tracking-tighter">+{drink.amount}ml</span>
          </button>
        ))}
      </div>

      <button 
        onClick={() => resetDaily()}
        className="mt-10 py-3 px-6 rounded-2xl bg-white/50 hover:bg-white border border-gray-100 shadow-sm text-[10px] font-black text-gray-400 hover:text-red-500 uppercase tracking-[0.2em] block text-center w-full transition-all active:scale-95"
      >
        Réinitialiser la journée
      </button>

      {/* Wave Animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes wave {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes wave-slow {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-wave { animation: wave 4s linear infinite; }
        .animate-wave-slow { animation: wave-slow 7s linear infinite; }
      `}} />

    </div>
  );
}


