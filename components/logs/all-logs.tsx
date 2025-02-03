import { getAllMdFilesData } from '@/lib/get-all-md-files-data';
import LogCard from './card';

interface Props extends React.HTMLProps<HTMLDivElement> {
  logs: Awaited<ReturnType<typeof getAllMdFilesData>>;
}

const AllLogs: React.FC<Props> = ({ logs }) => {
  return (
    <div className="w-full py-10 px-10 lg:px-20">
      <div className="container mx-auto flex flex-col gap-14">
        <div className="flex w-full flex-col sm:flex-row sm:justify-between sm:items-center gap-8">
          <h1 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular">
            All Logs
          </h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {logs.map((log, index) => (
            <LogCard log={log} key={`all-logs-log-page-${index}`} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllLogs;
