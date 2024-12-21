import fs from 'fs';
import path from 'path';

function getAllMarkdownFiles(dirPath: string): string[] {
	let results: string[] = [];

	const files = fs.readdirSync(dirPath);
	for (const file of files) {
		const filePath = path.join(dirPath, file);
		const stats = fs.statSync(filePath);

		if (stats.isDirectory()) {
			// If it's a directory, walk through it recursively
			results = results.concat(getAllMarkdownFiles(filePath));
		} else if (
			stats.isFile() &&
			(filePath.endsWith('.md') || filePath.endsWith('.mdx'))
		) {
			// Found a markdown file
			results.push(filePath);
		}
	}

	return results;
}

export default getAllMarkdownFiles;
