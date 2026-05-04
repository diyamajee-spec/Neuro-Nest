import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, DollarSign } from 'lucide-react';

export default function MarketPulse({ summary }: { summary?: string }) {
  return (
    <div className="glass-card p-6 border-l-2 border-l-emerald-500 relative overflow-hidden group">
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
            <BarChart3 className="w-4 h-4" />
          </div>
          <h3 className="font-black text-[10px] uppercase tracking-[0.3em] text-white">Market Alignment</h3>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
          <TrendingUp className="w-3 h-3" />
          High Demand
        </div>
      </div>

      <div className="space-y-4 relative z-10">
        <p className="text-[11px] text-gray-400 leading-relaxed font-medium line-clamp-3 italic">
          "{summary || "Analyzing current labor market benchmarks for your specific career trajectory..."}"
        </p>

        <div className="pt-2 grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/5">
              <DollarSign className="w-4 h-4 text-emerald-500" />
            </div>
            <div>
              <div className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Growth</div>
              <div className="text-xs font-black text-white">+24% YoY</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/5">
              <Users className="w-4 h-4 text-blue-500" />
            </div>
            <div>
              <div className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Openings</div>
              <div className="text-xs font-black text-white">12.5k+</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
