import { Handle, Position } from '@xyflow/react';
import { motion } from 'framer-motion';
import { Brain, MapPin, User, Globe } from 'lucide-react';

interface BubbleNodeData {
  label: string;
  type: 'behavioral' | 'location' | 'personal';
  summary: string;
  onSelect: () => void;
}

const config = {
  behavioral: { icon: Brain, colorClass: 'node-behavioral', glow: 'glow-accent', handlePos: Position.Bottom },
  location: { icon: MapPin, colorClass: 'node-location', glow: 'glow-success', handlePos: Position.Right },
  personal: { icon: User, colorClass: 'node-personal', glow: 'glow-warning', handlePos: Position.Top },
};

export function BubbleNode({ data }: { data: BubbleNodeData }) {
  const { icon: Icon, colorClass, glow, handlePos } = config[data.type];

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 180, damping: 22, delay: 0.2 }}
      className={`relative cursor-pointer group`}
      onClick={data.onSelect}
    >
      <div className={`w-28 h-28 rounded-full bg-card border-2 border-${colorClass}/40 flex flex-col items-center justify-center ${glow} transition-all duration-300 group-hover:border-${colorClass}/80`}>
        <div className={`w-10 h-10 rounded-full bg-${colorClass}/15 border border-${colorClass}/30 flex items-center justify-center mb-1.5`}>
          <Icon className={`w-5 h-5 text-${colorClass}`} />
        </div>
        <span className="text-[11px] font-semibold text-foreground">{data.label}</span>
        <span className="text-[9px] text-muted-foreground text-center px-2 leading-tight mt-0.5">{data.summary}</span>
      </div>
      <Handle type="target" position={handlePos} className={`!bg-${colorClass} !border-none !w-2 !h-2`} />
    </motion.div>
  );
}
