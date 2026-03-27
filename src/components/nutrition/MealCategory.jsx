import React from 'react';
import { MealCard } from './MealCard';
import { useAppContext } from '../../context/AppContext';

export const MealCategory = ({ title, optionsData }) => {
  const { globalOption, completedMeals, toggleMeal } = useAppContext();

  // Find the data for the currently selected global tab option.
  const activeOption = optionsData.find(opt => opt.optionNumber === globalOption);
  const isCompleted = completedMeals[title] || false;

  return (
    <div className="mb-6 relative px-1">
      {/* Show only the active option, or a message if it's missing for some reason */}
      <div className="w-full">
        {activeOption ? (
           <MealCard
             title={title}
             ingredients={activeOption.ingredients}
             isCompleted={isCompleted}
             onToggleComplete={() => toggleMeal(title)}
           />
        ) : (
          <div className="p-6 bg-pink-50/50 rounded-2xl text-center border-dashed border-2 border-pink-200">
            <span className="text-pink-400 font-medium italic">Option {globalOption} non définie pour {title}.</span>
          </div>
        )}
      </div>
    </div>
  );
};

