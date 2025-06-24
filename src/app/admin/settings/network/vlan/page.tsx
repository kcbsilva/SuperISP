// src/app/settings/network/vlan/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Split, RefreshCw, PlusCircle, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { useLocale } from '@/contexts/LocaleContext';
import { useToast } from '@/hooks/use-toast';
import { AddVlanModal } from '@/components/network/vlan/AddVlanModal';
import { EditVlanModal } from '@/components/network/vlan/EditVlanModal';
import { fetchVlans, deleteVlan } from '@/components/network/vlan/actions';
import { Vlan } from '@/types/vlan';

export default function VlanManagementPage() {
  const { t } = useLocale();
  const { toast } = useToast();
  const [vlans, setVlans] = useState<Vlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editVlan, setEditVlan] = useState<Vlan | null>(null);
  const [vlanToDelete, setVlanToDelete] = useState<Vlan | null>(null);
  const iconSize = 'h-2.5 w-2.5';

  const refreshVlans = async () => {
    setIsLoading(true);
    try {
      const data = await fetchVlans();
      setVlans(data);
    } catch {
      toast({ title: 'Failed to load VLANs.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { refreshVlans(); }, []);

  const handleDelete = async () => {
    if (!vlanToDelete) return;
    try {
      await deleteVlan(vlanToDelete.id);
      setVlans(prev => prev.filter(v => v.id !== vlanToDelete.id));
      toast({ title: 'VLAN deleted.' });
    } catch {
      toast({ title: 'Delete failed.', variant: 'destructive' });
    } finally {
      setVlanToDelete(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold flex items-center gap-2">
          <Split className={`${iconSize} text-primary`} /> VLAN Management
        </h1>
        <div className="flex items-center gap-2">
          <Button onClick={refreshVlans}><RefreshCw className={`mr-2 ${iconSize}`} /> Refresh</Button>
          <AddVlanModal onVlanAdded={(newVlan) => setVlans(prev => [newVlan, ...prev])} />
        </div>
      </div>

      <Card>
        <CardContent className="pt-0">
          {!isLoading && vlans.length > 0 ? (
            <div className="overflow-x-auto pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs text-center">VLAN ID</TableHead>
                    <TableHead className="text-xs text-center">Assigned To</TableHead>
                    <TableHead className="text-xs text-center">PoP</TableHead>
                    <TableHead className="text-xs text-center">Tagged</TableHead>
                    <TableHead className="text-xs text-center">Status</TableHead>
                    <TableHead className="text-xs text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vlans.map((vlan) => (
                    <TableRow key={vlan.id}>
                      <TableCell className="text-center font-mono text-xs">{vlan.vlanId}</TableCell>
                      <TableCell className="text-center text-xs">{vlan.assignedTo || '-'}</TableCell>
                      <TableCell className="text-center text-xs">{vlan.pop?.name || vlan.popId}</TableCell>
                      <TableCell className="text-center text-xs">
                        <Badge>{vlan.isTagged ? 'Tagged' : 'Untagged'}</Badge>
                      </TableCell>
                      <TableCell className="text-center text-xs">
                        <Badge variant={vlan.status === 'Active' ? 'default' : 'secondary'}>{vlan.status}</Badge>
                      </TableCell>
                      <TableCell className="flex gap-1 justify-center">
                        <EditVlanModal vlan={vlan} onVlanUpdated={(updated) => setVlans(prev => prev.map(v => v.id === updated.id ? updated : v))} />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="icon" variant="ghost" className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete VLAN {vlan.vlanId}?</AlertDialogTitle>
                              <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => { setVlanToDelete(vlan); handleDelete(); }}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-4 text-xs pt-6">
              {isLoading ? 'Loading VLANs...' : 'No VLANs configured.'}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
