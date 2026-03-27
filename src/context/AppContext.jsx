import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Option selected for the day (1, 2, 3, or 4)
  const [globalOption, setGlobalOption] = useState(() => {
    const saved = localStorage.getItem('trackedOption');
    return saved ? parseInt(saved, 10) : null;
  });

  // Current Hydration (in ml)
  const [hydrationIntake, setHydrationIntake] = useState(() => {
    const saved = localStorage.getItem('hydrationIntake');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Target Goal (e.g., 2000 ml)
  const hydrationGoal = 2000;

  useEffect(() => {
    if (globalOption !== null) {
      localStorage.setItem('trackedOption', globalOption);
    }
  }, [globalOption]);

  useEffect(() => {
    localStorage.setItem('hydrationIntake', hydrationIntake);
  }, [hydrationIntake]);

  const resetDaily = () => {
    setGlobalOption(null);
    setHydrationIntake(0);
    localStorage.removeItem('trackedOption');
    localStorage.removeItem('hydrationIntake');
  };

  return (
    <AppContext.Provider
      value={{
        globalOption,
        setGlobalOption,
        hydrationIntake,
        setHydrationIntake,
        hydrationGoal,
        resetDaily,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
