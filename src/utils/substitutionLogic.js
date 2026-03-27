/**
 * Parses a quantity string (e.g., "50g", "150ml", "1 unit") and returns the numeric value.
 * @param {string} qtyString 
 * @returns {number}
 */
export const parseQuantity = (qtyString) => {
  if (!qtyString) return 0;
  const match = qtyString.match(/(\d+(\.\d+)?)/);
  return match ? parseFloat(match[0]) : 0;
};

/**
 * Calculates the target macronutrient amount for a portion.
 * @param {Object} food - Food object from database { Carbs_per_100g, Protein_per_100g, etc. }
 * @param {number} qty - Quantity in grams/ml
 * @param {string} category - Category (Carbs, Protein, etc.)
 * @returns {number} - The absolute amount of the primary macro
 */
export const getTargetMacroAmount = (food, qty, category) => {
  if (!food) return 0;
  
  const per100 = {
    carbs: parseFloat(food.Carbs_per_100g) || 0,
    protein: parseFloat(food.Protein_per_100g) || 0,
    fat: parseFloat(food.Fat_per_100g) || 0,
    calories: parseFloat(food.Calories_per_100g) || 0,
  };

  // Logic: Swapping Carbs matches Carbs, Protein matches Protein, etc.
  switch (category.toLowerCase()) {
    case 'carbs':
    case 'glucides':
      return (per100.carbs / 100) * qty;
    case 'protein':
    case 'protéines':
      return (per100.protein / 100) * qty;
    case 'fat':
    case 'lipides':
      return (per100.fat / 100) * qty;
    default:
      // Fallback to calories if category is unknown or "Veggies"
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
  if (!newFood) return 0;

  const per100 = {
    carbs: parseFloat(newFood.Carbs_per_100g) || 0,
    protein: parseFloat(newFood.Protein_per_100g) || 0,
    fat: parseFloat(newFood.Fat_per_100g) || 0,
    calories: parseFloat(newFood.Calories_per_100g) || 0,
  };

  let macroPer100 = 0;
  switch (category.toLowerCase()) {
    case 'carbs':
    case 'glucides':
      macroPer100 = per100.carbs;
      break;
    case 'protein':
    case 'protéines':
      macroPer100 = per100.protein;
      break;
    case 'fat':
    case 'lipides':
      macroPer100 = per100.fat;
      break;
    default:
      macroPer100 = per100.calories;
  }

  if (macroPer100 === 0) return 0;
  
  return (targetAmount / macroPer100) * 100;
};
