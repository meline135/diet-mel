import { useState, useEffect } from 'react';
import Papa from 'papaparse';

/**
 * A custom hook to fetch and parse Workout CSV data.
 * @param {string} sheetCsvUrl - The published CSV URL of your Google Sheet.
 * @returns {object} { data, loading, error }
 */
export const useWorkoutData = (sheetCsvUrl) => {
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
          
          // CSV columns: Séance, Exercice, Série Reps, RIR, Conseil coach
          const groupedData = rawData.reduce((acc, row) => {
            const seanceRaw = row['Séance'];
            if (!seanceRaw) return acc;
            
            const seanceName = seanceRaw.trim();
            if (!acc[seanceName]) acc[seanceName] = [];
            
            acc[seanceName].push({
              name: row['Exercice'] || 'Sans nom',
              setsReps: row['Série Reps'] || '-',
              rir: row['RIR'] || '-',
              tips: row['Conseil coach'] || '',
              imageUrl: row['Image URL'] || '' // Optional if added later
            });
            
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
