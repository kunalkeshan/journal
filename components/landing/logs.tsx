import { MoveRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import LogCard from '../logs/card';
import getLatestMarkdownFiles from '@/lib/get-latest-md-files';

interface Props extends React.HTMLProps<HTMLDivElement> {
  logs: Awaited<ReturnType<typeof getLatestMarkdownFiles>>;
}

const HomeLogs: React.FC<Props> = ({ logs }) => {
  return (
    <div className="w-full py-10 px-10 lg:px-20">
      <div className="container mx-auto flex flex-col gap-14">
        <div className="flex w-full flex-col sm:flex-row sm:justify-between sm:items-center gap-8">
          <h2 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular">
            Latest Logs
          </h2>
          <Button className="gap-4" asChild>
            <Link href={'/logs'} prefetch={false}>
              View all logs <MoveRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {logs.map((log, index) => (
            <LogCard log={log} key={`latest-log-home-page-${index}`} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeLogs;
