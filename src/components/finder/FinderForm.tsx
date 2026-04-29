import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, AlertTriangle, MapPin, Briefcase, Heart, AtSign } from 'lucide-react';

export interface FinderQuery {
  fullName: string;
  location: string;
  interests: string;
  profession: string;
  knownUsernames: string;
}

interface Props {
  onSearch: (q: FinderQuery) => void;
  isScanning: boolean;
}

export function FinderForm({ onSearch, isScanning }: Props) {
  const [fullName, setFullName] = useState('');
  const [location, setLocation] = useState('');
  const [interests, setInterests] = useState('');
  const [profession, setProfession] = useState('');
  const [knownUsernames, setKnownUsernames] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;
    onSearch({
      fullName: fullName.trim(),
      location: location.trim(),
      interests: interests.trim(),
      profession: profession.trim(),
      knownUsernames: knownUsernames.trim(),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="bg-card/80 backdrop-blur-xl border border-border rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center">
            <Search className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">OSINT Social Media Finder</h2>
            <p className="text-[10px] text-muted-foreground font-mono">Identify possible profiles by name + filters</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono mb-1 block">
              Full Name <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Aarav Sharma"
              required
              className="w-full bg-secondary/60 border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary/60 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Field
              icon={<MapPin className="w-3 h-3" />}
              label="Location"
              value={location}
              onChange={setLocation}
              placeholder="City / Country"
            />
            <Field
              icon={<Heart className="w-3 h-3" />}
              label="Interests"
              value={interests}
              onChange={setInterests}
              placeholder="photography, cycling..."
            />
            <Field
              icon={<Briefcase className="w-3 h-3" />}
              label="Profession / Education"
              value={profession}
              onChange={setProfession}
              placeholder="Software engineer / MIT"
            />
          </div>

          <Field
            icon={<AtSign className="w-3 h-3" />}
            label="Known usernames / handles (optional)"
            value={knownUsernames}
            onChange={setKnownUsernames}
            placeholder="@aaravsharma, asharma_07"
          />

          <button
            type="submit"
            disabled={isScanning || !fullName.trim()}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all disabled:opacity-40 active:scale-[0.99]"
          >
            {isScanning ? (
              <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 1.4 }}>
                Investigating across platforms...
              </motion.span>
            ) : (
              'Run OSINT Search'
            )}
          </button>
        </form>

        <div className="flex items-center justify-center gap-1.5 mt-3">
          <AlertTriangle className="w-3 h-3 text-node-personal/70" />
          <span className="text-[9px] text-muted-foreground/70">
            Uses only publicly available data patterns. For ethical research and authorized investigation only.
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function Field({
  icon, label, value, onChange, placeholder,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono mb-1 flex items-center gap-1">
        {icon} {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-secondary/60 border border-border rounded-xl px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary/60 transition-colors"
      />
    </div>
  );
}
