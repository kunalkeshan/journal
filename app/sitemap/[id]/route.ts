import { NextResponse } from 'next/server';
import getAllMarkdownFiles from '@/lib/get-all-md-files';
import { LOGS_DIR } from '@/config';
import { SITE_URL } from '@/config/site';
import path from 'path';

export const runtime = 'nodejs';

function buildSitemapXml(urls: { loc: string; lastmod?: string }[]) {
  const body = urls
    .map(
      (u) => `
  <url>
    <loc>${u.loc}</loc>
    ${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}
  </url>`
    )
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(_req: Request, { params }: any) {
  const match = params.id.match(/^(\d+)\.xml$/);
  if (!match) return new NextResponse('Not Found', { status: 404 });

  const page = Number(match[1]);
  const pageSize = 50;
  const allFiles = getAllMarkdownFiles(LOGS_DIR);
  const startIndex = (page - 1) * pageSize;
  const endIndex = page * pageSize;
  const filesForPage = allFiles.slice(startIndex, endIndex);

  const urls = filesForPage.map((filePath: string) => {
    const relativePath = path.relative(LOGS_DIR, filePath);
    const slugArray = relativePath.replace(/\.(md|mdx)$/, '').split(path.sep);
    return {
      loc: `${SITE_URL.href}logs/${slugArray.join('/')}`,
      lastmod: new Date().toISOString(),
    };
  });

  const xml = buildSitemapXml(urls);

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
