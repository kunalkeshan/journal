import { NextRequest, NextResponse } from 'next/server';
import Fuse from 'fuse.js';
import { getAllMdFilesData } from '@/lib/get-all-md-files-data';
import { LOGS_DIR } from '@/config';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json(
      { error: 'Query parameter "q" is required' },
      { status: 400 }
    );
  }

  const allLogs = await getAllMdFilesData({ dirPath: LOGS_DIR });

  const fuse = new Fuse(allLogs, {
    keys: ['title', 'content'],
    includeScore: true,
    threshold: 0.3,
  });

  const results = fuse.search(query);
  const searchResults = results.map((result) => result.item);

  return NextResponse.json(searchResults);
}
