'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useState } from 'react';
import { Mail, Github, Linkedin, ArrowUpRight, Copy, Check, Download } from 'lucide-react';
import { PERSONAL } from '@/lib/data';

export function ContactSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    await navigator.clipboard.writeText(PERSONAL.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const links = [
    {
      icon: Github,
      label: 'GitHub',
      sub: '@Arshkhandev',
      href: PERSONAL.github,
      external: true,
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      sub: 'arsh-khan-845442371',
      href: PERSONAL.linkedin,
      external: true,
    },
  ];

  return (
    <section id="contact" className="section-padding border-t border-border">
      <div className="container-main" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <p className="text-mono text-xs text-muted-foreground mb-4 tracking-widest uppercase">
            Contact
          </p>
          <h2
            className="text-display text-4xl md:text-6xl leading-none mb-8"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Let's build<br />
            <span className="text-muted-foreground">something great.</span>
          </h2>

          <p className="text-muted-foreground text-lg max-w-lg mb-12 leading-relaxed">
            Open to full-time opportunities and freelance projects. If you have a product to
            build or a team to join — let's talk.
          </p>

          {/* Email CTA */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center gap-3 mb-12"
          >
            <a
              href={`mailto:${PERSONAL.email}`}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-foreground text-background font-medium hover:opacity-80 transition-opacity group"
            >
              <Mail className="w-4 h-4" />
              Send an email
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            <button
              onClick={copyEmail}
              className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl border border-border hover:bg-muted transition-colors text-sm"
              title="Copy email address"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  {PERSONAL.email}
                </>
              )}
            </button>

            <a
              href={PERSONAL.resumeUrl}
              download
              className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl border border-border hover:bg-muted transition-colors text-sm"
            >
              <Download className="w-4 h-4" />
              Resume
            </a>
          </motion.div>

          {/* Social links */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.35 }}
            className="flex flex-wrap gap-4"
          >
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                className="card-premium flex items-center gap-3 p-4 pr-5 group"
              >
                <div className="w-10 h-10 rounded-lg border border-border flex items-center justify-center">
                  <link.icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">{link.label}</p>
                  <p className="text-xs text-muted-foreground font-mono">{link.sub}</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
