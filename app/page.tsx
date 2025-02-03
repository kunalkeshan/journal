import Hero from '@/components/landing/hero';
import getLatestMarkdownFiles from '@/lib/get-latest-md-files';
import { LOGS_DIR } from '@/config';
import HomeLogs from '@/components/landing/logs';

export default async function Home() {
  const latestLogs = await getLatestMarkdownFiles({
    dirPath: LOGS_DIR,
    maxFiles: 4,
  });
  return (
    <main>
      <Hero />
      <HomeLogs logs={latestLogs} />
    </main>
  );
}
