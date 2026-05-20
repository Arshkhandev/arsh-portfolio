'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import type { GitHubData, GitHubRepo, ContributionWeek } from '@/lib/github';
import { Github, Star, GitFork, ExternalLink, Flame, TrendingUp, Users } from 'lucide-react';
import { formatNumber } from '@/lib/utils';
import { useEffect, useState } from 'react';

// ── Contribution graph ─────────────────────────────────────────────
function ContributionGraph({ weeks }: { weeks: ContributionWeek[] }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  if (weeks.length === 0) {
    // Fallback: use the public readme-stats image
    return (
      <div className="w-full">
        <Image
          src="https://github-readme-stats.vercel.app/api?username=Arshkhandev&show_icons=true&theme=dark&hide_border=true&bg_color=00000000&title_color=ffffff&text_color=888888&icon_color=ffffff"
          alt="GitHub Stats"
          width={400}
          height={200}
          className="w-full rounded-xl"
          unoptimized
        />
      </div>
    );
  }

  const heatClass = (n: number) => {
    if (n === 0) return 'heat-0';
    if (n <= 2) return 'heat-1';
    if (n <= 5) return 'heat-2';
    if (n <= 10) return 'heat-3';
    return 'heat-4';
  };

  return (
    <div ref={ref} className="overflow-x-auto cursor-grab active:cursor-grabbing" style={{ WebkitOverflowScrolling: 'touch' }}>
      <div className="flex gap-0.5 min-w-max">
        {weeks.map((week, wi) => (
          <motion.div
            key={wi}
            className="flex flex-col gap-0.5"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: wi * 0.005 }}
          >
            {week.contributionDays.map((day, di) => (
              <div
                key={di}
                title={`${day.date}: ${day.contributionCount} contributions`}
                className={`w-2.5 h-2.5 rounded-sm cursor-pointer transition-opacity hover:opacity-70 ${heatClass(day.contributionCount)}`}
              />
            ))}
          </motion.div>
        ))}
      </div>
      <div className="flex items-center justify-end gap-2 mt-2">
        <span className="text-[10px] text-muted-foreground font-mono">Less</span>
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className={`w-2.5 h-2.5 rounded-sm heat-${i}`} />
        ))}
        <span className="text-[10px] text-muted-foreground font-mono">More</span>
      </div>
    </div>
  );
}

// ── Language bar ───────────────────────────────────────────────────
function LanguageBar({ languages }: { languages: Record<string, number> }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });
  const total = Object.values(languages).reduce((a, b) => a + b, 0);
  const sorted = Object.entries(languages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6);

  const LANG_COLORS: Record<string, string> = {
    JavaScript: '#f7df1e',
    TypeScript: '#3178c6',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Java: '#b07219',
    Python: '#3572A5',
    Shell: '#89e051',
  };

  if (sorted.length === 0) return null;

  return (
    <div ref={ref} className="space-y-3">
      {sorted.map(([lang, bytes], i) => {
        const pct = total > 0 ? (bytes / total) * 100 : 0;
        const color = LANG_COLORS[lang] ?? '#888888';
        return (
          <div key={lang}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: color }}
                />
                {lang}
              </span>
              <span className="text-xs font-mono text-muted-foreground">
                {pct.toFixed(1)}%
              </span>
            </div>
            <div className="h-1 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: color }}
                initial={{ width: 0 }}
                animate={inView ? { width: `${pct}%` } : {}}
                transition={{ duration: 0.8, delay: i * 0.08, ease: 'easeOut' }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Repo card ──────────────────────────────────────────────────────
function RepoCard({ repo, index }: { repo: GitHubRepo; index: number }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <motion.a
      ref={ref}
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.05 }}
      className="card-premium p-4 flex flex-col gap-3 hover:no-underline block"
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-semibold truncate">{repo.name}</h4>
        <ExternalLink className="w-3 h-3 text-muted-foreground shrink-0 mt-0.5" />
      </div>

      {repo.description && (
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {repo.description}
        </p>
      )}

      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-auto">
        {repo.language && (
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-foreground/50" />
            {repo.language}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Star className="w-3 h-3" />
          {repo.stars}
        </span>
        <span className="flex items-center gap-1">
          <GitFork className="w-3 h-3" />
          {repo.forks}
        </span>
      </div>
    </motion.a>
  );
}

// ── Main ───────────────────────────────────────────────────────────
export function GitHubSection({ data }: { data: GitHubData | null }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const username = 'Arshkhandev';

  return (
    <section id="github" className="section-padding border-t border-border">
      <div className="container-main" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="text-mono text-xs text-muted-foreground mb-4 tracking-widest uppercase">
            GitHub
          </p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <h2
              className="text-display text-4xl md:text-5xl leading-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Open Source &
              <span className="text-muted-foreground"> Activity</span>
            </h2>
            <a
              href={`https://github.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="w-4 h-4" />
              <span className="font-mono">@{username}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </motion.div>

        {/* Stats row */}
        {data && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Github, label: 'Repositories', value: formatNumber(data.user.publicRepos) },
              { icon: Users, label: 'Followers', value: formatNumber(data.user.followers) },
              {
                icon: TrendingUp,
                label: 'Contributions (yr)',
                value: formatNumber(data.totalContributions),
              },
              { icon: Flame, label: 'Longest Streak', value: `${data.longestStreak}d` },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.07 }}
                className="card-premium p-5"
              >
                <stat.icon className="w-4 h-4 text-muted-foreground mb-3" />
                <p className="text-2xl font-bold font-mono">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          {/* Contribution graph + languages */}
          <div className="md:col-span-2 space-y-6">
            <div className="card-premium p-6">
              <p className="text-sm font-semibold mb-5">Contribution Activity</p>
              {data ? (
                <ContributionGraph weeks={data.contributionData} />
              ) : (
                <Image
                  src={`https://github-readme-activity-graph.vercel.app/graph?username=${username}&theme=minimal&hide_border=true&area=true`}
                  alt="GitHub contribution graph"
                  width={600}
                  height={200}
                  className="w-full rounded-lg"
                  unoptimized
                />
              )}
            </div>

            {data && Object.keys(data.languages).length > 0 && (
              <div className="card-premium p-6">
                <p className="text-sm font-semibold mb-5">Top Languages</p>
                <LanguageBar languages={data.languages} />
              </div>
            )}
          </div>

          {/* Recent repos */}
          <div>
            <p className="text-sm font-semibold mb-4">Recent Repositories</p>
            <div className="space-y-3">
              {data?.repos?.slice(0, 6).map((repo, i) => (
                <RepoCard key={repo.name} repo={repo} index={i} />
              )) ?? (
                <div className="card-premium p-6 text-center">
                  <Github className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Set GITHUB_TOKEN to load repos
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
