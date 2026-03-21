import { Handle, Position } from '@xyflow/react';
import { motion } from 'framer-motion';

interface SocialNodeData {
  platform: string;
  username: string;
  confidence: number;
  color: string;
  onSelect: () => void;
}

export function SocialNode({ data }: { data: SocialNodeData }) {
  return (
    <motion.div
      initial={{ scale: 0, x: -20 }}
      animate={{ scale: 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 22, delay: 0.4 }}
      className="cursor-pointer group"
      onClick={data.onSelect}
    >
      <div
        className="w-24 h-24 rounded-2xl bg-card border flex flex-col items-center justify-center transition-all duration-300 group-hover:scale-105"
        style={{
          borderColor: `${data.color}66`,
          boxShadow: `0 0 15px ${data.color}22, 0 0 40px ${data.color}08`,
        }}
      >
        <span className="text-[11px] font-semibold text-foreground">{data.platform}</span>
        <span className="text-[9px] text-muted-foreground font-mono mt-0.5">@{data.username}</span>
        <div className="mt-1.5 flex items-center gap-1">
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: data.color }}
          />
          <span className="text-[8px] font-mono" style={{ color: data.color }}>
            {data.confidence}% match
          </span>
        </div>
      </div>
      <Handle type="target" position={Position.Left} className="!bg-node-social !border-none !w-2 !h-2" />
    </motion.div>
  );
}
