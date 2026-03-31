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
  onIngredientReset = () => {},
  substitutions = {},
  isFeatured = false
}) => {
  const { userStates, toggleMeal } = useAppContext();
  
  const currentUserState = userStates[userId] || {};
  const globalOption = currentUserState.globalOption;
  const isCompleted = currentUserState.completedMeals?.[title] || false;

  const activeOption = optionsData.find(opt => String(opt.optionNumber) === String(globalOption));

  const errorTheme = {
    pink: 'bg-pink-50/50 border-pink-200 text-pink-400',
    blue: 'bg-blue-50/50 border-blue-200 text-blue-400',
  };

  return (
    <div className={twMerge("mb-6 relative", isFeatured ? "md:mb-12" : "md:col-span-1")}>
      <div className="w-full">
        {activeOption ? (
           <MealCard
             title={title}
             ingredients={activeOption.ingredients}
             isCompleted={isCompleted}
             onToggleComplete={() => toggleMeal(userId, title)}
             accentColor={accentColor}
             onIngredientClick={(ing) => onIngredientClick(ing, title)}
             onIngredientReset={onIngredientReset}
             substitutions={substitutions}
             isFeatured={isFeatured}
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



