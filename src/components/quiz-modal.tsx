'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, ArrowRight, BrainCircuit, Sparkles, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuizModalProps {
  node: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function QuizModal({ node, onClose, onSuccess }: QuizModalProps) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState(0); // 0: loading, 1: quiz, 2: results
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [scoring, setScoring] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await fetch(`/api/get-quiz?nodeId=${node.id}`);
        const data = await res.json();
        if (data.quiz) {
          setQuestions(data.quiz);
          setCurrentStep(1);
        } else {
          // Mock data for demo if API fails
          setQuestions([
            {
              question: `Which architectural pattern is most critical for ${node.label}?`,
              options: ["Atomic Design Synthesis", "Micro-kernel Integration", "Linear Sequential Flow", "Distributed State Propagation"],
              correctAnswer: 0,
              explanation: "Atomic Design Synthesis allows for the most modular and scalable architecture in this context."
            },
            {
              question: `How does ${node.label} typically handle neural concurrency?`,
              options: ["Synchronous Blocking", "Event-Loop Delegation", "Recursive Threading", "Manual Memory Locking"],
              correctAnswer: 1,
              explanation: "Event-loop delegation ensures non-blocking operations which is vital for neural processing."
            },
            {
              question: "What is the primary cognitive load optimizer in this skill?",
              options: ["Lazy-Loading Abstraction", "Strict Type Enforcement", "Heuristic Caching", "Bi-directional Mapping"],
              correctAnswer: 2,
              explanation: "Heuristic caching significantly reduces re-calculation costs and optimizes performance."
            }
          ]);
          setCurrentStep(1);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [node]);

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...userAnswers, optionIndex];
    setUserAnswers(newAnswers);
  };

  const currentQuestionIndex = userAnswers.length;

  const handleSubmit = async () => {
    setScoring(true);
    // Simulate API delay for dramatic effect
    await new Promise(r => setTimeout(r, 1500));
    
    try {
      const res = await fetch('/api/score-quiz', {
        method: 'POST',
        body: JSON.stringify({
          nodeId: node.id,
          answers: userAnswers,
          questions: questions,
          isGuest: true
        }),
      });
      const data = await res.json();
      setResult(data);
      setCurrentStep(2);
    } catch (err) {
      const correct = userAnswers.filter((a: any, i: number) => a === questions[i].correctAnswer).length;
      const passed = correct >= 2;
      setResult({ 
        passed, 
        score: Math.round((correct/questions.length)*100), 
        feedback: passed 
          ? "Exceptional performance. Your cognitive alignment with this node is confirmed." 
          : "Neural synchronization failed. Review the curriculum assets and re-attempt." 
      });
      setCurrentStep(2);
    } finally {
      setScoring(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-xl"
        onClick={onClose}
      />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative w-full max-w-2xl bg-surface/90 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)]"
      >
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-secondary to-primary" />
        
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-white uppercase tracking-tighter text-xl">
                Mastery Validation
              </h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Node: {node.label}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-gray-400 hover:text-white transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-10">
          {currentStep === 0 && (
            <div className="py-20 flex flex-col items-center gap-6">
              <div className="relative">
                <div className="w-16 h-16 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                </div>
              </div>
              <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-xs">Generating Neural Assessment...</p>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-10">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <div className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Evaluation Progress</div>
                  <div className="text-2xl font-black text-white font-outfit">
                    Question {currentQuestionIndex + 1}<span className="text-gray-600"> / {questions.length}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-1">Status</div>
                  <div className="text-sm font-bold text-emerald-400">SYNCED</div>
                </div>
              </div>
              
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
                  className="bg-primary h-full shadow-[0_0_15px_rgba(0,245,255,0.5)] transition-all duration-500"
                />
              </div>

              <AnimatePresence mode="wait">
                {currentQuestionIndex < questions.length ? (
                  <motion.div 
                    key={currentQuestionIndex}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    className="space-y-8"
                  >
                    <h4 className="text-2xl font-bold font-outfit leading-snug text-white tracking-tight">
                      {questions[currentQuestionIndex].question}
                    </h4>
                    <div className="grid grid-cols-1 gap-4">
                      {questions[currentQuestionIndex].options.map((option: any, i: number) => (
                        <button
                          key={i}
                          onClick={() => handleAnswer(i)}
                          className="w-full text-left p-6 rounded-3xl border border-white/5 bg-white/5 hover:border-primary/50 hover:bg-primary/5 transition-all group flex items-center justify-between"
                        >
                          <span className="text-gray-400 group-hover:text-white font-medium transition-colors">{option}</span>
                          <div className="w-6 h-6 rounded-full border-2 border-white/10 group-hover:border-primary transition-colors flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="py-10 flex flex-col items-center gap-8"
                  >
                    <div className="p-6 rounded-full bg-primary/10 text-primary border border-primary/20">
                      <CheckCircle2 className="w-12 h-12" />
                    </div>
                    <div className="text-center">
                      <h4 className="text-2xl font-black text-white uppercase tracking-tight mb-2">Analysis Complete</h4>
                      <p className="text-gray-500 text-sm">All response patterns have been recorded.</p>
                    </div>
                    <button 
                      onClick={handleSubmit}
                      disabled={scoring}
                      className="glass-button w-full py-5 text-sm uppercase tracking-[0.3em] font-black"
                    >
                      {scoring ? "Processing Neural Link..." : "Initialize Scoring Sequence"}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {currentStep === 2 && result && (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="py-6 text-center space-y-8"
            >
              <div className="relative inline-block">
                <div className={cn(
                  "mx-auto w-24 h-24 rounded-full flex items-center justify-center",
                  result.passed ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                )}>
                  {result.passed ? <Trophy className="w-12 h-12" /> : <AlertCircle className="w-12 h-12" />}
                </div>
                {result.passed && (
                  <motion.div 
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-full bg-emerald-400/20 blur-xl"
                  />
                )}
              </div>
              
              <div>
                <h4 className="text-4xl font-black mb-3 font-outfit tracking-tight text-white uppercase">
                  {result.passed ? "Alignment Success" : "Alignment Failed"}
                </h4>
                <div className="text-5xl font-black text-primary mb-4">{result.score}%</div>
                <p className="text-gray-400 max-w-xs mx-auto leading-relaxed text-sm">{result.feedback}</p>
              </div>

              <div className="flex gap-4">
                {result.passed ? (
                  <button onClick={onSuccess} className="glass-button flex-1 py-4 text-xs uppercase tracking-widest font-black">
                    Establish Cognitive Link
                  </button>
                ) : (
                  <button onClick={() => { setUserAnswers([]); setCurrentStep(1); }} className="flex-1 py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-xs font-black uppercase tracking-widest text-white transition-all border border-white/10">
                    Re-Initialize Test
                  </button>
                )}
                <button onClick={onClose} className="px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] text-gray-500 border border-white/5 hover:bg-white/5 transition-all">
                  Dismiss
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
