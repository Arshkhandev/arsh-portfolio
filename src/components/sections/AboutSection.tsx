'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Zap, Code, Rocket, Brain } from 'lucide-react';
import { PERSONAL, CERTIFICATIONS } from '@/lib/data';

const STRENGTHS = [
  {
    icon: Code,
    title: 'End-to-End Ownership',
    desc: 'From architecture to deployment — full product ownership across the stack.',
  },
  {
    icon: Rocket,
    title: 'Ship Fast',
    desc: 'AI-augmented workflows deliver polished, production-ready code in record time.',
  },
  {
    icon: Brain,
    title: 'Continuous Learner',
    desc: 'Staying current with Next.js 15, TypeScript, and modern engineering patterns.',
  },
  {
    icon: Zap,
    title: 'Performance Focused',
    desc: 'Obsessed with Core Web Vitals, clean code, and scalable architecture.',
  },
];

export function AboutSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 });

  return (
    <section id="about" className="section-padding border-t border-border">
      <div className="container-main" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-2 gap-16 items-start"
        >
          {/* Left: text */}
          <div>
            <p className="text-mono text-xs text-muted-foreground mb-4 tracking-widest uppercase">
              About
            </p>
            <h2
              className="text-display text-4xl md:text-5xl mb-8 leading-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Building things<br />
              <span className="text-muted-foreground">that matter.</span>
            </h2>

            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                I'm a Full Stack Developer who loves turning complex problems into elegant,
                production-ready solutions. My toolkit is built around the MERN stack —
                React, Node.js, Express, and MongoDB — paired with modern tooling like
                Next.js and TypeScript.
              </p>
              <p>
                What sets me apart is how I leverage AI development tools — Claude, Copilot,
                Cursor — not as a crutch, but as a force multiplier that lets me{' '}
                <span className="text-foreground">deliver higher quality, faster</span>.
              </p>
              <p>
                Available for full-time and freelance opportunities worldwide.
              </p>
            </div>

            {/* Certs */}
            <div className="mt-10 space-y-3">
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-mono mb-4">
                Certifications
              </p>
              {CERTIFICATIONS.map((cert) => (
                <div
                  key={cert.title}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card"
                >
                  <span className="text-lg">{cert.icon}</span>
                  <div>
                    <p className="text-sm font-medium leading-tight">{cert.title}</p>
                    <p className="text-xs text-muted-foreground">{cert.issuer} · {cert.year}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: strengths grid */}
          <div className="grid grid-cols-1 gap-4">
            {STRENGTHS.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: 20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
                className="card-premium p-6 cursor-default"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg border border-border flex items-center justify-center shrink-0">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Currently building widget */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="card-premium p-6 border-dashed"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                  Currently building
                </span>
              </div>
              <p className="text-sm font-medium">
                AI-powered MERN applications with Next.js 15
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Server components · TypeScript · App Router
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
