import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Utensils, Droplets, Heart, Dumbbell } from 'lucide-react';

export const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-white/60 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] shadow-[0_20px_50px_rgba(59,47,47,0.15)] z-50 px-4 py-3 ring-4 ring-black/5">
      <div className="flex justify-between items-center gap-1">
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            `flex flex-col items-center flex-1 py-1 rounded-[1.8rem] transition-all duration-300 ${isActive ? 'bg-brand-pink text-white shadow-lg shadow-brand-pink/30' : 'text-gray-400 hover:text-brand-pink'}`
          }
        >
          <Heart size={20} fill={location.pathname === '/' ? 'currentColor' : 'none'} />
          <span className="text-[8px] font-black uppercase tracking-widest mt-1">Nutrition</span>
        </NavLink>

        <NavLink 
          to="/workout" 
          className={({ isActive }) => 
            `flex flex-col items-center flex-1 py-1 rounded-[1.8rem] transition-all duration-300 ${isActive ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/30' : 'text-gray-400 hover:text-brand-orange'}`
          }
        >
          <Dumbbell size={20} />
          <span className="text-[8px] font-black uppercase tracking-widest mt-1">Sport</span>
        </NavLink>

        <NavLink 
          to="/diet-thomas" 
          className={({ isActive }) => 
            `flex flex-col items-center flex-1 py-1 rounded-[1.8rem] transition-all duration-300 ${isActive ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/30' : 'text-gray-400 hover:text-brand-blue'}`
          }
        >
          <Utensils size={20} />
          <span className="text-[8px] font-black uppercase tracking-widest mt-1">Thomas</span>
        </NavLink>

        <NavLink 
          to="/hydration" 
          className={({ isActive }) => 
            `flex flex-col items-center flex-1 py-1 rounded-[1.8rem] transition-all duration-300 ${isActive ? 'bg-brand-green text-white shadow-lg shadow-brand-green/30' : 'text-gray-400 hover:text-brand-green'}`
          }
        >
          <Droplets size={20} fill={location.pathname === '/hydration' ? 'currentColor' : 'none'} />
          <span className="text-[8px] font-black uppercase tracking-widest mt-1">Eau</span>
        </NavLink>
      </div>
    </nav>
  );
};

