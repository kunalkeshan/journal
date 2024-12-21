import fs from 'fs';
import path from 'path';
import { compileMDX } from 'next-mdx-remote/rsc';
import { LOGS_DIR } from '@/config';
import type { Metadata } from 'next';
import type { LogMetadata } from '@/types/logs';
import { DEFAULT_METADATA } from '@/config/site';

async function getMarkdownMetadata(slugs: string[]): Promise<Metadata> {
	let mdFilePath = path.join(LOGS_DIR, ...slugs) + '.md';
	let mdfileExists = fs.existsSync(mdFilePath);

	if (!mdfileExists) {
		mdFilePath = path.join(LOGS_DIR, ...slugs) + '.mdx';
		mdfileExists = fs.existsSync(mdFilePath);
	}

	if (!mdfileExists) {
		return DEFAULT_METADATA;
	}
	const source = fs.readFileSync(mdFilePath, 'utf-8');
	const { frontmatter } = await compileMDX<LogMetadata>({
		source,
		options: {
			parseFrontmatter: true,
		},
	});
	return {
		...DEFAULT_METADATA,
		title: frontmatter.title,
		description: frontmatter.description,
		openGraph: {
			...DEFAULT_METADATA.openGraph,
			title: frontmatter.title,
			description: frontmatter.description,
			images: [encodeURI(`/api/og?title${frontmatter.title}`)],
		},
		twitter: {
			...DEFAULT_METADATA.twitter,
			title: frontmatter.title,
			description: frontmatter.description,
			images: [encodeURI(`/api/og?title${frontmatter.title}`)],
		},
	};
}

export default getMarkdownMetadata;
