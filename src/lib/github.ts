/**
 * GitHub Data Library
 * Uses GitHub REST API v3 and GraphQL API v4.
 * Set GITHUB_TOKEN env var for higher rate limits (5000/hr vs 60/hr).
 */

export interface GitHubData {
  user: GitHubUser;
  repos: GitHubRepo[];
  languages: Record<string, number>;
  contributionData: ContributionWeek[];
  totalContributions: number;
  currentStreak: number;
  longestStreak: number;
}

export interface GitHubUser {
  login: string;
  name: string;
  bio: string;
  avatarUrl: string;
  followers: number;
  following: number;
  publicRepos: number;
  company: string | null;
  location: string | null;
  blog: string | null;
}

export interface GitHubRepo {
  name: string;
  description: string | null;
  url: string;
  homepage: string | null;
  stars: number;
  forks: number;
  language: string | null;
  topics: string[];
  updatedAt: string;
  isForked: boolean;
}

export interface ContributionWeek {
  contributionDays: ContributionDay[];
}

export interface ContributionDay {
  contributionCount: number;
  date: string;
  color: string;
}

const GITHUB_API = 'https://api.github.com';
const GITHUB_GRAPHQL = 'https://api.github.com/graphql';

function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

async function fetchGitHubUser(username: string): Promise<GitHubUser> {
  const res = await fetch(`${GITHUB_API}/users/${username}`, {
    headers: getHeaders(),
    next: { revalidate: 21600 },
  });
  const data = await res.json();
  return {
    login: data.login,
    name: data.name ?? username,
    bio: data.bio ?? '',
    avatarUrl: data.avatar_url,
    followers: data.followers,
    following: data.following,
    publicRepos: data.public_repos,
    company: data.company,
    location: data.location,
    blog: data.blog,
  };
}

async function fetchGitHubRepos(username: string): Promise<GitHubRepo[]> {
  const res = await fetch(
    `${GITHUB_API}/users/${username}/repos?sort=updated&per_page=20&type=owner`,
    {
      headers: getHeaders(),
      next: { revalidate: 21600 },
    }
  );
  const data = await res.json();
  if (!Array.isArray(data)) return [];

  return data
    .filter((r: any) => !r.fork)
    .slice(0, 12)
    .map((r: any) => ({
      name: r.name,
      description: r.description,
      url: r.html_url,
      homepage: r.homepage,
      stars: r.stargazers_count,
      forks: r.forks_count,
      language: r.language,
      topics: r.topics ?? [],
      updatedAt: r.updated_at,
      isForked: r.fork,
    }));
}

async function fetchLanguages(username: string, repos: GitHubRepo[]): Promise<Record<string, number>> {
  const languageMap: Record<string, number> = {};
  const topRepos = repos.slice(0, 8);

  await Promise.allSettled(
    topRepos.map(async (repo) => {
      try {
        const res = await fetch(`${GITHUB_API}/repos/${username}/${repo.name}/languages`, {
          headers: getHeaders(),
          next: { revalidate: 86400 },
        });
        const data = await res.json();
        Object.entries(data).forEach(([lang, bytes]) => {
          languageMap[lang] = (languageMap[lang] ?? 0) + (bytes as number);
        });
      } catch {
        // Silently skip failed repos
      }
    })
  );

  return languageMap;
}

async function fetchContributions(username: string): Promise<{
  weeks: ContributionWeek[];
  total: number;
}> {
  if (!process.env.GITHUB_TOKEN) {
    // Without token, return empty (GraphQL requires auth)
    return { weeks: [], total: 0 };
  }

  const query = `
    query ($username: String!) {
      user(login: $username) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
                color
              }
            }
          }
        }
      }
    }
  `;

  try {
    const res = await fetch(GITHUB_GRAPHQL, {
      method: 'POST',
      headers: {
        ...getHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables: { username } }),
      next: { revalidate: 21600 },
    });
    const json = await res.json();
    const calendar =
      json?.data?.user?.contributionsCollection?.contributionCalendar;
    return {
      weeks: calendar?.weeks ?? [],
      total: calendar?.totalContributions ?? 0,
    };
  } catch {
    return { weeks: [], total: 0 };
  }
}

function calculateStreaks(weeks: ContributionWeek[]): {
  current: number;
  longest: number;
} {
  const days = weeks
    .flatMap((w) => w.contributionDays)
    .sort((a, b) => a.date.localeCompare(b.date));

  let currentStreak = 0;
  let longestStreak = 0;
  let streak = 0;

  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].contributionCount > 0) {
      streak++;
      if (i === days.length - 1 || days[i + 1].contributionCount > 0) {
        currentStreak = streak;
      }
    } else {
      if (streak > longestStreak) longestStreak = streak;
      if (i === days.length - 1) currentStreak = 0;
      streak = 0;
    }
  }

  if (streak > longestStreak) longestStreak = streak;

  return { current: currentStreak, longest: longestStreak };
}

export async function getGitHubData(username: string): Promise<GitHubData> {
  try {
    const [user, repos] = await Promise.all([
      fetchGitHubUser(username),
      fetchGitHubRepos(username),
    ]);

    const [languages, contributions] = await Promise.all([
      fetchLanguages(username, repos),
      fetchContributions(username),
    ]);

    const { current, longest } = calculateStreaks(contributions.weeks);

    return {
      user,
      repos,
      languages,
      contributionData: contributions.weeks,
      totalContributions: contributions.total,
      currentStreak: current,
      longestStreak: longest,
    };
  } catch (error) {
    console.error('Error fetching GitHub data:', error);
    return {
      user: {
        login: username,
        name: 'Arsh Khan',
        bio: 'Full Stack Developer',
        avatarUrl: `https://avatars.githubusercontent.com/${username}`,
        followers: 0,
        following: 0,
        publicRepos: 0,
        company: null,
        location: null,
        blog: null,
      },
      repos: [],
      languages: {},
      contributionData: [],
      totalContributions: 0,
      currentStreak: 0,
      longestStreak: 0,
    };
  }
}
