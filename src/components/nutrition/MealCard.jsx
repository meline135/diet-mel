import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const MealCard = ({ 
  option, 
  title, 
  calories, 
  imageUrl, 
  ingredients, 
  isSelected, 
  isLockedOut, 
  onClick 
}) => {
  return (
    <button
      onClick={onClick}
      disabled={isLockedOut}
      className={twMerge(
        clsx(
          "relative flex flex-col p-4 w-full h-full text-left transition-all duration-300 soft-card",
          isSelected ? "ring-4 ring-pink-400 scale-[1.02] shadow-xl" : "hover:scale-[1.01]",
          isLockedOut ? "opacity-40 cursor-not-allowed grayscale-[50%]" : "cursor-pointer",
          // The selected card gets a white background always, but an unselected one also does. 
          // We can use a mild tint if not selected.
          "bg-white"
        )
      )}
    >
      <div className="flex justify-between items-start mb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-pink-500 bg-pink-50 px-2 py-1 rounded-full">
          Option {option}
        </span>
        {calories ? (
          <span className="text-sm font-semibold text-gray-500 flex items-center">
            <span className="w-2 h-2 rounded-full bg-orange-400 mr-1.5" />
            {calories} cal
          </span>
        ) : null}
      </div>

      <div className="flex items-center space-x-3 mb-4">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-16 h-16 rounded-xl object-cover shadow-sm" 
            onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Food' }} 
          />
        ) : (
          <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 text-xs text-center border border-gray-200">
            No Image
          </div>
        )}
        <div>
          <h3 className="text-lg font-bold text-gray-800 leading-tight mb-1">{title}</h3>
        </div>
      </div>

      <div className="mt-auto space-y-2">
        {ingredients.map((ing, idx) => (
          <div key={idx} className="flex justify-between items-center bg-gray-50 rounded-lg px-2 py-1.5 text-xs text-gray-600">
            <span className="font-medium">{ing.name}</span>
            <span className="text-gray-400">{ing.quantity}</span>
          </div>
        ))}
      </div>
      
      {/* Selected Indicator Checkmark */}
      {isSelected && (
        <div className="absolute top-4 right-4 bg-pink-500 text-white rounded-full p-1 shadow-md">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
      )}
    </button>
  );
};
