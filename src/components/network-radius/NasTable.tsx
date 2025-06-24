// src/components/network-radius/NasTable.tsx
'use client';

import * as React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical, Pencil, Trash2, RefreshCcw } from 'lucide-react';
import { Pop } from '@/types/pops';

export type NasType = {
  id: number;
  nasname: string; // IP address
  shortname: string; // Name
  type: string;
  pop: Pop | null;
  snmp_status: 'ok' | 'fail' | 'pending';
};

type NasTableProps = {
  data: NasType[];
  onEdit: (nas: NasType) => void;
  onDelete: (nas: NasType) => void;
  onRefreshStatus: (nasId: number) => void;
};

export function NasTable({ data, onEdit, onDelete, onRefreshStatus }: NasTableProps) {
  return (
    <div className="border rounded-md overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>IP Address</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>PoP</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((nas) => (
            <TableRow key={nas.id}>
              <TableCell>{nas.shortname}</TableCell>
              <TableCell>{nas.nasname}</TableCell>
              <TableCell>{nas.type}</TableCell>
              <TableCell>{nas.pop?.name || '—'}</TableCell>
              <TableCell>
                <Badge variant={
                  nas.snmp_status === 'ok' ? 'default' :
                  nas.snmp_status === 'fail' ? 'destructive' :
                  'secondary'
                }>
                  {nas.snmp_status === 'ok' ? 'Online' : nas.snmp_status === 'fail' ? 'Offline' : 'Checking...'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(nas)}>
                      <Pencil className="w-4 h-4 mr-2" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(nas)}>
                      <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onRefreshStatus(nas.id)}>
                      <RefreshCcw className="w-4 h-4 mr-2" /> Check Status
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
