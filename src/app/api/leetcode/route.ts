import { NextResponse } from 'next/server';
import { getLeetCodeStats } from '@/lib/leetcode';

// Revalidate every 6 hours
export const revalidate = 21600;

export async function GET() {
  try {
    const username = process.env.NEXT_PUBLIC_LEETCODE_USERNAME ?? 'arsh_khan_dev';
    const data = await getLeetCodeStats(username);
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=21600, stale-while-revalidate=43200',
      },
    });
  } catch (error) {
    console.error('LeetCode API error:', error);
    return NextResponse.json({ error: 'Failed to fetch LeetCode stats' }, { status: 500 });
  }
}
