import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { email } = data;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Fetch user by email
    const user = await prisma.user.findUnique({
      where: {
        email: email
      },
      select: {
        name: true,
        weaktopics: true,
        result: true,
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Prepare performance data for the graph
    let performanceData: any = [];
    if (user.result && Array.isArray(user.result)) {
      performanceData = user.result.map((quiz: any, index: number) => ({
        quizNumber: index + 1,
        marks: quiz.score || 0
      }));
    }

    const weakTopics = user.weaktopics || [];

    return NextResponse.json({
      user: {
        name: user.name
      },
      performanceData,
      result: user.result, // <--- Added raw result here
      weakTopics
    });

  } catch (error) {
    console.error("Dashboard data fetch (by email) error:", error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
