import { motion } from 'framer-motion';
import { FileText, TrendingUp, Sparkles } from 'lucide-react';

export default function ResumeEvolver({ 
  progress 
}: { 
  progress: number 
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 border-t-4 border-t-primary relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2 text-primary">
          <FileText className="w-5 h-5" />
          <h3 className="font-bold text-sm uppercase tracking-wider">Resume Evolver</h3>
        </div>
        <div className="flex items-center gap-1 text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded text-xs font-bold">
          <TrendingUp className="w-3 h-3" />
          +{Math.round(progress)}% Match Rate
        </div>
      </div>

      <div className="space-y-4 relative z-10">
        <div className="p-3 rounded bg-cyber-dark-900 border border-slate-800 flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" />
          <div>
            <div className="text-xs text-slate-400 mb-1">New Keywords Unlocked</div>
            <div className="flex flex-wrap gap-1">
              {progress > 10 ? <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">React Hooks</span> : null}
              {progress > 30 ? <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">Next.js</span> : null}
              {progress > 60 ? <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">LLM Integration</span> : null}
              {progress <= 10 ? <span className="text-xs text-slate-500 italic">Complete nodes to unlock...</span> : null}
            </div>
          </div>
        </div>

        <div className="p-3 rounded bg-cyber-dark-900 border border-slate-800">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-slate-400">Market Value Projection</span>
            <span className="text-white font-bold">
              ${Math.round(80000 + (progress * 500)).toLocaleString()}
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-primary to-emerald-400"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
