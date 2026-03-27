import React from 'react';
import { NavLink } from 'react-router-dom';
import { Utensils, Droplets } from 'lucide-react';

export const Navbar = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-200 z-50">
      <div className="max-w-md mx-auto px-12 py-3 flex justify-around items-center">
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            `flex flex-col items-center space-y-1 transition-colors ${isActive ? 'text-pink-500' : 'text-gray-400 hover:text-pink-300'}`
          }
        >
          <Utensils size={24} />
          <span className="text-xs font-bold uppercase tracking-wider mt-1">Nutrition</span>
        </NavLink>

        <NavLink 
          to="/hydration" 
          className={({ isActive }) => 
            `flex flex-col items-center space-y-1 transition-colors ${isActive ? 'text-pink-500' : 'text-gray-400 hover:text-pink-300'}`
          }
        >
          <Droplets size={24} />
          <span className="text-xs font-bold uppercase tracking-wider mt-1">Hydratation</span>
        </NavLink>
      </div>
    </nav>
  );
};
