import React, { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ChevronDown } from 'lucide-react';
import Lottie from 'lottie-react';
import sparkleAnimation from '../../assets/CTA Button Background.json';

export const MealCard = ({ 
  title, 
  ingredients,
  isCompleted,
  onToggleComplete
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

  return (
    <div className={twMerge(clsx(
      "relative flex flex-col w-full rounded-3xl transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] mb-4 overflow-hidden group",
      isCompleted 
        ? "bg-gradient-to-br from-pink-50 to-white ring-1 ring-pink-200/50 shadow-sm scale-[0.98] opacity-95" 
        : "bg-white shadow-[0_10px_40px_-10px_rgba(236,72,153,0.15)] ring-1 ring-pink-100/60 scale-100"
    ))}>
      
      {/* Custom Lottie Animation Overlay */}
      {isCompleted && (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-3xl mix-blend-overlay opacity-80 flex items-center justify-center">
          <Lottie 
            animationData={sparkleAnimation} 
            loop={true} 
            className="w-[150%] h-[150%] object-cover scale-[1.2]" 
          />
        </div>
      )}

      {/* Card Header (Clickable to expand/collapse) */}
      <div 
        onClick={handleHeaderClick}
        className={twMerge(clsx(
          "relative z-10 flex justify-between items-center p-6 cursor-pointer select-none transition-all duration-500",
          isOpen ? "border-b border-pink-50/50" : ""
        ))}
      >
        <div className="flex items-center gap-3">
          <h3 className={twMerge(clsx(
            "text-2xl font-black capitalize tracking-tight transition-all duration-500",
            isCompleted ? "text-pink-300 line-through decoration-pink-200 decoration-2 translate-x-1" : "text-pink-500"
          ))}>
            {title}
          </h3>
          <ChevronDown 
            size={20} 
            className={twMerge(clsx(
              "transition-transform duration-500",
              isCompleted ? "text-pink-300" : "text-pink-400",
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
              ? "bg-gradient-to-tr from-pink-500 to-pink-400 border-none text-white scale-110 shadow-[0_0_15px_rgba(236,72,153,0.5)] rotate-[360deg]" 
              : "border-pink-300 bg-white text-transparent hover:bg-pink-50 hover:scale-105 active:scale-95"
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
          {ingredients.map((ing, idx) => (
            <div key={idx} className="flex items-center gap-4 group/item hover:translate-x-1 transition-transform duration-300">
              
              {/* Ingredient Image Thumbnail */}
              <div className="flex-shrink-0 w-14 h-14 rounded-[1.2rem] overflow-hidden bg-pink-50 ring-2 ring-white shadow-sm flex items-center justify-center">
                {ing.imageUrl ? (
                  <img 
                    src={ing.imageUrl} 
                    alt={ing.name} 
                    className="w-full h-full object-cover group-hover/item:scale-110 group-hover/item:rotate-2 transition-all duration-500"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/150/FADCD9/FFFFFF?text=Food' }}
                  />
                ) : (
                  <span className="text-xs text-pink-300 font-bold">...</span>
                )}
              </div>
              
              {/* Ingredient Info */}
              <div className="flex-grow flex justify-between items-center bg-white/60 backdrop-blur-sm rounded-2xl px-5 py-4 border border-pink-50/50 shadow-sm">
                <span className="font-semibold text-gray-700 capitalize text-sm">{ing.name}</span>
                <span className="text-pink-400 font-extrabold text-xs bg-pink-50/80 px-3 py-1.5 rounded-lg border border-pink-100/50">{ing.quantity}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
};
