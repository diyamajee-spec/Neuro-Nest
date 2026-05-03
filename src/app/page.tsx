'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Target, Sparkles, ArrowRight, BrainCircuit, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { loginAsGuest, user, isLoading } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [goal, setGoal] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !goal) return;

    setIsGenerating(true);
    
    // Simulate flow if no backend keys, but code is ready
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('dreamGoal', goal);
    formData.append('userId', user?.id || '');
    formData.append('isGuest', String(!user || user.is_guest));

    try {
      const res = await fetch('/api/generate-tree', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        router.push(`/dashboard/${data.treeId}`);
      }
    } catch (err) {
      console.error(err);
      // For demo purposes, redirect anyway if backend fails due to missing keys
      alert("Note: To run the AI generation, you need to set GEMINI_API_KEY and SUPABASE env vars. Redirecting to demo view.");
      router.push('/dashboard/demo');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-20 overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyber-dark-800 via-background to-background relative z-0">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center mb-12 relative z-10"
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6 backdrop-blur-md"
        >
          <Sparkles className="w-4 h-4" />
          <span>Powered by Gemini 2.5 Flash</span>
        </motion.div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-white via-cyan-100 to-primary bg-clip-text text-transparent font-outfit drop-shadow-[0_0_15px_rgba(0,243,255,0.3)]">
          Your Career Path,<br />Engineered by AI.
        </h1>
        <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto">
          Upload your resume and state your dream goal. Neuro-Nest builds a personalized mastery tree to get you there.
        </p>
      </motion.div>

      {/* Main Form */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-xl"
      >
        <form onSubmit={handleGenerate} className="glass-card p-8 space-y-6">
          {/* File Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <Upload className="w-4 h-4 text-primary" /> 1. Upload Resume (PDF)
            </label>
            <div 
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer
                ${file ? 'border-primary bg-primary/5' : 'border-slate-700 hover:border-primary/50'}`}
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <input 
                id="file-upload"
                type="file" 
                className="hidden" 
                accept=".pdf"
                onChange={(e: any) => setFile(e.target.files?.[0] || null)}
              />
              {file ? (
                <div className="text-primary font-medium">{file.name}</div>
              ) : (
                <div className="text-slate-400 hover:text-slate-300 transition-colors">Click to upload or drag and drop</div>
              )}
            </div>
          </div>

          {/* Dream Goal */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" /> 2. Your Dream Goal
            </label>
            <input 
              type="text" 
              placeholder="e.g. Senior AI Engineer at Google"
              className="w-full bg-gray-900 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary transition-all placeholder:text-slate-500"
              value={goal}
              onChange={(e: any) => setGoal(e.target.value)}
            />
          </div>

          {/* Submit */}
          {!user && !isLoading ? (
            <button 
              type="button"
              onClick={loginAsGuest}
              className="w-full flex items-center justify-center gap-2 glass-button !bg-slate-800 hover:!bg-slate-700 !text-slate-200"
            >
              <ShieldCheck className="w-5 h-5" />
              Continue as Guest
            </button>
          ) : (
            <button 
              type="submit"
              disabled={!file || !goal || isGenerating}
              className="w-full flex items-center justify-center gap-2 glass-button"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating Tree...
                </>
              ) : (
                <>
                  <BrainCircuit className="w-5 h-5" />
                  Initialize Path
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          )}
        </form>
      </motion.div>

      {/* Floating Elements (Visual Decoration) */}
      <div className="absolute top-1/4 left-10 w-32 h-32 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 right-10 w-48 h-48 bg-primary/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
    </div>
  );
}
