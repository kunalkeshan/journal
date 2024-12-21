import type { MetadataRoute } from 'next';
import path from 'path';
import getAllMarkdownFiles from '@/lib/get-all-md-files';
import { SITE_URL } from '@/config/site';
import { LOGS_DIR } from '@/config';

const DEFAULT_SITEMAPS: MetadataRoute.Sitemap = [
	{
		url: SITE_URL.href,
		lastModified: new Date(),
		changeFrequency: 'yearly',
		priority: 1,
	},
];

export default function sitemap(): MetadataRoute.Sitemap {
	try {
		const markdownFilePaths = getAllMarkdownFiles(LOGS_DIR);

		const logSitemaps: MetadataRoute.Sitemap = markdownFilePaths.map(
			(filePath) => {
				const relativePath = path.relative(LOGS_DIR, filePath);
				const slugArray = relativePath
					.replace(/\.(md|mdx)$/, '')
					.split(path.sep);
				return {
					url: `${SITE_URL.href}/logs/${slugArray.join('/')}`,
					lastModified: new Date(),
					changeFrequency: 'monthly',
					priority: 0.8,
				};
			}
		);

		return [...logSitemaps, ...DEFAULT_SITEMAPS];
	} catch {
		return [...DEFAULT_SITEMAPS];
	}
}
