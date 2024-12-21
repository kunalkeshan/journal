import React, { Suspense } from 'react';
import { MDXRemote } from 'next-mdx-remote/rsc';
import fs from 'fs';
import path from 'path';
import getAllMarkdownFiles from '@/lib/get-all-md-files';
import { LOGS_DIR } from '@/config';

const LogEntryPage = async ({ params }: { params: { slugs: string[] } }) => {
	const mdFilePath = path.join(LOGS_DIR, ...params.slugs) + '.md';
	const fileExists = fs.existsSync(mdFilePath);
	if (!fileExists) {
		return <main>File not found</main>;
	}
	const fileContents = fs.readFileSync(mdFilePath, 'utf-8');
	return (
		<main className='prose'>
			<Suspense fallback={<div>Loading...</div>}>
				<MDXRemote source={fileContents} />
			</Suspense>
		</main>
	);
};

export default LogEntryPage;

export async function generateStaticParams() {
	const markdownFilePaths = getAllMarkdownFiles(LOGS_DIR);
	return markdownFilePaths.map((filePath) => {
		const relativePath = path.relative(LOGS_DIR, filePath);
		const slugArray = relativePath.replace(/\.md$/, '').split(path.sep);
		return {
			slug: slugArray,
		};
	});
}
