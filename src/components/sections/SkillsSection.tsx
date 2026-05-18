'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useState } from 'react';
import { SKILLS, SkillCategory } from '@/lib/data';
import { cn } from '@/lib/utils';

function SkillBar({ name, level, delay }: { name: string; level: number; delay: number }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div ref={ref} className="group">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm font-medium">{name}</span>
        <span className="text-xs font-mono text-muted-foreground">{level}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-foreground"
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : { width: 0 }}
          transition={{ duration: 0.8, delay, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

function CategoryCard({ category, active, onClick }: {
  category: SkillCategory;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'text-left p-4 rounded-xl border transition-all duration-200',
        active
          ? 'border-foreground bg-foreground text-background'
          : 'border-border bg-card hover:border-foreground/40'
      )}
    >
      <span className="text-2xl block mb-2">{category.icon}</span>
      <span className="text-sm font-semibold">{category.name}</span>
      <span className={cn(
        'block text-xs mt-0.5',
        active ? 'text-background/70' : 'text-muted-foreground'
      )}>
        {category.skills.length} technologies
      </span>
    </button>
  );
}

export function SkillsSection() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const current = SKILLS[activeCategory];

  return (
    <section id="skills" className="section-padding border-t border-border">
      <div className="container-main" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-mono text-xs text-muted-foreground mb-4 tracking-widest uppercase">
            Skills
          </p>
          <h2
            className="text-display text-4xl md:text-5xl mb-4 leading-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Technical
            <span className="text-muted-foreground"> Expertise</span>
          </h2>
          <p className="text-muted-foreground mb-12 max-w-xl">
            A curated set of tools and technologies I use to ship production-quality
            products from idea to deployment.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-[auto_1fr] gap-8 items-start">
          {/* Category selector */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex md:flex-col gap-3 overflow-x-auto pb-2 md:pb-0 md:w-48"
          >
            {SKILLS.map((cat, i) => (
              <CategoryCard
                key={cat.name}
                category={cat}
                active={activeCategory === i}
                onClick={() => setActiveCategory(i)}
              />
            ))}
          </motion.div>

          {/* Skills list */}
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="card-premium p-8 space-y-6"
          >
            <div className="flex items-center gap-3 mb-8">
              <span className="text-3xl">{current.icon}</span>
              <div>
                <h3
                  className="text-xl font-bold"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {current.name}
                </h3>
                <p className="text-xs text-muted-foreground font-mono">
                  {current.skills.length} skills
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {current.skills.map((skill, i) => (
                <SkillBar
                  key={skill.name}
                  name={skill.name}
                  level={skill.level}
                  delay={i * 0.06}
                />
              ))}
            </div>

            {/* AI tools callout */}
            {current.name === 'Tools & AI' && (
              <div className="mt-6 p-4 rounded-lg bg-muted border border-border">
                <p className="text-xs font-mono text-muted-foreground mb-1">Proficient in 10+ AI tools</p>
                <p className="text-sm">
                  Claude · ChatGPT · GitHub Copilot · Cursor · Perplexity · v0.dev
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
