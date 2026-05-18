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

const LEETCODE_GRAPHQL = 'https://leetcode.com/graphql';

const STATS_QUERY = `
  query getUserProfile($username: String!) {
    allQuestionsCount {
      difficulty
      count
    }
    matchedUser(username: $username) {
      username
      contributions { points }
      profile {
        reputation
        ranking
      }
      submitStats {
        acSubmissionNum {
          difficulty
          count
        }
        totalSubmissionNum {
          difficulty
          count
        }
      }
      submissionCalendar
      recentSubmissionList(limit: 8) {
        title
        titleSlug
        timestamp
        statusDisplay
        lang
      }
    }
  }
`;

const CONTEST_QUERY = `
  query getUserContestRanking($username: String!) {
    userContestRanking(username: $username) {
      attendedContestsCount
      rating
      topPercentage
    }
  }
`;

async function fetchGraphQL(query: string, variables: Record<string, string>) {
  const response = await fetch(LEETCODE_GRAPHQL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Referer': 'https://leetcode.com',
      'Origin': 'https://leetcode.com',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36',
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!response.ok) throw new Error(`LeetCode API ${response.status}`);
  return response.json();
}

export async function getLeetCodeStats(username: string): Promise<LeetCodeStats> {
  try {
    const [statsResult, contestResult] = await Promise.allSettled([
      fetchGraphQL(STATS_QUERY, { username }),
      fetchGraphQL(CONTEST_QUERY, { username }),
    ]);

    const data = statsResult.status === 'fulfilled' ? statsResult.value?.data : null;

    if (!data?.matchedUser) {
      throw new Error('User not found on LeetCode');
    }

    const contestData =
      contestResult.status === 'fulfilled'
        ? contestResult.value?.data?.userContestRanking
        : null;

    const user = data.matchedUser;
    const allQ = data.allQuestionsCount as Array<{ difficulty: string; count: number }>;
    const acStats = user.submitStats.acSubmissionNum as Array<{ difficulty: string; count: number }>;

    const getCount = (arr: typeof acStats, difficulty: string) =>
      arr.find((x) => x.difficulty === difficulty)?.count ?? 0;

    const getTotal = (difficulty: string) =>
      allQ.find((x) => x.difficulty === difficulty)?.count ?? 0;

    const totalSolved = getCount(acStats, 'All');
    const totalQuestions = getTotal('All');

    let calendar: Record<string, number> = {};
    try {
      calendar = JSON.parse(user.submissionCalendar ?? '{}');
    } catch {
      calendar = {};
    }

    return {
      username,
      totalSolved,
      totalQuestions,
      easySolved: getCount(acStats, 'Easy'),
      easyTotal: getTotal('Easy'),
      mediumSolved: getCount(acStats, 'Medium'),
      mediumTotal: getTotal('Medium'),
      hardSolved: getCount(acStats, 'Hard'),
      hardTotal: getTotal('Hard'),
      acceptanceRate: totalQuestions > 0 ? Math.round((totalSolved / totalQuestions) * 100 * 10) / 10 : 0,
      ranking: user.profile.ranking ?? 0,
      contributionPoints: user.contributions.points ?? 0,
      reputation: user.profile.reputation ?? 0,
      submissionCalendar: calendar,
      recentSubmissions: user.recentSubmissionList ?? [],
      contestRating: contestData ? Math.round(contestData.rating) : null,
      contestAttended: contestData?.attendedContestsCount ?? 0,
      contestTopPercentage: contestData?.topPercentage ?? null,
    };
  } catch (error) {
    console.error('Error fetching LeetCode stats:', error);
    return {
      username,
      totalSolved: 0,
      totalQuestions: 3000,
      easySolved: 0,
      easyTotal: 800,
      mediumSolved: 0,
      mediumTotal: 1600,
      hardSolved: 0,
      hardTotal: 600,
      acceptanceRate: 0,
      ranking: 0,
      contributionPoints: 0,
      reputation: 0,
      submissionCalendar: {},
      recentSubmissions: [],
      contestRating: null,
      contestAttended: 0,
      contestTopPercentage: null,
    };
  }
}