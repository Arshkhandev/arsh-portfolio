'use client';

import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';
import Image from 'next/image';
import type { LeetCodeStats } from '@/lib/leetcode';
import { ExternalLink, TrendingUp, Award, Code2 } from 'lucide-react';

// ── Animated counter ───────────────────────────────────────────────
function Counter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v).toLocaleString());
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.5 });

  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, value, { duration: 1.5, ease: 'easeOut' });
    return controls.stop;
  }, [count, inView, value]);

  return (
    <span ref={ref}>
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}

// ── Difficulty ring ────────────────────────────────────────────────
function DifficultyCard({
  label, solved, total, color,
}: {
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
            cx="36" cy="36" r={radius}
            stroke={color} strokeWidth="5" fill="none" strokeLinecap="round"
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

// ── Recent Submissions ─────────────────────────────────────────────
function RecentSubmissions({ submissions }: { submissions: LeetCodeStats['recentSubmissions'] }) {
  return (
    <div className="space-y-2">
      {submissions.slice(0, 5).map((sub, i) => (
        <div key={i} className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-muted/50 border border-border/50">
          <a
            href={`https://leetcode.com/problems/${sub.titleSlug}/`}
            target="_blank" rel="noopener noreferrer"
            className="text-sm hover:underline truncate flex-1"
          >
            {sub.title}
          </a>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] font-mono text-muted-foreground">{sub.lang}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
              sub.statusDisplay === 'Accepted'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'bg-red-500/10 text-red-500'
            }`}>
              {sub.statusDisplay === 'Accepted' ? 'AC' : 'WA'}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main section ───────────────────────────────────────────────────
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
          <p className="text-mono text-xs text-muted-foreground mb-4 tracking-widest uppercase">
            LeetCode
          </p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <h2
              className="text-display text-4xl md:text-5xl leading-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Problem Solving
              <span className="text-muted-foreground"> Stats</span>
            </h2>
            <a
              href={`https://leetcode.com/u/${username}/`}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="font-mono">@{username}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </motion.div>

        {noData ? (
          <div className="card-premium p-8 text-center">
            <Code2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">Check the profile directly:</p>
            <a
              href={`https://leetcode.com/u/${username}/`}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground text-background text-sm"
            >
              View LeetCode Profile <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Big numbers */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 }}
                className="card-premium p-6 col-span-2 md:col-span-1"
              >
                <p className="text-3xl md:text-4xl font-bold font-mono">
                  <Counter value={data.totalSolved} />
                </p>
                <p className="text-sm text-muted-foreground mt-1">Problems Solved</p>
                <p className="text-xs text-muted-foreground font-mono mt-1">of {data.totalQuestions} total</p>
              </motion.div>

              {data.ranking > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.15 }}
                  className="card-premium p-6"
                >
                  <TrendingUp className="w-5 h-5 mb-2 text-muted-foreground" />
                  <p className="text-2xl font-bold font-mono"><Counter value={data.ranking} /></p>
                  <p className="text-xs text-muted-foreground mt-1">Global Rank</p>
                </motion.div>
              )}

              {data.contestRating && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.2 }}
                  className="card-premium p-6"
                >
                  <Award className="w-5 h-5 mb-2 text-muted-foreground" />
                  <p className="text-2xl font-bold font-mono"><Counter value={data.contestRating} /></p>
                  <p className="text-xs text-muted-foreground mt-1">Contest Rating</p>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.25 }}
                className="card-premium p-6"
              >
                <p className="text-2xl font-bold font-mono">{data.acceptanceRate}%</p>
                <p className="text-xs text-muted-foreground mt-1">Acceptance Rate</p>
              </motion.div>
            </div>

            {/* Difficulty breakdown */}
            <div className="grid grid-cols-3 gap-4">
              <DifficultyCard label="Easy" solved={data.easySolved} total={data.easyTotal} color="#22c55e" />
              <DifficultyCard label="Medium" solved={data.mediumSolved} total={data.mediumTotal} color="#f59e0b" />
              <DifficultyCard label="Hard" solved={data.hardSolved} total={data.hardTotal} color="#ef4444" />
            </div>

            {/* LeetCode activity card + recent submissions */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Official LeetCode stats card — always shows real data */}
              <div className="card-premium p-6">
                <p className="text-sm font-semibold mb-4">Activity Overview</p>
                <div className="space-y-3">
                <img
  src={`https://leetcard.jacoblin.com/${username}?theme=dark&ext=heatmap`}
  alt="LeetCode Stats"
  className="w-full rounded-lg"
  loading="lazy"
/><div className="card-premium p-6">
  <p className="text-sm font-semibold mb-4">Activity Overview</p>
  <img
    src={`https://github-readme-stats.vercel.app/api?username=Arshkhandev&show_icons=true&theme=dark&hide_border=true&bg_color=00000000&title_color=ffffff&text_color=888888&icon_color=ffffff&count_private=true`}
    alt="GitHub Stats"
    className="w-full rounded-lg mb-3"
  />
  <img
    src={`https://github-readme-streak-stats.herokuapp.com?user=Arshkhandev&theme=dark&hide_border=true&background=00000000&stroke=444&ring=ffffff&fire=ffffff&currStreakLabel=888888`}
    alt="GitHub Streak"
    className="w-full rounded-lg"
  />
</div>
                </div>
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