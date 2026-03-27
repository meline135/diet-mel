import { useState, useEffect } from 'react';
import Papa from 'papaparse';

/**
 * A custom hook to fetch and parse Google Sheet CSV data.
 * @param {string} sheetCsvUrl - The published CSV URL of your Google Sheet.
 */
export const useSheetData = (sheetCsvUrl) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sheetCsvUrl) {
      setLoading(false);
      return;
    }

    Papa.parse(sheetCsvUrl, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const rawData = results.data;
          
          // The CSV columns are: ['Meal type', 'Option', 'Ingrédient', 'Quantité', 'Image URL']
          const groupedData = rawData.reduce((acc, row) => {
            const mealTypeRaw = row['Meal type'];
            if (!mealTypeRaw) return acc;
            
            // Standardize meal type key (e.g. "Petit-déjeuner" -> "petit-déjeuner")
            const mealType = mealTypeRaw.trim(); 
            const optionRaw = row['Option'];
            if (!optionRaw) return acc;
            const optionValue = String(optionRaw).trim(); // Support both "1" and "ON"
            
            if (!acc[mealType]) acc[mealType] = [];
            
            // Find if this option already exists in the mealType array
            let optionGroup = acc[mealType].find(opt => String(opt.optionNumber) === optionValue);
            
            if (!optionGroup) {
              optionGroup = {
                id: `${mealType}-${optionValue}`,
                optionNumber: optionValue,
                title: '', // We will set this based on the first ingredient
                calories: null, // No calories in sheet right now
                imageUrl: row['Image URL'] || '', 
                ingredients: []
              };
              acc[mealType].push(optionGroup);
            }
            
            // Add ingredient to the group
            const ingName = row['Ingrédient'];
            const ingQty = row['Quantité'];
            if (ingName) {
              if (optionGroup.ingredients.length === 0) {
                 // Set the title dynamically to the first ingredient's name (capitalized)
                 optionGroup.title = ingName.charAt(0).toUpperCase() + ingName.slice(1);
              }
              // If the main image is empty, grab the first valid ingredient image we find
              if (!optionGroup.imageUrl && row['Image URL']) {
                optionGroup.imageUrl = row['Image URL'];
              }
              
              optionGroup.ingredients.push({
                name: ingName,
                quantity: ingQty || '',
                imageUrl: row['Image URL'] || ''
              });
            }
            
            return acc;
          }, {});

          setData(groupedData);
          setLoading(false);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      },
      error: (error) => {
        setError(error.message);
        setLoading(false);
      }
    });
  }, [sheetCsvUrl]);

  return { data, loading, error };
};
