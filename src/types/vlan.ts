// src/types/vlan.ts

export interface Vlan {
    id: string;
    vlanId: number;
    description?: string;
    popId: string;
    nasIdentifier: string;
    interfaceName: string;
    allowAsInterface: boolean;
    assignedTo?: string;
    status: 'Active' | 'Inactive';
    isTagged: boolean;
    availableInHub: boolean;
    participantId?: string;
    createdAt: string;
  
    // Optional populated relations
    pop?: {
      id: string;
      name: string;
      location: string;
    };
  
    participant?: {
      id: string;
      companyName: string;
    };
  }
  