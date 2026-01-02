import { NextResponse } from 'next/server';
import { SITE_URL } from '@/config/site';

export async function GET() {
  // You can compute total pages based on count / page size.
  const totalSitemaps = 5;

  const items = Array.from({ length: totalSitemaps }, (_, i) => i + 1)
    .map(
      (n) => `<sitemap><loc>${SITE_URL.href}sitemap/${n}.xml</loc></sitemap>`
    )
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</sitemapindex>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
