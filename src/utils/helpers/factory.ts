export function decodeJsonString(str: string): string {
  return str.replace(/&quot;/g, '"');
};

export function requestedFields(fields: string): string[] | null {
  return fields ? fields.split(',').map(f => f.trim()) : null;
}; 

export function formatMoney(amount: number, currencyCode: string = 'GBP', locale: string = 'en-GB'): string {
  // return new Intl.NumberFormat(locale, { style: 'currency', currency: currencyCode }).format(amount / 100);
  return new Intl.NumberFormat(locale, { style: 'currency', currency: currencyCode }).format(amount);
};

export function getCurrencySymbol(currencyCode: string = 'GBP', locale: string = 'en-GB'): string {
  return (0).toLocaleString(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).replace(/\d/g, '').trim();
};

export function getProductIDFromGid(id: string): number {
  return Number(id.split('/').pop()); 
};

export function getProductHandle(): string {
  const path = window.location.pathname;
  return path.startsWith('/products/') ? path.replace('/products/', '').split('/')[0] : null;
};