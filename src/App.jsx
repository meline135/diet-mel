import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import DietPage from './pages/DietPage';
import HydrationPage from './pages/HydrationPage';
import WorkoutPage from './pages/WorkoutPage';

const MEL_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTPCZebU1Gv0st2F3VpD8WcLeqC3NZm55Ev8xYWLXijQ5nbgvpUg82izrB3PpMrrVmXxtgleuNh4WbV/pub?gid=0&single=true&output=csv';
const THOMAS_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ6xaF0JvNwMwhipjIcLgpL6U4ywwSFoBqZbKE4sHf0n5CsV7GqLe_kXXEK_brMiWE6vQOXkstEvS63/pub?gid=0&single=true&output=csv';
const MEL_WORKOUT_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR6kI3yYf6IusEj3I99th3IRDybNPN_RP8pakcJHp8yUqGfLmNbEqp5d1vBiimFHk4tCFpPPn01x8EE/pub?gid=0&single=true&output=csv';

export default function App() {
  return (
    <AppProvider>
      <Router>
        {/* Deep chic beige background (#F0ECE8) with matching selection color */}
        <div className="min-h-screen pb-16 flex justify-center text-gray-800 font-sans selection:bg-[#E2DED9] selection:text-[#3C322F]">
          <main className="w-full max-w-md relative z-10 px-4 bg-white/30 backdrop-blur-[50px] shadow-2xl border-x border-white/10 min-h-screen">
            <Routes>
              <Route 
                path="/" 
                element={<DietPage userId="mel" sheetUrl={MEL_SHEET_URL} title="Diet Mel" accentColor="pink" allowedOptions={[1, 2, 3, 4]} />} 
              />
              <Route 
                path="/diet-thomas" 
                element={<DietPage userId="thomas" sheetUrl={THOMAS_SHEET_URL} title="Diet Thomas" accentColor="blue" allowedOptions={['ON', 'OFF']} />} 
              />
              <Route path="/hydration" element={<HydrationPage />} />
              <Route path="/workout" element={<WorkoutPage sheetUrl={MEL_WORKOUT_SHEET_URL} />} />
            </Routes>
          </main>
          <Navbar />
        </div>
      </Router>
    </AppProvider>
  );
}

