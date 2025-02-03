import React from 'react';
import { getAllMdFilesData } from '@/lib/get-all-md-files-data';
import { LOGS_DIR } from '@/config';
import AllLogs from '@/components/logs/all-logs';

const AllLogsPage = async () => {
  const allLogs = await getAllMdFilesData({ dirPath: LOGS_DIR });
  return (
    <main>
      <AllLogs logs={allLogs} />
    </main>
  );
};

export default AllLogsPage;
