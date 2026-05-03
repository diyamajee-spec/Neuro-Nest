import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Brain, BookOpen, Sparkles, CheckCircle2, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SkillBlade({ 
  isOpen, 
  node, 
  onClose, 
  onTakeQuiz 
}: { 
  isOpen: boolean; 
  node: any; 
  onClose: () => void;
  onTakeQuiz: () => void;
}) {
  const status = node?.status || 'locked';
  const isMastered = status === 'mastered' || status === 'completed';
  const isLocked = status === 'locked';

  return (
    <AnimatePresence>
      {isOpen && node && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-md"
          />
          
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-lg bg-surface/90 border-l border-white/5 z-[70] p-8 shadow-[ -20px_0_50px_rgba(0,0,0,0.5)] overflow-y-auto"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            
            <button 
              onClick={onClose}
              className="absolute top-8 right-8 p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all group"
            >
              <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            </button>

            <div className="flex items-center gap-2 mb-10 text-primary">
              <div className="p-2 rounded-lg bg-primary/10">
                <Brain className="w-5 h-5" />
              </div>
              <span className="font-bold tracking-[0.3em] text-[10px] uppercase">Neural Analysis</span>
            </div>
            
            <div className="mb-12">
              <h2 className="text-4xl font-black mb-4 font-outfit text-white tracking-tight">
                {node.label}
              </h2>
              <div className="flex items-center gap-3">
                <span className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                  isMastered ? "bg-primary/10 border-primary/30 text-primary" :
                  isLocked ? "bg-white/5 border-white/10 text-gray-500" :
                  "bg-secondary/10 border-secondary/30 text-secondary"
                )}>
                  {status}
                </span>
                <span className="text-gray-600 text-xs font-medium uppercase tracking-widest">
                  {node.category || 'Skill Node'}
                </span>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">Core Intelligence</h4>
                <p className="text-gray-300 text-lg leading-relaxed font-light">
                  {node.description || "Synthesizing this node will provide fundamental capabilities required for your career trajectory."}
                </p>
              </div>
              
              <div className="p-6 rounded-2xl bg-white/5 border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <BookOpen className="w-12 h-12" />
                </div>
                <h4 className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Curriculum Assets
                </h4>
                <ul className="space-y-4">
                  {[
                    "Mastery Documentation & Specs",
                    "Advanced Implementation Patterns",
                    "Architectural Case Studies"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors cursor-default">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="pt-8">
                {!isMastered && !isLocked && (
                  <button 
                    onClick={onTakeQuiz}
                    className="w-full glass-button group py-5 text-sm uppercase tracking-[0.3em] font-black"
                  >
                    <span className="flex items-center justify-center gap-3">
                      <Play className="w-4 h-4 fill-current group-hover:translate-x-1 transition-transform" />
                      Engage Mastery Test
                    </span>
                  </button>
                )}

                {isMastered && (
                  <div className="p-5 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center gap-3 text-primary font-black uppercase tracking-[0.2em] text-xs">
                    <CheckCircle2 className="w-5 h-5" />
                    Cognitive Link Established
                  </div>
                )}

                {isLocked && (
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center gap-3 text-gray-500 font-black uppercase tracking-[0.2em] text-xs">
                    <Lock className="w-5 h-5" />
                    Neural Path Obstructed
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
