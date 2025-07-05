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
import { RefreshCcw, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
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
  totalEntries?: number;
  showSelect?: boolean;
  showActions?: boolean;
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
  totalEntries = 0,
  showSelect = true,
  showActions = true,
}: Props<T>) {
  const getVisiblePages = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 3) return [1, 2, 3, 4, 5];
    if (page >= totalPages - 2) return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [page - 2, page - 1, page, page + 1, page + 2];
  };

  const startEntry = (page - 1) * rowsPerPage + 1;
  const endEntry = Math.min(page * rowsPerPage, totalEntries);

  return (
    <Card className="bg-white border-0 shadow-sm rounded-lg overflow-hidden">
      <CardContent className="p-0">
        {/* Header Section */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-semibold text-gray-900">Select</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Show</span>
                <select className="border border-gray-300 rounded px-2 py-1 text-sm">
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
                <span>entries</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Search:</span>
              <input
                type="text"
                placeholder="Type search here"
                className="border border-gray-300 rounded px-3 py-1 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50 border-b border-gray-200">
                {showSelect && (
                  <TableHead className="w-12 text-center">
                    <input type="checkbox" className="rounded" />
                  </TableHead>
                )}
                {columns.map((col) => (
                  <TableHead
                    key={col.key}
                    className={`text-xs font-semibold text-gray-700 uppercase tracking-wider py-2 text-center ${col.className || ''}`}
                  >
                    {col.label}
                  </TableHead>
                ))}
                {showActions && (
                  <TableHead className="text-xs font-semibold text-gray-700 uppercase tracking-wider py-2 text-center">
                    Actions
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                [...Array(rowsPerPage)].map((_, i) => (
                  <TableRow key={i} className="hover:bg-gray-50 transition-colors border-b border-gray-100">
                    {showSelect && (
                      <TableCell className="text-center py-2">
                        <Skeleton className="h-4 w-4 mx-auto" />
                      </TableCell>
                    )}
                    {columns.map((_, colIdx) => (
                      <TableCell key={colIdx} className="py-2 text-center">
                        <Skeleton className="h-4 w-24 mx-auto" />
                      </TableCell>
                    ))}
                    {showActions && (
                      <TableCell className="py-2 text-center">
                        <Skeleton className="h-4 w-16 mx-auto" />
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + (showSelect ? 1 : 0) + (showActions ? 1 : 0)}
                    className="text-center py-8 text-gray-500"
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

        {/* Footer with Pagination */}
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {startEntry} to {endEntry} of {totalEntries} entries
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onPageChange(1)}
                disabled={page === 1}
                className="h-8 w-8 p-0"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {getVisiblePages().map((pg) => (
                <Button
                  key={pg}
                  size="sm"
                  variant={pg === page ? 'default' : 'outline'}
                  onClick={() => onPageChange(pg)}
                  className={`h-8 w-8 p-0 ${pg === page ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}`}
                >
                  {pg}
                </Button>
              ))}

              <Button
                size="sm"
                variant="outline"
                onClick={() => onPageChange(page + 1)}
                disabled={page === totalPages}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => onPageChange(totalPages)}
                disabled={page === totalPages}
                className="h-8 w-8 p-0"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}