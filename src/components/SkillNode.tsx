import { Handle, Position } from '@xyflow/react';
import { motion } from 'framer-motion';
import { Code, Database, Globe, Cpu, Layout, Lightbulb } from 'lucide-react';

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
  const isCompleted = data.status === 'completed';
  const isCurrent = data.status === 'current';
  const isLocked = data.status === 'locked';

  let borderGlow = 'border-slate-700 shadow-none';
  let iconColor = 'text-slate-500';

  if (isCompleted) {
    borderGlow = 'border-primary shadow-[0_0_15px_rgba(0,243,255,0.4)]';
    iconColor = 'text-primary';
  } else if (isCurrent) {
    borderGlow = 'border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.4)] node-active';
    iconColor = 'text-yellow-400';
  }

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={!isLocked ? { scale: 1.05 } : {}}
      className={`px-4 py-3 rounded-xl bg-cyber-dark-800 border-2 ${borderGlow} flex items-center gap-3 w-48 ${isLocked ? 'opacity-50 grayscale' : 'cursor-pointer'}`}
    >
      <Handle type="target" position={Position.Top} className="!bg-primary !w-2 !h-2 !border-none" />
      
      <div className={`p-2 rounded-lg bg-cyber-dark-900 ${iconColor}`}>
        <Icon className="w-5 h-5" />
      </div>
      
      <div>
        <div className="text-sm font-bold text-white">{data.label}</div>
        <div className="text-xs text-slate-400">{data.duration || '2 weeks'}</div>
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-primary !w-2 !h-2 !border-none" />
    </motion.div>
  );
}
