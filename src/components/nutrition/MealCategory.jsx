import React from 'react';
import { MealCard } from './MealCard';
import { useAppContext } from '../../context/AppContext';
import { twMerge } from 'tailwind-merge';

export const MealCategory = ({ 
  title, 
  optionsData, 
  userId, 
  accentColor = 'pink',
  onIngredientClick = () => {},
  substitutions = {}
}) => {
  const { userStates, toggleMeal } = useAppContext();
  
  const currentUserState = userStates[userId] || {};
  const globalOption = currentUserState.globalOption;
  const isCompleted = currentUserState.completedMeals?.[title] || false;

  // Find the data for the currently selected global tab option.
  const activeOption = optionsData.find(opt => opt.optionNumber === globalOption);

  const errorTheme = {
    pink: 'bg-pink-50/50 border-pink-200 text-pink-400',
    blue: 'bg-blue-50/50 border-blue-200 text-blue-400',
  };

  return (
    <div className="mb-6 relative px-1">
      {/* Show only the active option, or a message if it's missing for some reason */}
      <div className="w-full">
        {activeOption ? (
           <MealCard
             title={title}
             ingredients={activeOption.ingredients}
             isCompleted={isCompleted}
             onToggleComplete={() => toggleMeal(userId, title)}
             accentColor={accentColor}
             onIngredientClick={(ing) => onIngredientClick(ing, title)}
             substitutions={substitutions}
           />
        ) : (
          <div className={twMerge("p-6 rounded-2xl text-center border-dashed border-2", errorTheme[accentColor] || errorTheme.pink)}>
            <span className="font-medium italic">Option {globalOption} non définie pour {title}.</span>
          </div>
        )}
      </div>
    </div>
  );
};


