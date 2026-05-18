'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Github, Linkedin, Mail, Download, MapPin, Circle } from 'lucide-react';
import { PERSONAL, TECH_STACK } from '@/lib/data';

// ── Animated text cycling ──────────────────────────────────────────
const ROLES = [
  'Full Stack Developer',
  'MERN Stack Engineer',
  'React Specialist',
  'Node.js Developer',
  'Open to Opportunities',
];

function RoleCycler() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % ROLES.length);
        setVisible(true);
      }, 300);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <span
      className="inline-block transition-all duration-300"
      style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(8px)' }}
    >
      {ROLES[index]}
    </span>
  );
}

// ── Scrolling tech ticker ──────────────────────────────────────────
function TechTicker() {
  const items = [...TECH_STACK, ...TECH_STACK]; // duplicate for infinite loop
  return (
    <div className="relative w-full overflow-hidden py-3">
      {/* Fade masks */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-background to-transparent" />

      <motion.div
        className="flex gap-4 w-max"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
      >
        {items.map((tech, i) => (
          <span
            key={i}
            className="tag whitespace-nowrap text-[11px]"
          >
            {tech}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ── Live clock ─────────────────────────────────────────────────────
function LiveClock() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () =>
      setTime(
        new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Asia/Kolkata',
        })
      );
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return <span>{time} IST</span>;
}

// ── Ambient background particles ──────────────────────────────────
function AmbientBg() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {/* Dot grid */}
      <div className="absolute inset-0 bg-dot-grid opacity-40 dark:opacity-20" />

      {/* Subtle radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gradient-radial opacity-10 dark:opacity-[0.06]"
        style={{
          background: 'radial-gradient(circle, hsl(0 0% 50%) 0%, transparent 70%)',
        }}
      />
    </div>
  );
}

// ── Main Hero ──────────────────────────────────────────────────────
export function HeroSection() {
  const fadeUp = {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center pt-24 pb-12 section-padding"
    >
      <AmbientBg />

      <div className="container-main relative z-10">
        {/* Status badge */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-10"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono border border-border bg-muted/50">
            <Circle className="w-2 h-2 fill-emerald-500 text-emerald-500 animate-pulse" />
            Available for work
            <span className="text-muted-foreground ml-1">·</span>
            <LiveClock />
          </span>
        </motion.div>

        {/* Headline */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6"
        >
          <h1
            className="text-display text-[clamp(3rem,8vw,7rem)] leading-none tracking-tight mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            <span className="block">Arsh Khan</span>
            <span className="block text-muted-foreground">
              <RoleCycler />
            </span>
          </h1>
        </motion.div>

        {/* Description */}
        <motion.p
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-muted-foreground text-lg md:text-xl max-w-2xl leading-relaxed mb-10"
        >
          Building{' '}
          <span className="text-foreground font-medium">production-ready web products</span>{' '}
          with clean architecture — MERN stack, React, and modern AI-augmented development
          workflows.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap items-center gap-4 mb-16"
        >
          <a
            href="#projects"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-foreground text-background font-medium text-sm hover:opacity-80 transition-opacity group"
          >
            View my work
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href={PERSONAL.resumeUrl}
            download
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors"
          >
            <Download className="w-4 h-4" />
            Resume
          </a>
          <a
            href={`mailto:${PERSONAL.email}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors"
          >
            <Mail className="w-4 h-4" />
            Get in touch
          </a>
        </motion.div>

        {/* Social + location */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-16"
        >
          <a
            href={PERSONAL.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-foreground transition-colors"
          >
            <Github className="w-4 h-4" />
            <span>Arshkhandev</span>
          </a>
          <a
            href={PERSONAL.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-foreground transition-colors"
          >
            <Linkedin className="w-4 h-4" />
            <span>LinkedIn</span>
          </a>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            Available Globally
          </span>
        </motion.div>
      </div>

      {/* Tech ticker at bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="relative z-10 border-t border-border"
      >
        <TechTicker />
      </motion.div>
    </section>
  );
}
