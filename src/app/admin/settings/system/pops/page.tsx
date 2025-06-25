// src/app/settings/network/pops/page.tsx
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import PoPList from '@/components/settings/system/pop/PoPList';
import PoPAddModal from '@/components/settings/system/pop/PoPAddModal';
import PoPEditModal from '@/components/settings/system/pop/PoPEditModal';
import PoPDeleteDialog from '@/components/settings/system/pop/PoPDeleteDialog';
import { useToast } from '@/hooks/use-toast';
import { Pop, PopData } from '@/types/pops';

export default function PoPPage() {
  const [pops, setPops] = React.useState<Pop[]>([]);
  const [addOpen, setAddOpen] = React.useState(false);
  const [editPoP, setEditPoP] = React.useState<Pop | null>(null);
  const [deletePoP, setDeletePoP] = React.useState<Pop | null>(null);
  const { toast } = useToast();

  const handleAdd = (data: PopData) => {
    const newPop: Pop = { ...data, id: Date.now().toString() };
    setPops(prev => [...prev, newPop]);
    toast({ title: 'PoP Added Successfully' });
    setAddOpen(false);
  };

  const handleUpdate = (updated: Pop) => {
    setPops(prev => prev.map(p => (p.id === updated.id ? updated : p)));
    toast({ title: 'PoP Updated Successfully' });
    setEditPoP(null);
  };

  const handleDelete = (id: string) => {
    setPops(prev => prev.filter(p => p.id !== id));
    toast({ title: 'PoP Deleted' });
    setDeletePoP(null);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Points of Presence (PoPs)</CardTitle>
          <Button onClick={() => setAddOpen(true)} className="bg-green-600 hover:bg-green-700 text-white">
            <PlusCircle className="w-4 h-4 mr-2" /> Add PoP
          </Button>
        </CardHeader>
        <CardContent>
          <PoPList
            pops={pops}
            onEdit={(pop) => setEditPoP(pop)}
            onDelete={(pop) => setDeletePoP(pop)}
          />
        </CardContent>
      </Card>

      <PoPAddModal 
        open={addOpen}
        onOpenChange={setAddOpen}
        onAdd={handleAdd} 
      />

      {editPoP && (
        <PoPEditModal
          open={!!editPoP}
          onOpenChange={(open) => !open && setEditPoP(null)}
          pop={editPoP}
          onUpdate={handleUpdate}
        />
      )}

      {deletePoP && (
        <PoPDeleteDialog
          pop={deletePoP}
          onCancel={() => setDeletePoP(null)}
          onConfirm={() => handleDelete(deletePoP.id)}
        />
      )}
    </div>
  );
}