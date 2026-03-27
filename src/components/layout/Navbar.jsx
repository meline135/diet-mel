import React from 'react';
import { NavLink } from 'react-router-dom';
import { Utensils, Droplets, Home, User } from 'lucide-react';

export const Navbar = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-200 z-50">
      <div className="max-w-md mx-auto px-6 py-3 flex justify-between items-center">
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            `flex flex-col items-center space-y-1 transition-colors ${isActive ? 'text-pink-500' : 'text-gray-400'}`
          }
        >
          <Utensils size={24} />
          <span className="text-xs font-medium">Nutrition</span>
        </NavLink>

        <NavLink 
          to="/hydration" 
          className={({ isActive }) => 
            `flex flex-col items-center space-y-1 transition-colors ${isActive ? 'text-pink-500' : 'text-gray-400'}`
          }
        >
          <Droplets size={24} />
          <span className="text-xs font-medium">Hydration</span>
        </NavLink>

        {/* Placeholder icons for future app expansion */}
        <button className="flex flex-col items-center space-y-1 text-gray-400">
          <Home size={24} />
          <span className="text-xs font-medium">Home</span>
        </button>
        <button className="flex flex-col items-center space-y-1 text-gray-400">
          <User size={24} />
          <span className="text-xs font-medium">Profile</span>
        </button>
      </div>
    </nav>
  );
};
