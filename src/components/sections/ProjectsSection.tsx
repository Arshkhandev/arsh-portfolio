'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ExternalLink, Github, ArrowUpRight } from 'lucide-react';
import { PROJECTS, Project } from '@/lib/data';
import { cn } from '@/lib/utils';

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const statusColors: Record<Project['status'], string> = {
    live: 'bg-emerald-500',
    wip: 'bg-amber-500',
    archived: 'bg-muted-foreground',
  };

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="card-premium group relative overflow-hidden flex flex-col"
    >
      {/* Top accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />

      <div className="p-8 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={cn('w-1.5 h-1.5 rounded-full', statusColors[project.status])} />
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                {project.status === 'live' ? 'Live' : project.status === 'wip' ? 'In Progress' : 'Archived'}
              </span>
              <span className="text-muted-foreground text-xs">·</span>
              <span className="text-xs font-mono text-muted-foreground capitalize">
                {project.category}
              </span>
            </div>
            <h3
              className="text-xl font-bold group-hover:text-muted-foreground transition-colors"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {project.title}
            </h3>
          </div>

          {/* Action links */}
          <div className="flex gap-2 shrink-0">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-3.5 h-3.5" />
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-foreground text-background flex items-center justify-center hover:opacity-80 transition-opacity"
                aria-label="Live demo"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">
          {project.description}
        </p>

        {/* Problem solved callout */}
        <div className="mb-5 p-3 rounded-lg bg-muted border border-border/50">
          <p className="text-xs font-mono text-muted-foreground mb-1 uppercase tracking-widest">
            Problem Solved
          </p>
          <p className="text-xs leading-relaxed">{project.problem}</p>
        </div>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-2 mb-5">
          {project.stack.map((tech) => (
            <span key={tech} className="tag">{tech}</span>
          ))}
        </div>

        {/* Metrics */}
        {project.metrics && (
          <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
            {project.metrics.map((metric) => (
              <span key={metric} className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-emerald-500" />
                {metric}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 pointer-events-none rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: 'radial-gradient(circle at 50% 0%, hsl(var(--foreground) / 0.03) 0%, transparent 60%)',
        }}
      />
    </motion.article>
  );
}

export function ProjectsSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="projects" className="section-padding border-t border-border">
      <div className="container-main" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="text-mono text-xs text-muted-foreground mb-4 tracking-widest uppercase">
            Work
          </p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h2
              className="text-display text-4xl md:text-5xl leading-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Featured<br />
              <span className="text-muted-foreground">Projects</span>
            </h2>
            <a
              href="https://github.com/Arshkhandev"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              View all on GitHub
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </motion.div>

        {/* Projects grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROJECTS.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
