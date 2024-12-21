import fs from 'fs';
import path from 'path';
import getAllMarkdownFiles from './get-all-md-files';
import { compileMDX } from 'next-mdx-remote/rsc';
import { LogMetadata } from '@/types/logs';

interface GetLatestMarkdownFilesArgs {
	dirPath: string; // e.g. path.join(process.cwd(), 'logs')
	minFiles?: number; // default is 5
	maxFiles?: number; // default is 10
}

/**
 * We now only return the file path and the frontmatter object.
 */
interface GetLatestMarkdownFilesResponse {
	slug: string;
	frontmatter: LogMetadata | null;
}

type GetLatestMarkdownFilesFunction = (
	options: GetLatestMarkdownFilesArgs
) => Promise<GetLatestMarkdownFilesResponse[]>;

const getLatestMarkdownFiles: GetLatestMarkdownFilesFunction = async ({
	dirPath,
	minFiles = 5,
	maxFiles = 10,
}) => {
	// 1) Gather all .md / .mdx files from logs
	const allMarkdownPaths = getAllMarkdownFiles(dirPath);
	// e.g. ["/full/path/logs/2024/01-21-Apr-to-27-Apr/fileA.md", ...]

	// 2) Group by year/week so we can sort them easily
	const yearWeekMap: Record<string, Record<string, string[]>> = {};

	for (const mdPath of allMarkdownPaths) {
		// relative => "2024/03-06-May-to-12-May/some.md"
		const relative = path.relative(dirPath, mdPath);
		const parts = relative.split(path.sep);
		// => ["2024", "03-06-May-to-12-May", "some.md"]
		const [yearStr, weekFolder] = parts;

		if (!yearWeekMap[yearStr]) {
			yearWeekMap[yearStr] = {};
		}
		if (!yearWeekMap[yearStr][weekFolder]) {
			yearWeekMap[yearStr][weekFolder] = [];
		}
		yearWeekMap[yearStr][weekFolder].push(mdPath);
	}

	// 3) Sort the years descending. e.g. 2025 => 2024 => 2023 ...
	const allYears = Object.keys(yearWeekMap).sort(
		(a, b) => Number(b) - Number(a)
	);

	// 4) Calculate "current year" and "current week index"
	const currentYear = new Date().getFullYear();
	const today = new Date();
	const startOfYear = new Date(currentYear, 0, 1);
	const dayOfYear =
		Math.floor(
			(today.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)
		) + 1;
	const currentWeekIndex = Math.ceil(dayOfYear / 7);

	// Helper to parse the folder prefix number (e.g. "03-06-May-to-12-May" => 3)
	function getWeekNumberFromFolder(folderName: string): number {
		// We assume folder starts with NN-...
		const prefix = folderName.split('-')[0];
		return parseInt(prefix, 10);
	}

	// 5) Collect results in descending year/week order until we reach min/max
	const result: GetLatestMarkdownFilesResponse[] = [];

	for (const year of allYears) {
		const numericYear = Number(year);

		// Skip future years if any
		if (numericYear > currentYear) {
			continue;
		}

		// Sort the week folders in descending order by their numeric prefix
		const weekFolders = Object.keys(yearWeekMap[year]).sort((a, b) => {
			const aWeekNum = getWeekNumberFromFolder(a);
			const bWeekNum = getWeekNumberFromFolder(b);
			return bWeekNum - aWeekNum; // descending
		});

		// For the current year, only consider weeks up to currentWeekIndex
		let filteredWeekFolders = weekFolders;
		if (numericYear === currentYear) {
			filteredWeekFolders = weekFolders.filter((wf) => {
				const wn = getWeekNumberFromFolder(wf);
				return wn <= currentWeekIndex;
			});
		}

		// Iterate each valid folder
		for (const wf of filteredWeekFolders) {
			const mdPaths = yearWeekMap[year][wf];

			for (const filePath of mdPaths) {
				// Example: filePath = "/absolute/logs/2024/03-06-May/entry1.md"
				const fileContents = fs.readFileSync(filePath, 'utf8');

				// Extract the frontmatter
				let frontmatter: LogMetadata | null = null;
				try {
					const { frontmatter: fm } = await compileMDX<LogMetadata>({
						source: fileContents,
						options: {
							parseFrontmatter: true,
						},
					});
					frontmatter = fm;
				} catch (err) {
					console.error(
						`Error parsing frontmatter in ${filePath}`,
						err
					);
				}

				// Build the slug (relative path without extension)
				// e.g. "2024/03-06-May/entry1"
				const relativePath = path.relative(dirPath, filePath);
				const slugWithoutExt = relativePath.replace(/\.[^.]+$/, '');
				// remove .md or .mdx extension

				result.push({
					slug: slugWithoutExt,
					frontmatter: {
            ...frontmatter,
            ...(frontmatter?.date && {
              date: new Date(frontmatter.date),
            })
          },
				});

				if (result.length >= maxFiles) {
					// Reached max needed
					return result;
				}
			}

			// If we have at least minFiles, you could break early if desired:
			// if (result.length >= minFiles) {
			//   return result;
			// }
		}

		// If we finish the year and have at least minFiles, we can return
		if (result.length >= minFiles) {
			return result;
		}
	}

	// Return whatever we have if we didn't reach min/max fully
	return result;
};

export default getLatestMarkdownFiles;
