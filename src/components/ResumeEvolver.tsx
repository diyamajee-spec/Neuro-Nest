import { motion } from 'framer-motion';
import { FileText, TrendingUp, Sparkles, Zap } from 'lucide-react';

export default function ResumeEvolver({ 
  progress 
}: { 
  progress: number 
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass-card p-6 border-l-2 border-l-primary relative overflow-hidden group"
    >
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/10 transition-colors duration-700" />
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/20 text-primary">
            <Zap className="w-4 h-4" />
          </div>
          <h3 className="font-black text-[10px] uppercase tracking-[0.3em] text-white">Evolver Core</h3>
        </div>
        <motion.div 
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex items-center gap-1.5 text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest"
        >
          <TrendingUp className="w-3 h-3" />
          +{Math.round(progress)}% Strength
        </motion.div>
      </div>

      <div className="space-y-5 relative z-10">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            <Sparkles className="w-3 h-3" /> Synthesis Progress
          </div>
          <div className="relative w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary via-primary to-secondary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
            <motion.div 
              className="absolute top-0 left-0 h-full w-20 bg-white/30 blur-sm"
              animate={{ x: ['-100%', '400%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
            <div className="text-[9px] font-bold text-gray-500 uppercase mb-1">Market Match</div>
            <div className="text-sm font-black text-white">{Math.round(65 + (progress * 0.3))}%</div>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
            <div className="text-[9px] font-bold text-gray-500 uppercase mb-1">Salary Tier</div>
            <div className="text-sm font-black text-white">${Math.round(85 + (progress * 0.8))}k</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {progress > 10 && (
            <motion.span 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-[9px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider"
            >
              React-19
            </motion.span>
          )}
          {progress > 40 && (
            <motion.span 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-[9px] bg-secondary/10 text-secondary border border-secondary/20 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider"
            >
              AI-Agents
            </motion.span>
          )}
          {progress > 75 && (
            <motion.span 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-[9px] bg-accent/10 text-accent border border-accent/20 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider"
            >
              Architecture
            </motion.span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
