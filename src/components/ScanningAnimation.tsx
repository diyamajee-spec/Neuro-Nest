import { motion, AnimatePresence } from 'framer-motion';
import { Scan, FileText, Cpu, CheckCircle, BrainCircuit, Fingerprint } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ScanningAnimation({ 
  onComplete 
}: { 
  onComplete: () => void 
}) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setStep(1), 2000);
    const timer2 = setTimeout(() => setStep(2), 4500);
    const timer3 = setTimeout(() => {
      setStep(3);
      setTimeout(onComplete, 1500);
    }, 6500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  const messages = [
    { title: "Parsing Resume", desc: "Decoding professional matrix and syntax structure..." },
    { title: "Extracting Intelligence", desc: "Isolating high-value competencies and specialized skills..." },
    { title: "Neural Synthesis", desc: "Calculating optimal mastery trajectory and dependency graph..." },
    { title: "Sequence Complete", desc: "Neural map synchronized. Entering dashboard environment..." }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background overflow-hidden">
      {/* Background Neural Grid */}
      <div className="absolute inset-0 opacity-20" 
           style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #00F5FF 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      
      <div className="relative flex flex-col items-center max-w-lg w-full p-12 text-center">
        
        {/* Main Animation Container */}
        <div className="relative mb-16">
          {/* Outer Rotating Ring */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="w-48 h-48 rounded-full border border-dashed border-primary/20"
          />
          
          {/* Inner Pulsing Core */}
          <div className="absolute inset-4 rounded-full bg-primary/5 flex items-center justify-center border border-primary/10">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 1.5, opacity: 0, rotate: 20 }}
                className="text-primary"
              >
                {step === 0 && <FileText className="w-16 h-16" />}
                {step === 1 && <Fingerprint className="w-16 h-16" />}
                {step === 2 && <BrainCircuit className="w-16 h-16" />}
                {step === 3 && <CheckCircle className="w-16 h-16 text-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.5)]" />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Scanning Effect */}
          {step < 3 && (
            <motion.div 
              className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent z-20 shadow-[0_0_20px_#00F5FF]"
              initial={{ top: "0%" }}
              animate={{ top: "100%" }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          )}

          {/* Data Points Decoration */}
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary rounded-full"
              style={{ 
                top: `${50 + 40 * Math.sin(i * Math.PI / 2)}%`, 
                left: `${50 + 40 * Math.cos(i * Math.PI / 2)}%` 
              }}
              animate={{ scale: [1, 2, 1], opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
            />
          ))}
        </div>

        <div className="space-y-4">
          <motion.h3 
            key={messages[step].title}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-3xl font-black text-white font-outfit uppercase tracking-tighter"
          >
            {messages[step].title}
          </motion.h3>
          
          <motion.p 
            key={messages[step].desc}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-500 font-mono text-xs uppercase tracking-widest leading-relaxed max-w-xs mx-auto"
          >
            {messages[step].desc}
          </motion.p>
        </div>

        {/* Binary Stream Decoration */}
        <div className="absolute -left-20 top-0 bottom-0 w-10 flex flex-col items-center gap-2 opacity-10 pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.span 
              key={i}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1, delay: i * 0.1, repeat: Infinity }}
              className="text-[8px] text-primary font-mono"
            >
              {Math.random() > 0.5 ? '1' : '0'}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  );
}
