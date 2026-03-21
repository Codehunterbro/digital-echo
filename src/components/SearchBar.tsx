import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Scan, AlertTriangle } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isScanning: boolean;
}

export function SearchBar({ onSearch, isScanning }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  };

  return (
    <div className="absolute top-0 left-0 right-0 z-40 p-4">
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-center gap-3 bg-card/90 backdrop-blur-xl border border-border rounded-2xl px-4 py-3 shadow-2xl">
            <Scan className="w-5 h-5 text-node-center shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter username or identity to investigate..."
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none font-mono"
            />
            <button
              type="submit"
              disabled={isScanning || !query.trim()}
              className="px-4 py-1.5 rounded-xl bg-node-center/15 border border-node-center/30 text-node-center text-xs font-semibold hover:bg-node-center/25 transition-all disabled:opacity-40 active:scale-95"
            >
              {isScanning ? (
                <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                  Scanning...
                </motion.span>
              ) : (
                'Investigate'
              )}
            </button>
          </div>
        </form>

        {/* Disclaimer */}
        <div className="flex items-center justify-center gap-1.5 mt-2">
          <AlertTriangle className="w-3 h-3 text-node-personal/60" />
          <span className="text-[9px] text-muted-foreground/60">
            Uses only publicly available data. For authorized research purposes only.
          </span>
        </div>
      </div>
    </div>
  );
}
