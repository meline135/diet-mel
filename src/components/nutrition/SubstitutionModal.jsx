import React, { useState, useMemo } from 'react';
import { X, Search, Check, RefreshCw, Info } from 'lucide-react';
import { useFoodDatabase } from '../../hooks/useFoodDatabase';
import { parseQuantity, getTargetMacroAmount, calculateNewQuantity } from '../../utils/substitutionLogic';
import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';

export const SubstitutionModal = ({ 
  isOpen, 
  onClose, 
  onSelect, 
  originalItem, 
  accentColor = 'pink' 
}) => {
  const { db, loading } = useFoodDatabase();
  const [search, setSearch] = useState('');

  // 1. Find original food macros from DB to calculate target
  const originalInDb = useMemo(() => {
    if (!db.length || !originalItem) return null;
    return db.find(f => (f.Food_Name || f.food_name)?.toLowerCase() === originalItem.name.toLowerCase());
  }, [db, originalItem]);

  // 2. Identify category and calculate target macro amount
  const category = originalInDb?.Category || originalInDb?.category || 'Carbs'; // Fallback
  const originalQty = parseQuantity(originalItem?.quantity);
  const targetAmount = useMemo(() => {
    if (!originalInDb) return 0;
    return getTargetMacroAmount(originalInDb, originalQty, category);
  }, [originalInDb, originalQty, category]);

  // 3. Filter and Calculate Equivalents
  const options = useMemo(() => {
    if (!db.length) return [];
    
    return db
      .filter(f => {
        const cat = (f.Category || f.category || '').toLowerCase();
        const name = (f.Food_Name || f.food_name || '').toLowerCase();
        const matchesCat = cat === category.toLowerCase();
        const matchesSearch = name.includes(search.toLowerCase());
        const isNotOriginal = name !== (originalItem?.name || '').toLowerCase();
        return matchesCat && matchesSearch && isNotOriginal;
      })
      .map(f => {
        const newQty = calculateNewQuantity(targetAmount, f, category);
        return { ...f, calculatedQty: Math.round(newQty) };
      });
  }, [db, category, search, targetAmount, originalItem]);

  if (!isOpen) return null;

  const themes = {
    pink: {
      bg: 'bg-pink-500',
      text: 'text-pink-600',
      ring: 'ring-pink-500/20',
      light: 'bg-pink-50',
    },
    blue: {
      bg: 'bg-[#3A8EBA]',
      text: 'text-[#3A8EBA]',
      ring: 'ring-[#3A8EBA]/20',
      light: 'bg-blue-50',
    }
  };

  const theme = themes[accentColor] || themes.pink;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 isolate">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-white/70 backdrop-blur-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 ease-out border border-white/20">
        
        {/* Header */}
        <header className={twMerge("p-6 text-white relative bg-opacity-80 backdrop-blur-md", theme.bg)}>
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X size={20} />
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <RefreshCw size={24} className="animate-spin-slow" />
            <h2 className="text-xl font-black tracking-tight">Substitution Intelligente</h2>
          </div>
          <p className="text-white/80 text-sm font-medium">
            Équivalence pour <span className="text-white font-bold underline decoration-2 underline-offset-4">{originalItem.name} ({originalItem.quantity})</span>
          </p>
        </header>

        {/* Search Bar */}
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder={`Chercher dans ${category}...`}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-offset-1 focus:ring-gray-300 transition-all font-medium text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-grow overflow-y-auto p-4 space-y-3">
          {loading ? (
             <div className="flex flex-col items-center justify-center py-10 text-gray-400">
               <RefreshCw className="animate-spin mb-2" size={32} />
               <p className="text-xs font-bold uppercase tracking-widest">Calcul des macros...</p>
             </div>
          ) : options.length === 0 ? (
            <div className="text-center py-10 px-6">
               <Info className="mx-auto text-gray-300 mb-3" size={40} />
               <p className="text-gray-500 font-medium italic">Aucune alternative trouvée pour cette catégorie.</p>
            </div>
          ) : (
            options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => onSelect(option)}
                className="w-full flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all group active:scale-[0.98]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                    {option.Image_URL || option.image_url ? (
                      <img 
                        src={option.Image_URL || option.image_url} 
                        alt={option.Food_Name || option.food_name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <Utensils size={20} />
                      </div>
                    )}
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-900 capitalize">{option.Food_Name || option.food_name}</p>
                    <p className={twMerge("text-xs font-extrabold uppercase tracking-widest", theme.text)}>
                      {option.calculatedQty}g <span className="text-gray-400 opacity-60">Calculé</span>
                    </p>
                  </div>
                </div>
                <div className={twMerge("w-8 h-8 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shrink-0", theme.bg, "text-white")}>
                  <Check size={16} strokeWidth={3} />
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <footer className="p-4 bg-gray-50 border-t border-gray-100">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center leading-relaxed">
            Les quantités sont calculées pour correspondre <br/> exactements aux macronutriments du menu coach.
          </p>
        </footer>
      </div>
    </div>
  );
};
