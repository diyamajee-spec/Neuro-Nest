'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ReactFlow, Background, Controls, useNodesState, useEdgesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Plus, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';

import QuizModal from '@/components/quiz-modal';
import SkillNode from '@/components/SkillNode';
import GoalNode from '@/components/GoalNode';
import SkillBlade from '@/components/SkillBlade';
import ScanningAnimation from '@/components/ScanningAnimation';
import ResumeEvolver from '@/components/ResumeEvolver';
import MarketPulse from '@/components/MarketPulse';

const nodeTypes = { skillNode: SkillNode, goalNode: GoalNode };

export default function Dashboard() {
  const { id } = useParams();
  const router = useRouter();
  
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  
  const [loading, setLoading] = useState(true);
  const [isScanning, setIsScanning] = useState(true);
  const [summary, setSummary] = useState<string>('');
  
  const [selectedNodeData, setSelectedNodeData] = useState<any>(null);
  const [isBladeOpen, setIsBladeOpen] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      let rawNodes = [];
      let rawEdges = [];
      
      if (id === 'demo') {
        setSummary("Accelerate your path to Senior AI Engineer by mastering React-19 concurrent patterns and deep Gemini integration strategies.");
        rawNodes = [
          { id: '1', type: 'skillNode', position: { x: 400, y: 150 }, data: { 
            id: '1', label: 'React Fundamentals', category: 'frontend', status: 'completed', description: 'Core React hooks and lifecycle',
            metadata: {
              resources: [
                { title: "React 19 Official Docs", type: "doc" },
                { title: "Hooks Deep Dive", type: "video" }
              ],
              market_insight: { salary_range: "$120k - $160k", demand_level: "high" }
            }
          } },
          { id: '2', type: 'skillNode', position: { x: 250, y: 350 }, data: { 
            id: '2', label: 'Next.js App Router', category: 'frontend', status: 'current', description: 'Server components and routing',
            metadata: {
              resources: [
                { title: "App Router Mastery", type: "doc" },
                { title: "Fullstack Next.js Project", type: "project" }
              ],
              market_insight: { salary_range: "$140k - $180k", demand_level: "high" }
            }
          } },
          { id: '3', type: 'skillNode', position: { x: 550, y: 350 }, data: { 
            id: '3', label: 'TypeScript Mastery', category: 'core', status: 'completed', description: 'Advanced types and safety',
            metadata: {
              resources: [
                { title: "TypeScript Handbook", type: "doc" }
              ],
              market_insight: { salary_range: "$130k - $170k", demand_level: "high" }
            }
          } },
          { id: '4', type: 'skillNode', position: { x: 400, y: 550 }, data: { 
            id: '4', label: 'Advanced AI Integration', category: 'ai', status: 'locked', description: 'Working with Gemini & LLMs',
            metadata: {
              resources: [
                { title: "Gemini 1.5 Flash Specs", type: "doc" },
                { title: "Neural Synthesis API Guide", type: "video" }
              ],
              market_insight: { salary_range: "$160k - $220k", demand_level: "high" }
            }
          } },
          { id: '5', type: 'goalNode', position: { x: 365, y: 750 }, data: { id: '5', label: 'Senior AI Engineer' } },
        ];
        
        rawEdges = [
          { id: 'e1-2', source: '1', target: '2', type: 'smoothstep', animated: true, style: { stroke: '#00f3ff', strokeWidth: 2, filter: 'drop-shadow(0 0 8px rgba(0,243,255,0.5))' } },
          { id: 'e1-3', source: '1', target: '3', type: 'smoothstep', animated: true, style: { stroke: '#00f3ff', strokeWidth: 2, filter: 'drop-shadow(0 0 8px rgba(0,243,255,0.5))' } },
          { id: 'e2-4', source: '2', target: '4', type: 'smoothstep', style: { stroke: '#1a1a1a', strokeWidth: 2 } },
          { id: 'e3-4', source: '3', target: '4', type: 'smoothstep', style: { stroke: '#1a1a1a', strokeWidth: 2 } },
          { id: 'e4-5', source: '4', target: '5', type: 'smoothstep', style: { stroke: '#1a1a1a', strokeWidth: 2 } },
        ];
      } else {
        const { data: treeData } = await supabase.from('learning_trees').select('description').eq('id', id).single();
        if (treeData) setSummary(treeData.description || '');

        const { data: nodesData } = await supabase.from('nodes').select('*').eq('tree_id', id).order('level');
        const { data: edgesData } = await supabase.from('edges').select('*').eq('tree_id', id);
        
        if (nodesData) {
          // Calculate positions for a more "branching" tree look
          const levelCounts: Record<number, number> = {};
          
          rawNodes = nodesData.map((n: any) => {
            const level = n.level || 1;
            const metadata = typeof n.metadata === 'string' ? JSON.parse(n.metadata) : (n.metadata || {});
            const isGoal = metadata.is_goal || n.level === 5 || n.label.toLowerCase().includes('senior') || n.label.toLowerCase().includes('engineer');
            
            // Increment count for this level to offset horizontally
            levelCounts[level] = (levelCounts[level] || 0) + 1;
            const horizontalOffset = (levelCounts[level] - 1) * 250 - (Object.values(levelCounts).filter(v => v > 1).length * 125);

            return {
              id: n.id,
              type: isGoal ? 'goalNode' : 'skillNode',
              position: { 
                x: 400 + horizontalOffset, 
                y: level * 200 
              },
              data: { 
                ...n, 
                category: metadata.category || 'core',
                is_goal: isGoal,
                metadata: metadata
              }
            };
          });
        }
        
        if (edgesData) {
          rawEdges = edgesData.map((e: any) => ({
            id: e.id,
            source: e.source_id,
            target: e.target_id,
            type: 'smoothstep',
            animated: true,
            style: { stroke: '#00f3ff', strokeWidth: 2, filter: 'drop-shadow(0 0 8px rgba(0,243,255,0.5))' }
          }));
        }
      }
      
      setNodes(rawNodes);
      setEdges(rawEdges);
      
      // Calculate progress
      const completedCount = rawNodes.filter((n: any) => n.data.status === 'completed').length;
      const totalSkills = Math.max(1, rawNodes.filter((n: any) => n.type === 'skillNode').length);
      setProgress((completedCount / totalSkills) * 100);
      
      setLoading(false);
    };

    fetchData();
  }, [id, setNodes, setEdges]);

  const onNodeClick = (event: any, node: any) => {
    setSelectedNodeData(node.data);
    if (node.type === 'skillNode') {
      setIsBladeOpen(true);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-cyber-dark-900">
      <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyber-dark-800 via-background to-background text-white relative">
      {isScanning && <ScanningAnimation onComplete={() => setIsScanning(false)} />}
      
      {!isScanning && (
        <>
          {/* Header */}
          <header className="absolute top-0 left-0 right-0 z-10 px-8 py-6 flex justify-between items-start pointer-events-none">
            <div className="flex flex-col gap-6 pointer-events-auto">
              <div>
                <h2 className="text-sm font-medium text-primary mb-1 uppercase tracking-widest drop-shadow-[0_0_5px_rgba(0,243,255,0.5)]">Mastery Path</h2>
                <h1 className="text-3xl font-bold font-outfit">Neural Synthesis Graph</h1>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => router.push('/')}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                >
                  <Home className="w-4 h-4" />
                  Terminal
                </button>
                <button 
                  onClick={() => router.push('/')}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-xs font-bold uppercase tracking-widest text-primary hover:bg-primary/20 transition-all shadow-[0_0_15px_rgba(0,243,255,0.1)]"
                >
                  <Plus className="w-4 h-4" />
                  New Synthesis
                </button>
              </div>
            </div>
            
            <div className="w-80 pointer-events-auto space-y-4">
              <ResumeEvolver progress={progress} />
              <MarketPulse summary={summary} />
            </div>
          </header>

          {/* React Flow Graph */}
          <div className="w-full h-screen">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onNodeClick={onNodeClick}
              nodeTypes={nodeTypes}
              fitView
              fitViewOptions={{ padding: 0.5 }}
              minZoom={0.2}
              maxZoom={2}
              className="bg-transparent"
            >
              <Background color="#1a1a1a" gap={30} size={1} variant="dots" />
              <Controls className="!bg-cyber-dark-900 !border-slate-800 !fill-primary [&>button]:!border-slate-800 [&>button]:hover:!bg-slate-800" />
            </ReactFlow>
          </div>

          {/* Clarity Legend */}
          <div className="absolute bottom-10 left-10 z-20 glass-card p-4 flex flex-col gap-3 pointer-events-none">
            <div className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Mastery Legend</div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_10px_rgba(0,243,255,0.8)]" />
              <span className="text-[10px] text-gray-400 font-bold uppercase">Mastered</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-secondary animate-pulse" />
              <span className="text-[10px] text-gray-400 font-bold uppercase">Synthesizing</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-gray-800 border border-white/10" />
              <span className="text-[10px] text-gray-400 font-bold uppercase">Neural Block</span>
            </div>
          </div>

          {/* Side Panel Blade */}
          <SkillBlade 
            isOpen={isBladeOpen}
            node={selectedNodeData}
            onClose={() => setIsBladeOpen(false)}
            onTakeQuiz={() => {
              setIsBladeOpen(false);
              setShowQuiz(true);
            }}
          />

          {/* Quiz Modal */}
          {showQuiz && selectedNodeData && (
            <QuizModal 
              node={selectedNodeData} 
              onClose={() => setShowQuiz(false)} 
              onSuccess={() => {
                setShowQuiz(false);
                
                 // Update React Flow Nodes state locally for the demo
                 setNodes((nds: any[]) => {
                   const updatedNodes = nds.map((node: any) => {
                     if (node.id === selectedNodeData.id || node.data.label === selectedNodeData.label) {
                       return { ...node, data: { ...node.data, status: 'completed' } };
                     }
                     return node;
                   });

                   // If in demo mode, check for nodes to unlock
                   if (id === 'demo') {
                     return updatedNodes.map((node: any) => {
                       if (node.data.status === 'locked') {
                         // Find edges pointing to this node
                         const incomingEdges = edges.filter((e: any) => e.target === node.id);
                         // Check if all source nodes are completed
                         const allParentsCompleted = incomingEdges.every((e: any) => {
                           const parent = updatedNodes.find((n: any) => n.id === e.source);
                           return parent?.data.status === 'completed';
                         });
                         
                         if (allParentsCompleted && incomingEdges.length > 0) {
                           return { ...node, data: { ...node.data, status: 'in-progress' } };
                         }
                       }
                       return node;
                     });
                   }
                   return updatedNodes;
                 });

                 // Update edges for demo mode (glow effect)
                 if (id === 'demo') {
                   setEdges((eds: any[]) => eds.map(edge => {
                     const sourceNode = nodes.find((n: any) => n.id === edge.source);
                     if (sourceNode?.data.label === selectedNodeData.label || sourceNode?.id === selectedNodeData.id) {
                       return { ...edge, animated: true, style: { ...edge.style, stroke: '#00f3ff' } };
                     }
                     return edge;
                   }));
                 }

                 setProgress(p => Math.min(100, p + 25));
               }}
             />
           )}
         </>
       )}
     </div>
   );
 }
