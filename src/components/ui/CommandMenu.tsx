'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from 'cmdk';
import {
  Home, User, Code2, Briefcase, Mail, Github,
  Linkedin, Download, ExternalLink, Sun, Moon, Monitor
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { PERSONAL } from '@/lib/data';

interface CommandAction {
  icon: React.ReactNode;
  label: string;
  shortcut?: string;
  action: () => void;
}

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const { setTheme } = useTheme();

  // Open on ⌘K / Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((p) => !p);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setOpen(false);
  };

  const navigate = (href: string) => {
    window.open(href, '_blank', 'noopener');
    setOpen(false);
  };

  const NAVIGATION: CommandAction[] = [
    { icon: <Home className="w-4 h-4" />, label: 'Home', action: () => scrollTo('hero') },
    { icon: <User className="w-4 h-4" />, label: 'About', action: () => scrollTo('about') },
    { icon: <Code2 className="w-4 h-4" />, label: 'Skills', action: () => scrollTo('skills') },
    { icon: <Briefcase className="w-4 h-4" />, label: 'Projects', action: () => scrollTo('projects') },
    { icon: <Code2 className="w-4 h-4" />, label: 'LeetCode Stats', action: () => scrollTo('leetcode') },
    { icon: <Github className="w-4 h-4" />, label: 'GitHub Activity', action: () => scrollTo('github') },
    { icon: <Mail className="w-4 h-4" />, label: 'Contact', action: () => scrollTo('contact') },
  ];

  const SOCIALS: CommandAction[] = [
    { icon: <Github className="w-4 h-4" />, label: 'GitHub', action: () => navigate(PERSONAL.github) },
    { icon: <Linkedin className="w-4 h-4" />, label: 'LinkedIn', action: () => navigate(PERSONAL.linkedin) },
    { icon: <ExternalLink className="w-4 h-4" />, label: 'LeetCode', action: () => navigate(PERSONAL.leetcode) },
    { icon: <Mail className="w-4 h-4" />, label: 'Email me', action: () => { window.location.href = `mailto:${PERSONAL.email}`; setOpen(false); } },
    { icon: <Download className="w-4 h-4" />, label: 'Download Resume', action: () => navigate(PERSONAL.resumeUrl) },
  ];

  const THEMES: CommandAction[] = [
    { icon: <Sun className="w-4 h-4" />, label: 'Light mode', action: () => { setTheme('light'); setOpen(false); } },
    { icon: <Moon className="w-4 h-4" />, label: 'Dark mode', action: () => { setTheme('dark'); setOpen(false); } },
    { icon: <Monitor className="w-4 h-4" />, label: 'System theme', action: () => { setTheme('system'); setOpen(false); } },
  ];

  return (
    <>
      {/* Trigger hint — visible in navbar area */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <button
          onClick={() => setOpen(true)}
          className="glass flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>Search or jump to…</span>
          <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded border border-border">
            ⌘K
          </kbd>
        </button>
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <style jsx global>{`
          [cmdk-overlay] {
            position: fixed; inset: 0; z-index: 60;
            background: hsl(0 0% 0% / 0.5);
            backdrop-filter: blur(4px);
          }
          [cmdk-dialog] {
            position: fixed; top: 30%; left: 50%;
            transform: translateX(-50%) translateY(-50%);
            z-index: 61; width: 100%; max-width: 520px; padding: 0 16px;
          }
          [cmdk-root] {
            background: hsl(var(--card));
            border: 1px solid hsl(var(--border));
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 32px 64px -12px rgba(0,0,0,0.4);
          }
          [cmdk-input-wrapper] {
            display: flex; align-items: center; gap: 8px;
            padding: 14px 16px; border-bottom: 1px solid hsl(var(--border));
          }
          [cmdk-input] {
            flex: 1; background: transparent; outline: none; border: none;
            font-size: 14px; color: hsl(var(--foreground));
            font-family: var(--font-sans);
          }
          [cmdk-input]::placeholder { color: hsl(var(--muted-foreground)); }
          [cmdk-list] { padding: 8px; max-height: 320px; overflow-y: auto; }
          [cmdk-group-heading] {
            font-size: 10px; font-weight: 500; letter-spacing: 0.08em;
            text-transform: uppercase; color: hsl(var(--muted-foreground));
            padding: 8px 8px 4px;
            font-family: var(--font-mono);
          }
          [cmdk-item] {
            display: flex; align-items: center; gap: 10px;
            padding: 10px 10px; border-radius: 8px; cursor: pointer;
            font-size: 13px; transition: background 0.1s;
            color: hsl(var(--foreground));
          }
          [cmdk-item][data-selected] {
            background: hsl(var(--muted));
          }
          [cmdk-empty] {
            text-align: center; padding: 24px; font-size: 13px;
            color: hsl(var(--muted-foreground));
          }
          [cmdk-separator] { height: 1px; background: hsl(var(--border)); margin: 4px 0; }
        `}</style>

        <Command>
          <div cmdk-input-wrapper="">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style={{ color: 'hsl(var(--muted-foreground))', flexShrink: 0 }}>
              <path d="M6.5 1a5.5 5.5 0 1 0 3.594 9.715l3.595 3.596a.75.75 0 0 0 1.06-1.06l-3.595-3.597A5.5 5.5 0 0 0 6.5 1Zm-4 5.5a4 4 0 1 1 8 0 4 4 0 0 1-8 0Z"/>
            </svg>
            <CommandInput placeholder="Search sections, links, actions…" />
          </div>
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Navigate">
              {NAVIGATION.map((item) => (
                <CommandItem key={item.label} onSelect={item.action}>
                  {item.icon}
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Links">
              {SOCIALS.map((item) => (
                <CommandItem key={item.label} onSelect={item.action}>
                  {item.icon}
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Theme">
              {THEMES.map((item) => (
                <CommandItem key={item.label} onSelect={item.action}>
                  {item.icon}
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
