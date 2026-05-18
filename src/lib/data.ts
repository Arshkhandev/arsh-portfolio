/**
 * Static portfolio data — extracted from Arsh Khan's resume.
 * Edit this file to update any portfolio content.
 */

// ── Personal Info ──────────────────────────────────────────────────
export const PERSONAL = {
  name: 'Arsh Khan',
  role: 'Full Stack Developer',
  tagline: 'Building production-ready products with clean architecture.',
  bio: `Motivated Full Stack Developer with hands-on experience building and deploying
web applications using the MERN stack. Skilled in crafting responsive frontends
with React and Tailwind CSS, and developing robust backend systems with Node.js,
Express, and MongoDB. Proficient in integrating modern AI tools to accelerate
development workflows and deliver high-quality solutions.`,
  email: 'arsh.khan.dev@gmail.com',
  github: 'https://github.com/Arshkhandev',
  linkedin: 'https://linkedin.com/in/arsh-khan-845442371',
  leetcode: 'https://leetcode.com/u/arsh_khan_dev/',
  location: 'Available Globally',
  availability: 'Open to full-time & freelance',
  resumeUrl: '/ArshKhanResume.pdf',
} as const;

// ── Projects ───────────────────────────────────────────────────────
export interface Project {
  id: string;
  title: string;
  description: string;
  problem: string;
  stack: string[];
  liveUrl?: string;
  githubUrl?: string;
  metrics?: string[];
  featured: boolean;
  category: 'fullstack' | 'frontend' | 'backend' | 'tool';
  status: 'live' | 'wip' | 'archived';
}

export const PROJECTS: Project[] = [
  {
    id: 'thesafetynet',
    title: 'TheSafetyNet',
    description:
      'A fully responsive web application built with a component-driven React architecture, optimised for performance and exceptional user experience.',
    problem:
      'Needed a fast, accessible safety-information platform with optimal Core Web Vitals scores.',
    stack: ['React', 'Tailwind CSS', 'Vercel'],
    liveUrl: 'https://thesafetynet.vercel.app',
    metrics: ['100 Lighthouse', 'Sub-second LCP', 'Mobile-first'],
    featured: true,
    category: 'frontend',
    status: 'live',
  },
  {
    id: 'catify-ecommerce',
    title: 'E-Commerce Platform',
    description:
      'Full-stack MERN e-commerce solution for businesses — product management, shopping cart, REST API backend, and scalable production-ready architecture.',
    problem:
      'Client needed a production-grade online store with custom admin controls and a real-time cart experience.',
    stack: ['React', 'Node.js', 'Express', 'MongoDB', 'REST API', 'Vercel'],
    liveUrl: 'https://catify-fawn.vercel.app',
    metrics: ['Client project', 'Scalable architecture', 'REST API'],
    featured: true,
    category: 'fullstack',
    status: 'live',
  },
  {
    id: 'kcalpro',
    title: 'KcalPro',
    description:
      'A calorie and nutrition tracking application enabling users to log meals, monitor daily intake, and achieve health goals with an intuitive dashboard.',
    problem:
      'Users needed a clean, friction-free way to track macros and visualise daily nutritional progress.',
    stack: ['React', 'Node.js', 'MongoDB'],
    githubUrl: 'https://github.com/Arshkhandev/kcalpro',
    metrics: ['Meal logging', 'Macro tracking', 'Progress dashboards'],
    featured: true,
    category: 'fullstack',
    status: 'live',
  },
];

// ── Skills ─────────────────────────────────────────────────────────
export interface SkillCategory {
  name: string;
  icon: string;
  skills: Skill[];
}

export interface Skill {
  name: string;
  level: number; // 0–100
  icon?: string;
}

export const SKILLS: SkillCategory[] = [
  {
    name: 'Frontend',
    icon: '⚡',
    skills: [
      { name: 'React.js', level: 90 },
      { name: 'Next.js', level: 80 },
      { name: 'TypeScript', level: 75 },
      { name: 'Tailwind CSS', level: 92 },
      { name: 'JavaScript ES6+', level: 88 },
      { name: 'HTML5 / CSS3', level: 95 },
    ],
  },
  {
    name: 'Backend',
    icon: '🛠',
    skills: [
      { name: 'Node.js', level: 82 },
      { name: 'Express.js', level: 80 },
      { name: 'MongoDB', level: 78 },
      { name: 'REST APIs', level: 85 },
      { name: 'Java', level: 72 },
    ],
  },
  {
    name: 'Tools & AI',
    icon: '🤖',
    skills: [
      { name: 'Git & GitHub', level: 88 },
      { name: 'Vercel', level: 85 },
      { name: 'Claude AI', level: 90 },
      { name: 'GitHub Copilot', level: 85 },
      { name: 'Cursor', level: 82 },
      { name: 'v0.dev', level: 78 },
    ],
  },
];

// Flat tech stack for hero ticker
export const TECH_STACK = [
  'React', 'Next.js', 'TypeScript', 'Node.js', 'Express',
  'MongoDB', 'Tailwind CSS', 'JavaScript', 'Java', 'REST API',
  'Vercel', 'Git', 'Claude AI', 'GitHub Copilot',
];

// ── Experience ─────────────────────────────────────────────────────
export interface Experience {
  title: string;
  company: string;
  period: string;
  description: string[];
  skills: string[];
  type: 'work' | 'education' | 'freelance';
}

export const EXPERIENCE: Experience[] = [
  {
    title: 'Full Stack Developer',
    company: 'Freelance',
    period: '2023 — Present',
    description: [
      'Delivered production-ready e-commerce platform for client (Catify)',
      'Built and deployed multiple MERN stack applications',
      'Integrated AI development tools for 3× faster delivery',
      'End-to-end ownership from architecture to deployment',
    ],
    skills: ['React', 'Node.js', 'MongoDB', 'Vercel', 'REST API'],
    type: 'freelance',
  },
  {
    title: 'Self-Directed Learning',
    company: 'Full Stack Development',
    period: '2022 — 2023',
    description: [
      'Mastered MERN stack through hands-on project building',
      'Completed LeetCode 30 Days of JavaScript Challenge',
      'Earned Cloud Computing certificate from ExcelR',
      'Google 30 Days Coding Challenge milestone',
    ],
    skills: ['JavaScript', 'React', 'Data Structures', 'Cloud'],
    type: 'education',
  },
];

// ── Certifications ─────────────────────────────────────────────────
export const CERTIFICATIONS = [
  {
    title: 'Certificate of Cloud Computing',
    issuer: 'ExcelR',
    year: '2023',
    icon: '☁️',
  },
  {
    title: '30 Days Coding Challenge',
    issuer: 'Google',
    year: '2023',
    icon: '🎯',
  },
  {
    title: '30 Days of JavaScript Challenge',
    issuer: 'LeetCode',
    year: '2023',
    icon: '⚡',
  },
];

// ── Nav links ──────────────────────────────────────────────────────
export const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Work', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Stats', href: '#leetcode' },
  { label: 'Contact', href: '#contact' },
] as const;
