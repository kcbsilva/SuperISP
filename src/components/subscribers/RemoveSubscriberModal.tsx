// src/components/subscribers/RemoveSubscriberModal.tsx
'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLocale } from '@/contexts/LocaleContext';
import { deleteSubscriber } from '@/services/postgres/subscribers';

type RemoveSubscriberModalProps = {
  open: boolean;
  onClose: () => void;
  subscriberId: string;
  subscriberName?: string;
  onSuccess?: () => void;
};

export function RemoveSubscriberModal({ open, onClose, subscriberId, subscriberName, onSuccess }: RemoveSubscriberModalProps) {
  const { toast } = useToast();
  const { t } = useLocale();
  const [busy, setBusy] = React.useState(false);
  const iconSize = 'h-3 w-3';

  const handleDelete = async () => {
    setBusy(true);
    try {
      await deleteSubscriber(subscriberId);
      toast({ title: t('remove_subscriber.success_toast') });
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast({ title: t('remove_subscriber.error_toast'), description: err.message, variant: 'destructive' });
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && !busy && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-sm text-destructive flex items-center gap-2">
            <Trash2 className={iconSize} /> {t('remove_subscriber.title', 'Delete Subscriber')}
          </DialogTitle>
        </DialogHeader>

        <p className="text-xs">
          {t('remove_subscriber.confirmation', 'Are you sure you want to delete {name}? This action cannot be undone.')
            .replace('{name}', subscriberName || subscriberId)}
        </p>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose} disabled={busy}>{t('remove_subscriber.cancel_button', 'Cancel')}</Button>
          <Button variant="destructive" onClick={handleDelete} disabled={busy}>
            {busy ? <Loader2 className={`mr-2 ${iconSize} animate-spin`} /> : <Trash2 className={`mr-2 ${iconSize}`} />}
            {t('remove_subscriber.delete_button', 'Delete')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
