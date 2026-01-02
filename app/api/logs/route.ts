import { NextRequest, NextResponse } from 'next/server';
import { getAllMdFilesData } from '@/lib/get-all-md-files-data';
import { LOGS_DIR } from '@/config';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  const allLogs = await getAllMdFilesData({ dirPath: LOGS_DIR });
  const totalLogs = allLogs.length;
  const totalPages = Math.ceil(totalLogs / limit);

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedLogs = allLogs.slice(startIndex, endIndex);

  return NextResponse.json({
    logs: paginatedLogs,
    totalPages,
  });
}
