import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import NutritionPage from './pages/NutritionPage';
import HydrationPage from './pages/HydrationPage';

export default function App() {
  return (
    <AppProvider>
      <Router>
        {/* Pale pink background from references */}
        <div className="min-h-screen pb-16 flex justify-center text-gray-800 font-sans selection:bg-pink-200">
          <main className="w-full max-w-md relative z-10 px-4">
            <Routes>
              <Route path="/" element={<NutritionPage />} />
              <Route path="/hydration" element={<HydrationPage />} />
            </Routes>
          </main>
          <Navbar />
        </div>
      </Router>
    </AppProvider>
  );
}
