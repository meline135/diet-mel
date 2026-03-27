import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Utensils, Droplets, Heart } from 'lucide-react';

export const Navbar = () => {
  const location = useLocation();
  const isThomas = location.pathname.includes('thomas');
  const activeColor = isThomas ? 'text-[#3A8EBA]' : 'text-pink-500';
  const hoverColor = isThomas ? 'hover:text-blue-300' : 'hover:text-pink-300';

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-200 z-50">
      <div className="max-w-md mx-auto px-4 py-3 flex justify-around items-center">
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            `flex flex-col items-center space-y-1 transition-colors ${isActive ? 'text-pink-500' : 'text-gray-400 hover:text-pink-300'}`
          }
        >
          <Heart size={22} fill={location.pathname === '/' ? 'currentColor' : 'none'} />
          <span className="text-[10px] font-bold uppercase tracking-wider mt-1">Diet Mel</span>
        </NavLink>

        <NavLink 
          to="/diet-thomas" 
          className={({ isActive }) => 
            `flex flex-col items-center space-y-1 transition-colors ${isActive ? 'text-[#3A8EBA]' : 'text-gray-400 hover:text-blue-300'}`
          }
        >
          <Utensils size={22} />
          <span className="text-[10px] font-bold uppercase tracking-wider mt-1">Diet Thomas</span>
        </NavLink>

        <NavLink 
          to="/hydration" 
          className={({ isActive }) => 
            `flex flex-col items-center space-y-1 transition-colors ${isActive ? activeColor : 'text-gray-400 ' + hoverColor}`
          }
        >
          <Droplets size={22} fill={location.pathname === '/hydration' ? 'currentColor' : 'none'} />
          <span className="text-[10px] font-bold uppercase tracking-wider mt-1">Hydratation</span>
        </NavLink>
      </div>
    </nav>
  );
};

