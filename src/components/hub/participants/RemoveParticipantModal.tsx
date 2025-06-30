'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export function RemoveParticipantModal({
  open,
  onClose,
  participantId,
}: {
  open: boolean;
  onClose: () => void;
  participantId: string;
}) {
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/admin/hub/participants/remove/${participantId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error();
      toast({ title: 'Participant deleted successfully' });
      onClose();
    } catch {
      toast({ title: 'Error deleting participant', variant: 'destructive' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Participant</DialogTitle>
        </DialogHeader>
        <p className="text-sm">Are you sure you want to delete this participant?</p>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" onClick={handleDelete}>Delete</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
