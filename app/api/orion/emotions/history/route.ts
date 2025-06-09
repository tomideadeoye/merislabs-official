import { NextRequest, NextResponse } from 'next/server';
import { query, sql } from '@shared/lib/database';
import { EmotionalLogEntry } from '@shared/types/orion';

export const dynamic = "force-dynamic";
