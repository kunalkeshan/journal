import React, { Suspense } from 'react';
import { getAllMdFilesData } from '@/lib/get-all-md-files-data';
import { LOGS_DIR } from '@/config';
import AllLogs from '@/components/logs/all-logs';
import { Spinner } from '@/components/ui/spinner';

const AllLogsPage = async () => {
  const allLogs = await getAllMdFilesData({ dirPath: LOGS_DIR });
  return (
    <main>
      <Suspense
        fallback={
          <div className="flex items-center justify-center">
            <Spinner />
          </div>
        }
      >
        <AllLogs logs={allLogs} />
      </Suspense>
    </main>
  );
};

export default AllLogsPage;

export const revalidate = 3600;
