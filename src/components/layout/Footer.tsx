import { Github, Linkedin, Mail, Code2 } from 'lucide-react';
import { PERSONAL } from '@/lib/data';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="container-main py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div>
            <p
              className="font-bold text-lg"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Arsh Khan
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Full Stack Developer · {PERSONAL.location}
            </p>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-4">
            <a
              href={PERSONAL.github}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href={PERSONAL.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href={`mailto:${PERSONAL.email}`}
              className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors"
              aria-label="Email"
            >
              <Mail className="w-4 h-4" />
            </a>
            <a
              href={PERSONAL.leetcode}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors"
              aria-label="LeetCode"
            >
              <Code2 className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            © {year} Arsh Khan. Crafted with Next.js 15 + Framer Motion.
          </p>
          <p className="text-xs text-muted-foreground font-mono">
            Open to opportunities — {PERSONAL.availability}
          </p>
        </div>
      </div>
    </footer>
  );
}
