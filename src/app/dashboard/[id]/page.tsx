'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Lock, Play, Brain, ChevronRight } from 'lucide-react';
import QuizModal from '@/components/quiz-modal';

export default function Dashboard() {
  const { id } = useParams();
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [showQuiz, setShowQuiz] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (id === 'demo') {
        // Mock data for demo
        setNodes([
          { id: '1', label: 'React Fundamentals', status: 'mastered', level: 1, description: 'Core React hooks and lifecycle' },
          { id: '2', label: 'Next.js App Router', status: 'in-progress', level: 2, description: 'Server components and routing' },
          { id: '3', label: 'Advanced AI Integration', status: 'locked', level: 3, description: 'Working with Gemini & LLMs' },
        ]);
        setLoading(false);
        return;
      }

      const { data: nodesData } = await supabase.from('nodes').select('*').eq('tree_id', id).order('level');
      const { data: edgesData } = await supabase.from('edges').select('*').eq('tree_id', id);
      
      if (nodesData) setNodes(nodesData);
      if (edgesData) setEdges(edgesData);
      setLoading(false);
    };

    fetchData();
  }, [id]);

  const handleNodeClick = (node: any) => {
    if (node.status === 'locked') return;
    setSelectedNode(node);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen p-8">
      <header className="max-w-7xl mx-auto mb-12 flex justify-between items-end">
        <div>
          <h2 className="text-sm font-medium text-indigo-400 mb-2 uppercase tracking-widest">Mastery Path</h2>
          <h1 className="text-4xl font-bold font-outfit">Neural Synthesis Graph</h1>
        </div>
        <div className="flex gap-4">
          <div className="px-4 py-2 glass-card flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-medium">System Online</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Tree Visualization (Simplified for Demo) */}
        <div className="lg:col-span-2 relative min-h-[600px] glass-card p-12 overflow-hidden bg-slate-900/20">
          <div className="relative z-10 flex flex-col items-center gap-16">
            {nodes.map((node: any, index: number) => (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleNodeClick(node)}
                className={`relative group cursor-pointer w-64 p-6 rounded-2xl border-2 transition-all duration-300
                  ${node.status === 'mastered' ? 'border-emerald-500/50 bg-emerald-500/5 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 
                    node.status === 'in-progress' ? 'border-indigo-500 bg-indigo-500/10 node-active shadow-[0_0_30px_rgba(99,102,241,0.2)]' : 
                    'border-slate-800 bg-slate-900/50 grayscale opacity-60'}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2 rounded-lg ${node.status === 'mastered' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                    {node.status === 'mastered' ? <CheckCircle2 className="w-5 h-5" /> : 
                     node.status === 'locked' ? <Lock className="w-5 h-5" /> : <Brain className="w-5 h-5" />}
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Level {node.level}</span>
                </div>
                <h3 className="font-bold text-lg mb-2">{node.label}</h3>
                <p className="text-xs text-slate-400 line-clamp-2">{node.description}</p>
                
                {node.status === 'in-progress' && (
                  <div className="mt-4 flex items-center text-indigo-400 text-xs font-bold group-hover:gap-2 transition-all">
                    START MASTERY <ChevronRight className="w-4 h-4" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* SVG Connector Lines (Simple Vertical Flow) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
            <defs>
              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
            {nodes.slice(0, -1).map((_: any, i: number) => (
              <line 
                key={i} 
                x1="50%" y1={`${20 + i * 25}%`} 
                x2="50%" y2={`${45 + i * 25}%`} 
                stroke="url(#lineGrad)" 
                strokeWidth="2" 
                strokeDasharray="5,5"
              />
            ))}
          </svg>
        </div>

        {/* Info & Action Sidebar */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {selectedNode ? (
              <motion.div
                key={selectedNode.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="glass-card p-8 sticky top-8"
              >
                <div className="flex items-center gap-3 mb-6 text-indigo-400">
                  <Brain className="w-6 h-6" />
                  <span className="font-bold tracking-widest text-sm uppercase">Skill Insight</span>
                </div>
                <h2 className="text-3xl font-bold mb-4 font-outfit">{selectedNode.label}</h2>
                <p className="text-slate-400 mb-8 leading-relaxed">
                  {selectedNode.description}
                </p>
                
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Prerequisites</h4>
                    <p className="text-sm">Foundational Logic, ES6+ Javascript</p>
                  </div>
                  
                  {selectedNode.status !== 'mastered' && (
                    <button 
                      onClick={() => setShowQuiz(true)}
                      className="w-full glass-button flex items-center justify-center gap-2"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      Take Mastery Quiz
                    </button>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="glass-card p-8 h-full flex flex-col items-center justify-center text-center opacity-50 italic">
                <Brain className="w-12 h-12 mb-4" />
                <p>Select a node to view mastery details and take the quiz.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {showQuiz && selectedNode && (
        <QuizModal 
          node={selectedNode} 
          onClose={() => setShowQuiz(false)} 
          onSuccess={() => {
            setShowQuiz(false);
            // Refresh nodes logic would go here
            const newNodes = nodes.map((n: any) => n.id === selectedNode.id ? {...n, status: 'mastered'} : n);
            setNodes(newNodes);
          }}
        />
      )}
    </div>
  );
}
