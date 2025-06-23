// src/types/inventory.ts
export interface InventoryCategory {
    id: string;
    name: string;
    description?: string;
  }
  
  export interface Manufacturer {
    id: string;
    name: string;
    notes?: string;
  }
  
  export interface Supplier {
    id: string;
    name: string;
    contact?: string;
  }
  
  export interface Product {
    id: string;
    patrimonialNumber: string;
    name: string;
    categoryId: string;
    manufacturerId: string;
    supplierId: string;
    quantity: number;
  }