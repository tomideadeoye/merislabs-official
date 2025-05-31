import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import type { Idea } from '@/types/ideas';

/**
 * API route for fetching ideas
 */
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const status = url.searchParams.get('status');
    const tag = url.searchParams.get('tag');
    
    // Build query with filters
    let query = `SELECT * FROM ideas WHERE 1=1`;
    const params: any = {};
    
    if (status) {
      query += ` AND status = @status`;
      params.status = status;
    }
    
    // Add sorting
    query += ` ORDER BY updatedAt DESC`;
    
    // Execute query
    const stmt = db.prepare(query);
    const rows = stmt.all(params);
    
    // Parse JSON fields
    const ideas: Idea[] = rows.map((row: any) => ({
      id: row.id,
      title: row.title,
      briefDescription: row.briefDescription,
      status: row.status,
      tags: JSON.parse(row.tags || '[]'),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      dueDate: row.dueDate,
      priority: row.priority
    }));
    
    // If tag filter is provided, filter in memory (since tags are stored as JSON)
    const filteredIdeas = tag 
      ? ideas.filter(idea => idea.tags?.some(t => t.toLowerCase() === tag.toLowerCase()))
      : ideas;
    
    return NextResponse.json({ 
      success: true, 
      ideas: filteredIdeas
    });
  } catch (error: any) {
    console.error('Error in GET /api/orion/ideas:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'An unexpected error occurred' 
    }, { status: 500 });
  }
}