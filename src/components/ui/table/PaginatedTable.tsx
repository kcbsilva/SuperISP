// src/components/ui/table/PaginatedTable.tsx
'use client';

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Card, CardContent } from '@/components/ui/card';

interface Props<T> {
  columns: { key: string; label: string; className?: string }[];
  data: T[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onRefresh: () => void;
  loading: boolean;
  rowsPerPage?: number;
  renderRow: (row: T, index: number) => React.ReactNode;
}

export function PaginatedTable<T>({
  columns,
  data,
  page,
  totalPages,
  onPageChange,
  onRefresh,
  loading,
  renderRow,
  rowsPerPage = 10,
}: Props<T>) {
  const getVisiblePages = () => {
    if (totalPages <= 4) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 2) return [1, 2, 3];
    if (page >= totalPages - 1) return [totalPages - 2, totalPages - 1, totalPages];
    return [page - 1, page, page + 1];
  };

  const { resolvedTheme } = useTheme();
  const refreshColor = resolvedTheme === 'dark' ? '#fca311' : '#233b6e';

  return (
    <Card className="bg-background border shadow-sm rounded-md">
      <CardContent className="p-0 overflow-x-auto rounded-md">
        {/* ✅ White background around the table */}
        <div className="bg-white dark:bg-[--card] p-2 sm:p-4 rounded-md overflow-hidden">
          <Table>
            <TableHeader className="sticky top-0 z-10">
              <TableRow
                className="bg-[#233B6E] dark:bg-[--card] hover:bg-[#233B6E] dark:hover:bg-[--card] border-b border-b-2"
                style={{ borderBottomColor: '#FCA311' }}
              >
                {columns.map((col, index) => (
                  <TableHead
                    key={col.key}
                    className={`text-sm font-semibold text-white dark:text-[--card-foreground] ${index === 0 ? 'rounded-tl-md' : index === columns.length - 1 ? 'rounded-tr-md text-right' : ''} ${col.className || ''}`}
                  >
                    {col.label}
                  </TableHead>
                ))}
                <TableHead className="text-sm font-semibold text-white dark:text-[--card-foreground] text-right rounded-tr-md">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                [...Array(rowsPerPage)].map((_, i) => (
                  <TableRow key={i} className="hover:bg-muted/50 transition-colors">
                    {columns.map((_, colIdx) => (
                      <TableCell key={colIdx}>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                    ))}
                    <TableCell className="text-right">
                      <Skeleton className="h-4 w-16 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + 1}
                    className="text-center py-6 text-muted-foreground text-sm"
                  >
                    No data found.
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row, i) => (
                  <React.Fragment key={i}>{renderRow(row, i)}</React.Fragment>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Footer with Pagination and Refresh */}
        <div className="flex justify-center items-center p-4 border-t flex-wrap gap-2">
          <div className="flex gap-1 items-center flex-wrap">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onPageChange(1)}
              disabled={page === 1}
            >
              &laquo;
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
            >
              &lsaquo;
            </Button>

            {getVisiblePages().map((pg) => (
              <Button
                key={pg}
                size="sm"
                variant={pg === page ? 'default' : 'outline'}
                onClick={() => onPageChange(pg)}
              >
                {pg}
              </Button>
            ))}

            <Button
              size="sm"
              variant="outline"
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages}
            >
              &rsaquo;
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onPageChange(totalPages)}
              disabled={page === totalPages}
            >
              &raquo;
            </Button>

            <Button
              size="sm"
              onClick={onRefresh}
              disabled={loading}
              style={{ backgroundColor: refreshColor, color: 'white' }}
              className="gap-2"
            >
              <RefreshCcw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}