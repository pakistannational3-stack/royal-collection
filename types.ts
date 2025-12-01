export interface SubProduct {
  id: string;
  sku: string;
  name?: string; // Specific name for this variant (overrides parent)
  description?: string; // Specific description (overrides parent)
  color: string;
  price: number;
  quantity: number;
  weight: string;
  dimensions: string;
  image: string;
  remarks: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  basePrice: number;
  image: string;
  remarks: string;
  alertLimit: number;
  subProducts: SubProduct[];
}

export enum ActionType {
  CREATE_PRODUCT = 'CREATE_PRODUCT',
  ADD_SUB_PRODUCT = 'ADD_SUB_PRODUCT',
  UPDATE_STOCK = 'UPDATE_STOCK',
  UNKNOWN = 'UNKNOWN'
}

export interface InventoryAction {
  type: ActionType;
  productName?: string; // Used for matching
  sku?: string; // Used for matching sub-products
  color?: string; // Used for matching sub-products if SKU not provided
  data?: any; // The payload to add/update
  quantityChange?: number; // Positive to add, negative to remove
  reason?: string; // For the AI to explain what it did
}

export interface Alert {
  id: string;
  productName: string;
  sku: string;
  currentQuantity: number;
  limit: number;
  timestamp: number;
}