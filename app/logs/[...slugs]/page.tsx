import React, { Suspense } from 'react';
import { MDXRemote } from 'next-mdx-remote/rsc';
import fs from 'fs';
import path from 'path';
import remarkGfm from 'remark-gfm';
import getAllMarkdownFiles from '@/lib/get-all-md-files';
import { LOGS_DIR } from '@/config';
import getMarkdownMetadata from '@/lib/get-md-metadata';
import Link from 'next/link';

const LogEntryPage = async ({
	params,
}: {
	params?: Promise<{ slugs?: string[] }>;
}) => {
	// Destructure slugs from params
	const { slugs } = (await params) ?? {};

	// Construct the file path
	let mdFilePath = path.join(LOGS_DIR, ...slugs!) + '.md';
	let mdfileExists = fs.existsSync(mdFilePath);

	if (!mdfileExists) {
		mdFilePath = path.join(LOGS_DIR, ...slugs!) + '.mdx';
		mdfileExists = fs.existsSync(mdFilePath);
	}

	if (!mdfileExists) {
		return <main>File not found</main>;
	}

	// Read and render the Markdown/MDX file
	const source = fs.readFileSync(mdFilePath, 'utf-8');
	return (
		<main>
			<div className='container mx-auto py-10 px-10 lg:px-0'>
				<div className='prose mx-auto'>
					<Suspense fallback={<div>Loading...</div>}>
						<MDXRemote
							source={source}
							options={{
								parseFrontmatter: true,
								mdxOptions: { remarkPlugins: [remarkGfm] },
							}}
						/>
					</Suspense>
				</div>
				<div className='flex justify-center mt-10'>
					<Link href='/logs' prefetch={false}>
						← Back to all logs
					</Link>
				</div>
			</div>
		</main>
	);
};

export default LogEntryPage;

export async function generateStaticParams() {
	const markdownFilePaths = getAllMarkdownFiles(LOGS_DIR);
	return markdownFilePaths.map((filePath) => {
		const relativePath = path.relative(LOGS_DIR, filePath);
		const slugArray = relativePath
			.replace(/\.(md|mdx)$/, '')
			.split(path.sep);
		return {
			slugs: slugArray, // Match the expected param name
		};
	});
}

export async function generateMetadata({
	params,
}: {
	params?: Promise<{ slugs?: string[] }>;
}) {
	const { slugs } = (await params) ?? {};
	const metadata = await getMarkdownMetadata(slugs!);
	return metadata;
}
