// src/types/vpn.ts

export type VPNConnection = {
    id: number;
    name: string;
    remote_address: string;
    local_subnet: string;
    remote_subnet: string;
    pre_shared_key: string;
    enabled: boolean;
    created_at: string;
  
    // ✅ Add these for L2TP support
    username: string;
    password: string;
  };
  