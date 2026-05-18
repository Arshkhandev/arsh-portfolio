import { Navbar } from '@/components/layout/Navbar';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { SkillsSection } from '@/components/sections/SkillsSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { ExperienceSection } from '@/components/sections/ExperienceSection';
import { LeetCodeSection } from '@/components/sections/LeetCodeSection';
import { GitHubSection } from '@/components/sections/GitHubSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { Footer } from '@/components/layout/Footer';
import { getLeetCodeStats } from '@/lib/leetcode';
import { getGitHubData } from '@/lib/github';

// Revalidate every 6 hours — keeps data fresh without hammering APIs
export const revalidate = 21600;

export default async function Home() {
  // Parallel data fetching on the server
  const [leetcodeData, githubData] = await Promise.allSettled([
    getLeetCodeStats('arsh_khan_dev'),
    getGitHubData('Arshkhandev'),
  ]);

  const leetcode = leetcodeData.status === 'fulfilled' ? leetcodeData.value : null;
  const github = githubData.status === 'fulfilled' ? githubData.value : null;

  return (
    <>
      <Navbar />
      <main className="relative">
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <ExperienceSection />
        <LeetCodeSection data={leetcode} />
        <GitHubSection data={github} />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
