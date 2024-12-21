import fs from 'fs';
import path from 'path';
import createMdImage from './create-md-image';
import { kebabToTitleCase } from './utils';

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

			// 1. Derive the image base name from the .md/.mdx
			//    e.g. "entry1.md" => base = "entry1"
			const baseName = path.basename(file, path.extname(file));

			// 2. Our desired image file name = baseName + ".png"
			const imageName = baseName + '.png';

			// 3. Where we expect the image to live in public/<subDir>
			const imagePath = path.join(
				process.cwd(),
				'public',
				'thumbnails',
				imageName
			);

			// 4. If the image does not exist, create it
			if (!fs.existsSync(imagePath)) {
				console.log(
					`Image does not exist for ${filePath}. Creating now...`
				);

				// The text we want to render can be the baseName or something else
				const title = kebabToTitleCase(`${baseName}`);
				createMdImage('thumbnails', imageName, title)
					.then(() => {
						console.log(`Created PNG for ${filePath}`);
					})
					.catch((err) => {
						console.error('Error creating image:', err);
					});
			}
		}
	}

	return results;
}

export default getAllMarkdownFiles;
