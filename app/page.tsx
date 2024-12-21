import Hero from '@/components/landing/hero';
import getLatestMarkdownFiles from '@/lib/get-latest-md-files';
import { LOGS_DIR } from '@/config';

export default async function Home() {
	const latestLogs = await getLatestMarkdownFiles({ dirPath: LOGS_DIR });
	console.log(latestLogs);
	return (
		<main>
			<Hero />
		</main>
	);
}
