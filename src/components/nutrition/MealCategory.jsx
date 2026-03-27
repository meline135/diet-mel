import React from 'react';
import { MealCard } from './MealCard';
import { useAppContext } from '../../context/AppContext';

export const MealCategory = ({ title, optionsData }) => {
  const { globalOption, setGlobalOption } = useAppContext();

  const handleSelectOption = (optionGroup) => {
    // Determine the option number from the clicked card
    // Note: optionsData is expected to be an array of objects representing options
    if (globalOption === optionGroup.optionNumber) {
      // Toggle off if they click the same one again
      setGlobalOption(null);
    } else {
      setGlobalOption(optionGroup.optionNumber);
    }
  };

  // If a global option is selected, find only that option's data
  const displayedOptions = globalOption 
    ? optionsData.filter(opt => opt.optionNumber === globalOption) 
    : optionsData;

  return (
    <div className="mb-8 relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-black text-gray-800 tracking-tight">{title}</h2>
        {globalOption && (
          <span className="text-sm font-medium text-pink-500 bg-pink-100 px-3 py-1 rounded-full">
            Locked
          </span>
        )}
      </div>

      <div 
        className={`grid gap-4 transition-all duration-500 ease-in-out ${
          globalOption ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'
        }`}
      >
        {optionsData.map((opt) => {
          const isSelected = globalOption === opt.optionNumber;
          const isLockedOut = globalOption !== null && globalOption !== opt.optionNumber;

          // Soft collapse unselected options if we are locked
          if (isLockedOut) return null;

          return (
            <div key={opt.id || opt.optionNumber} className="w-full flex">
              <MealCard
                option={opt.optionNumber}
                title={opt.title}
                calories={opt.calories}
                imageUrl={opt.imageUrl}
                ingredients={opt.ingredients}
                isSelected={isSelected}
                isLockedOut={isLockedOut}
                onClick={() => handleSelectOption(opt)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
