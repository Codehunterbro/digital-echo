import { motion } from 'framer-motion';
import { Wifi, Database, Shield } from 'lucide-react';

export function StatusBar() {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="absolute bottom-0 left-0 right-0 z-40 px-4 py-2 bg-card/80 backdrop-blur-xl border-t border-border"
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-node-location animate-pulse" />
            <span className="text-[10px] text-muted-foreground font-mono">SYSTEM ONLINE</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Wifi className="w-3 h-3 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground font-mono">6 SOURCES</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Database className="w-3 h-3 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground font-mono">MOCK DATA</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Shield className="w-3 h-3 text-node-center" />
          <span className="text-[10px] text-node-center font-mono">DIGITAL IDENTITY MAPPER v1.0</span>
        </div>
      </div>
    </motion.div>
  );
}
