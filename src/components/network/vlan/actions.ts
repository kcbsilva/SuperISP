// src/components/network/vlan/actions.ts
'use server';

import { Vlan } from '@/types/vlan';

interface VlanPayload {
  vlanId: number;
  description?: string;
  popId: string;
  isTagged: boolean;
  status: 'Active' | 'Inactive';
  assignedTo?: string;
  availableInHub: boolean;
  participantId?: string;
  nasIdentifier: string;
  interfaceName?: string;
  allowAsInterface: boolean;
}

// ------------------------
// VLAN CRUD
// ------------------------

export async function fetchVlans(): Promise<Vlan[]> {
  const res = await fetch('/api/vlans/list');
  if (!res.ok) throw new Error('Failed to load VLANs');
  return res.json();
}

export async function createVlan(data: VlanPayload): Promise<Vlan> {
  const res = await fetch('/api/vlans/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create VLAN');
  return res.json();
}

export async function updateVlan(id: string, data: VlanPayload): Promise<Vlan> {
  const res = await fetch(`/api/vlans/update/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update VLAN');
  return res.json();
}

export async function deleteVlan(id: string): Promise<void> {
  const res = await fetch(`/api/vlans/delete/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete VLAN');
}

// ------------------------
// Auxiliary Fetches
// ------------------------

export async function fetchPops(): Promise<{ id: string; name: string; location: string }[]> {
  const res = await fetch('/api/pops/list');
  if (!res.ok) throw new Error('Failed to load PoPs');
  return res.json();
}

export async function fetchParticipants(): Promise<{ id: string; companyName: string }[]> {
  const res = await fetch('/api/participants/list');
  if (!res.ok) throw new Error('Failed to load participants');
  return res.json();
}

export async function fetchNasByPopId(popId: string): Promise<{ id: string; identifier: string }[]> {
  const res = await fetch(`/api/nas/by-pop/${popId}`);
  if (!res.ok) throw new Error('Failed to fetch NAS by PoP');
  return res.json();
}

export async function fetchInterfacesByNas(nasIdentifier: string): Promise<string[]> {
  const res = await fetch(`/api/nas/interfaces/${nasIdentifier}`);
  if (!res.ok) throw new Error('Failed to fetch interfaces for NAS');
  return res.json();
}
