import React, { useEffect, useState } from 'react';
import { MealCategory } from '../components/nutrition/MealCategory';
import { SubstitutionModal } from '../components/nutrition/SubstitutionModal';
import { useAppContext } from '../context/AppContext';
import { useSheetData } from '../hooks/useSheetData';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function DietPage({ userId, sheetUrl, title, accentColor = 'pink' }) {
  const { userStates, setGlobalOption, setSubstitution } = useAppContext();
  const { data: mealsData, loading, error } = useSheetData(sheetUrl);
  
  const currentUserState = userStates[userId] || {};
  const globalOption = currentUserState.globalOption;
  const substitutions = currentUserState.substitutions || {};

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedIng, setSelectedIng] = useState(null);

  const handleIngredientClick = (ing, mealTitle) => {
    setSelectedIng({ ...ing, mealTitle });
    setModalOpen(true);
  };

  const handleSubstitutionSelect = (substituteItem) => {
    const key = `${selectedIng.mealTitle}-${selectedIng.name}`;
    setSubstitution(userId, key, substituteItem);
    setModalOpen(false);
  };

  // Default to Option 1 on mount if no option is selected
  useEffect(() => {
    if (globalOption === null) {
      setGlobalOption(userId, 1);
    }
  }, [globalOption, setGlobalOption, userId]);

  if (loading) {
    const loaderColors = {
      pink: 'text-pink-400',
      blue: 'text-blue-400',
    };
    return (
      <div className={twMerge("flex flex-col items-center justify-center h-[70vh]", loaderColors[accentColor] || loaderColors.pink)}>
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

  const themeStyles = {
    pink: {
      headerBg: 'bg-[#FADCD9]/90',
      headerShadow: 'shadow-[0_10px_20px_-15px_rgba(250,220,217,1)]',
      btnActive: 'bg-pink-500 shadow-pink-500/30',
    },
    blue: {
      headerBg: 'bg-[#E3F2FD]/90',
      headerShadow: 'shadow-[0_10px_20px_-15px_rgba(187,222,251,1)]',
      btnActive: 'bg-[#3A8EBA] shadow-[#3A8EBA]/30',
    }
  };

  const currentTheme = themeStyles[accentColor] || themeStyles.pink;

  return (
    <div className="pb-24 pt-6 px-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <header className={twMerge("mb-8 mt-2 sticky top-0 z-20 backdrop-blur-md pt-4 pb-4 -mx-2 px-4", currentTheme.headerBg, currentTheme.headerShadow)}>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-5">{title}</h1>

        {/* Global Option Selector Tabs */}
        <div className="flex justify-between items-center gap-2 bg-white/40 p-1.5 rounded-full ring-1 ring-white/60 shadow-inner">
          {optionsList.map((opt) => (
            <button
              key={opt}
              onClick={() => setGlobalOption(userId, opt)}
              className={twMerge(
                clsx(
                  "flex-1 py-2.5 rounded-full text-sm font-bold transition-all duration-300",
                  globalOption === opt 
                  ? `${currentTheme.btnActive} text-white shadow-lg scale-105` 
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
              userId={userId}
              accentColor={accentColor}
              onIngredientClick={handleIngredientClick}
              substitutions={substitutions}
            />
          ))}
        </div>
      )}

      {/* Substitution Modal */}
      {selectedIng && (
        <SubstitutionModal 
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSelect={handleSubstitutionSelect}
          originalItem={selectedIng}
          accentColor={accentColor}
        />
      )}

    </div>
  );
}


