/**
 * Parses a quantity string (e.g., "50g", "150ml", "1 unit") and returns the numeric value.
 * @param {string} qtyString 
 * @returns {number}
 */
export const parseQuantity = (qtyString) => {
  if (!qtyString) return 0;
  // Handle strings like "50g", "100 ml", "1.5 pieces"
  const match = String(qtyString).replace(',', '.').match(/(\d+(\.\d+)?)/);
  return match ? parseFloat(match[0]) : 0;
};

/**
 * Calculates the target macronutrient amount for a portion.
 * @param {Object} food - Food object from database { Carbs_100g, Protein_100g, etc. }
 * @param {number} qty - Quantity in grams/ml
 * @param {string} category - Category (Glucides, Protéines, Lipides)
 * @returns {number} - The absolute amount of the primary macro
 */
export const getTargetMacroAmount = (food, qty, category) => {
  if (!food || !qty) return 0;
  
  // Use keys exactly as they appear in the CSV headers
  const per100 = {
    carbs: parseFloat(String(food.Carbs_100g || 0).replace(',', '.')) || 0,
    protein: parseFloat(String(food.Protein_100g || 0).replace(',', '.')) || 0,
    fat: parseFloat(String(food.Fat_100g || 0).replace(',', '.')) || 0,
    calories: parseFloat(String(food.Calories_100g || 0).replace(',', '.')) || 0,
  };

  const cat = (category || '').toLowerCase();

  // Mapping French sheet categories to macros
  if (cat.includes('glucide')) {
    return (per100.carbs / 100) * qty;
  } else if (cat.includes('protéine') || cat.includes('proteine')) {
    return (per100.protein / 100) * qty;
  } else if (cat.includes('lipide')) {
    return (per100.fat / 100) * qty;
  } else {
    // Fallback: match by calories
    return (per100.calories / 100) * qty;
  }
};

/**
 * Calculates the required quantity of a new food to match a target macro amount.
 * Formula: $NewQuantity = (OriginalMacroAmount / NewFoodMacroPer100g) * 100$
 * @param {number} targetAmount - The absolute macro amount to reach
 * @param {Object} newFood - Food object from database
 * @param {string} category - Category
 * @returns {number} - The new quantity in grams/ml
 */
export const calculateNewQuantity = (targetAmount, newFood, category) => {
  if (!newFood || targetAmount <= 0) return 0;

  const per100 = {
    carbs: parseFloat(String(newFood.Carbs_100g || 0).replace(',', '.')) || 0,
    protein: parseFloat(String(newFood.Protein_100g || 0).replace(',', '.')) || 0,
    fat: parseFloat(String(newFood.Fat_100g || 0).replace(',', '.')) || 0,
    calories: parseFloat(String(newFood.Calories_100g || 0).replace(',', '.')) || 0,
  };

  const cat = (category || '').toLowerCase();
  let macroPer100 = 0;

  if (cat.includes('glucide')) {
    macroPer100 = per100.carbs;
  } else if (cat.includes('protéine') || cat.includes('proteine')) {
    macroPer100 = per100.protein;
  } else if (cat.includes('lipide')) {
    macroPer100 = per100.fat;
  } else {
    macroPer100 = per100.calories;
  }

  if (macroPer100 === 0) return 0;
  
  return (targetAmount / macroPer100) * 100;
};

