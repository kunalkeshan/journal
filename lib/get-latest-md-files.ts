import fs from 'fs';
import path from 'path';
import getAllMarkdownFiles from './get-all-md-files';

interface GetLatestMarkdownFilesArgs {
	dirPath: string;
	minFiles?: number;
	maxFiles?: number;
}

interface GetLatestMarkdownFilesResponse {
	filePath: string;
	content: string;
}

type GetLatestMarkdownFilesFunction = (
	options: GetLatestMarkdownFilesArgs
) => Promise<GetLatestMarkdownFilesResponse[]>;

const getLatestMarkdownFiles: GetLatestMarkdownFilesFunction = async ({
	dirPath, // e.g. path.join(process.cwd(), 'logs')
	minFiles = 5, // min number of md files we want
	maxFiles = 10, // max number of md files we want
}) => {
	// 1) Gather all .md files from logs
	const allMarkdownPaths = getAllMarkdownFiles(dirPath);
	//   e.g. [ "/full/path/logs/2024/01-21-Apr-to-27-Apr/fileA.md", "/full/path/logs/2024/02-28-Apr-to-05-May/fileX.md", ... ]

	// 2) Group by year/week so we can sort them easily
	//    We'll parse year from the path segment and the week folder from the next segment
	//    Something like: "logs/2024/03-06-May-to-12-May/foo.md"
	//    => year=2024, weekFolder="03-06-May-to-12-May"
	const yearWeekMap: Record<string, Record<string, string[]>> = {};

	for (const mdPath of allMarkdownPaths) {
		// logs/2024/03-06-May-to-12-May/some.md
		const relative = path.relative(dirPath, mdPath);
		// => "2024/03-06-May-to-12-May/some.md"
		const parts = relative.split(path.sep); // => ["2024", "03-06-May-to-12-May", "some.md"]
		const [yearStr, weekFolder] = parts;
		const year = yearStr;

		if (!yearWeekMap[year]) {
			yearWeekMap[year] = {};
		}
		if (!yearWeekMap[year][weekFolder]) {
			yearWeekMap[year][weekFolder] = [];
		}
		yearWeekMap[year][weekFolder].push(mdPath);
	}

	// 3) Sort the years descending. e.g. 2025 => 2024 => 2023 ...
	const allYears = Object.keys(yearWeekMap).sort(
		(a, b) => Number(b) - Number(a)
	);

	// 4) We need to figure out the "current year" and "current week folder"
	const currentYear = new Date().getFullYear();
	// Simple approach to define "current week folder index" (1-based):
	// (This is not a perfect ISO-week approach, it's just an example.)
	const today = new Date();
	const startOfYear = new Date(currentYear, 0, 1);
	const dayOfYear =
		Math.floor(
			(today.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)
		) + 1;
	const currentWeekIndex = Math.ceil(dayOfYear / 7); // roughly

	// Helper to parse the folder prefix number (e.g. "03-06-May-to-12-May" => 3)
	function getWeekNumberFromFolder(folderName: string): number {
		// We assume the folder name starts with NN-
		// e.g. "03-06-May-to-12-May" => parseInt("03") => 3
		const prefix = folderName.split('-')[0];
		return parseInt(prefix, 10); // might be NaN if can't parse
	}

	// 5) We'll iterate over years in descending order, starting at currentYear.
	//    For each year, we'll get the week folders sorted descending by that NN- prefix.
	const result: { filePath: string; content: string }[] = [];

	for (const year of allYears) {
		if (Number(year) > currentYear) {
			// skip future years if any
			continue;
		}

		// Sort the week folders in descending order by their numeric prefix
		const weekFolders = Object.keys(yearWeekMap[year]).sort((a, b) => {
			const aWeekNum = getWeekNumberFromFolder(a);
			const bWeekNum = getWeekNumberFromFolder(b);
			return bWeekNum - aWeekNum; // descending
		});

		// If this is the current year, we only want to start from "currentWeekIndex" folder or below
		let filteredWeekFolders = weekFolders;
		if (Number(year) === currentYear) {
			filteredWeekFolders = weekFolders.filter((wf) => {
				const wn = getWeekNumberFromFolder(wf);
				return wn <= currentWeekIndex;
			});
		}

		for (const wf of filteredWeekFolders) {
			// Add the .md files from this folder
			const mdPaths = yearWeekMap[year][wf];

			for (const fp of mdPaths) {
				const fileContents = fs.readFileSync(fp, 'utf8');
				result.push({
					filePath: fp,
					content: fileContents,
				});
				if (result.length >= maxFiles) {
					// We have reached the maximum we want (10).
					return result;
				}
			}

			// Check if we have at least the minimum.
			// If yes and we want to stop early, uncomment:
			// if (result.length >= minFiles) {
			//   return result;
			// }
		}

		// By the time we finish all the weeks in this year,
		// if we STILL don't have enough, we move on to the previous year in the next loop iteration.
		if (result.length >= minFiles) {
			// We have at least the minimum needed.
			return result;
		}
	}

	// If we exhaust all years and still don't have enough, return whatever we have.
	return result;
};

export default getLatestMarkdownFiles;
