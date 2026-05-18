import { NextResponse } from 'next/server';
import { getGitHubData } from '@/lib/github';

export const revalidate = 21600;

export async function GET() {
  try {
    const username = process.env.NEXT_PUBLIC_GITHUB_USERNAME ?? 'Arshkhandev';
    const data = await getGitHubData(username);
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=21600, stale-while-revalidate=43200',
      },
    });
  } catch (error) {
    console.error('GitHub API error:', error);
    return NextResponse.json({ error: 'Failed to fetch GitHub data' }, { status: 500 });
  }
}
