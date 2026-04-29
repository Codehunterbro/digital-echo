import { motion } from 'framer-motion';
import { Shield, Target, Lightbulb, Link2 } from 'lucide-react';
import type { FinderReport } from '@/types/finder';
import { ProfileCard } from './ProfileCard';

const verdictStyles: Record<string, { color: string; label: string }> = {
  'Confirmed Match': { color: 'hsl(140, 70%, 45%)', label: 'Confirmed Match' },
  'Likely Match': { color: 'hsl(170, 80%, 50%)', label: 'Likely Match' },
  'Possible Match': { color: 'hsl(40, 90%, 55%)', label: 'Possible Match' },
  'No Confirmed Match': { color: 'hsl(0, 70%, 55%)', label: 'No Confirmed Match' },
};

export function FinderReportView({ report }: { report: FinderReport }) {
  const verdict = verdictStyles[report.verdict] || verdictStyles['Possible Match'];
  const shortlisted = report.profiles.filter((p) => p.status === 'Shortlisted');
  const review = report.profiles.filter((p) => p.status === 'Needs Review');
  const eliminated = report.profiles.filter((p) => p.status === 'Eliminated');

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-5xl mx-auto space-y-6"
    >
      {/* Header / verdict */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono mb-1">Subject</div>
            <h1 className="text-2xl font-bold text-foreground">{report.subject.fullName}</h1>
            <div className="flex flex-wrap gap-2 mt-2 text-[11px] font-mono text-muted-foreground">
              {report.subject.location && <Tag>📍 {report.subject.location}</Tag>}
              {report.subject.profession && <Tag>💼 {report.subject.profession}</Tag>}
              {report.subject.interests && <Tag>♥ {report.subject.interests}</Tag>}
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono mb-1">Verdict</div>
            <div
              className="px-3 py-1.5 rounded-xl text-sm font-semibold inline-flex items-center gap-2"
              style={{ backgroundColor: `${verdict.color}1a`, color: verdict.color, border: `1px solid ${verdict.color}55` }}
            >
              <Shield className="w-4 h-4" />
              {verdict.label}
            </div>
            <div className="mt-2 text-[11px] font-mono text-muted-foreground">
              Overall confidence: <span style={{ color: verdict.color }}>{report.overallConfidence}%</span>
            </div>
          </div>
        </div>

        <p className="text-sm text-foreground/80 mt-4 leading-relaxed">{report.summary}</p>

        <div className="mt-4 grid grid-cols-3 gap-3">
          <Stat label="Shortlisted" value={shortlisted.length} color="hsl(140, 70%, 45%)" />
          <Stat label="Needs Review" value={review.length} color="hsl(40, 90%, 55%)" />
          <Stat label="Eliminated" value={eliminated.length} color="hsl(0, 70%, 55%)" />
        </div>
      </div>

      {/* Shortlisted */}
      {shortlisted.length > 0 && (
        <Section icon={<Target className="w-4 h-4" />} title="Shortlisted Profiles" subtitle="Most likely matches">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {shortlisted.map((p, i) => <ProfileCard key={p.url + i} profile={p} index={i} />)}
          </div>
        </Section>
      )}

      {/* Cross-checks */}
      {report.crossChecks.length > 0 && (
        <Section icon={<Link2 className="w-4 h-4" />} title="Cross-Platform Checks">
          <ul className="space-y-2">
            {report.crossChecks.map((c, i) => (
              <li key={i} className="text-sm text-foreground/85 flex gap-2 bg-card border border-border rounded-xl px-4 py-3">
                <span className="text-primary font-mono">→</span><span>{c}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Needs review */}
      {review.length > 0 && (
        <Section icon={<Target className="w-4 h-4" />} title="Needs Review">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {review.map((p, i) => <ProfileCard key={p.url + i} profile={p} index={i} />)}
          </div>
        </Section>
      )}

      {/* Eliminated */}
      {eliminated.length > 0 && (
        <Section icon={<Target className="w-4 h-4" />} title="Eliminated" subtitle="Ruled out during cross-check">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {eliminated.map((p, i) => <ProfileCard key={p.url + i} profile={p} index={i} />)}
          </div>
        </Section>
      )}

      {/* Recommendations */}
      {report.recommendations.length > 0 && (
        <Section icon={<Lightbulb className="w-4 h-4" />} title="Recommended Next Steps">
          <ul className="space-y-2">
            {report.recommendations.map((r, i) => (
              <li key={i} className="text-sm text-foreground/85 flex gap-2 bg-card border border-border rounded-xl px-4 py-3">
                <span className="text-node-personal font-mono">{i + 1}.</span><span>{r}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <div className="text-[10px] text-muted-foreground/70 text-center font-mono pb-6">
        ⚠ {report.disclaimer}
      </div>
    </motion.div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return <span className="px-2 py-0.5 rounded-md bg-secondary border border-border">{children}</span>;
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-secondary/40 border border-border rounded-xl px-3 py-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">{label}</div>
      <div className="text-xl font-bold" style={{ color }}>{value}</div>
    </div>
  );
}

function Section({ icon, title, subtitle, children }: { icon: React.ReactNode; title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
          {icon}
        </div>
        <div>
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
          {subtitle && <p className="text-[10px] text-muted-foreground font-mono">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}
