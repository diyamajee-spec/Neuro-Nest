import { Handle, Position } from '@xyflow/react';
import { motion } from 'framer-motion';
import { Target } from 'lucide-react';

export default function GoalNode({ data }: { data: any }) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      className="px-6 py-4 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border-2 border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.5)] flex items-center gap-4 w-64 backdrop-blur-md"
    >
      <Handle type="target" position={Position.Top} className="!bg-yellow-400 !w-3 !h-3 !border-none" />
      
      <div className="p-3 rounded-full bg-yellow-400/20 text-yellow-400">
        <Target className="w-8 h-8" />
      </div>
      
      <div>
        <div className="text-xs font-semibold text-yellow-400/80 uppercase tracking-wider">Dream Goal</div>
        <div className="text-lg font-bold text-white">{data.label}</div>
      </div>
    </motion.div>
  );
}
