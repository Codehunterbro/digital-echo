import { motion } from 'framer-motion';
import { ExternalLink, CheckCircle2, XCircle, AlertCircle, BadgeCheck, Users, MessageSquare, Clock } from 'lucide-react';
import type { FinderProfile } from '@/types/finder';

const platformColors: Record<string, string> = {
  Instagram: 'hsl(330, 80%, 55%)',
  Facebook: 'hsl(220, 90%, 55%)',
  LinkedIn: 'hsl(210, 80%, 50%)',
  'Twitter (X)': 'hsl(210, 10%, 80%)',
  Snapchat: 'hsl(50, 100%, 55%)',
  TikTok: 'hsl(330, 90%, 60%)',
  YouTube: 'hsl(0, 100%, 50%)',
  Reddit: 'hsl(16, 100%, 50%)',
  GitHub: 'hsl(0, 0%, 75%)',
};

const statusStyles = {
  Shortlisted: { icon: CheckCircle2, color: 'hsl(140, 70%, 45%)', label: 'Shortlisted' },
  Eliminated: { icon: XCircle, color: 'hsl(0, 70%, 55%)', label: 'Eliminated' },
  'Needs Review': { icon: AlertCircle, color: 'hsl(40, 90%, 55%)', label: 'Needs Review' },
};

export function ProfileCard({ profile, index }: { profile: FinderProfile; index: number }) {
  const color = platformColors[profile.platform] || 'hsl(170, 80%, 50%)';
  const status = statusStyles[profile.status] || statusStyles['Needs Review'];
  const StatusIcon = status.icon;
  const isEliminated = profile.status === 'Eliminated';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`bg-card border rounded-2xl p-4 transition-all ${isEliminated ? 'opacity-60 border-border' : 'border-border hover:border-primary/40'}`}
      style={!isEliminated ? { boxShadow: `0 0 0 1px ${color}22` } : undefined}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-bold uppercase shrink-0"
            style={{ backgroundColor: `${color}22`, color, border: `1px solid ${color}55` }}
          >
            {profile.platform.slice(0, 2)}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-foreground">{profile.displayName}</span>
              {profile.verified && <BadgeCheck className="w-3.5 h-3.5 text-primary" />}
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground">
              <span style={{ color }}>{profile.platform}</span>
              <span>·</span>
              <span>@{profile.username}</span>
            </div>
          </div>
        </div>

        <div
          className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-mono shrink-0"
          style={{ backgroundColor: `${status.color}15`, color: status.color, border: `1px solid ${status.color}40` }}
        >
          <StatusIcon className="w-3 h-3" />
          {status.label}
        </div>
      </div>

      {profile.bio && (
        <p className="text-xs text-muted-foreground mb-3 leading-relaxed line-clamp-2">{profile.bio}</p>
      )}

      <div className="flex flex-wrap gap-3 text-[10px] font-mono text-muted-foreground mb-3">
        {profile.location && <span>📍 {profile.location}</span>}
        {profile.followers != null && (
          <span className="flex items-center gap-1"><Users className="w-3 h-3" />{formatNum(profile.followers)}</span>
        )}
        {profile.posts != null && (
          <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{formatNum(profile.posts)} posts</span>
        )}
        {profile.lastActive && (
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{profile.lastActive}</span>
        )}
      </div>

      {/* Confidence bar */}
      <div className="mb-3">
        <div className="flex justify-between text-[10px] font-mono mb-1">
          <span className="text-muted-foreground">Confidence</span>
          <span style={{ color }}>{profile.confidence}%</span>
        </div>
        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${profile.confidence}%` }}
            transition={{ delay: index * 0.05 + 0.2, duration: 0.6 }}
            className="h-full rounded-full"
            style={{ backgroundColor: color }}
          />
        </div>
      </div>

      {profile.matchingIndicators.length > 0 && (
        <div className="mb-2">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono mb-1">Matching indicators</div>
          <ul className="space-y-1">
            {profile.matchingIndicators.map((m, i) => (
              <li key={i} className="text-[11px] text-foreground/80 flex gap-1.5">
                <span className="text-node-location">✓</span><span>{m}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {profile.inconsistencies.length > 0 && (
        <div className="mb-3">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono mb-1">Inconsistencies</div>
          <ul className="space-y-1">
            {profile.inconsistencies.map((m, i) => (
              <li key={i} className="text-[11px] text-foreground/70 flex gap-1.5">
                <span className="text-node-personal">!</span><span>{m}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <a
        href={profile.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-[11px] font-mono text-primary hover:underline"
      >
        <ExternalLink className="w-3 h-3" />
        {profile.url}
      </a>
    </motion.div>
  );
}

function formatNum(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return String(n);
}
