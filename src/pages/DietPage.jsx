import React, { useEffect, useState } from 'react';
import { MealCategory } from '../components/nutrition/MealCategory';
import { SubstitutionModal } from '../components/nutrition/SubstitutionModal';
import { useAppContext } from '../context/AppContext';
import { useSheetData } from '../hooks/useSheetData';
import { twMerge } from 'tailwind-merge';
import { Loader2, Heart } from 'lucide-react';

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
    <div className="pb-32 pt-8 px-4 animate-in fade-in slide-in-from-bottom-6 duration-700">
      
      <header className="mb-12 sticky top-0 z-20 backdrop-blur-md bg-white/5 pt-6 pb-6 -mx-4 px-6 flex flex-col gap-6 border-b border-white/10 shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-black text-brand-brown tracking-tighter leading-none">{title}</h1>
          <div className="w-12 h-12 rounded-2xl bg-white/50 backdrop-blur-lg shadow-sm border border-white/40 flex items-center justify-center">
            <Heart size={24} className="text-brand-pink fill-brand-pink/20" />
          </div>
        </div>

        {/* Global Option Selector Tabs */}
        <div className="flex justify-between items-center gap-2 bg-white/50 backdrop-blur-xl p-1.5 rounded-[2rem] shadow-[0_10px_30px_rgba(59,47,47,0.05)] border border-white/30">
          {allowedOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => setGlobalOption(userId, opt)}
              className={twMerge(
                "flex-1 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                String(globalOption) === String(opt) 
                ? "bg-brand-pink text-white shadow-lg shadow-brand-pink/30 scale-105" 
                : "text-brand-brown/40"
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
        <div className="relative overflow-hidden">
          {/* Background Decor - Floating Fruits */}
          <div className="absolute -right-20 top-20 w-40 h-40 opacity-10 pointer-events-none blur-[1px] float">
            <img src="/Users/macdememe/.gemini/antigravity/brain/97f44df9-df67-4524-a9d6-2515850cffd0/strawberry_transparent_1774997303509.png" alt="" className="w-full h-full object-contain" />
          </div>
          <div className="absolute -left-20 top-[400px] w-48 h-48 opacity-10 pointer-events-none blur-[2px] float-slow">
            <img src="/Users/macdememe/.gemini/antigravity/brain/97f44df9-df67-4524-a9d6-2515850cffd0/lemon_slice_transparent_1774997273386.png" alt="" className="w-full h-full object-contain" />
          </div>

          <div className="flex flex-col gap-8 mt-6">
            {mealCategories.map(([mealType, optionsArray], idx) => {
               // Asymmetrical rhythm
               const isFeatured = idx === 0 || idx === 3;
               return (
                 <div key={mealType} className="w-full">
                   <MealCategory 
                     title={mealType} 
                     optionsData={optionsArray}
                     userId={userId}
                     accentColor={accentColor}
                     onIngredientClick={handleIngredientClick}
                     onIngredientReset={handleIngredientReset}
                     substitutions={substitutions}
                     isFeatured={isFeatured}
                   />
                 </div>
               );
            })}
          </div>
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



