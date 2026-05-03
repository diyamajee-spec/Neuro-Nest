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
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-20 overflow-hidden">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-6">
          <Sparkles className="w-4 h-4" />
          <span>Powered by Gemini 1.5 Pro</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent font-outfit">
          Your Career Path,<br />Engineered by AI.
        </h1>
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
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
              <Upload className="w-4 h-4" /> 1. Upload Resume (PDF)
            </label>
            <div 
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer
                ${file ? 'border-indigo-500 bg-indigo-500/5' : 'border-slate-700 hover:border-slate-600'}`}
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
                <div className="text-indigo-400 font-medium">{file.name}</div>
              ) : (
                <div className="text-slate-500">Click to upload or drag and drop</div>
              )}
            </div>
          </div>

          {/* Dream Goal */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <Target className="w-4 h-4" /> 2. Your Dream Goal
            </label>
            <input 
              type="text" 
              placeholder="e.g. Senior AI Engineer at Google"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              value={goal}
              onChange={(e: any) => setGoal(e.target.value)}
            />
          </div>

          {/* Submit */}
          {!user && !isLoading ? (
            <button 
              type="button"
              onClick={loginAsGuest}
              className="w-full flex items-center justify-center gap-2 glass-button !bg-slate-800 hover:!bg-slate-700"
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
      <div className="absolute top-1/4 left-10 w-24 h-24 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-rose-500/20 rounded-full blur-3xl animate-pulse" />
    </div>
  );
}
