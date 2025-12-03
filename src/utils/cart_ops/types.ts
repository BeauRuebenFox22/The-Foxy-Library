export type CartItem = {
  id: string | number;
  quantity: number;
  properties?: Record<string, any>;
};

export type CartSummary = {
  subtotal: number;
  total: number;
  itemCount: number;
  currency: string;
};

export type GetCartOptions = {
  lines?: boolean; 
  total?: boolean; 
  currency?: boolean;
  lineItemId?: string
};

export type CartResponse = {
  items: CartItem[];
  item_count: number;
  total_price: number;
  items_subtotal_price: number;
  currency: string;
  attributes: Record<string, string>;
  [key: string]: any; // allows extra fields
};

export type CartOptionsResult = {
  lines?: CartItem[];
  total?: number;
  currency?: string;
  lineItem?: CartItem;
};

export type AddItemResponse = {
  items: CartItem[];
  item_count: number;
  cart_token: string;
  product_title?: string;
  [key: string]: any; // index signature for extra fields
};

export type CartAttributes = Record<string, string>;