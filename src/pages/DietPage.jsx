import React, { useEffect, useState } from 'react';
import { MealCategory } from '../components/nutrition/MealCategory';
import { SubstitutionModal } from '../components/nutrition/SubstitutionModal';
import { useAppContext } from '../context/AppContext';
import { useSheetData } from '../hooks/useSheetData';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import melAvatar from '../assets/mel-avatar.png';
import thomasAvatar from '../assets/thomas-avatar.png';

export default function DietPage({ userId, sheetUrl, title, accentColor = 'pink', allowedOptions = [1, 2, 3, 4] }) {
  const { userStates, setGlobalOption, setSubstitution, clearSubstitution } = useAppContext();
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

  const handleIngredientReset = (ing, mealTitle) => {
    const key = `${mealTitle}-${ing.name}`;
    clearSubstitution(userId, key);
  };

  // Default to the first allowed option on mount if no option is selected
  useEffect(() => {
    if (globalOption === null && allowedOptions.length > 0) {
      setGlobalOption(userId, allowedOptions[0]);
    }
  }, [globalOption, setGlobalOption, userId, allowedOptions]);

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

  const themeStyles = {
    pink: {
      headerBg: 'bg-white/70 border-b border-pink-100/50',
      headerShadow: 'shadow-[0_8px_30px_rgba(250,220,217,0.4)]',
      btnActive: 'bg-pink-500 shadow-pink-500/30',
    },
    blue: {
      headerBg: 'bg-white/70 border-b border-blue-100/50',
      headerShadow: 'shadow-[0_8px_30px_rgba(187,222,251,0.4)]',
      btnActive: 'bg-[#3A8EBA] shadow-[#3A8EBA]/30',
    }
  };

  const currentTheme = themeStyles[accentColor] || themeStyles.pink;

  return (
    <div className="pb-24 pt-6 px-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <header className={twMerge("mb-8 mt-2 sticky top-0 z-20 backdrop-blur-md pt-4 pb-4 -mx-2 px-4", currentTheme.headerBg, currentTheme.headerShadow)}>
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">{title}</h1>
          <img 
            src={userId === 'mel' ? melAvatar : thomasAvatar} 
            alt={userId} 
            className={twMerge(
              "w-12 h-12 rounded-full border-2 border-white shadow-md",
              userId === 'mel' ? "ring-2 ring-pink-200/50" : "ring-2 ring-blue-200/50"
            )}
          />
        </div>

        {/* Global Option Selector Tabs */}
        <div className="flex justify-between items-center gap-2 bg-white/40 p-1.5 rounded-full ring-1 ring-white/60 shadow-inner">
          {allowedOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => setGlobalOption(userId, opt)}
              className={twMerge(
                clsx(
                  "flex-1 py-3 rounded-full text-xs font-black uppercase tracking-tighter transition-all duration-300",
                  String(globalOption) === String(opt) 
                  ? `${currentTheme.btnActive} text-white shadow-lg scale-105` 
                  : "text-gray-500 hover:bg-white/50"
                )
              )}
            >
              {typeof opt === 'number' ? `Opt ${opt}` : opt}
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
              onIngredientReset={handleIngredientReset}
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



