import React from 'react';
import { MealCategory } from '../components/nutrition/MealCategory';
import { useAppContext } from '../context/AppContext';
import { useSheetData } from '../hooks/useSheetData';
import { Loader2 } from 'lucide-react';

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTPCZebU1Gv0st2F3VpD8WcLeqC3NZm55Ev8xYWLXijQ5nbgvpUg82izrB3PpMrrVmXxtgleuNh4WbV/pub?gid=0&single=true&output=csv';

export default function NutritionPage() {
  const { globalOption, resetDaily } = useAppContext();
  const { data: mealsData, loading, error } = useSheetData(SHEET_URL);

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
  // e.g. "Petit-déjeuner", "Déjeuner"
  const mealCategories = mealsData ? Object.entries(mealsData) : [];

  return (
    <div className="pb-24 pt-6 px-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Plan du Jour</h1>
          <p className="text-gray-500 font-medium tracking-wide">Choisissez l'option pour la journée.</p>
        </div>
        
        {globalOption && (
          <div className="text-right">
            <span className="block text-xl font-black text-pink-500">
              Option {globalOption}
            </span>
            <button 
              onClick={resetDaily}
              className="text-[10px] font-bold text-gray-400 hover:text-red-500 transition-colors uppercase tracking-widest mt-1 bg-white px-2 py-1 rounded shadow-sm"
            >
              Réinitialiser
            </button>
          </div>
        )}
      </header>

      {mealCategories.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          <p>Aucun repas trouvé. Vérifiez la structure de votre tableau.</p>
        </div>
      ) : (
        <div className="space-y-10">
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
