import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Check daily reset on load
  const checkAndResetDaily = () => {
    const today = new Date().toLocaleDateString();
    const lastActiveDate = localStorage.getItem('lastActiveDate');
    
    if (lastActiveDate !== today) {
      // It's a new day! clear data.
      localStorage.removeItem('userStates');
      localStorage.setItem('lastActiveDate', today);
      return true; // Indicates a reset happened
    }
    return false;
  };

  // Run the check once at startup to determine initial states
  const [didReset] = useState(checkAndResetDaily);

  // Initial state for user data
  const defaultUserState = {
    globalOption: null,
    completedMeals: {},
    liquids: { 
      Water: 0, 
      Coffee: 0, 
      Tea: 0, 
      Whey: 0, 
      Soda: 0, 
      PreWorkout: 0, 
      Creatine: 0 
    },
    intakeHistory: [], // Tracks [{ type, amount }]
    hydrationGoal: 2000, 
    substitutions: {} // New: { [ingredientKey]: substituteFoodObject }
  };

  // State mapping user IDs to their respective tracking data
  const [userStates, setUserStates] = useState(() => {
    if (didReset) return { mel: { ...defaultUserState }, thomas: { ...defaultUserState } };
    const saved = localStorage.getItem('userStates');
    const parsed = saved ? JSON.parse(saved) : {};
    
    // Ensure both users exist in the state and handle migration from previous versions
    return {
      mel: { ...defaultUserState, ...(parsed.mel || {}) },
      thomas: { ...defaultUserState, ...(parsed.thomas || {}) }
    };
  });



  // Save states to LocalStorage
  useEffect(() => {
    localStorage.setItem('userStates', JSON.stringify(userStates));
  }, [userStates]);





  // --- MIDNIGHT RESET LOGIC ---
  useEffect(() => {
    const checkMidnight = () => {
      const now = new Date();
      const night = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1, // Tomorrow
        0, 0, 0 // Midnight
      );
      const msToMidnight = night.getTime() - now.getTime();

      const timerId = setTimeout(() => {
        resetDaily();
        checkMidnight(); // Re-set for the following day
      }, msToMidnight);

      return timerId;
    };

    const timerId = checkMidnight();
    return () => clearTimeout(timerId);
  }, []);

  const setGlobalOption = (userId, option) => {
    setUserStates(prev => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        globalOption: option
      }
    }));
  };

  const setHydrationIntake = (userId, drinkType, amountOrFn) => {
    setUserStates(prev => {
      const currentLiquids = { ...prev[userId].liquids };
      const currentHistory = [...(prev[userId].intakeHistory || [])];
      
      const currentVal = currentLiquids[drinkType] || 0;
      const nextVal = typeof amountOrFn === 'function' ? amountOrFn(currentVal) : amountOrFn;
      
      // If we are adding (not resetting or undoing), record to history
      const diff = nextVal - currentVal;
      if (diff > 0) {
        currentHistory.push({ type: drinkType, amount: diff });
      }

      return {
        ...prev,
        [userId]: {
          ...prev[userId],
          liquids: {
            ...currentLiquids,
            [drinkType]: Math.max(0, nextVal)
          },
          intakeHistory: currentHistory
        }
      };
    });
  };

  const undoHydration = (userId) => {
    setUserStates(prev => {
      const currentHistory = [...(prev[userId].intakeHistory || [])];
      if (currentHistory.length === 0) return prev;

      const lastIntake = currentHistory.pop();
      const currentLiquids = { ...prev[userId].liquids };
      
      return {
        ...prev,
        [userId]: {
          ...prev[userId],
          liquids: {
            ...currentLiquids,
            [lastIntake.type]: Math.max(0, (currentLiquids[lastIntake.type] || 0) - lastIntake.amount)
          },
          intakeHistory: currentHistory
        }
      };
    });
  };

  const setHydrationGoal = (userId, newGoal) => {
    setUserStates(prev => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        hydrationGoal: newGoal
      }
    }));
  };

  const toggleMeal = (userId, mealType) => {
    setUserStates(prev => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        completedMeals: {
          ...prev[userId].completedMeals,
          [mealType]: !prev[userId].completedMeals[mealType]
        }
      }
    }));
  };

  const setSubstitution = (userId, ingredientKey, substituteFood) => {
    setUserStates(prev => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        substitutions: {
          ...prev[userId].substitutions,
          [ingredientKey]: substituteFood
        }
      }
    }));
  };

  const clearSubstitution = (userId, ingredientKey) => {
    setUserStates(prev => {
      const newSubstitutions = { ...prev[userId].substitutions };
      delete newSubstitutions[ingredientKey];
      return {
        ...prev,
        [userId]: {
          ...prev[userId],
          substitutions: newSubstitutions
        }
      };
    });
  };

  const resetDaily = () => {
    setUserStates({
      mel: { ...defaultUserState },
      thomas: { ...defaultUserState }
    });
    localStorage.removeItem('userStates');
    localStorage.setItem('lastActiveDate', new Date().toLocaleDateString());
  };

  return (
    <AppContext.Provider
      value={{
        userStates,
        setGlobalOption,
        setHydrationIntake,
        undoHydration,
        setHydrationGoal,
        toggleMeal,
        setSubstitution,
        clearSubstitution,
        resetDaily,
      }}
    >
      {children}
    </AppContext.Provider>
  );


};

export const useAppContext = () => useContext(AppContext);


