export async function fetchShopifyCurrencyCode(): Promise<string> {
  try {
    const url = '/cart.js';
    const response = await fetch(url);
    const data = await response.json();
    return data.currency || 'GBP';
  } catch (error) {
    console.error('Error fetching cart:', error);
    return 'GBP';
  };
};

/* THIS CAN BE DELETED LATER, SUPERSEDED BY cartManager METHODS */