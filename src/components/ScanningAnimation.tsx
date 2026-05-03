import { motion } from 'framer-motion';
import { Scan, FileText, Cpu, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ScanningAnimation({ 
  onComplete 
}: { 
  onComplete: () => void 
}) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setStep(1), 1500);
    const timer2 = setTimeout(() => setStep(2), 3500);
    const timer3 = setTimeout(() => {
      setStep(3);
      setTimeout(onComplete, 1000);
    }, 5000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cyber-dark-900/95 backdrop-blur-md">
      <div className="flex flex-col items-center max-w-md w-full p-8 text-center">
        
        <div className="relative mb-12">
          {/* Central Icon */}
          <motion.div 
            className="w-24 h-24 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center text-primary relative z-10"
            animate={{ scale: [1, 1.1, 1], boxShadow: ["0 0 0px #00f3ff", "0 0 40px #00f3ff", "0 0 0px #00f3ff"] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {step === 0 && <FileText className="w-10 h-10" />}
            {step === 1 && <Scan className="w-10 h-10" />}
            {step === 2 && <Cpu className="w-10 h-10" />}
            {step === 3 && <CheckCircle className="w-10 h-10 text-emerald-400" />}
          </motion.div>

          {/* Scanning Line */}
          {step < 3 && (
            <motion.div 
              className="absolute left-0 right-0 h-1 bg-primary z-20 shadow-[0_0_10px_#00f3ff]"
              initial={{ top: 0 }}
              animate={{ top: "100%" }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          )}

          {/* Glowing Rings */}
          <div className="absolute inset-0 rounded-full border border-primary/30 animate-ping" />
          <div className="absolute -inset-4 rounded-full border border-primary/10 animate-pulse" />
        </div>

        <h3 className="text-2xl font-bold text-white mb-2 font-outfit">
          {step === 0 && "Parsing Resume..."}
          {step === 1 && "Extracting Skills..."}
          {step === 2 && "Synthesizing Neural Map..."}
          {step === 3 && "Path Initialized!"}
        </h3>
        
        <p className="text-slate-400">
          {step === 0 && "Reading document structure and experience."}
          {step === 1 && "Identifying key competencies and gaps."}
          {step === 2 && "Generating optimal learning trajectory."}
          {step === 3 && "Preparing your dashboard."}
        </p>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-800 rounded-full mt-8 overflow-hidden">
          <motion.div 
            className="h-full bg-primary"
            initial={{ width: "0%" }}
            animate={{ width: step === 0 ? "25%" : step === 1 ? "50%" : step === 2 ? "85%" : "100%" }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </div>
  );
}
