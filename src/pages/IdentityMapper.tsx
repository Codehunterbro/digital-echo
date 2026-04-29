import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { FinderForm, type FinderQuery } from '@/components/finder/FinderForm';
import { FinderReportView } from '@/components/finder/FinderReportView';
import { StatusBar } from '@/components/StatusBar';
import type { FinderReport } from '@/types/finder';

export default function IdentityMapper() {
  const [isScanning, setIsScanning] = useState(false);
  const [report, setReport] = useState<FinderReport | null>(null);

  const handleSearch = useCallback(async (q: FinderQuery) => {
    setIsScanning(true);
    setReport(null);

    try {
      const { data, error } = await supabase.functions.invoke('investigate', {
        body: q,
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setReport(data as FinderReport);
    } catch (err: any) {
      console.error('OSINT search failed:', err);
      toast.error(err.message || 'Failed to run OSINT search.');
    } finally {
      setIsScanning(false);
    }
  }, []);

  return (
    <div className="w-full min-h-screen bg-background relative overflow-x-hidden">
      <div className="fixed inset-0 cyber-grid opacity-30 pointer-events-none" />
      <div className="fixed inset-0 scan-line pointer-events-none" />

      <header className="relative z-10 px-4 pt-6 pb-2">
        <div className="max-w-5xl mx-auto flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center">
            <Search className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground tracking-tight">Social Media Finder</h1>
            <p className="text-[10px] text-muted-foreground font-mono">OSINT-style profile discovery across platforms</p>
          </div>
        </div>
      </header>

      <main className="relative z-10 px-4 py-6 space-y-8">
        <FinderForm onSearch={handleSearch} isScanning={isScanning} />

        {!report && !isScanning && (
          <div className="text-center pt-8">
            <p className="text-muted-foreground text-sm font-mono">
              Enter a name above to discover possible matching profiles.
            </p>
            <p className="text-muted-foreground/50 text-xs mt-1">
              Powered by AI · Uses only public data patterns
            </p>
          </div>
        )}

        {isScanning && (
          <div className="max-w-3xl mx-auto bg-card/60 border border-border rounded-2xl p-8 text-center">
            <div className="inline-flex items-center gap-2 text-sm font-mono text-primary animate-pulse">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Scanning Instagram, Facebook, LinkedIn, X, Snapchat…
            </div>
            <p className="text-[11px] text-muted-foreground mt-2">
              Cross-checking photos, bios, locations and activity patterns.
            </p>
          </div>
        )}

        {report && <FinderReportView report={report} />}
      </main>

      <StatusBar />
    </div>
  );
}
