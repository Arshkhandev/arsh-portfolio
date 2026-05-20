export interface LeetCodeStats {
  username: string;
  totalSolved: number;
  totalQuestions: number;
  easySolved: number;
  easyTotal: number;
  mediumSolved: number;
  mediumTotal: number;
  hardSolved: number;
  hardTotal: number;
  acceptanceRate: number;
  ranking: number;
  contributionPoints: number;
  reputation: number;
  submissionCalendar: Record<string, number>;
  recentSubmissions: RecentSubmission[];
  contestRating: number | null;
  contestAttended: number;
  contestTopPercentage: number | null;
}

export interface RecentSubmission {
  title: string;
  titleSlug: string;
  timestamp: string;
  statusDisplay: string;
  lang: string;
}

const PROXY_BASE = 'https://alfa-leetcode-api.onrender.com';

export async function getLeetCodeStats(username: string): Promise<LeetCodeStats> {
  try {
    const [profileRes, solvedRes, contestRes, recentRes] = await Promise.allSettled([
      fetch(`${PROXY_BASE}/userProfile/${username}`, { next: { revalidate: 21600 }, signal: AbortSignal.timeout(10000) }),
      fetch(`${PROXY_BASE}/${username}/solved`, { next: { revalidate: 21600 }, signal: AbortSignal.timeout(10000) }),
      fetch(`${PROXY_BASE}/${username}/contest`, { next: { revalidate: 21600 }, signal: AbortSignal.timeout(10000) }),
      fetch(`${PROXY_BASE}/${username}/submission?limit=8`, { next: { revalidate: 21600 }, signal: AbortSignal.timeout(10000) }),
    ]);

    const profileData = profileRes.status === 'fulfilled' && profileRes.value.ok
      ? await profileRes.value.json() : null;

    const solvedData = solvedRes.status === 'fulfilled' && solvedRes.value.ok
      ? await solvedRes.value.json() : null;

    const contestData = contestRes.status === 'fulfilled' && contestRes.value.ok
      ? await contestRes.value.json() : null;

    const recentData = recentRes.status === 'fulfilled' && recentRes.value.ok
      ? await recentRes.value.json() : null;

    // Log calendar for debugging
    console.log('Profile keys:', profileData ? Object.keys(profileData) : 'null');
    console.log('Raw calendar:', String(profileData?.submissionCalendar ?? 'none').slice(0, 200));

    if (!solvedData && !profileData) throw new Error('Could not fetch LeetCode stats');

    // Parse submission calendar
    let calendar: Record<string, number> = {};
    try {
      const raw = profileData?.submissionCalendar ?? '{}';
      calendar = typeof raw === 'string' ? JSON.parse(raw) : (raw ?? {});
      console.log('Calendar entries:', Object.keys(calendar).length);
    } catch {
      calendar = {};
    }

    const recentSubmissions: RecentSubmission[] = (
      recentData?.submission ?? recentData?.recentSubmissionList ?? []
    ).map((s: any) => ({
      title: s.title ?? '',
      titleSlug: s.titleSlug ?? '',
      timestamp: s.timestamp ?? '',
      statusDisplay: s.statusDisplay ?? s.status ?? '',
      lang: s.lang ?? '',
    }));

    const totalSolved = solvedData?.solvedProblem ?? profileData?.totalSolved ?? 0;
    const easySolved = solvedData?.easySolved ?? profileData?.easySolved ?? 0;
    const mediumSolved = solvedData?.mediumSolved ?? profileData?.mediumSolved ?? 0;
    const hardSolved = solvedData?.hardSolved ?? profileData?.hardSolved ?? 0;
    const totalQuestions = solvedData?.totalQuestions ?? 3000;
    const easyTotal = solvedData?.totalEasyQuestions ?? 800;
    const mediumTotal = solvedData?.totalMediumQuestions ?? 1600;
    const hardTotal = solvedData?.totalHardQuestions ?? 600;

    return {
      username, totalSolved, totalQuestions,
      easySolved, easyTotal, mediumSolved, mediumTotal, hardSolved, hardTotal,
      acceptanceRate: totalQuestions > 0 ? Math.round((totalSolved / totalQuestions) * 100 * 10) / 10 : 0,
      ranking: profileData?.ranking ?? 0,
      contributionPoints: profileData?.contributionPoints ?? 0,
      reputation: profileData?.reputation ?? 0,
      submissionCalendar: calendar,
      recentSubmissions,
      contestRating: contestData?.contestRating ? Math.round(contestData.contestRating) : null,
      contestAttended: contestData?.contestAttend ?? 0,
      contestTopPercentage: contestData?.contestTopPercentage ?? null,
    };
  } catch (error) {
    console.error('Error fetching LeetCode stats:', error);
    return {
      username, totalSolved: 0, totalQuestions: 3000,
      easySolved: 0, easyTotal: 800, mediumSolved: 0, mediumTotal: 1600, hardSolved: 0, hardTotal: 600,
      acceptanceRate: 0, ranking: 0, contributionPoints: 0, reputation: 0,
      submissionCalendar: {}, recentSubmissions: [],
      contestRating: null, contestAttended: 0, contestTopPercentage: null,
    };
  }
}