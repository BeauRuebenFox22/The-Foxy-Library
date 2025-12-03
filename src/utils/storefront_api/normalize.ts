export interface NormalizedProduct {
  id: string;
  handle?: string;
  title?: string;
  variantId?: string;
  price?: string | null;
  imageUrl?: string | null;
  imageAlt?: string | null;
  [key: string]: any;
};

export function normalizeProduct(product: any, selectedVariant?: any): NormalizedProduct {
  const variant = selectedVariant || product.variants?.edges?.[0]?.node || {};
  let imageUrl = null;
  let imageAlt = null;
  if(product.images?.nodes && product.images.nodes.length > 0) {
    imageUrl = product.images.nodes[0].url || null;
    imageAlt = product.images.nodes[0].altText || null;
  };
  const { id: variantId, price } = variant;
  return {
    id: product.id,
    ...Object.fromEntries(Object.entries(product).filter(([key]) => key !== 'variants')),
    variantId,
    price: price?.amount || null,
    imageUrl,
    imageAlt,
  };
};