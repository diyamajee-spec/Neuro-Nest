'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

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
              question: `Which of the following is a key concept in ${node.label}?`,
              options: ["Virtual DOM", "Direct DOM manipulation", "Manual memory management", "jQuery"],
              correctAnswer: 0
            },
            {
              question: `How do you typically handle state in ${node.label}?`,
              options: ["Global variables", "useState hook", "Cookies only", "Redux always"],
              correctAnswer: 1
            },
            {
              question: "What is the primary benefit of this skill?",
              options: ["Faster development", "Lower performance", "More code", "Browser incompatibility"],
              correctAnswer: 0
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

    if (newAnswers.length < questions.length) {
      // Move to next question? Not needed if showing all at once or one by one
    }
  };

  const currentQuestionIndex = userAnswers.length;

  const handleSubmit = async () => {
    setScoring(true);
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
      // Mock result for demo
      const correct = userAnswers.filter((a: any, i: number) => a === questions[i].correctAnswer).length;
      const passed = correct >= 2;
      setResult({ passed, score: (correct/3)*100, feedback: passed ? "Excellent work! You've mastered this node." : "Keep practicing and try again." });
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
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative w-full max-w-2xl glass-card overflow-hidden"
      >
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <h3 className="font-bold text-xl flex items-center gap-2">
            <Brain className="w-5 h-5 text-indigo-400" />
            Mastery Quiz: {node.label}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8">
          {currentStep === 0 && (
            <div className="py-12 flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
              <p className="text-slate-400 font-medium">Generating adaptive questions...</p>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-8">
              <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase tracking-widest">
                <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                <span>{Math.round((currentQuestionIndex / questions.length) * 100)}% Complete</span>
              </div>
              
              <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentQuestionIndex / questions.length) * 100}%` }}
                  className="bg-indigo-500 h-full"
                />
              </div>

              {currentQuestionIndex < questions.length ? (
                <div className="space-y-6">
                  <h4 className="text-2xl font-bold font-outfit leading-tight">
                    {questions[currentQuestionIndex].question}
                  </h4>
                  <div className="grid grid-cols-1 gap-3">
                    {questions[currentQuestionIndex].options.map((option: any, i: number) => (
                      <button
                        key={i}
                        onClick={() => handleAnswer(i)}
                        className="w-full text-left p-4 rounded-xl border border-slate-800 bg-slate-950/50 hover:border-indigo-500 hover:bg-indigo-500/5 transition-all group flex items-center justify-between"
                      >
                        <span className="text-slate-300 group-hover:text-white transition-colors">{option}</span>
                        <div className="w-6 h-6 rounded-full border border-slate-700 group-hover:border-indigo-500 transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-8 flex flex-col items-center gap-6">
                  <p className="text-lg text-slate-300">All questions answered!</p>
                  <button 
                    onClick={handleSubmit}
                    disabled={scoring}
                    className="glass-button w-full max-w-xs"
                  >
                    {scoring ? "Evaluating Performance..." : "Submit for Evaluation"}
                  </button>
                </div>
              )}
            </div>
          )}

          {currentStep === 2 && result && (
            <div className="py-8 text-center space-y-6">
              <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center ${result.passed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                {result.passed ? <CheckCircle2 className="w-12 h-12" /> : <AlertCircle className="w-12 h-12" />}
              </div>
              
              <div>
                <h4 className="text-3xl font-bold mb-2">
                  {result.passed ? "Mastery Achieved!" : "Mastery Pending"}
                </h4>
                <p className="text-slate-400">{result.feedback}</p>
              </div>

              <div className="flex gap-4 justify-center">
                {result.passed ? (
                  <button onClick={onSuccess} className="glass-button">
                    Unlock Next Node
                  </button>
                ) : (
                  <button onClick={() => { setUserAnswers([]); setCurrentStep(1); }} className="glass-button !bg-slate-800">
                    Try Again
                  </button>
                )}
                <button onClick={onClose} className="px-6 py-3 rounded-full font-medium border border-slate-800 hover:bg-slate-800 transition-colors">
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function Brain(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .52 5.886 3 3 0 1 0 5.174 2.138h1.828a3 3 0 1 0 5.174-2.138 4 4 0 0 0 .52-5.886 4 4 0 0 0-2.526-5.77A3 3 0 1 0 12 5z" />
      <path d="M9 13a4.5 4.5 0 0 0 3 4" />
      <path d="M15 13a4.5 4.5 0 0 1-3 4" />
      <path d="M12 5v4" />
    </svg>
  )
}
