import React, { useState, useEffect } from 'react';
import { useWorkoutData } from '../hooks/useWorkoutData';
import { WorkoutCard } from '../components/sport/WorkoutCard';
import { Loader2, Dumbbell, Sparkles } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';

export default function WorkoutPage({ sheetUrl }) {
  const { data: workoutsData, loading, error } = useWorkoutData(sheetUrl);
  const [activeTab, setActiveTab] = useState(null);

  // When data loads, default to the first session
  useEffect(() => {
    if (workoutsData && !activeTab) {
      setActiveTab(Object.keys(workoutsData)[0]);
    }
  }, [workoutsData, activeTab]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-pink-400">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <p className="font-bold tracking-widest uppercase text-xs">Préparation des séances...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-red-500">
        <p className="font-medium">Oups! Problème avec les séances: {error}</p>
      </div>
    );
  }

  const sessionNames = Object.keys(workoutsData || {});
  const currentExercises = activeTab ? workoutsData[activeTab] : [];

  return (
    <div className="pb-32 pt-8 px-4 animate-in fade-in slide-in-from-bottom-6 duration-700">
      
      <header className="mb-12 sticky top-0 z-20 backdrop-blur-3xl bg-white/40 pt-6 pb-6 -mx-4 px-6 flex flex-col gap-6 border-b border-white/20 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-4xl font-black text-brand-brown tracking-tighter leading-none">Sport Mel</h1>
            <p className="text-[10px] font-black text-brand-orange uppercase tracking-[0.25em] mt-1">Coach Tips & Execution</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/50 backdrop-blur-lg shadow-sm border border-white/40 flex items-center justify-center">
            <Sparkles size={24} className="text-brand-orange fill-brand-orange/20" />
          </div>
        </div>

        {/* Dynamic Session Tabs */}
        <div className="flex justify-between items-center gap-2 bg-white/50 backdrop-blur-xl p-1.5 rounded-[2rem] shadow-[0_10px_30px_rgba(59,47,47,0.05)] border border-white/30">
          {sessionNames.map((name, index) => (
            <button
              key={name}
              onClick={() => setActiveTab(name)}
              className={twMerge(
                "flex-1 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                activeTab === name 
                ? "bg-brand-orange text-white shadow-lg shadow-brand-orange/30 scale-105" 
                : "text-brand-brown/40"
              )}
            >
              {`S${index + 1}`}
            </button>
          ))}
        </div>
      </header>

      {activeTab && (
        <div className="px-2 mb-8">
          <h2 className="text-xl font-black text-brand-brown uppercase tracking-tight flex items-center gap-3">
            <Dumbbell size={24} className="text-brand-orange" />
            {activeTab}
          </h2>
          <div className="h-1.5 w-16 bg-brand-orange rounded-full mt-2" />
        </div>
      )}

      {currentExercises.length === 0 ? (
        <div className="text-center py-20 bg-gray-50/50 rounded-[3rem] border border-dashed border-gray-200">
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Aucun exercice pour cette séance.</p>
        </div>
      ) : (
        <div className="relative overflow-hidden">
          {/* Background Decor - Floating Fruits */}
          <div className="absolute -left-20 top-40 w-40 h-40 opacity-10 pointer-events-none blur-[2px] float">
            <img src="/Users/macdememe/.gemini/antigravity/brain/97f44df9-df67-4524-a9d6-2515850cffd0/lemon_slice_transparent_1774997273386.png" alt="" className="w-full h-full object-contain" />
          </div>
          <div className="absolute -right-20 top-[600px] w-48 h-48 opacity-10 pointer-events-none blur-[1px] float-slow">
            <img src="/Users/macdememe/.gemini/antigravity/brain/97f44df9-df67-4524-a9d6-2515850cffd0/strawberry_transparent_1774997303509.png" alt="" className="w-full h-full object-contain" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {currentExercises.map((ex, idx) => {
              // Create an asymmetrical rhythm: first and every 4th is featured
              const isFeatured = idx % 4 === 0;
              return (
                <WorkoutCard 
                  key={`${activeTab}-${idx}`} 
                  exercise={ex} 
                  isFeatured={isFeatured} 
                />
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
