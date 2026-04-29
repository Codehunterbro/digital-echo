import { motion } from 'framer-motion';
import { Shield, Link2, ExternalLink, BadgeCheck, CheckCircle2, GitBranch, User } from 'lucide-react';
import type { FinderReport, IdentityGroup, VerifiedProfile, CrossLinkedAccount } from '@/types/finder';

const platformColors: Record<string, string> = {
  Instagram: 'hsl(330, 80%, 55%)',
  Facebook: 'hsl(220, 90%, 55%)',
  LinkedIn: 'hsl(210, 80%, 50%)',
  'Twitter (X)': 'hsl(210, 10%, 80%)',
  X: 'hsl(210, 10%, 80%)',
  Snapchat: 'hsl(50, 100%, 55%)',
  TikTok: 'hsl(330, 90%, 60%)',
  YouTube: 'hsl(0, 100%, 50%)',
  Reddit: 'hsl(16, 100%, 50%)',
  GitHub: 'hsl(0, 0%, 75%)',
  Website: 'hsl(170, 80%, 50%)',
};

const confidenceStyles: Record<string, { color: string }> = {
  High: { color: 'hsl(140, 70%, 45%)' },
  Medium: { color: 'hsl(40, 90%, 55%)' },
  Low: { color: 'hsl(0, 70%, 55%)' },
};

function platformColor(p: string) {
  return platformColors[p] || 'hsl(170, 80%, 50%)';
}

export function FinderReportView({ report }: { report: FinderReport }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-5xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono mb-1">Subject</div>
            <h1 className="text-2xl font-bold text-foreground">{report.subject.fullName}</h1>
            <div className="flex flex-wrap gap-2 mt-2 text-[11px] font-mono text-muted-foreground">
              {report.subject.location && <Tag>📍 {report.subject.location}</Tag>}
              {report.subject.profession && <Tag>💼 {report.subject.profession}</Tag>}
              {report.subject.interests && <Tag>♥ {report.subject.interests}</Tag>}
              {report.subject.knownUsernames && <Tag>@ {report.subject.knownUsernames}</Tag>}
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono mb-1">Result</div>
            <div
              className="px-3 py-1.5 rounded-xl text-sm font-semibold inline-flex items-center gap-2"
              style={{
                backgroundColor: report.noConfirmedMatch ? 'hsl(0,70%,55%,0.1)' : 'hsl(140,70%,45%,0.1)',
                color: report.noConfirmedMatch ? 'hsl(0,70%,55%)' : 'hsl(140,70%,45%)',
                border: `1px solid ${report.noConfirmedMatch ? 'hsl(0,70%,55%,0.4)' : 'hsl(140,70%,45%,0.4)'}`,
              }}
            >
              <Shield className="w-4 h-4" />
              {report.noConfirmedMatch ? 'No Confirmed Match' : `${report.groups.length} Identified Individual${report.groups.length === 1 ? '' : 's'}`}
            </div>
          </div>
        </div>

        <p className="text-sm text-foreground/80 mt-4 leading-relaxed">{report.summary}</p>
      </div>

      {/* No match state */}
      {report.noConfirmedMatch && report.groups.length === 0 && (
        <div className="bg-card border border-destructive/30 rounded-2xl p-8 text-center">
          <div className="text-base font-semibold text-foreground mb-1">No confirmed match</div>
          <p className="text-sm text-muted-foreground">
            No verified profiles strongly aligned with the provided details. Try adding more identifiers (location, profession, known usernames).
          </p>
        </div>
      )}

      {/* Groups */}
      {report.groups.map((g, i) => (
        <GroupCard key={g.groupName + i} group={g} index={i} />
      ))}

      <div className="text-[10px] text-muted-foreground/70 text-center font-mono pb-6">
        ⚠ {report.disclaimer}
      </div>
    </motion.div>
  );
}

function GroupCard({ group, index }: { group: IdentityGroup; index: number }) {
  const conf = confidenceStyles[group.confidence] || confidenceStyles.Medium;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="bg-card border border-border rounded-2xl overflow-hidden"
      style={{ boxShadow: `0 0 0 1px ${conf.color}22` }}
    >
      {/* Group header */}
      <div className="p-5 border-b border-border bg-secondary/30">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${conf.color}1f`, color: conf.color, border: `1px solid ${conf.color}55` }}
            >
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">{group.groupName}</div>
              <div className="text-base font-semibold text-foreground">{group.displayName}</div>
            </div>
          </div>
          <div
            className="px-3 py-1.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5"
            style={{ backgroundColor: `${conf.color}15`, color: conf.color, border: `1px solid ${conf.color}40` }}
          >
            <Shield className="w-3.5 h-3.5" />
            {group.confidence} Confidence
          </div>
        </div>

        <p className="text-sm text-foreground/80 mt-3 leading-relaxed">{group.summary}</p>

        <div className="flex flex-wrap gap-1.5 mt-3 text-[11px] font-mono text-muted-foreground">
          {group.matchedDetails.location && <Tag>📍 {group.matchedDetails.location}</Tag>}
          {group.matchedDetails.profession && <Tag>💼 {group.matchedDetails.profession}</Tag>}
          {group.matchedDetails.education && <Tag>🎓 {group.matchedDetails.education}</Tag>}
          {group.matchedDetails.company && <Tag>🏢 {group.matchedDetails.company}</Tag>}
          {group.matchedDetails.interests && <Tag>♥ {group.matchedDetails.interests}</Tag>}
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Verified Profiles */}
        <div>
          <SectionHeader icon={<BadgeCheck className="w-3.5 h-3.5" />} title="Verified Profiles" subtitle="Public, working links" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {group.verifiedProfiles.map((p, i) => <VerifiedRow key={p.url + i} p={p} />)}
          </div>
        </div>

        {/* Cross-linked accounts */}
        {group.crossLinkedAccounts.length > 0 && (
          <div>
            <SectionHeader icon={<GitBranch className="w-3.5 h-3.5" />} title="Cross-linked Accounts" subtitle="Discovered via bio / external links" />
            <div className="space-y-2">
              {group.crossLinkedAccounts.map((c, i) => <CrossLinkedRow key={c.url + i} c={c} />)}
            </div>
          </div>
        )}

        {/* Verified data points */}
        <div>
          <SectionHeader icon={<CheckCircle2 className="w-3.5 h-3.5" />} title="Verified Data Points" subtitle={`${group.verifiedDataPoints.length} matching signals`} />
          <ul className="space-y-1.5">
            {group.verifiedDataPoints.map((d, i) => (
              <li key={i} className="text-[12px] text-foreground/85 flex gap-2 bg-secondary/30 border border-border rounded-lg px-3 py-2">
                <span style={{ color: conf.color }}>✓</span><span>{d}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Connection explanation */}
        <div>
          <SectionHeader icon={<Link2 className="w-3.5 h-3.5" />} title="Connection Explanation" />
          <div className="text-[12px] text-foreground/85 bg-secondary/30 border border-border rounded-lg px-3 py-2.5 leading-relaxed">
            {group.connectionExplanation}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function VerifiedRow({ p }: { p: VerifiedProfile }) {
  const color = platformColor(p.platform);
  return (
    <a
      href={p.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 bg-secondary/30 border border-border hover:border-primary/40 rounded-lg px-3 py-2.5 transition-colors"
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold uppercase shrink-0"
        style={{ backgroundColor: `${color}22`, color, border: `1px solid ${color}55` }}
      >
        {p.platform.slice(0, 2)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1">
          <span className="text-xs font-semibold text-foreground" style={{ color }}>{p.platform}</span>
          {p.verified && <BadgeCheck className="w-3 h-3 text-primary" />}
        </div>
        <div className="text-[11px] font-mono text-muted-foreground truncate">@{p.username}</div>
      </div>
      <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary shrink-0" />
    </a>
  );
}

function CrossLinkedRow({ c }: { c: CrossLinkedAccount }) {
  const color = platformColor(c.platform);
  return (
    <a
      href={c.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-secondary/30 border border-border hover:border-primary/40 rounded-lg px-3 py-2.5 transition-colors"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: color }}
          />
          <span className="text-xs font-semibold" style={{ color }}>{c.platform}</span>
          <span className="text-[11px] font-mono text-muted-foreground truncate">{c.url}</span>
        </div>
        <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-primary shrink-0" />
      </div>
      <div className="text-[10px] text-muted-foreground/80 font-mono mt-1 pl-4">↳ {c.discoveredVia}</div>
    </a>
  );
}

function SectionHeader({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle?: string }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <div className="w-6 h-6 rounded-md bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
        {icon}
      </div>
      <div>
        <h3 className="text-xs font-semibold text-foreground">{title}</h3>
        {subtitle && <p className="text-[10px] text-muted-foreground font-mono">{subtitle}</p>}
      </div>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return <span className="px-2 py-0.5 rounded-md bg-secondary border border-border">{children}</span>;
}
