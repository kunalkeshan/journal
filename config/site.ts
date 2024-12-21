import type { Metadata } from 'next';

export const SITE_URL = new URL('https://journal.kunalkeshan.com');

export const DEFAULT_METADATA: Metadata = {
	metadataBase: SITE_URL,
	title: 'Journal - Kunal Keshan',
	description:
		'Sharing my learnings, document helpful guides, and keep a record of various insights I come across. This space is dedicated to my continuous learning journey and serves as a valuable resource for anyone interested in the topics I explore.',
	openGraph: {
		title: 'Journal - Kunal Keshan',
		description:
			'Sharing my learnings, document helpful guides, and keep a record of various insights I come across. This space is dedicated to my continuous learning journey and serves as a valuable resource for anyone interested in the topics I explore.',
		images: [{ url: '/og-image.jpeg' }],
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Journal - Kunal Keshan',
		description:
			'Sharing my learnings, document helpful guides, and keep a record of various insights I come across. This space is dedicated to my continuous learning journey and serves as a valuable resource for anyone interested in the topics I explore.',
		images: [{ url: '/og-image.jpeg' }],
	},
};
