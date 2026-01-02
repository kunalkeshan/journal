'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import LogCard from './card';
import { getAllMdFilesData } from '@/lib/get-all-md-files-data';
import { parseAsInteger, useQueryState } from 'nuqs';
import { Spinner } from '@/components/ui/spinner';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { SearchIcon } from 'lucide-react';
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from '@/components/ui/input-group';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useEffect, useMemo } from 'react';
import { DOTS, generatePaginationRange } from '@/lib/pagination';

type Logs = Awaited<ReturnType<typeof getAllMdFilesData>>;

interface PaginatedLogsResponse {
  logs: Logs;
  totalPages: number;
}

const fetchLogs = async (
  page: number,
  limit: number
): Promise<PaginatedLogsResponse> => {
  const { data } = await axios.get<PaginatedLogsResponse>(
    `/api/logs?page=${page}&limit=${limit}`
  );
  return data;
};

const fetchSearchResults = async (
  query: string,
  page: number,
  limit: number
): Promise<PaginatedLogsResponse> => {
  if (!query) {
    return { logs: [], totalPages: 0 };
  }
  const { data } = await axios.get<PaginatedLogsResponse>(
    `/api/search?q=${query}&page=${page}&limit=${limit}`
  );
  return data;
};

const AllLogs: React.FC = () => {
  const [searchQuery, setSearchQuery] = useQueryState('q');
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));

  useEffect(() => {
    if (searchQuery) {
      setPage(1);
    }
  }, [searchQuery, setPage]);

  const { data, isLoading } = useQuery({
    queryKey: ['logs', searchQuery, page],
    queryFn: () =>
      searchQuery
        ? fetchSearchResults(searchQuery, page, 8)
        : fetchLogs(page, 8),
  });

  const logsToDisplay = data?.logs;
  const totalPages = data?.totalPages ?? 1;

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const paginationRange = useMemo(
    () => generatePaginationRange({ currentPage: page, totalPages }),
    [page, totalPages]
  );

  return (
    <div className="w-full py-10 px-10 lg:px-20">
      <div className="container mx-auto flex flex-col gap-14">
        <div className="flex w-full flex-col sm:flex-row sm:justify-between sm:items-center gap-8">
          <h1 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular">
            All Logs
          </h1>
          <InputGroup>
            <InputGroupInput
              placeholder="Search logs..."
              value={searchQuery ?? ''}
              onChange={(e) => setSearchQuery(e.target.value || null)}
            />
            <InputGroupAddon>
              <SearchIcon className="size-4" />
            </InputGroupAddon>
          </InputGroup>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center">
            <Spinner />
          </div>
        ) : logsToDisplay && logsToDisplay.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {logsToDisplay.map((log, index) => (
                <LogCard log={log} key={`all-logs-log-page-${index}`} />
              ))}
            </div>
            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(page - 1);
                      }}
                      className={
                        page <= 1 ? 'pointer-events-none opacity-50' : ''
                      }
                    />
                  </PaginationItem>
                  {paginationRange.map((pageNumber, index) => {
                    if (pageNumber === DOTS) {
                      return (
                        <PaginationItem key={`dots-${index}`}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }

                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(pageNumber as number);
                          }}
                          isActive={page === pageNumber}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(page + 1);
                      }}
                      className={
                        page >= totalPages
                          ? 'pointer-events-none opacity-50'
                          : ''
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        ) : (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <SearchIcon className="size-12" />
              </EmptyMedia>
              <EmptyTitle>No results found</EmptyTitle>
              <EmptyDescription>
                Try searching for something else.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </div>
    </div>
  );
};

export default AllLogs;
