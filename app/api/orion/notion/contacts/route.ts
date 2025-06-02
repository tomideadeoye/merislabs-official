import { NextRequest, NextResponse } from 'next/server';
import { fetchContactsFromNotion } from '@/lib/notion_service';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import type { ContactShared } from '@/types/orion';

interface FetchContactsApiResponse {
  success: boolean;
  contacts?: ContactShared[];
  error?: string;
}

export async function GET(
  request: NextRequest
): Promise<NextResponse<FetchContactsApiResponse>> {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await fetchContactsFromNotion();

    if (result.success) {
      return NextResponse.json({ success: true, contacts: result.contacts });
    } else {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json({ success: false, error: error.message || 'An unexpected error occurred.' }, { status: 500 });
  }
}
