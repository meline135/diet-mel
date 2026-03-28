/**
 * shoppingLogic.js
 * Utilities for aggregating and categorizing ingredients for the Shopping List.
 */

const CATEGORY_MAPPING = {
  // Légumes
  'carotte': 'Légumes', 'tomate': 'Légumes', 'chou': 'Légumes', 'céleri': 'Légumes', 'brocoli': 'Légumes', 
  'ail': 'Légumes', 'oignon': 'Légumes', 'courgette': 'Légumes', 'salade': 'Légumes',
  'concombre': 'Légumes', 'poivron': 'Légumes', 'haricot': 'Légumes', 'épinard': 'Légumes', 'champignon': 'Légumes',
  'radis': 'Légumes', 'aubergine': 'Légumes', 'maïs': 'Légumes', 'petit pois': 'Légumes', 'avocat': 'Légumes',
  'légumes': 'Légumes',

  // Fruits
  'pomme': 'Fruits', 'banane': 'Fruits', 'melon': 'Fruits', 'ananas': 'Fruits', 'poire': 'Fruits', 
  'orange': 'Fruits', 'raisin': 'Fruits', 'fruits séchés': 'Fruits', 'noisette': 'Fruits',
  'fraise': 'Fruits', 'framboise': 'Fruits', 'myrtille': 'Fruits', 'citron': 'Fruits', 'pêche': 'Fruits',
  'abricot': 'Fruits', 'kiwi': 'Fruits', 'mangue': 'Fruits', 'fruits rouges': 'Fruits',

  // Viande/Poisson
  'poulet': 'Viande/Poisson', 'boeuf': 'Viande/Poisson', 'porc': 'Viande/Poisson', 'poisson': 'Viande/Poisson',
  'jambon': 'Viande/Poisson', 'saucisse': 'Viande/Poisson', 'dinde': 'Viande/Poisson', 'steak': 'Viande/Poisson',
  'saumon': 'Viande/Poisson', 'thon': 'Viande/Poisson', 'crevette': 'Viande/Poisson', 'veau': 'Viande/Poisson',
  'oeuf': 'Produits laitiers', // Eggs are often in cremerie/dairy icons in these lists

  // Produits laitiers
  'beurre': 'Produits laitiers', 'yaourt': 'Produits laitiers', 'fromage': 'Produits laitiers', 'mozzarella': 'Produits laitiers', 
  'crème fraîche': 'Produits laitiers', 'lait': 'Boissons', 'skyr': 'Produits laitiers',

  // Petit déj (Specific to user's list)
  'céréales': 'Petit déj', 'brioche': 'Petit déj', 'gateau': 'Petit déj',
  'café': 'Petit déj', 'thé': 'Petit déj', 'sucre': 'Petit déj', 'confiture': 'Petit déj', 'pâte à tartiner': 'Petit déj',

  // Boissons
  'eau': 'Boissons', 'soda': 'Boissons', 'jus': 'Boissons', 'sirop': 'Boissons', 'bière': 'Boissons', 'vin': 'Boissons',

  // Sauces
  'moutarde': 'Sauces', 'mayonnaise': 'Sauces', 'ketchup': 'Sauces', 'sauce tomate': 'Sauces', 'soja': 'Sauces',

  // Glucides / Épicerie (Combined based on typical use)
  'riz': 'Glucides', 'pâte': 'Glucides', 'quinoa': 'Glucides', 'semoule': 'Glucides', 'pain': 'Glucides',
  'pomme de terre': 'Glucides', 'patate douce': 'Glucides', 'flocons d\'avoine': 'Glucides',
  'sel': 'Épicerie', 'poivre': 'Épicerie', 'huile': 'Épicerie', 'vinaigre': 'Épicerie', 'farine': 'Épicerie',
  'chocolat': 'Épicerie', 'noix': 'Épicerie', 'amande': 'Épicerie', 'noix du brésil': 'Épicerie'
};

const CATEGORY_ORDER = [
  'Légumes', 'Fruits', 'Viande/Poisson', 'Produits laitiers', 
  'Petit déj', 'Boissons', 'Sauces', 'Glucides', 'Épicerie', 'Autres'
];

/**
 * Categorize an ingredient based on its name.
 */
export const getCategory = (name) => {
  const n = name.toLowerCase();
  for (const [key, cat] of Object.entries(CATEGORY_MAPPING)) {
    if (n.includes(key)) return cat;
  }
  return 'Autres';
};

/**
 * Parse a quantity string like "200g" or "2 large eggs" into a number and unit.
 */
export const parseQuantity = (qtyStr) => {
  if (!qtyStr) return { value: 0, unit: '' };
  
  // Match the first number (integer or decimal)
  const match = qtyStr.match(/(\d+[.,]?\d*)/);
  if (!match) return { value: 0, unit: qtyStr.trim() };
  
  const value = parseFloat(match[0].replace(',', '.'));
  const unit = qtyStr.replace(match[0], '').trim();
  
  return { value, unit };
};

/**
 * Formats a quantity for display.
 */
export const formatQuantity = (value, unit) => {
  if (value === 0 && !unit) return '';
  if (value === 0) return unit;
  return `${value}${unit ? (unit.startsWith(' ') ? unit : ' ' + unit) : ''}`;
};

/**
 * Aggregates ingredients from multiple plans.
 * selectedPlans: { mel: { '1': 2, ... }, thomas: { 'ON': 1, ... } }
 * allData: { mel: groupedDataMel, thomas: groupedDataThomas }
 */
export const aggregateIngredients = (selectedPlans, allData) => {
  const masterList = {};

  ['mel', 'thomas'].forEach(user => {
    const plans = selectedPlans[user];
    const data = allData[user];

    if (!data) return;

    Object.entries(plans).forEach(([option, count]) => {
      if (count <= 0) return;

      // Extract all ingredients for this option across ALL meal types (Breakfast, Lunch, etc.)
      Object.entries(data).forEach(([mealType, options]) => {
        const selectedOpt = options.find(o => String(o.optionNumber) === String(option));
        if (!selectedOpt) return;

        selectedOpt.ingredients.forEach(ing => {
          const key = ing.name.toLowerCase().trim();
          const { value, unit } = parseQuantity(ing.quantity);

          if (!masterList[key]) {
            masterList[key] = {
              name: ing.name,
              totalValue: 0,
              unit: unit,
              category: getCategory(ing.name)
            };
          }

          masterList[key].totalValue += (value * count);
        });
      });
    });
  });

  // Group by category and sort
  const grouped = {};
  Object.values(masterList).forEach(item => {
    if (!grouped[item.category]) grouped[item.category] = [];
    grouped[item.category].push(item);
  });

  // Sort categories by predefined order
  const sortedGrouped = {};
  CATEGORY_ORDER.forEach(cat => {
    if (grouped[cat]) {
      sortedGrouped[cat] = grouped[cat].sort((a, b) => a.name.localeCompare(b.name));
    }
  });

  return sortedGrouped;
};
