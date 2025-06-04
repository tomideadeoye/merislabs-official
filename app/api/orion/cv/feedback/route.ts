import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

interface FeedbackPayload {
  componentId: string;
  opportunityId: string;
  tailoredContent: string;
  rating: 'positive' | 'negative';
  comments?: string;
}

export async function GET() {
  return NextResponse.json({ success: false, error: 'Method Not Allowed' }, { status: 405 });
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const payload: FeedbackPayload = await request.json();

    if (!payload.componentId || !payload.opportunityId || !payload.rating) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // In a real implementation, this would store the feedback in a database
    // For now, we'll just log it and return success
    console.log('CV Tailoring Feedback:', payload);

    // Example database operation:
    // await db.cvFeedback.create({
    //   data: {
    //     componentId: payload.componentId,
    //     opportunityId: payload.opportunityId,
    //     tailoredContent: payload.tailoredContent,
    //     rating: payload.rating,
    //     comments: payload.comments,
    //     userId: session.user.id
    //   }
    // });

    return NextResponse.json({
      success: true,
      message: 'Feedback recorded successfully'
    });
  } catch (error: any) {
    console.error('Error recording CV feedback:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to record feedback' },
      { status: 500 }
    );
  }
}
