import fs from 'fs';
import path from 'path';
import getAllMarkdownFiles from './get-all-md-files';
import { compileMDX } from 'next-mdx-remote/rsc';
import { LogMetadata } from '@/types/logs';
import { kebabToTitleCase } from './utils';

interface GetAllMdFilesDataArgs {
	dirPath: string; // e.g. path.join(process.cwd(), 'logs')
}

interface MdFileEntry {
	slug: string;
	image: string;
	frontmatter: LogMetadata | null;
}

export async function getAllMdFilesData({
	dirPath,
}: GetAllMdFilesDataArgs): Promise<MdFileEntry[]> {
	// 1) Gather all .md / .mdx files
	const allMarkdownPaths = getAllMarkdownFiles(dirPath);

	// 2) Group by year/week so we can skip “future” data
	const yearWeekMap: Record<string, Record<string, string[]>> = {};

	for (const mdPath of allMarkdownPaths) {
		// Example: "2024/03-06-May-to-12-May/some.md"
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

	// 3) Sort years descending (e.g. 2025 => 2024 => 2023 ...)
	const allYears = Object.keys(yearWeekMap).sort(
		(a, b) => Number(b) - Number(a)
	);

	// 4) Determine “current year” & “current week” so we skip future weeks
	const currentYear = new Date().getFullYear();
	const today = new Date();
	const startOfYear = new Date(currentYear, 0, 1);
	const dayOfYear =
		Math.floor(
			(today.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)
		) + 1;
	const currentWeekIndex = Math.ceil(dayOfYear / 7);

	function getWeekNumberFromFolder(folderName: string): number {
		// Assume folder starts with NN-...
		const prefix = folderName.split('-')[0];
		return parseInt(prefix, 10);
	}

	// 5) Gather all log entries in an array
	const allEntries: MdFileEntry[] = [];

	for (const year of allYears) {
		const numericYear = Number(year);

		// Skip "future" years
		if (numericYear > currentYear) {
			continue;
		}

		// Sort each year's week folders in descending order by the numeric prefix
		const weekFolders = Object.keys(yearWeekMap[year]).sort((a, b) => {
			const aWeekNum = getWeekNumberFromFolder(a);
			const bWeekNum = getWeekNumberFromFolder(b);
			return bWeekNum - aWeekNum; // descending
		});

		// For the current year, only consider weeks <= currentWeekIndex
		let filteredWeekFolders = weekFolders;
		if (numericYear === currentYear) {
			filteredWeekFolders = weekFolders.filter((wf) => {
				const wn = getWeekNumberFromFolder(wf);
				return wn <= currentWeekIndex;
			});
		}

		// Collect all .md/.mdx from these folders
		for (const wf of filteredWeekFolders) {
			const mdPaths = yearWeekMap[year][wf];

			for (const filePath of mdPaths) {
				const fileContents = fs.readFileSync(filePath, 'utf8');

				let frontmatter: LogMetadata | null = null;
				try {
					const { frontmatter: fm } = await compileMDX<LogMetadata>({
						source: fileContents,
						options: { parseFrontmatter: true },
					});
					// Convert frontmatter.date to Date if exists
					frontmatter = fm
						? {
								...fm,
								date: fm.date ? new Date(fm.date) : undefined,
						  }
						: null;
				} catch (err) {
					console.error(
						`Error parsing frontmatter in ${filePath}`,
						err
					);
				}

				// e.g. "2024/03-06-May/entry1"
				const relativePath = path.relative(dirPath, filePath);
				const slugWithoutExt = relativePath.replace(/\.[^.]+$/, '');

				allEntries.push({
					slug: slugWithoutExt,
					image: encodeURI(
						`/api/og?title=${kebabToTitleCase(
							path.parse(filePath).name
						)}`
					),
					frontmatter,
				});
			}
		}
	}

	// 6) Sort all entries by descending date
	//    If frontmatter.date is missing, treat as earliest (sort last)
	allEntries.sort((a, b) => {
		const dateA = a.frontmatter?.date
			? new Date(a.frontmatter.date).getTime()
			: 0;
		const dateB = b.frontmatter?.date
			? new Date(b.frontmatter.date).getTime()
			: 0;
		return dateB - dateA; // descending
	});

	// 7) Return the entire sorted list
	return allEntries;
}
