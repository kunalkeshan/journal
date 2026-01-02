import { NextRequest, NextResponse } from 'next/server';
import Fuse from 'fuse.js';
import { getAllMdFilesData } from '@/lib/get-all-md-files-data';
import { LOGS_DIR } from '@/config';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q');
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  if (!query) {
    return NextResponse.json(
      { error: 'Query parameter "q" is required' },
      { status: 400 }
    );
  }

  const allLogs = await getAllMdFilesData({ dirPath: LOGS_DIR });

  const fuse = new Fuse(allLogs, {
    keys: ['frontmatter.title', 'content'],
    includeScore: true,
    threshold: 0.4,
  });

  const results = fuse.search(query);
  const searchResults = results.map((result) => result.item);

  const totalResults = searchResults.length;
  const totalPages = Math.ceil(totalResults / limit);

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedResults = searchResults.slice(startIndex, endIndex);

  return NextResponse.json({
    logs: paginatedResults,
    totalPages,
  });
}
