import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Brain, BookOpen } from 'lucide-react';

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
  return (
    <AnimatePresence>
      {isOpen && node && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          />
          
          {/* Drawer */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-cyber-dark-900 border-l border-slate-800 z-50 p-6 shadow-2xl overflow-y-auto"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-800 text-slate-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6 text-primary mt-8">
              <Brain className="w-6 h-6" />
              <span className="font-bold tracking-widest text-sm uppercase">Skill Insight</span>
            </div>
            
            <h2 className="text-3xl font-bold mb-4 font-outfit text-white">{node.label}</h2>
            <p className="text-slate-400 mb-8 leading-relaxed">
              {node.description || "Master this skill to unlock your career potential and advance further up your neural map."}
            </p>
            
            <div className="space-y-6">
              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 shadow-inner">
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-4 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" /> Recommended Resources
                </h4>
                <ul className="space-y-3 text-sm text-slate-300">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                    <span>Official Documentation Deep Dive</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                    <span>Interactive Scrimba Course</span>
                  </li>
                </ul>
              </div>
              
              {node.status !== 'completed' && node.status !== 'locked' && (
                <button 
                  onClick={onTakeQuiz}
                  className="w-full glass-button flex items-center justify-center gap-2 py-4 text-lg"
                >
                  <Play className="w-5 h-5 fill-current" />
                  Initiate Mastery Quiz
                </button>
              )}

              {node.status === 'completed' && (
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/30 text-primary text-center font-bold">
                  Skill Mastered
                </div>
              )}

              {node.status === 'locked' && (
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-500 text-center font-bold">
                  Prerequisites required
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
