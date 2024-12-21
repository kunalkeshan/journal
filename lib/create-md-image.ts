import path from 'path';
import fs from 'fs';
import textToImage from 'text-to-image';

/**
 * Given a width, a proposed font size, and the text length,
 * estimate how many lines we'll need and the total height.
 */
function estimateLineCountAndHeight(
	text: string,
	width: number,
	fontSize: number,
	paddingX: number,
	paddingY: number
) {
	// Rough approximation: each character takes about 0.6 * fontSize in width
	// This can vary by font, so tweak factor as needed
	const approxCharWidth = fontSize * 0.6;

	// Effective width = total width - left+right padding
	const effectiveWidth = width - paddingX * 2;

	// Characters per line
	const charsPerLine = Math.floor(effectiveWidth / approxCharWidth);
	if (charsPerLine <= 0) {
		// If font size is too big for even 1 char to fit, return a large height
		return { lineCount: 1, totalHeight: 99999 };
	}

	// Number of lines needed
	const lineCount = Math.ceil(text.length / charsPerLine);

	// We'll assume lineHeight ~ 1.2 * fontSize
	const lineHeight = fontSize * 1.2;

	// totalHeight = top padding + lines * lineHeight + bottom padding
	const totalHeight = paddingY + lineCount * lineHeight + paddingY;

	return { lineCount, totalHeight };
}

/**
 * Find the largest font size (between minSize and maxSize)
 * for which the text still fits in (width×height).
 */
function findBestFitFontSize(
	text: string,
	width: number,
	height: number,
	minSize: number,
	maxSize: number,
	paddingX: number,
	paddingY: number
): number {
	let bestSize = minSize;
	for (let size = minSize; size <= maxSize; size++) {
		const { totalHeight } = estimateLineCountAndHeight(
			text,
			width,
			size,
			paddingX,
			paddingY
		);
		if (totalHeight <= height) {
			bestSize = size; // still fits, keep going
		} else {
			break; // doesn't fit, so revert to the last known good
		}
	}
	return bestSize;
}

/**
 * Generates a 1200×630 PNG from the given text (title),
 * auto-scaling the font size so the text is readable.
 * The final image is saved to: public/<subDir>/<fileName>.png
 */
async function createMdImage(
	subDir: string,
	fileName: string,
	title: string
): Promise<string> {
	try {
		// Ensure file ends with .png
		if (!fileName.endsWith('.png')) {
			fileName += '.png';
		}

		// Desired overall image size
		const IMG_WIDTH = 1200;
		const IMG_HEIGHT = 630;

		// We'll allow the font size to vary from 24 to 100
		const MIN_FONT_SIZE = 24;
		const MAX_FONT_SIZE = 100;

		// We'll leave 50px padding on each side
		const PADDING_X = 50;
		const PADDING_Y = 50;

		// 1. Find the largest font size that fits
		const bestFontSize = findBestFitFontSize(
			title,
			IMG_WIDTH,
			IMG_HEIGHT,
			MIN_FONT_SIZE,
			MAX_FONT_SIZE,
			PADDING_X,
			PADDING_Y
		);

		// 2. We'll set lineHeight to ~1.2 × bestFontSize
		const lineHeight = Math.round(bestFontSize * 1.2);

		// 3. Generate the data URI using text-to-image
		const dataUri = await textToImage.generate(title, {
			// Force the final image to 1200×630
			maxWidth: IMG_WIDTH,
			customHeight: IMG_HEIGHT,

			fontFamily: 'Arial',
			fontSize: bestFontSize,
			lineHeight: lineHeight,

			// We want top-left alignment
			textAlign: 'center',
			verticalAlign: 'center',

			bgColor: '#ffffff', // white background
			textColor: '#000000', // black text
		});

		// 4. Extract Base64 portion
		const base64 = dataUri.split(',')[1];

		// 5. Convert Base64 to Buffer
		const imageBuffer = Buffer.from(base64, 'base64');

		// 6. Build output path -> /projectRoot/public/<subDir>/<fileName>.png
		const outputPath = path.join(process.cwd(), 'public', subDir, fileName);

		// 7. Ensure the subdirectory exists
		fs.mkdirSync(path.dirname(outputPath), { recursive: true });

		// 8. Write the PNG file
		fs.writeFileSync(outputPath, imageBuffer);

		console.log(`PNG image generated at: ${outputPath}`);
		return outputPath;
	} catch (error) {
		console.error('Error generating image:', error);
		throw error;
	}
}

export default createMdImage;
