import * as CartTypes from "./types";

export interface CartOps {
  getCart(options?: CartTypes.GetCartOptions): Promise<CartTypes.CartOptionsResult | CartTypes.CartResponse>
  addItem(item: CartTypes.CartItem): Promise<CartTypes.AddItemResponse | null>
  addItems(items: CartTypes.CartItem[]): Promise<Array<CartTypes.AddItemResponse | null>>
  updateItem(item: CartTypes.CartItem): Promise<CartTypes.AddItemResponse | null>
  removeItem(item: CartTypes.CartItem): Promise<CartTypes.AddItemResponse | null>
  clearCart(): Promise<CartTypes.AddItemResponse | null>
  getAllCartAttributes(): Promise<CartTypes.CartAttributes>
  getCartAttribute(attrKey: string): Promise<string | null>
  setCartAttribute(attrKey: string, attrVal: string | number | Array<string | number>): Promise<void>;
  removeCartAttribute(attrKey: string): Promise<void>;
  addCartNote(note: string): Promise<void | null>;
  removeCartNote(): Promise<void | null>;
  applyDiscount(): Promise<void>;
  getCartSummary(): Promise<CartTypes.CartSummary>;
};