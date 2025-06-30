'use client';

import * as React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ListParticipants } from '@/components/hub/participants/ListParticipants';
import { AddParticipantModal } from '@/components/hub/participants/AddParticipantModal';
import { UpdateParticipantModal } from '@/components/hub/participants/UpdateParticipantModal';
import { RemoveParticipantModal } from '@/components/hub/participants/RemoveParticipantModal';
import { useLocale } from '@/contexts/LocaleContext';

export default function HubParticipantsPage() {
  const { t } = useLocale();
  const queryClient = useQueryClient();

  const [addOpen, setAddOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [removeOpen, setRemoveOpen] = React.useState(false);

  const [selectedParticipant, setSelectedParticipant] = React.useState<{
    id: string;
    companyName: string;
    businessNumber: string;
  } | null>(null);

  const handleOpenAdd = () => {
    setAddOpen(true);
  };

  const handleOpenEdit = (participant: {
    id: string;
    companyName: string;
    businessNumber: string;
  }) => {
    setSelectedParticipant(participant);
    setEditOpen(true);
  };

  const handleOpenRemove = (participantId: string) => {
    setSelectedParticipant({
      id: participantId,
      companyName: '',
      businessNumber: '',
    });
    setRemoveOpen(true);
  };

  const handleCloseAll = () => {
    setAddOpen(false);
    setEditOpen(false);
    setRemoveOpen(false);
    setSelectedParticipant(null);

    // ✅ TanStack Query v5 syntax
    queryClient.invalidateQueries({ queryKey: ['participants'] });
  };

  return (
    <>
      <ListParticipants
        onAdd={handleOpenAdd}
        onEdit={handleOpenEdit}
        onRemove={handleOpenRemove}
      />

      <AddParticipantModal open={addOpen} onClose={handleCloseAll} />

      {selectedParticipant && (
        <UpdateParticipantModal
          open={editOpen}
          onClose={handleCloseAll}
          participant={selectedParticipant}
        />
      )}

      {selectedParticipant && (
        <RemoveParticipantModal
          open={removeOpen}
          onClose={handleCloseAll}
          participantId={selectedParticipant.id}
        />
      )}
    </>
  );
}
