import React, { Suspense } from 'react';
import AllLogs from '@/components/logs/all-logs';
import { Spinner } from '@/components/ui/spinner';

const AllLogsPage = () => {
  return (
    <main>
      <Suspense
        fallback={
          <div className="flex items-center justify-center">
            <Spinner />
          </div>
        }
      >
        <AllLogs />
      </Suspense>
    </main>
  );
};

export default AllLogsPage;
