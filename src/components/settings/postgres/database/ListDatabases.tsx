// src/components/settings/postgres/databases/ListDatabases.tsx
'use client';

import * as React from 'react';
import { Eye, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { PaginatedTable } from '@/components/ui/table/PaginatedTable';
import { usePagination } from '@/hooks/usePagination';
import { useLocale } from '@/contexts/LocaleContext';
import { Input } from '@/components/ui/input';

interface DatabaseEntry {
  name: string;
  owner: string;
  encoding: string;
}

export function ListDatabases() {
  const { t } = useLocale();
  const [loading, setLoading] = React.useState(true);
  const [databases, setDatabases] = React.useState<DatabaseEntry[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');

  const fetchDatabases = async () => {
    setLoading(true);
    setTimeout(() => {
      const fakeData = Array.from({ length: 35 }, (_, i) => ({
        name: `db_${i + 1}`,
        owner: `owner_${i + 1}`,
        encoding: 'UTF8',
      }));
      setDatabases(fakeData);
      setLoading(false);
    }, 1000);
  };

  React.useEffect(() => {
    fetchDatabases();
  }, []);

  const filteredData = databases.filter(
    (db) =>
      db.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      db.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      db.encoding.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const { page, setPage, totalPages, currentData } = usePagination(filteredData, 10);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Input
          type="text"
          placeholder={t('search', 'Search...')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <PaginatedTable<DatabaseEntry>
        columns={[
          { key: 'select', label: '' },
          { key: 'name', label: t('postgres_databases.name', 'Database Name') },
          { key: 'owner', label: t('postgres_databases.owner', 'Owner') },
          { key: 'encoding', label: t('postgres_databases.encoding', 'Encoding') },
        ]}
        data={currentData}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onRefresh={fetchDatabases}
        loading={loading}
        renderRow={(db: DatabaseEntry, i: number) => (
          <TableRow key={db.name} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50 dark:bg-muted'}>
            <TableCell>
              <input type="checkbox" className="form-checkbox" />
            </TableCell>
            <TableCell>{db.name}</TableCell>
            <TableCell>{db.owner}</TableCell>
            <TableCell>{db.encoding}</TableCell>
            <TableCell className="text-right space-x-2">
              <Button size="icon" variant="ghost">
                <Eye className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        )}
      />
    </div>
  );
}
