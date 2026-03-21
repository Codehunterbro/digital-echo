import { motion, AnimatePresence } from 'framer-motion';
import { X, Brain, MapPin, User, Globe, Shield, Activity, Clock, MessageSquare } from 'lucide-react';
import type { PersonData } from '@/data/mockData';

interface DetailPanelProps {
  selectedNode: string | null;
  person: PersonData;
  onClose: () => void;
}

export function DetailPanel({ selectedNode, person, onClose }: DetailPanelProps) {
  return (
    <AnimatePresence>
      {selectedNode && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="absolute top-0 right-0 w-96 h-full bg-card/95 backdrop-blur-xl border-l border-border z-50 overflow-y-auto"
        >
          <div className="p-5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider font-mono">
                {selectedNode === 'center' ? 'Identity Overview' : selectedNode}
              </h2>
              <button onClick={onClose} className="p-1.5 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors active:scale-95">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {selectedNode === 'center' && <OverviewPanel person={person} />}
            {selectedNode === 'behavioral' && <BehavioralPanel person={person} />}
            {selectedNode === 'location' && <LocationPanel person={person} />}
            {selectedNode === 'personal' && <PersonalPanel person={person} />}
            {person.social.find(s => s.platform === selectedNode) && (
              <SocialPanel platform={person.social.find(s => s.platform === selectedNode)!} />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SectionCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl bg-secondary/50 border border-border p-4 mb-3 ${className}`}>
      {children}
    </div>
  );
}

function StatRow({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-xs font-mono font-medium" style={color ? { color } : {}}>{value}</span>
    </div>
  );
}

function OverviewPanel({ person }: { person: PersonData }) {
  return (
    <div className="space-y-3">
      <SectionCard>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-node-center/20 border border-node-center/40 flex items-center justify-center">
            <span className="text-lg font-bold text-node-center font-mono">{person.avatar}</span>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">{person.name}</h3>
            <p className="text-xs text-muted-foreground font-mono">@{person.username}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-node-social" />
          <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-node-location via-node-personal to-node-social transition-all" style={{ width: `${person.riskScore}%` }} />
          </div>
          <span className="text-xs font-mono text-node-social">{person.riskScore}%</span>
        </div>
        <p className="text-[10px] text-muted-foreground mt-1">Digital Exposure Risk Score</p>
      </SectionCard>
      <SectionCard>
        <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-node-social" /> Linked Platforms
        </h4>
        {person.social.map(s => (
          <div key={s.platform} className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
            <span className="text-xs text-foreground">{s.platform}</span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-muted-foreground">@{s.username}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full" style={{ color: s.color, backgroundColor: `${s.color}15` }}>
                {s.confidence}%
              </span>
            </div>
          </div>
        ))}
      </SectionCard>
    </div>
  );
}

function BehavioralPanel({ person }: { person: PersonData }) {
  const b = person.behavioral;
  return (
    <div className="space-y-3">
      <SectionCard>
        <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-node-behavioral" /> Activity Patterns
        </h4>
        <StatRow label="Sleep Pattern" value={b.sleepPattern} />
        <StatRow label="Active Hours" value={b.activeHours} />
        <StatRow label="Avg Screen Time" value={b.avgDailyScreenTime} />
      </SectionCard>
      <SectionCard>
        <h4 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5 text-node-behavioral" /> Sentiment Analysis
        </h4>
        {b.sentiment.map(s => (
          <div key={s.label} className="mb-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-muted-foreground">{s.label}</span>
              <span className="text-[10px] font-mono" style={{ color: s.color }}>{s.value}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${s.value}%` }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="h-full rounded-full"
                style={{ backgroundColor: s.color }}
              />
            </div>
          </div>
        ))}
      </SectionCard>
      <SectionCard>
        <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-node-behavioral" /> Frequent Sites
        </h4>
        {b.websiteVisits.map(w => (
          <StatRow key={w.site} label={w.site} value={w.frequency} />
        ))}
      </SectionCard>
    </div>
  );
}

function LocationPanel({ person }: { person: PersonData }) {
  const l = person.location;
  return (
    <div className="space-y-3">
      <SectionCard>
        <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-node-location" /> Estimated Location
        </h4>
        <StatRow label="Locality" value={l.locality} color="hsl(140, 70%, 45%)" />
        <StatRow label="City" value={l.city} />
        <StatRow label="Country" value={l.country} />
      </SectionCard>
      <SectionCard>
        <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-node-location" /> Network & Timezone
        </h4>
        <StatRow label="ISP" value={l.isp} color="hsl(140, 70%, 45%)" />
        <StatRow label="Timezone" value={l.timezone} />
      </SectionCard>
      <SectionCard>
        <h4 className="text-xs font-semibold text-foreground mb-2">Geo Patterns</h4>
        {l.geoPatterns.map((p, i) => (
          <div key={i} className="flex items-start gap-2 py-1.5">
            <div className="w-1 h-1 rounded-full bg-node-location mt-1.5 shrink-0" />
            <span className="text-[11px] text-muted-foreground leading-relaxed">{p}</span>
          </div>
        ))}
      </SectionCard>
    </div>
  );
}

function PersonalPanel({ person }: { person: PersonData }) {
  const p = person.personal;
  return (
    <div className="space-y-3">
      <SectionCard>
        <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-node-personal" /> Identity
        </h4>
        <StatRow label="Full Name" value={p.fullName} color="hsl(40, 90%, 55%)" />
        <StatRow label="Email" value={p.email} />
        <StatRow label="Phone" value={p.phone} />
      </SectionCard>
      <SectionCard>
        <h4 className="text-xs font-semibold text-foreground mb-2">Bio</h4>
        <p className="text-[11px] text-muted-foreground leading-relaxed">{p.bio}</p>
      </SectionCard>
      <SectionCard>
        <h4 className="text-xs font-semibold text-foreground mb-2">Known Aliases</h4>
        <div className="flex flex-wrap gap-1.5">
          {p.aliases.map(a => (
            <span key={a} className="text-[10px] font-mono px-2 py-1 rounded-lg bg-node-personal/10 border border-node-personal/20 text-node-personal">
              {a}
            </span>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function SocialPanel({ platform }: { platform: PersonData['social'][0] }) {
  return (
    <div className="space-y-3">
      <SectionCard>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-semibold text-foreground">{platform.platform}</h4>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full" style={{ color: platform.color, backgroundColor: `${platform.color}15` }}>
            {platform.confidence}% confidence
          </span>
        </div>
        <StatRow label="Username" value={`@${platform.username}`} />
        <StatRow label="Followers" value={platform.followers.toLocaleString()} />
        <StatRow label="Posts" value={platform.posts.toLocaleString()} />
        <StatRow label="Last Active" value={platform.lastActive} color={platform.color} />
      </SectionCard>
      <SectionCard>
        <h4 className="text-xs font-semibold text-foreground mb-3">Recent Activity</h4>
        {platform.recentActivity.map((a, i) => (
          <div key={i} className="py-2 border-b border-border/50 last:border-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">{a.type}</span>
              <span className="text-[9px] text-muted-foreground">{a.date}</span>
            </div>
            <p className="text-[11px] text-foreground/80 leading-relaxed">{a.content}</p>
            <span className="text-[9px] text-muted-foreground mt-1 inline-block">⚡ {a.engagement.toLocaleString()} engagement</span>
          </div>
        ))}
      </SectionCard>
    </div>
  );
}
