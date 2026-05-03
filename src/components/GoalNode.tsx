import { Handle, Position } from '@xyflow/react';
import { motion } from 'framer-motion';
import { Trophy, Star } from 'lucide-react';

export default function GoalNode({ data }: { data: any }) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        boxShadow: ["0 0 20px rgba(251, 191, 36, 0.2)", "0 0 40px rgba(251, 191, 36, 0.4)", "0 0 20px rgba(251, 191, 36, 0.2)"]
      }}
      transition={{ 
        boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" }
      }}
      whileHover={{ scale: 1.1, rotate: [0, -1, 1, 0] }}
      className="relative px-8 py-6 rounded-3xl bg-gradient-to-br from-gray-900 via-amber-900/40 to-gray-900 border-2 border-amber-500/50 flex flex-col items-center text-center gap-3 w-72 backdrop-blur-2xl"
    >
      <Handle type="target" position={Position.Top} className="!bg-amber-500 !w-3 !h-3 !border-none" />
      
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex gap-1">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.5, 1, 0.5], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 2, delay: i * 0.5, repeat: Infinity }}
          >
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
          </motion.div>
        ))}
      </div>

      <div className="p-4 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
        <Trophy className="w-10 h-10" />
      </div>
      
      <div>
        <div className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.2em] mb-1">Ultimate Objective</div>
        <div className="text-xl font-black text-white font-outfit leading-tight drop-shadow-md">
          {data.label}
        </div>
      </div>

      <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-amber-500/5 to-transparent pointer-events-none" />
    </motion.div>
  );
}
