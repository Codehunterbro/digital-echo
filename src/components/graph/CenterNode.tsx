import { Handle, Position } from '@xyflow/react';
import { motion } from 'framer-motion';

interface CenterNodeData {
  label: string;
  subtitle: string;
  avatar: string;
  riskScore: number;
  onSelect: () => void;
}

export function CenterNode({ data }: { data: CenterNodeData }) {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="relative cursor-pointer group"
      onClick={data.onSelect}
    >
      {/* Outer ring pulse */}
      <div className="absolute -inset-4 rounded-full border border-node-center/20 animate-pulse-glow" />
      <div className="absolute -inset-8 rounded-full border border-node-center/10 animate-pulse-glow" style={{ animationDelay: '1s' }} />
      
      {/* Main node */}
      <div className="w-32 h-32 rounded-full bg-card border-2 border-node-center/60 flex flex-col items-center justify-center glow-primary transition-all duration-300 group-hover:border-node-center">
        <div className="w-14 h-14 rounded-full bg-node-center/20 border border-node-center/40 flex items-center justify-center mb-1">
          <span className="text-lg font-bold text-node-center font-mono">{data.avatar}</span>
        </div>
        <span className="text-xs font-semibold text-foreground truncate max-w-[100px]">{data.label}</span>
        <span className="text-[10px] text-muted-foreground font-mono">@{data.subtitle}</span>
      </div>

      {/* Risk indicator */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-card border border-node-social/40 text-[9px] font-mono text-node-social">
        RISK {data.riskScore}%
      </div>

      <Handle type="source" position={Position.Top} className="!bg-node-behavioral !border-none !w-2 !h-2" id="top" />
      <Handle type="source" position={Position.Bottom} className="!bg-node-personal !border-none !w-2 !h-2" id="bottom" />
      <Handle type="source" position={Position.Left} className="!bg-node-location !border-none !w-2 !h-2" id="left" />
      <Handle type="source" position={Position.Right} className="!bg-node-social !border-none !w-2 !h-2" id="right" />
    </motion.div>
  );
}
