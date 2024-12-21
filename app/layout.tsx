import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { DEFAULT_METADATA } from '@/config/site';
import type { Metadata } from 'next';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	...DEFAULT_METADATA,
	title: {
		template: '%s | Journal - Kunal Keshan',
		default: 'Journal - Kunal Keshan',
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				{children}
			</body>
		</html>
	);
}
