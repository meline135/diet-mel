import React, { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ChevronDown, RefreshCw } from 'lucide-react';

export const MealCard = ({ 
  title, 
  ingredients,
  isCompleted,
  onToggleComplete,
  accentColor = 'pink',
  onIngredientClick = () => {},
  onIngredientReset = () => {},
  substitutions = {},
  isFeatured = false
}) => {
  const [isOpen, setIsOpen] = useState(!isCompleted);
  useEffect(() => { setIsOpen(!isCompleted); }, [isCompleted]);

  const themes = {
    pink: {
      card: "bg-white/10 border-white/20 shadow-[0_20px_50px_rgba(255,138,155,0.05)]",
      titleActive: "text-brand-pink",
      titleDone: "text-brand-pink/30",
      checkDone: "bg-brand-pink shadow-lg shadow-brand-pink/40",
      checkActive: "border-brand-pink/30",
      ingBg: "bg-brand-pink/5",
      qty: "bg-brand-pink/10 text-brand-pink border-brand-pink/20"
    },
    blue: {
      card: "bg-white/10 border-white/20 shadow-[0_20px_50px_rgba(58,142,186,0.05)]",
      titleActive: "text-brand-blue",
      titleDone: "text-brand-blue/30",
      checkDone: "bg-brand-blue shadow-lg shadow-brand-blue/40",
      checkActive: "border-brand-blue/30",
      ingBg: "bg-brand-blue/5",
      qty: "bg-brand-blue/10 text-brand-blue border-brand-blue/20"
    }
  };

  const theme = themes[accentColor] || themes.pink;

  return (
    <div className={twMerge(
      "relative flex flex-col w-full rounded-[3rem] transition-all duration-500 mb-8 overflow-hidden border",
      isCompleted ? "opacity-70 grayscale-[0.2] scale-[0.98]" : theme.card
    )}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={twMerge(
          "flex justify-between items-center p-8 cursor-pointer select-none", 
          isOpen && "border-b border-brand-brown/5",
          isFeatured && "pt-12 pb-8"
        )}
      >
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            {isFeatured && !isCompleted && (
              <span className="text-[10px] font-black text-brand-orange uppercase tracking-[0.3em] mb-2">Featured Meal</span>
            )}
            <h3 className={twMerge(
              "font-black transition-all duration-500 tracking-tighter leading-none",
              isCompleted ? `${theme.titleDone} line-through text-2xl` : `${theme.titleActive} text-4xl`,
              isFeatured && !isCompleted ? "text-5xl" : ""
            )}>
              {title}
            </h3>
          </div>
          <ChevronDown size={24} className={twMerge("transition-transform duration-500", isOpen && "rotate-180", isCompleted ? "opacity-30" : "opacity-50")} />
        </div>
        
        <button 
          onClick={(e) => { e.stopPropagation(); onToggleComplete(); }}
          className={twMerge(
            "w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-500 shrink-0",
            isCompleted ? `${theme.checkDone} border-none text-white rotate-[360deg]` : `${theme.checkActive} bg-white text-transparent shadow-sm`
          )}
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
          </svg>
        </button>
      </div>

      <div className={twMerge("transition-all duration-500 overflow-hidden", isOpen ? "max-h-[1500px] p-8 pt-4" : "max-h-0")}>
        <div className="grid grid-cols-1 gap-5">
          {ingredients.map((ing, idx) => {
            const subKey = `${title}-${ing.name}`;
            const sub = substitutions[subKey];
            const displayName = sub ? (sub.Food_Name || sub.food_name) : ing.name;
            const displayQty = sub ? `${sub.calculatedQty}g` : ing.quantity;
            const displayImg = sub ? (sub.Image_URL || sub.image_url) : ing.imageUrl;

            return (
              <div key={idx} className="flex items-center gap-5 group">
                <button 
                  onClick={() => onIngredientClick(ing)}
                  className="flex-grow flex items-center gap-5 hover:translate-x-2 transition-transform"
                >
                  <div className={twMerge("flex-shrink-0 w-16 h-16 rounded-[2rem] overflow-hidden ring-4 ring-white shadow-md flex items-center justify-center relative", theme.ingBg)}>
                    {displayImg ? (
                      <img src={displayImg} alt={displayName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <span className="text-xl">🥗</span>
                    )}
                  </div>
                  
                  <div className="flex-grow flex justify-between items-center bg-white/50 backdrop-blur-sm rounded-[2rem] px-5 py-4 border border-brand-brown/5 shadow-sm group-hover:shadow-md transition-all relative overflow-hidden">
                    <span className="font-bold text-sm text-brand-brown capitalize leading-tight flex items-center gap-2 min-w-0 flex-grow mr-2">
                      <span className="truncate">{displayName}</span>
                      {sub && <RefreshCw size={14} className="text-brand-pink/50 animate-spin-slow shrink-0" />}
                    </span>
                    <span className={twMerge("font-black text-[10px] px-3 py-1.5 rounded-full border uppercase tracking-widest shrink-0", theme.qty)}>{displayQty}</span>
                    
                    {sub && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onIngredientReset(ing, title);
                        }}
                        className="absolute -right-2 -top-2 w-8 h-8 rounded-full bg-white shadow-lg border border-brand-brown/5 flex items-center justify-center text-red-400 hover:text-red-500 hover:scale-110 active:scale-95 transition-all z-20"
                        title="Revenir à l'original"
                      >
                        <RefreshCw size={12} />
                      </button>
                    )}
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};


