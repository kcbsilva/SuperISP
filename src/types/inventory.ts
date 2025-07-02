// src/types/inventory.ts
export interface InventoryCategory {
    id: string;
    name: string;
    description?: string;
  }
  
  export interface Manufacturer {
    id: string;
    businessName: string;
    businessNumber: string;
    address: string;
    telephone: string;
    email: string;
  }
  
  export interface Supplier {
    id: string;
    businessName: string;
    businessNumber: string;
    address: string;
    email: string;
    telephone: string;
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