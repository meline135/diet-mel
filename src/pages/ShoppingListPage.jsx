import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useSheetData } from '../hooks/useSheetData';
import { ShoppingCart, ClipboardList, Plus, Minus, Trash2, CheckCircle2 } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { aggregateIngredients, getCategory } from '../utils/shoppingLogic';

const MEL_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTPCZebU1Gv0st2F3VpD8WcLeqC3NZm55Ev8xYWLXijQ5nbgvpUg82izrB3PpMrrVmXxtgleuNh4WbV/pub?gid=0&single=true&output=csv';
const THOMAS_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ6xaF0JvNwMwhipjIcLgpL6U4ywwSFoBqZbKE4sHf0n5CsV7GqLe_kXXEK_brMiWE6vQOXkstEvS63/pub?gid=0&single=true&output=csv';

export default function ShoppingListPage() {
  const { userStates, shoppingCart, updateCart, clearCart } = useAppContext();
  const { data: melData, loading: melLoading } = useSheetData(MEL_SHEET_URL);
  const { data: thomasData, loading: thomasLoading } = useSheetData(THOMAS_SHEET_URL);

  const [view, setView] = useState('select'); // 'select' or 'list'
  const [isGenerating, setIsGenerating] = useState(false);
  const [checkedItems, setCheckedItems] = useState({});

  const melCart = shoppingCart.mel || { 1: 0, 2: 0, 3: 0, 4: 0 };
  const thomasCart = shoppingCart.thomas || { 'ON': 0, 'OFF': 0 };

  const totalItemsInCart = Object.values(melCart).reduce((a, b) => a + b, 0) + 
                           Object.values(thomasCart).reduce((a, b) => a + b, 0);

  const handleGenerate = () => {
    if (totalItemsInCart > 0) {
      setIsGenerating(true);
      setTimeout(() => {
        setIsGenerating(false);
        setView('list');
      }, 2500); // 2.5s animation
    }
  };

  const toggleCheck = (name) => {
    setCheckedItems(prev => ({ ...prev, [name]: !prev[name] }));
  };

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] animate-in fade-in duration-500">
        <div className="relative w-64 h-32 mb-8 overflow-hidden">
          {/* Falling Items */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 flex gap-4">
            <span className="text-2xl animate-bounce-custom [animation-delay:-0.2s]">🍎</span>
            <span className="text-2xl animate-bounce-custom [animation-delay:-0.5s]">🥦</span>
            <span className="text-2xl animate-bounce-custom">🥕</span>
            <span className="text-2xl animate-bounce-custom [animation-delay:-0.8s]">🍌</span>
          </div>

          {/* Rolling Cart */}
          <div className="absolute bottom-0 left-0 text-5xl animate-roll-cart text-green-500">
             🛒
          </div>
          <div className="absolute bottom-0 w-full h-1 bg-gray-200/50 rounded-full" />
        </div>
        
        <h2 className="text-xl font-black text-gray-800 tracking-tight text-center">
          On remplit le panier...
        </h2>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-3">Calcul en cours</p>

        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes bounce-custom {
            0%, 100% { transform: translateY(-50px) rotate(0deg); opacity: 0; }
            50% { opacity: 1; }
            80% { transform: translateY(15px) rotate(360deg); opacity: 1; }
          }
          @keyframes roll-cart {
            0% { transform: translateX(-60px) rotate(-10deg); }
            50% { transform: translateX(110px) rotate(10deg); }
            100% { transform: translateX(280px) rotate(-10deg); }
          }
          .animate-bounce-custom { animation: bounce-custom 1.2s infinite ease-in; }
          .animate-roll-cart { animation: roll-cart 2.5s linear infinite; }
        `}} />
      </div>
    );
  }

  if (view === 'list') {
    const allData = { mel: melData, thomas: thomasData };
    const selectedPlans = { mel: melCart, thomas: thomasCart };
    
    // Aggregation logic (base menu only)
    const categorizedIngredients = aggregateIngredients(selectedPlans, allData);
    const allIngredientsList = Object.values(categorizedIngredients).flat();
    const checkedCount = allIngredientsList.filter(item => checkedItems[item.name]).length;
    const progress = allIngredientsList.length > 0 ? (checkedCount / allIngredientsList.length) * 100 : 0;

    const categoryStyles = {
      'Légumes': { color: 'text-emerald-500', dot: 'bg-emerald-500' },
      'Fruits': { color: 'text-cyan-500', dot: 'bg-cyan-500' },
      'Viande/Poisson': { color: 'text-orange-500', dot: 'bg-orange-500' },
      'Produits laitiers': { color: 'text-amber-500', dot: 'bg-amber-500' },
      'Petit déj': { color: 'text-purple-400', dot: 'bg-purple-400' },
      'Boissons': { color: 'text-blue-500', dot: 'bg-blue-500' },
      'Sauces': { color: 'text-red-500', dot: 'bg-red-500' },
      'Glucides': { color: 'text-stone-500', dot: 'bg-stone-500' },
      'Épicerie': { color: 'text-rose-700', dot: 'bg-rose-700' },
      'Autres': { color: 'text-gray-400', dot: 'bg-gray-400' }
    };

    return (
      <div className="pb-32 pt-6 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-md mx-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Ma Liste</h1>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-1">
              {checkedCount} / {allIngredientsList.length} articles récupérés
            </p>
          </div>
          <button 
            onClick={() => setView('select')}
            className="p-3 rounded-2xl bg-white shadow-sm border border-gray-100 text-gray-400 hover:text-pink-500 transition-all active:scale-95"
          >
            <ShoppingCart size={20} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-white/50 border border-white rounded-full mb-10 overflow-hidden shadow-inner p-0.5">
          <div 
            className="h-full bg-gradient-to-r from-pink-500 to-rose-400 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {Object.entries(categorizedIngredients).map(([category, items]) => {
          const style = categoryStyles[category] || categoryStyles.Autres;
          return (
            <div key={category} className="mb-10 animate-in fade-in slide-in-from-left-4 duration-700">
              <h3 className={twMerge("text-xs font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2", style.color)}>
                 <span className={twMerge("w-2 h-2 rounded-full", style.dot)}></span>
                 {category}
              </h3>
              
              <div className="bg-white/60 backdrop-blur-md rounded-[2.5rem] border border-white p-6 shadow-sm space-y-5">
                {items.map(item => {
                  const isChecked = checkedItems[item.name];
                  return (
                    <div 
                      key={item.name} 
                      onClick={() => toggleCheck(item.name)}
                      className="flex items-center gap-4 cursor-pointer group"
                    >
                      <div className={twMerge(
                        "w-6 h-6 rounded-xl border-2 flex items-center justify-center transition-all",
                        isChecked ? "bg-emerald-500 border-emerald-500 shadow-md scale-95" : "border-gray-100 bg-white group-hover:border-pink-200"
                      )}>
                        {isChecked && <CheckCircle2 size={14} className="text-white" />}
                      </div>
                      
                      <div className="flex flex-col flex-1">
                        <span className={twMerge(
                          "text-sm font-black transition-all",
                          isChecked ? "text-gray-300 line-through decoration-gray-200" : "text-gray-700"
                        )}>
                          {item.name}
                        </span>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-tight">
                          {item.totalValue} {item.unit}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        <button 
          onClick={() => { setView('select'); clearCart(); setCheckedItems({}); }}
          className="mt-10 py-4 px-6 rounded-3xl bg-gray-900 text-white text-[10px] font-black uppercase tracking-[0.2em] block text-center w-full shadow-xl hover:bg-black transition-all active:scale-95"
        >
          Nouvelle Liste
        </button>
      </div>
    );
  }

  // SELECTION VIEW
  return (
    <div className="pb-32 pt-6 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-md mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Panier Courses</h1>
        <p className="text-gray-400 text-xs font-medium mt-2">Sélectionne les jours à préparer.</p>
      </header>

      {/* Mel Section */}
      <div className="mb-10">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-pink-500 mb-4">OPTIONS MÉLINE</h3>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(num => (
            <div key={num} className="bg-white p-4 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col items-center gap-3">
              <span className="text-[11px] font-black text-gray-400">OPTION {num}</span>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => updateCart('mel', num, -1)}
                  className="w-10 h-10 rounded-full flex items-center justify-center border text-gray-400 hover:bg-gray-50 active:scale-90 transition-all font-bold"
                >
                  <Minus size={16} />
                </button>
                <span className="text-lg font-black text-gray-800 w-4 text-center">{melCart[num] || 0}</span>
                <button 
                  onClick={() => updateCart('mel', num, 1)}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-pink-500 text-white shadow-md active:scale-90 transition-all font-bold"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Thomas Section */}
      <div className="mb-12">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-[#3A8EBA] mb-4">OPTIONS THOMAS</h3>
        <div className="grid grid-cols-2 gap-4">
          {['ON', 'OFF'].map(type => (
            <div key={type} className="bg-white p-4 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col items-center gap-3">
              <span className="text-[11px] font-black text-gray-400">JOUR {type}</span>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => updateCart('thomas', type, -1)}
                  className="w-10 h-10 rounded-full flex items-center justify-center border text-gray-400 hover:bg-gray-50 active:scale-90 transition-all font-bold"
                >
                  <Minus size={16} />
                </button>
                <span className="text-lg font-black text-gray-800 w-4 text-center">{thomasCart[type] || 0}</span>
                <button 
                  onClick={() => updateCart('thomas', type, 1)}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-[#3A8EBA] text-white shadow-md active:scale-90 transition-all font-bold"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button 
        disabled={totalItemsInCart === 0}
        onClick={handleGenerate}
        className={twMerge(
          "py-5 px-6 rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] block text-center w-full shadow-2xl transition-all active:scale-95",
          totalItemsInCart > 0 ? "bg-pink-500 text-white hover:bg-pink-600" : "bg-gray-100 text-gray-300 pointer-events-none"
        )}
      >
        Générer la liste ({totalItemsInCart})
      </button>

      {totalItemsInCart > 0 && (
        <button 
          onClick={clearCart}
          className="mt-6 text-[9px] font-black text-red-300 hover:text-red-500 uppercase tracking-widest text-center w-full transition-colors flex items-center justify-center gap-2"
        >
          <Trash2 size={12} /> Vider le panier
        </button>
      )}
    </div>
  );
}
