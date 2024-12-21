import fs from 'fs';
import path from 'path';

function getAllMarkdownFiles(dirPath: string): string[] {
	let results: string[] = [];
	const files = fs.readdirSync(dirPath);
	for (const file of files) {
		const filePath = path.join(dirPath, file);
		const stats = fs.statSync(filePath);
		if (stats.isDirectory()) {
			results = results.concat(getAllMarkdownFiles(filePath));
		} else if (stats.isFile() && filePath.endsWith('.md')) {
			results.push(filePath);
		}
	}
	return results;
}

export default getAllMarkdownFiles;
