import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Terminal, Cpu, Brain, Network } from 'lucide-react';

const steps = [
  "Initializing Career Matrix Synthesis...",
  "Parsing Professional Profile DNA...",
  "Querying Global Labor Market Trends...",
  "Isolating Core Cognitive Strengths...",
  "Identifying Skill Gaps & Dependencies...",
  "Mapping Optimal Mastery Trajectory...",
  "Simulating Salary Growth Curves...",
  "Synthesizing Neural Graph Topology...",
  "Finalizing Career Roadmap..."
];

export default function ReasoningStream({ isGenerating }: { isGenerating: boolean }) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!isGenerating) {
      setCurrentStep(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [isGenerating]);

  if (!isGenerating) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full mt-6 p-4 rounded-xl bg-black/40 border border-white/5 font-mono text-[10px] space-y-3"
    >
      <div className="flex items-center justify-between text-gray-500 border-b border-white/5 pb-2">
        <div className="flex items-center gap-2">
          <Terminal className="w-3 h-3" />
          <span className="uppercase tracking-widest">Neural Reasoning Stream</span>
        </div>
        <div className="flex items-center gap-2">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_#00F5FF]"
          />
          <span className="text-primary uppercase">Active</span>
        </div>
      </div>

      <div className="space-y-2">
        {steps.slice(0, currentStep + 1).map((step, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 text-gray-400"
          >
            <span className="text-gray-700">[{i}]</span>
            <span className={i === currentStep ? "text-primary" : ""}>
              {step}
              {i === currentStep && (
                <motion.span 
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >
                  _
                </motion.span>
              )}
            </span>
          </motion.div>
        ))}
      </div>

      <div className="pt-2 flex gap-4">
        <div className="flex items-center gap-1.5 text-gray-600 uppercase tracking-tighter">
          <Cpu className="w-3 h-3" /> Flash-2.0
        </div>
        <div className="flex items-center gap-1.5 text-gray-600 uppercase tracking-tighter">
          <Brain className="w-3 h-3" /> NLP-Synth
        </div>
        <div className="flex items-center gap-1.5 text-gray-600 uppercase tracking-tighter">
          <Network className="w-3 h-3" /> Graph-Gen
        </div>
      </div>
    </motion.div>
  );
}
