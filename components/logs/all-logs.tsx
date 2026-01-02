'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import LogCard from './card';
import { getAllMdFilesData } from '@/lib/get-all-md-files-data';

type Logs = Awaited<ReturnType<typeof getAllMdFilesData>>;

interface Props extends React.HTMLProps<HTMLDivElement> {
  logs: Logs;
}

const fetchSearchResults = async (query: string): Promise<Logs> => {
  if (!query) {
    return [];
  }
  const { data } = await axios.get<Logs>(`/api/search?q=${query}`);
  return data;
};

const AllLogs: React.FC<Props> = ({ logs }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['searchResults', searchQuery],
    queryFn: () => fetchSearchResults(searchQuery),
    enabled: !!searchQuery,
  });

  const logsToDisplay = searchQuery ? searchResults : logs;

  return (
    <div className="w-full py-10 px-10 lg:px-20">
      <div className="container mx-auto flex flex-col gap-14">
        <div className="flex w-full flex-col sm:flex-row sm:justify-between sm:items-center gap-8">
          <h1 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular">
            All Logs
          </h1>
          <input
            type="text"
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border rounded-md"
          />
        </div>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {logsToDisplay?.map((log, index) => (
              <LogCard log={log} key={`all-logs-log-page-${index}`} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllLogs;
