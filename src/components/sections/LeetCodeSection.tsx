'use client';

import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';
import type { LeetCodeStats } from '@/lib/leetcode';
import { ExternalLink, TrendingUp, Award, Code2 } from 'lucide-react';

function Counter({ value }: { value: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v).toLocaleString());
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.5 });
  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, value, { duration: 1.5, ease: 'easeOut' });
    return controls.stop;
  }, [count, inView, value]);
  return <span ref={ref}><motion.span>{rounded}</motion.span></span>;
}

function DifficultyCard({ label, solved, total, color }: {
  label: string; solved: number; total: number; color: string;
}) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const pct = total > 0 ? (solved / total) * 100 : 0;
  const radius = 28;
  const circ = 2 * Math.PI * radius;
  const dash = (pct / 100) * circ;
  return (
    <div ref={ref} className="card-premium p-5 text-center">
      <div className="flex justify-center mb-3">
        <svg width="72" height="72" className="-rotate-90">
          <circle cx="36" cy="36" r={radius} stroke="hsl(var(--border))" strokeWidth="5" fill="none" />
          <motion.circle
            cx="36" cy="36" r={radius} stroke={color} strokeWidth="5" fill="none" strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={inView ? { strokeDashoffset: circ - dash } : {}}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
          />
        </svg>
      </div>
      <p className="text-2xl font-bold font-mono"><Counter value={solved} /></p>
      <p className="text-xs text-muted-foreground mt-1 font-mono">/ {total}</p>
      <p className="text-sm font-semibold mt-2" style={{ color }}>{label}</p>
    </div>
  );
}

function RecentSubmissions({ submissions }: { submissions: LeetCodeStats['recentSubmissions'] }) {
  return (
    <div className="space-y-2">
      {submissions.slice(0, 5).map((sub, i) => (
        <div key={i} className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-muted/50 border border-border/50">
          <a href={`https://leetcode.com/problems/${sub.titleSlug}/`} target="_blank" rel="noopener noreferrer"
            className="text-sm hover:underline truncate flex-1">{sub.title}</a>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] font-mono text-muted-foreground">{sub.lang}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
              sub.statusDisplay === 'Accepted'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'bg-red-500/10 text-red-500'
            }`}>{sub.statusDisplay === 'Accepted' ? 'AC' : 'WA'}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Heatmap built from real calendar data ──────────────────────────
function SubmissionHeatmap({ calendar }: { calendar: Record<string, number> }) {
  // LeetCode stores timestamps as unix seconds (start of day UTC)
  const entries = Object.entries(calendar).map(([ts, count]) => ({
    ts: parseInt(ts),
    count: count as number,
  }));

  // Build a lookup by date string
  const byDate: Record<string, number> = {};
  entries.forEach(({ ts, count }) => {
    const d = new Date(ts * 1000);
    const key = d.toISOString().slice(0, 10); // "YYYY-MM-DD"
    byDate[key] = (byDate[key] ?? 0) + count;
  });

  // Generate last 52 weeks of dates
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weeks: { date: string; count: number }[][] = [];
  let current = new Date(today);
  current.setDate(current.getDate() - 363);

  for (let w = 0; w < 52; w++) {
    const week: { date: string; count: number }[] = [];
    for (let d = 0; d < 7; d++) {
      const dateStr = current.toISOString().slice(0, 10);
      week.push({ date: dateStr, count: byDate[dateStr] ?? 0 });
      current.setDate(current.getDate() + 1);
    }
    weeks.push(week);
  }

  const totalActive = Object.values(byDate).filter(v => v > 0).length;

  const heatClass = (n: number) => {
    if (n === 0) return 'heat-0';
    if (n <= 2) return 'heat-1';
    if (n <= 5) return 'heat-2';
    if (n <= 10) return 'heat-3';
    return 'heat-4';
  };

  return (
    <div>
      <div className="overflow-x-auto pb-1">
        <div className="flex gap-[3px]" style={{ width: 'max-content' }}>
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((day, di) => (
                <div
                  key={di}
                  title={`${day.date}: ${day.count} submission${day.count !== 1 ? 's' : ''}`}
                  className={`rounded-sm hover:opacity-80 transition-opacity ${heatClass(day.count)}`}
                  style={{ width: '11px', height: '11px' }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between mt-3">
        <span className="text-[10px] text-muted-foreground font-mono">
          {totalActive} active day{totalActive !== 1 ? 's' : ''} this year
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-muted-foreground font-mono">Less</span>
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className={`rounded-sm heat-${i}`} style={{ width: '11px', height: '11px' }} />
          ))}
          <span className="text-[10px] text-muted-foreground font-mono">More</span>
        </div>
      </div>
    </div>
  );
}

export function LeetCodeSection({ data }: { data: LeetCodeStats | null }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const username = 'arsh_khan_dev';
  const noData = !data || data.totalSolved === 0;

  return (
    <section id="leetcode" className="section-padding border-t border-border">
      <div className="container-main" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="text-mono text-xs text-muted-foreground mb-4 tracking-widest uppercase">LeetCode</p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <h2 className="text-display text-4xl md:text-5xl leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Problem Solving
              <span className="text-muted-foreground"> Stats</span>
            </h2>
            <a href={`https://leetcode.com/u/${username}/`} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <span className="font-mono">@{username}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </motion.div>

        {noData ? (
          <div className="card-premium p-8 text-center">
            <Code2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">Check the profile directly:</p>
            <a href={`https://leetcode.com/u/${username}/`} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground text-background text-sm">
              View LeetCode Profile <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }} className="card-premium p-6 col-span-2 md:col-span-1">
                <p className="text-3xl md:text-4xl font-bold font-mono"><Counter value={data.totalSolved} /></p>
                <p className="text-sm text-muted-foreground mt-1">Problems Solved</p>
                <p className="text-xs text-muted-foreground font-mono mt-1">of {data.totalQuestions} total</p>
              </motion.div>
              {data.ranking > 0 && (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.15 }} className="card-premium p-6">
                  <TrendingUp className="w-5 h-5 mb-2 text-muted-foreground" />
                  <p className="text-2xl font-bold font-mono"><Counter value={data.ranking} /></p>
                  <p className="text-xs text-muted-foreground mt-1">Global Rank</p>
                </motion.div>
              )}
              {data.contestRating && (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }} className="card-premium p-6">
                  <Award className="w-5 h-5 mb-2 text-muted-foreground" />
                  <p className="text-2xl font-bold font-mono"><Counter value={data.contestRating} /></p>
                  <p className="text-xs text-muted-foreground mt-1">Contest Rating</p>
                </motion.div>
              )}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.25 }} className="card-premium p-6">
                <p className="text-2xl font-bold font-mono">{data.acceptanceRate}%</p>
                <p className="text-xs text-muted-foreground mt-1">Acceptance Rate</p>
              </motion.div>
            </div>

            {/* Difficulty */}
            <div className="grid grid-cols-3 gap-4">
              <DifficultyCard label="Easy" solved={data.easySolved} total={data.easyTotal} color="#22c55e" />
              <DifficultyCard label="Medium" solved={data.mediumSolved} total={data.mediumTotal} color="#f59e0b" />
              <DifficultyCard label="Hard" solved={data.hardSolved} total={data.hardTotal} color="#ef4444" />
            </div>

            {/* Heatmap + Submissions */}
            <div className="grid md:grid-cols-2 gap-6 cursor-pointer">
              <div className="card-premium p-6">
                <p className="text-sm font-semibold mb-5">Submission Activity</p>
                <SubmissionHeatmap calendar={data.submissionCalendar} />
              </div>
              {data.recentSubmissions.length > 0 && (
                <div className="card-premium p-6">
                  <p className="text-sm font-semibold mb-4">Recent Submissions</p>
                  <RecentSubmissions submissions={data.recentSubmissions} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}