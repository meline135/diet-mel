import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import DietPage from './pages/DietPage';
import HydrationPage from './pages/HydrationPage';

const MEL_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTPCZebU1Gv0st2F3VpD8WcLeqC3NZm55Ev8xYWLXijQ5nbgvpUg82izrB3PpMrrVmXxtgleuNh4WbV/pub?gid=0&single=true&output=csv';
const THOMAS_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ6xaF0JvNwMwhipjIcLgpL6U4ywwSFoBqZbKE4sHf0n5CsV7GqLe_kXXEK_brMiWE6vQOXkstEvS63/pub?gid=0&single=true&output=csv';

export default function App() {
  return (
    <AppProvider>
      <Router>
        {/* Pale pink background from references */}
        <div className="min-h-screen pb-16 flex justify-center text-gray-800 font-sans selection:bg-pink-200">
          <main className="w-full max-w-md relative z-10 px-4">
            <Routes>
              <Route path="/" element={<Navigate to="/diet-mel" replace />} />
              <Route 
                path="/diet-mel" 
                element={<DietPage userId="mel" sheetUrl={MEL_SHEET_URL} title="Diet Mel" accentColor="pink" />} 
              />
              <Route 
                path="/diet-thomas" 
                element={<DietPage userId="thomas" sheetUrl={THOMAS_SHEET_URL} title="Diet Thomas" accentColor="blue" />} 
              />
              <Route path="/hydration" element={<HydrationPage />} />
            </Routes>
          </main>
          <Navbar />
        </div>
      </Router>
    </AppProvider>
  );
}

