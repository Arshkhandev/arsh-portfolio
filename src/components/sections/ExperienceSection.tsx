'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { EXPERIENCE, CERTIFICATIONS } from '@/lib/data';
import { cn } from '@/lib/utils';

function TimelineItem({ exp, index }: { exp: typeof EXPERIENCE[0]; index: number }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 });

  const typeColors = {
    work: 'bg-blue-500',
    freelance: 'bg-emerald-500',
    education: 'bg-amber-500',
  };

  const typeLabels = {
    work: 'Full-time',
    freelance: 'Freelance',
    education: 'Learning',
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative pl-8 pb-12 last:pb-0"
    >
      {/* Timeline line */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-border" />

      {/* Timeline dot */}
      <div className={cn(
        'absolute left-[-4px] top-1.5 w-2 h-2 rounded-full border-2 border-background',
        typeColors[exp.type]
      )} />

      {/* Content */}
      <div className="card-premium p-6">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={cn(
                'text-xs px-2 py-0.5 rounded-full font-mono',
                exp.type === 'freelance' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                exp.type === 'education' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                'bg-blue-500/10 text-blue-600 dark:text-blue-400'
              )}>
                {typeLabels[exp.type]}
              </span>
            </div>
            <h3
              className="text-lg font-bold"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {exp.title}
            </h3>
            <p className="text-sm text-muted-foreground">{exp.company}</p>
          </div>
          <span className="text-xs font-mono text-muted-foreground bg-muted px-2.5 py-1 rounded-lg border border-border whitespace-nowrap">
            {exp.period}
          </span>
        </div>

        <ul className="space-y-2 mb-5">
          {exp.description.map((point, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="mt-1.5 w-1 h-1 rounded-full bg-muted-foreground shrink-0" />
              {point}
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-2">
          {exp.skills.map((skill) => (
            <span key={skill} className="tag">{skill}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function ExperienceSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="experience" className="section-padding border-t border-border">
      <div className="container-main" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="text-mono text-xs text-muted-foreground mb-4 tracking-widest uppercase">
            Experience
          </p>
          <h2
            className="text-display text-4xl md:text-5xl leading-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Journey &
            <span className="text-muted-foreground"> Timeline</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Timeline */}
          <div>
            {EXPERIENCE.map((exp, i) => (
              <TimelineItem key={i} exp={exp} index={i} />
            ))}
          </div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3
              className="text-xl font-bold mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Achievements
            </h3>

            <div className="space-y-4">
              {CERTIFICATIONS.map((cert, i) => (
                <motion.div
                  key={cert.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="card-premium p-5 flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-xl border border-border flex items-center justify-center text-2xl shrink-0">
                    {cert.icon}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{cert.title}</p>
                    <p className="text-xs text-muted-foreground">{cert.issuer} · {cert.year}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Key strengths */}
            <div className="mt-8 p-6 rounded-2xl bg-foreground text-background">
              <p className="text-xs font-mono opacity-60 mb-4 uppercase tracking-widest">
                What I bring
              </p>
              <ul className="space-y-3">
                {[
                  'End-to-end project ownership',
                  'AI-augmented development (3× faster)',
                  'Production-ready code, always',
                  'Strong problem-solving consistency',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
