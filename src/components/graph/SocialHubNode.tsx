import { Handle, Position } from '@xyflow/react';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';

interface SocialHubNodeData {
  label: string;
  count: number;
}

export function SocialHubNode({ data }: { data: SocialHubNodeData }) {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 22, delay: 0.3 }}
    >
      <div className="w-20 h-20 rounded-full bg-card border-2 border-node-social/40 flex flex-col items-center justify-center glow-danger">
        <Globe className="w-5 h-5 text-node-social mb-1" />
        <span className="text-[10px] font-semibold text-foreground">{data.label}</span>
        <span className="text-[8px] text-muted-foreground font-mono">{data.count} platforms</span>
      </div>
      <Handle type="target" position={Position.Left} className="!bg-node-social !border-none !w-2 !h-2" />
      <Handle type="source" position={Position.Right} className="!bg-node-social !border-none !w-2 !h-2" id="out" />
    </motion.div>
  );
}
