import React from 'react';
import { Info, Target, Layers, ArrowUpRight } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

export const WorkoutCard = ({ exercise, isFeatured = false }) => {
  const { name, setsReps, rir, tips, imageUrl } = exercise;

  return (
    <div className="relative bg-white/10 rounded-[3rem] p-8 shadow-[0_40px_100px_rgba(59,47,47,0.03)] border border-white/20 transition-all duration-500 hover:shadow-[0_50px_120px_rgba(59,47,47,0.06)] group w-full">
      
      {/* Main Grid Layout - Less Academic */}
      <div className="flex flex-col gap-8">
        
        <div className="flex flex-col gap-4">
          <div className="max-w-[85%]">
            <h3 className="text-2xl font-black text-brand-brown leading-[0.95] uppercase tracking-tighter transition-colors">
              {name}
            </h3>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {/* Glassy Bento Group for RIR, Volume & Feedback */}
          <div className="flex-grow flex flex-col gap-4 bg-white/30 backdrop-blur-md p-5 rounded-[2.5rem] border border-white/40 shadow-sm">
            
            {/* Unified RIR Block - Always in flow */}
            {rir !== '-' && (
              <div className="bg-brand-orange text-white p-4 rounded-[1.8rem] shadow-lg shadow-brand-orange/20 relative overflow-hidden group/rir border border-white/20">
                <div className="flex items-center gap-3 mb-1">
                  <Target size={14} strokeWidth={3} className="opacity-70" />
                  <span className="text-[8px] font-black uppercase tracking-[0.25em] opacity-80">RIR / Tempo</span>
                </div>
                <p className={twMerge(
                  "font-black leading-tight tracking-tight uppercase italic drop-shadow-sm line-clamp-3",
                  rir.length > 5 ? "text-sm" : "text-xl"
                )}>
                  {rir}
                </p>
                <Target size={80} className="absolute -right-6 -bottom-6 opacity-10 rotate-12 group-hover/rir:scale-110 transition-transform" />
              </div>
            )}

            {/* Volume Stats */}
            <div className="flex items-center gap-4 bg-brand-pink text-white p-4 rounded-[1.8rem] shadow-lg shadow-brand-pink/30 border border-white/20">
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Layers size={16} strokeWidth={3} />
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] font-black uppercase tracking-[0.2em] opacity-70">Volume</span>
                <span className="text-sm font-black tracking-tight">{setsReps}</span>
              </div>
            </div>

            {/* Feedback Section */}
            {tips && (
              <div className="bg-brand-brown/5 rounded-[1.8rem] p-5 border border-brand-brown/5 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-brand-brown/30">
                  <Info size={12} strokeWidth={3} />
                  <span className="text-[8px] font-black uppercase tracking-widest">Feedback</span>
                </div>
                <div className="space-y-3">
                  {tips.split('\n').filter(line => line.trim().length > 0).map((line, i) => (
                    <div key={i} className="flex items-start gap-3 group">
                      <div className="mt-2 w-1.5 h-1.5 rounded-full bg-brand-pink shrink-0" />
                      <p className="text-sm text-brand-brown/80 leading-relaxed font-bold">
                        {line.replace('- [ ]', '').replace('-', '').trim()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Image Block - Varied Size */}
          {imageUrl && (
            <div className="relative rounded-[2.8rem] overflow-hidden bg-gray-100/50 shadow-2xl ring-4 ring-white/50 transition-all duration-700 hover:scale-[1.02] backdrop-blur-sm w-full aspect-video">
              <img src={imageUrl} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-brown/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <ArrowUpRight size={24} className="absolute bottom-6 right-6 text-white opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500" />
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
