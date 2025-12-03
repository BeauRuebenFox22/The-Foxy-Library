import { showToast } from "../store/store";
import { createErrorHandler } from '../../utils/error_handling/factory';
import * as CartTypes from "./types";
import { CartOps } from "./blueprint";


class CartManager implements CartOps {
  
  private errors = createErrorHandler({ component: 'cart-operations' });

  /** 
    * To use getCart(), you can pass an options object to specify what data you want like so:
    * const cartData = await cartManager.getCart({ lines: true, total: true, currency: true, lineItemId: '1234567890' });
    * This will return an object with the cart lines, total price, currency, and the specific line item with the given ID.
  */
  async getCart(options?: CartTypes.GetCartOptions): Promise<CartTypes.CartOptionsResult | CartTypes.CartResponse> {
    const response = await fetch('/cart.js');
    const cart: CartTypes.CartResponse = await response.json();
    const result: CartTypes.CartOptionsResult = {};
    if(options?.lines) result.lines = cart.items;
    if(options?.total) result.total = cart.total_price;
    if(options?.currency) result.currency = cart.currency;
    if(options?.lineItemId) result.lineItem = cart.items.find((item: CartTypes.CartItem) => item.id === options.lineItemId);
    return Object.keys(result).length ? result : cart;
  };

  /**
   * To use addItem(), you can call it with an object specifying the item details like so:
   * await cartManager.addItem({ id: 1234567890, quantity: 2, properties: { color: 'blue', size: 'M' } });
   * This will add 2 units of the product with ID 1234567890 to the cart, along with custom properties for color and size.
  */
  async addItem(item: CartTypes.CartItem): Promise<CartTypes.AddItemResponse | null> {
    try {
      const response = await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      if(!response.ok) throw new Error('Failed to add item to cart');
      const data = await response.json();
      showToast(`Added ${data.product_title} to cart!`, 'success', 3000);
      return data;
    } catch (error: any) {
      this.errors.handle({
        error,
        scope: 'addItem',
        userMessage: 'Unable to add item to cart right now.',
        devMessage: 'addItem failed in cartManager',
        severity: 'error'
      });
      return null;
    };
  };

  /**
   * To use addItems(), you can call it with an array of item objects like so:
   * await cartManager.addItems([
   *   { id: 1234567890, quantity: 2 },
   *   { id: 9876543210, quantity: 1 }
   * ]);
  */
  async addItems(items: CartTypes.CartItem[]): Promise<Array<CartTypes.AddItemResponse | null>> {
    const results = [];
    for(const item of items) {
      results.push(await this.addItem(item));
    }
    return results;
  };

  /**
   * To use updateItem(), you can call it with an object specifying the updated item details like so:
   * await cartManager.updateItem({ id: 'line_item_id_123', quantity: 3, properties: { color: 'red' } });
  */
  async updateItem(item: CartTypes.CartItem): Promise<CartTypes.AddItemResponse | null> {
    try {
      const response = await fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: item.id, 
          quantity: item.quantity, 
          properties: item.properties 
        })
      });
      if(!response.ok) throw new Error('Failed to update item in cart');
      const data = await response.json();
      showToast(`Updated item in cart!`, 'success', 3000);
      return data;
    } catch(error: any){
      this.errors.handle({
        error,
        scope: 'updateItem',
        userMessage: 'Unable to update item in cart right now.',
        devMessage: 'updateItem failed in cartManager',
        severity: 'error'
      });
      return null;
    };
  };

  /**
   * To use removeItem(), you can call it with an object specifying the item to remove like so:
   * await cartManager.removeItem({ id: 'line_item_id_123' });
  */
  async removeItem(item: CartTypes.CartItem): Promise<CartTypes.AddItemResponse | null> {
    try {
      const response = await fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: item.id,
          quantity: 0
        })
      });
      if(!response.ok) throw new Error('Failed to remove item from cart');
      const data = await response.json();
      showToast(`Removed item from cart!`, 'success', 3000);
      return data;
    } catch(error: any) {
      this.errors.handle({
        error,
        scope: 'removeItem',
        userMessage: 'Unable to remove item from cart right now.',
        devMessage: 'removeItem failed in cartManager',
        severity: 'error'
      });
      return null;
    };
  };

  /**
   * To use clearCart(), simply call it without any arguments:
   * await cartManager.clearCart();
  */
  async clearCart(): Promise<CartTypes.AddItemResponse | null> {
    try {
      const response = await fetch('/cart/clear.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if(!response.ok) throw new Error('Failed to clear cart');
      const data = await response.json();
      showToast(`Cleared cart!`, 'success', 3000);
      return data;
    } catch(error: any) {
      this.errors.handle({
        error,
        scope: 'clearCart',
        userMessage: 'Unable to clear cart right now.',
        devMessage: 'clearCart failed in cartManager',
        severity: 'error'
      });
      return null;
    };
  };
  
  /**
   * To use getAllCartAttributes(), you can call it without any arguments like so:
   * const attributes = await cartManager.getAllCartAttributes();
  */
  async getAllCartAttributes(): Promise<CartTypes.CartAttributes> {
    const response = await fetch('/cart.js');
    const cart = await response.json();
    return cart.attributes || {};
  };

  /**
   * To use getCartAttribute(), you can call it with the attribute key you set for the discount like so:
   * const discountCode = await cartManager.getCartAttribute('discountCode');
   */
  async getCartAttribute(attrKey: string): Promise<string | null> {
    const response = await fetch('/cart.js');
    const cart = await response.json();
    return cart.attributes[attrKey] || null;
  };

  /**
   * Set a cart attribute. If attrVal is an array, it will be stored as a comma-separated string.
   * Example: await cartManager.setCartAttribute('discount', [1,2,3]);
  */
  async setCartAttribute(attrKey: string, attrVal: string | number | Array<string | number>): Promise<void> {
    const response = await fetch('/cart.js');
    const cart = await response.json();
    const existingRaw = cart.attributes[attrKey] || '';
    const existingArr = existingRaw ? existingRaw.split(',').map(v => v.trim()).filter(Boolean) : [];
    const newArr = Array.isArray(attrVal) ? attrVal.map(String) : [String(attrVal)];
    const mergedSet = new Set([...existingArr, ...newArr]);
    const value = Array.from(mergedSet).join(',');
    await fetch('/cart/update.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ attributes: { [attrKey]: value } })
    });
  };

  /**
   * Remove a cart attribute by key.
   * Example: await cartManager.removeCartAttribute('discount');
  */
  async removeCartAttribute(attrKey: string): Promise<void> {
    const attributes = await this.getAllCartAttributes(); 
    delete attributes[attrKey];
    await fetch('/cart/update.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ attributes })
    });
  };

  /**
   * To use addCartNote(), you can call it with the note string like so:
   * await cartManager.addCartNote('Please deliver between 3-5 PM.');
  */
  async addCartNote(note: string): Promise<void | null> {
    try {
      await fetch('/cart/update.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note })
      });
    } catch(error: any) {
      this.errors.handle({
        error,
        scope: 'addCartNote',
        userMessage: 'Unable to add note to cart right now.',
        devMessage: 'addCartNote failed in cartManager',
        severity: 'error'
      });
      return null;
    };
  };

  /**
   * To use removeCartNote(), simply call it without any arguments:
   * await cartManager.removeCartNote();
  */
  async removeCartNote(): Promise<void | null> {
    try {
      await fetch('/cart/update.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: '' })
      });
    } catch(error: any) {
      this.errors.handle({
        error,
        scope: 'removeCartNote',
        userMessage: 'Unable to remove note from cart right now.',
        devMessage: 'removeCartNote failed in cartManager',
        severity: 'error'
      });
      return null;
    };
  };

  /**
   * To use applyDiscount(), simply call it without any arguments:
   * await cartManager.applyDiscount();
  */
  async applyDiscount() {
    const discounts = await this.getCartAttribute('discountCodes');
    if(!discounts) return;
    const codes = discounts.split(',').map(code => code.trim()).filter(Boolean);
    for(const code of codes) {
      showToast(`Discount code "${code}" will be applied at checkout.`, 'info');
      window.location.href = `/checkout?discount=${encodeURIComponent(code)}`;
    };
  };

  /**
   * To use getCartSummary(), simply call it without any arguments:
   * const summary = await cartManager.getCartSummary();
   * const summary: CartSummary = await cartManager.getCartSummary();
  */
  async getCartSummary(): Promise<CartTypes.CartSummary>{
    const response = await fetch('/cart.js');
    const cart = await response.json();
    return {
      subtotal: cart.items_subtotal_price,
      total: cart.total_price,
      itemCount: cart.item_count,
      currency: cart.currency
    };
  };

};

/**
 * To use cartManager, you can import it and call its methods like so:
 * import { cartManager } from './path/to/cart';
*/
export const cartManager = new CartManager();

/* 
  To Add: 
  * Add events system to power the components, modules and helpers methods
  * This should also reduce reliance on the State as well
  * Add loading state management
  * Retry logic, maybe? 
*/