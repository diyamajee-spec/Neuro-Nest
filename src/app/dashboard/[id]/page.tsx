'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ReactFlow, Background, Controls, MiniMap, useNodesState, useEdgesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain } from 'lucide-react';

import QuizModal from '@/components/quiz-modal';
import SkillNode from '@/components/SkillNode';
import GoalNode from '@/components/GoalNode';
import SkillBlade from '@/components/SkillBlade';
import ScanningAnimation from '@/components/ScanningAnimation';
import ResumeEvolver from '@/components/ResumeEvolver';

const nodeTypes = { skillNode: SkillNode, goalNode: GoalNode };

export default function Dashboard() {
  const { id } = useParams();
  
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  
  const [loading, setLoading] = useState(true);
  const [isScanning, setIsScanning] = useState(true);
  
  const [selectedNodeData, setSelectedNodeData] = useState<any>(null);
  const [isBladeOpen, setIsBladeOpen] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      let rawNodes = [];
      let rawEdges = [];
      
      if (id === 'demo') {
        // Mock data for demo with precise React Flow coordinates
        rawNodes = [
          { id: '1', type: 'skillNode', position: { x: 250, y: 50 }, data: { label: 'React Fundamentals', category: 'frontend', status: 'completed', description: 'Core React hooks and lifecycle' } },
          { id: '2', type: 'skillNode', position: { x: 250, y: 200 }, data: { label: 'Next.js App Router', category: 'frontend', status: 'current', description: 'Server components and routing' } },
          { id: '3', type: 'skillNode', position: { x: 250, y: 350 }, data: { label: 'Advanced AI Integration', category: 'ai', status: 'locked', description: 'Working with Gemini & LLMs' } },
          { id: '4', type: 'goalNode', position: { x: 215, y: 500 }, data: { label: 'Senior AI Engineer' } },
        ];
        
        rawEdges = [
          { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#00f3ff', strokeWidth: 2 } },
          { id: 'e2-3', source: '2', target: '3', style: { stroke: '#1a1a1a', strokeWidth: 2 } },
          { id: 'e3-4', source: '3', target: '4', style: { stroke: '#1a1a1a', strokeWidth: 2 } },
        ];
      } else {
        const { data: nodesData } = await supabase.from('nodes').select('*').eq('tree_id', id).order('level');
        const { data: edgesData } = await supabase.from('edges').select('*').eq('tree_id', id);
        
        if (nodesData) {
          rawNodes = nodesData.map((n: any, i: number) => ({
            id: n.id,
            type: n.is_goal ? 'goalNode' : 'skillNode',
            position: { x: 250, y: i * 150 + 50 },
            data: { ...n }
          }));
        }
        
        if (edgesData) {
          rawEdges = edgesData.map((e: any) => ({
            id: `e${e.source_id}-${e.target_id}`,
            source: e.source_id,
            target: e.target_id,
            animated: true,
            style: { stroke: '#00f3ff', strokeWidth: 2 }
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
            <div>
              <h2 className="text-sm font-medium text-primary mb-1 uppercase tracking-widest drop-shadow-[0_0_5px_rgba(0,243,255,0.5)]">Mastery Path</h2>
              <h1 className="text-3xl font-bold font-outfit">Neural Synthesis Graph</h1>
            </div>
            
            <div className="w-80 pointer-events-auto">
              <ResumeEvolver progress={progress} />
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
              minZoom={0.5}
              maxZoom={1.5}
              className="bg-transparent"
            >
              <Background color="#1a1a1a" gap={20} size={2} />
              <Controls className="!bg-cyber-dark-900 !border-slate-800 !fill-primary [&>button]:!border-slate-800 [&>button]:hover:!bg-slate-800" />
            </ReactFlow>
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
                setNodes((nds: any[]) => nds.map((node: any) => {
                  if (node.data.label === selectedNodeData.label) {
                    return { ...node, data: { ...node.data, status: 'completed' } };
                  }
                  return node;
                }));
                setProgress(p => Math.min(100, p + 33)); // Fake progress bump for demo
              }}
            />
          )}
        </>
      )}
    </div>
  );
}
