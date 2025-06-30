// src/components/subscribers/SubscriberProfile.tsx
'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Subscriber } from '@/types/subscribers';
import { useLocale } from '@/contexts/LocaleContext';

interface Props {
  open: boolean;
  subscriber: Subscriber;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function SubscriberProfile({ open, subscriber, onClose, onEdit, onDelete }: Props) {
  const { t } = useLocale();

  const renderField = (label: string, value?: string | Date | null) => (
    <div className="text-xs">
      <span className="font-medium text-muted-foreground mr-1">{label}:</span>
      {value ? (
        <span>{value instanceof Date ? format(value, 'PPP') : value}</span>
      ) : (
        <span className="italic text-muted-foreground">{t('common.not_provided', 'Not provided')}</span>
      )}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-sm">
            {t('subscriber_profile.title', 'Subscriber Profile')}{' '}
            <Badge variant="outline" className="ml-2 text-xs">{subscriber.status}</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-2 text-sm">
          {subscriber.subscriberType === 'Residential' && (
            <>
              {renderField(t('add_subscriber.fullname_label'), subscriber.fullName)}
              {renderField(t('add_subscriber.birthday_label'), subscriber.birthday)}
              {renderField(t('add_subscriber.tax_id_label'), subscriber.taxId)}
            </>
          )}

          {subscriber.subscriberType === 'Commercial' && (
            <>
              {renderField(t('add_subscriber.company_name_label'), subscriber.companyName)}
              {renderField(t('add_subscriber.established_date_label'), subscriber.establishedDate)}
              {renderField(t('add_subscriber.tax_id_label'), subscriber.taxId)}
              {renderField(t('add_subscriber.business_number_label'), subscriber.businessNumber)}
            </>
          )}

          {renderField(t('add_subscriber.address_label'), subscriber.address)}
          {renderField(t('add_subscriber.point_of_reference_label'), subscriber.pointOfReference)}
          {renderField(t('add_subscriber.email_label'), subscriber.email)}
          {renderField(t('add_subscriber.phone_label'), subscriber.phoneNumber)}
          {renderField(t('add_subscriber.mobile_label'), subscriber.mobileNumber)}
          {renderField(t('add_subscriber.signup_date_label'), subscriber.signupDate)}
        </div>

        <DialogFooter className="mt-4">
          <Button onClick={onEdit} variant="default">
            <Pencil className="h-4 w-4 mr-1" /> {t('subscriber_profile.edit_button', 'Edit')}
          </Button>
          <Button onClick={onDelete} variant="destructive">
            <Trash2 className="h-4 w-4 mr-1" /> {t('subscriber_profile.delete_button', 'Delete')}
          </Button>
          <Button onClick={onClose} variant="outline">
            {t('subscriber_profile.close_button', 'Close')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
