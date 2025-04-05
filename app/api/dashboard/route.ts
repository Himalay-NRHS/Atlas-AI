// app/api/dashboard/route.ts
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
          onlineDates: true
        }
      });
  
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
  
      // Prepare performance data
      let performanceData: any = [];
      if (user.result) {
        performanceData = Array.isArray(user.result)
          ? user.result.map((quiz: any, index: number) => ({
              quizNumber: index + 1,
              marks: quiz.score || 0
            }))
          : [];
      }
  
      const weakTopics = user.weaktopics || [];
  
      return NextResponse.json({
        user: {
          name: user.name
        },
        performanceData,
        weakTopics,
        onlineDates: user.onlineDates || []
      });
  
    } catch (error) {
      console.error("Dashboard data fetch (by email) error:", error);
      return NextResponse.json(
        { error: 'Failed to fetch dashboard data' },
        { status: 500 }
      );
    }
  }
  