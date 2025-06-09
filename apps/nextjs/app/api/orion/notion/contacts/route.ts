import { NextRequest, NextResponse } from 'next/server';
import { fetchContactsFromNotion } from '@shared/lib/notion_service';
import { auth } from '@shared/auth';

interface FetchContactsApiResponse {
  success: boolean;
  contacts?: any[];
  error?: string;
}

export async function GET(request: NextRequest): Promise<NextResponse<FetchContactsApiResponse>> {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const contacts = await fetchContactsFromNotion();
    return NextResponse.json({ success: true, contacts: contacts });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch contacts' }, { status: 500 });
  }
}
