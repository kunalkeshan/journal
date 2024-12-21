import React, { Suspense } from 'react';
import { MDXRemote } from 'next-mdx-remote/rsc';
import fs from 'fs';
import path from 'path';
import getAllMarkdownFiles from '@/lib/get-all-md-files';
import { LOGS_DIR } from '@/config';
import getMarkdownMetadata from '@/lib/get-md-metadata';

const LogEntryPage = async ({ params }: { params: { slugs: string[] } }) => {
	// https://nextjs.org/docs/messages/sync-dynamic-apis
	const { slugs } = await params;

	let mdFilePath = path.join(LOGS_DIR, ...slugs) + '.md';
	let mdfileExists = fs.existsSync(mdFilePath);

	if (!mdfileExists) {
		mdFilePath = path.join(LOGS_DIR, ...slugs) + '.mdx';
		mdfileExists = fs.existsSync(mdFilePath);
	}

	if (!mdfileExists) {
		return <main>File not found</main>;
	}

	const source = fs.readFileSync(mdFilePath, 'utf-8');
	return (
		<main className='prose'>
			<Suspense fallback={<div>Loading...</div>}>
				<MDXRemote
					source={source}
					options={{ parseFrontmatter: true }}
				/>
			</Suspense>
		</main>
	);
};

export default LogEntryPage;

export async function generateStaticParams() {
	const markdownFilePaths = getAllMarkdownFiles(LOGS_DIR);
	// Example:
	//   filePath = /absolute/path/to/your-project/logs/week1/entry1.md
	//   relativePath = week1/entry1.md
	//   slugArray = ["week1", "entry1"]
	//
	// We'll return { slug: ["week1", "entry1"] } for each file.
	return markdownFilePaths.map((filePath) => {
		// Make file path relative to LOGS_DIR
		const relativePath = path.relative(LOGS_DIR, filePath);
		// Remove ".md" or ".mdx" extension and split by path separator
		const slugArray = relativePath
			.replace(/\.(md|mdx)$/, '')
			.split(path.sep);
		return {
			slug: slugArray,
		};
	});
}

export async function generateMetadata({
	params,
}: {
	params: { slugs: string[] };
}) {
	const { slugs } = await params;
	// https://nextjs.org/docs/messages/sync-dynamic-apis
	const metadata = await getMarkdownMetadata(slugs);
	return metadata;
}
