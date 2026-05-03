import { Handle, Position } from '@xyflow/react';
import { motion } from 'framer-motion';
import { Code, Database, Globe, Cpu, Layout, Lightbulb, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap: Record<string, any> = {
  frontend: Layout,
  backend: Database,
  core: Code,
  infrastructure: Globe,
  ai: Cpu,
  soft: Lightbulb,
};

export default function SkillNode({ data }: { data: any }) {
  const Icon = iconMap[data.category?.toLowerCase()] || Code;
  const status = data.status || 'locked';
  
  const isCompleted = status === 'mastered' || status === 'completed';
  const isInProgress = status === 'in-progress' || status === 'current';
  const isLocked = status === 'locked';

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={!isLocked ? { scale: 1.05, y: -5 } : {}}
      className={cn(
        "relative px-4 py-4 rounded-2xl border-2 transition-all duration-500 w-52 group",
        "bg-surface/80 backdrop-blur-xl",
        isCompleted && "border-primary shadow-[0_0_20px_rgba(0,245,255,0.2)]",
        isInProgress && "border-secondary animate-pulse-slow shadow-[0_0_20px_rgba(112,0,255,0.2)]",
        isLocked && "border-white/5 opacity-60 grayscale bg-black/40"
      )}
    >
      <Handle type="target" position={Position.Top} className="!bg-primary !w-2 !h-2 !border-none !opacity-0 group-hover:!opacity-100 transition-opacity" />
      
      <div className="flex items-center gap-3">
        <div className={cn(
          "p-2.5 rounded-xl transition-colors duration-500",
          isCompleted ? "bg-primary/20 text-primary" : 
          isInProgress ? "bg-secondary/20 text-secondary" : 
          "bg-white/5 text-gray-400"
        )}>
          {isLocked ? <Lock className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-bold text-white truncate leading-tight">
            {data.label}
          </div>
          <div className="text-[10px] text-gray-400 uppercase tracking-wider mt-1">
            {isLocked ? 'Locked' : data.category || 'Skill'}
          </div>
        </div>
      </div>

      {/* Decorative scan line for active nodes */}
      {isInProgress && (
        <div className="absolute inset-x-0 top-0 h-px bg-secondary shadow-[0_0_10px_#7000FF] animate-scan" />
      )}

      <Handle type="source" position={Position.Bottom} className="!bg-primary !w-2 !h-2 !border-none !opacity-0 group-hover:!opacity-100 transition-opacity" />
    </motion.div>
  );
}
