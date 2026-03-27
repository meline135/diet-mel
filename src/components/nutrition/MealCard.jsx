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
  substitutions = {}
}) => {
  // Local state to manage expanding/collapsing
  const [isOpen, setIsOpen] = useState(!isCompleted);

  // Automatically close when ticked, and open if unticked
  useEffect(() => {
    if (isCompleted) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  }, [isCompleted]);

  const handleHeaderClick = () => {
    setIsOpen(!isOpen);
  };

  const handleCheckboxClick = (e) => {
    e.stopPropagation(); // Prevent the header click event from firing
    onToggleComplete();
  };

  const themes = {
    pink: {
      cardCompleted: "bg-gradient-to-br from-pink-50 to-white ring-pink-200/50",
      cardActive: "bg-white shadow-[0_10px_40px_-10px_rgba(236,72,153,0.15)] ring-pink-100/60",
      borderSoft: "border-pink-50/50",
      textCompleted: "text-pink-300 decoration-pink-200",
      textActive: "text-pink-500",
      chevronCompleted: "text-pink-300",
      chevronActive: "text-pink-400",
      checkCompleted: "bg-gradient-to-tr from-pink-500 to-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.5)]",
      checkActive: "border-pink-300 hover:bg-pink-50",
      imgBg: "bg-pink-50",
      ingName: "text-gray-700",
      ingQtyBg: "text-pink-400 bg-pink-50/80 border-pink-100/50",
    },
    blue: {
      cardCompleted: "bg-gradient-to-br from-blue-50 to-white ring-blue-200/50",
      cardActive: "bg-white shadow-[0_10px_40px_-10px_rgba(58,142,186,0.15)] ring-blue-100/60",
      borderSoft: "border-blue-50/50",
      textCompleted: "text-blue-300 decoration-blue-200",
      textActive: "text-[#3A8EBA]",
      chevronCompleted: "text-blue-300",
      chevronActive: "text-blue-400",
      checkCompleted: "bg-gradient-to-tr from-[#3A8EBA] to-[#5ba9d4] shadow-[0_0_15px_rgba(58,142,186,0.5)]",
      checkActive: "border-blue-300 hover:bg-blue-50",
      imgBg: "bg-blue-50",
      ingName: "text-gray-700",
      ingQtyBg: "text-[#3A8EBA] bg-blue-50/80 border-blue-100/50",
    }
  };

  const theme = themes[accentColor] || themes.pink;

  return (
    <div className={twMerge(clsx(
      "relative flex flex-col w-full rounded-3xl transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] mb-4 overflow-hidden group",
      isCompleted 
        ? `${theme.cardCompleted} scale-[0.98] opacity-95` 
        : `${theme.cardActive} scale-100`
    ))}>
      
      {/* Card Header (Clickable to expand/collapse) */}
      <div 
        onClick={handleHeaderClick}
        className={twMerge(clsx(
          "relative z-10 flex justify-between items-center p-6 cursor-pointer select-none transition-all duration-500",
          isOpen ? `border-b ${theme.borderSoft}` : ""
        ))}
      >
        <div className="flex items-center gap-3">
          <h3 className={twMerge(clsx(
            "text-2xl font-black capitalize tracking-tight transition-all duration-500",
            isCompleted ? `${theme.textCompleted} line-through decoration-2 translate-x-1` : theme.textActive
          ))}>
            {title}
          </h3>
          <ChevronDown 
            size={20} 
            className={twMerge(clsx(
              "transition-transform duration-500",
              isCompleted ? theme.chevronCompleted : theme.chevronActive,
              isOpen ? "rotate-180" : "rotate-0"
            ))} 
          />
        </div>
        
        {/* Interactive Checkbox with pop animation */}
        <button 
          onClick={handleCheckboxClick}
          className={twMerge(clsx(
            "w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all duration-500 focus:outline-none z-10",
            isCompleted 
              ? `${theme.checkCompleted} border-none text-white scale-110 rotate-[360deg]` 
              : `${theme.checkActive} bg-white text-transparent hover:scale-105 active:scale-95`
          ))}
          aria-label={isCompleted ? "Marquer comme non consommé" : "Marquer comme consommé"}
        >
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" d="M5 13l4 4L19 7" />
          </svg>
        </button>
      </div>

      {/* Collapsible Ingredient List */}
      <div 
        className={twMerge(clsx(
          "transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] origin-top",
          isOpen 
            ? "max-h-[1000px] opacity-100 p-6 pt-2" 
            : "max-h-0 opacity-0 overflow-hidden px-6 py-0 scale-y-95"
        ))}
      >
        <div className={twMerge(clsx(
          "space-y-4 transition-opacity duration-500 delay-100", 
          isCompleted && "opacity-70"
        ))}>
          {ingredients.map((ing, idx) => {
            // Check for substitution
            const subKey = `${title}-${ing.name}`;
            const sub = substitutions[subKey];
            const displayName = sub ? (sub.Food_Name || sub.food_name) : ing.name;
            const displayQty = sub ? `${sub.calculatedQty}g` : ing.quantity;
            const displayImg = sub ? (sub.Image_URL || sub.image_url) : ing.imageUrl;

            return (
              <button 
                key={idx} 
                onClick={() => onIngredientClick(ing)}
                className="w-full flex items-center gap-4 group/item hover:translate-x-1 transition-transform duration-300 text-left"
              >
                
                {/* Ingredient Image Thumbnail */}
                <div className={twMerge("flex-shrink-0 w-14 h-14 rounded-[1.2rem] overflow-hidden ring-2 ring-white shadow-sm flex items-center justify-center relative", theme.imgBg)}>
                  {displayImg ? (
                    <img 
                      src={displayImg} 
                      alt={displayName} 
                      className="w-full h-full object-cover group-hover/item:scale-110 group-hover/item:rotate-2 transition-all duration-500"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/150/FADCD9/FFFFFF?text=Food' }}
                    />
                  ) : (
                    <span className={twMerge("text-xs font-bold", isCompleted ? theme.chevronCompleted : theme.chevronActive)}>...</span>
                  )}
                  {sub && (
                    <div className={twMerge("absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[1px]", theme.text)}>
                      <RefreshCw size={14} className="text-white animate-spin-slow" />
                    </div>
                  )}
                </div>
                
                {/* Ingredient Info */}
                <div className={twMerge("flex-grow flex justify-between items-center bg-white/60 backdrop-blur-sm rounded-2xl px-5 py-4 border shadow-sm group-hover/item:border-gray-200 transition-colors", theme.borderSoft)}>
                  <span className={twMerge("font-semibold capitalize text-sm flex items-center gap-2", theme.ingName)}>
                    {displayName}
                    {sub && <RefreshCw size={12} className={twMerge(theme.text, "opacity-50")} />}
                  </span>
                  <span className={twMerge("font-extrabold text-xs px-3 py-1.5 rounded-lg border", theme.ingQtyBg)}>{displayQty}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      
    </div>
  );
};

