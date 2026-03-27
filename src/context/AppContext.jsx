import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Check daily reset on load
  const checkAndResetDaily = () => {
    const today = new Date().toLocaleDateString();
    const lastActiveDate = localStorage.getItem('lastActiveDate');
    
    if (lastActiveDate !== today) {
      // It's a new day! clear data.
      localStorage.removeItem('trackedOption');
      localStorage.removeItem('hydrationIntake');
      localStorage.removeItem('completedMeals');
      localStorage.setItem('lastActiveDate', today);
      return true; // Indicates a reset happened
    }
    return false;
  };

  // Run the check once at startup to determine initial states
  const [didReset] = useState(checkAndResetDaily);

  // Option selected for the day (1, 2, 3, or 4)
  const [globalOption, setGlobalOption] = useState(() => {
    if (didReset) return null;
    const saved = localStorage.getItem('trackedOption');
    return saved ? parseInt(saved, 10) : null;
  });

  // Current Hydration (in ml)
  const [hydrationIntake, setHydrationIntake] = useState(() => {
    if (didReset) return 0;
    const saved = localStorage.getItem('hydrationIntake');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Target Goal (e.g., 2000 ml)
  const hydrationGoal = 2000;

  // Completed Meals
  const [completedMeals, setCompletedMeals] = useState(() => {
    if (didReset) return {};
    const saved = localStorage.getItem('completedMeals');
    return saved ? JSON.parse(saved) : {};
  });

  // Save states to LocalStorage
  useEffect(() => {
    if (globalOption !== null) {
      localStorage.setItem('trackedOption', globalOption);
    }
  }, [globalOption]);

  useEffect(() => {
    localStorage.setItem('hydrationIntake', hydrationIntake);
  }, [hydrationIntake]);

  useEffect(() => {
    localStorage.setItem('completedMeals', JSON.stringify(completedMeals));
  }, [completedMeals]);

  const toggleMeal = (mealType) => {
    setCompletedMeals(prev => ({
      ...prev,
      [mealType]: !prev[mealType]
    }));
  };

  const resetDaily = () => {
    setGlobalOption(null);
    setHydrationIntake(0);
    setCompletedMeals({});
    localStorage.removeItem('trackedOption');
    localStorage.removeItem('hydrationIntake');
    localStorage.removeItem('completedMeals');
    localStorage.setItem('lastActiveDate', new Date().toLocaleDateString());
  };

  return (
    <AppContext.Provider
      value={{
        globalOption,
        setGlobalOption,
        hydrationIntake,
        setHydrationIntake,
        hydrationGoal,
        completedMeals,
        toggleMeal,
        resetDaily,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
