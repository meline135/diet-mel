import React, { useEffect } from 'react';
import { MealCategory } from '../components/nutrition/MealCategory';
import { useAppContext } from '../context/AppContext';
import { useSheetData } from '../hooks/useSheetData';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTPCZebU1Gv0st2F3VpD8WcLeqC3NZm55Ev8xYWLXijQ5nbgvpUg82izrB3PpMrrVmXxtgleuNh4WbV/pub?gid=0&single=true&output=csv';

export default function NutritionPage() {
  const { globalOption, setGlobalOption } = useAppContext();
  const { data: mealsData, loading, error } = useSheetData(SHEET_URL);

  // Default to Option 1 on mount if no option is selected
  useEffect(() => {
    if (globalOption === null) {
      setGlobalOption(1);
    }
  }, [globalOption, setGlobalOption]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-pink-400">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <p className="font-medium tracking-wide">Chargement du menu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-red-500">
        <p className="font-medium">Erreur lors de la lecture des données: {error}</p>
      </div>
    );
  }

  // Use Object.entries to iterate over our grouped meal types 
  const mealCategories = mealsData ? Object.entries(mealsData) : [];
  const optionsList = [1, 2, 3, 4]; // The 4 options defined by the coach

  return (
    <div className="pb-24 pt-6 px-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <header className="mb-8 mt-2 sticky top-0 z-20 bg-[#FADCD9]/90 backdrop-blur-md pt-4 pb-4 -mx-2 px-4 shadow-[0_10px_20px_-15px_rgba(250,220,217,1)]">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-5">Plan du Jour</h1>

        {/* Global Option Selector Tabs */}
        <div className="flex justify-between items-center gap-2 bg-white/40 p-1.5 rounded-full ring-1 ring-white/60 shadow-inner">
          {optionsList.map((opt) => (
            <button
              key={opt}
              onClick={() => setGlobalOption(opt)}
              className={twMerge(
                clsx(
                  "flex-1 py-2.5 rounded-full text-sm font-bold transition-all duration-300",
                  globalOption === opt 
                  ? "bg-pink-500 text-white shadow-lg shadow-pink-500/30 scale-105" 
                  : "text-gray-500 hover:bg-white/50"
                )
              )}
            >
              Opt {opt}
            </button>
          ))}
        </div>
      </header>

      {mealCategories.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          <p>Aucun repas trouvé. Vérifiez la structure de votre tableau.</p>
        </div>
      ) : (
        <div className="space-y-10 mt-6">
          {mealCategories.map(([mealType, optionsArray]) => (
            <MealCategory 
              key={mealType} 
              title={mealType} 
              optionsData={optionsArray} 
            />
          ))}
        </div>
      )}

    </div>
  );
}
