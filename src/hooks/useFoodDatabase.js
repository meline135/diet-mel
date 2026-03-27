import { useState, useEffect } from 'react';
import Papa from 'papaparse';

// OFFICIAL URL: Master Food Database CSV
export const FOOD_DATABASE_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSIMyendwZuAesVW7CkyvzRjTuTmAFeieIjCeuCSPNo3OQ_99AmY1L7A3QbpHd2EBFA3rhGTvRO9TRg/pub?gid=565663186&single=true&output=csv';

export const useFoodDatabase = () => {
  const [db, setDb] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!FOOD_DATABASE_URL) {
      setLoading(false);
      return;
    }

    Papa.parse(FOOD_DATABASE_URL, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const rawData = results.data;
          // Filter out rows that don't have a food name
          const cleanedData = rawData.filter(row => row.Food_Name || row.food_name);
          setDb(cleanedData);
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
  }, []);

  return { db, loading, error };
};
