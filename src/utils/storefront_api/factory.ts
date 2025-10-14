import { state, showToast } from "../store/store";

async function shopifyFetch(query: string, variables: Record<string, any> = {}): Promise<any> {
  try {
    if(!state.shopDomain || !state.storefrontToken) throw new Error('Missing Shopify configuration (shopDomain/storefrontToken)');
    const endpoint = `https://${state.shopDomain}/api/2025-07/graphql.json`;
    const token = state.storefrontToken;
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token
      },
      body: JSON.stringify({ query, variables })
    });
    const json = await res.json();
    if(json.errors) throw new Error(json.errors.map((e: any) => e.message).join(', '));
    return json.data;
  } catch(error) {
    console.error('Shopify Fetch Error:', error);
    throw error; 
  };
};

export async function getIdFromHandle(handle: string): Promise<string | null> {
  const query = `
    query ($handle: String!) {
      product(handle: $handle) {
        id
      }
    }`;
  try {
    const data = await shopifyFetch(query, { handle });
    return data?.product?.id || null;
  } catch (error) {
    console.error('getIdFromHandle error:', error);
    return null;
  };
};

// Field + normalization helpers
const BASE_PRODUCT_FIELDS = ['id','handle','title'];
const DEFAULT_VARIANT_FIELDS = ['id','title','price { amount currencyCode }'];

function mergeFields(requested: string[] | string, defaults: string[]): string[] {
  const req = (Array.isArray(requested) ? requested : requested.split(','))
    .map(f => f.trim())
    .filter(Boolean);
  const seen = new Set<string>();
  const ordered: string[] = [];
  for(const f of req) { 
    if(!seen.has(f)) { 
      seen.add(f); ordered.push(f); 
    }; 
  };
  for(const d of defaults) { 
    if(!seen.has(d)) { 
      seen.add(d); 
      ordered.push(d); 
    }; 
  };
  return ordered;
};

function expandProductFields(fields: string[]): string {
  return fields
    .filter(f => f !== 'price')
    .map(f => {
      if(f === 'images') return 'images(first: 10) { nodes { url altText } }';
      return f;
    })
    .join('\n');
};

function variantSelection(fields: string[] = DEFAULT_VARIANT_FIELDS): string {
  return fields.join('\n');
};

interface NormalizedProduct {
  id: string;
  handle?: string;
  title?: string;
  variantId?: string;
  price?: string | null;
  imageUrl?: string | null;
  imageAlt?: string | null;
  // index signature for dynamic requested fields
  [key: string]: any;
};

function normalizeProduct(product: any, selectedVariant?: any): NormalizedProduct {
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

// Query builders
function buildProductsQuery(fieldsString: string, variantFieldsString: string) {
  return `
    query ($limit: Int!, $sortKey: ProductSortKeys!, $reverse: Boolean) {
      products(first: $limit, sortKey: $sortKey, reverse: $reverse) {
        edges {
          node {
            ${fieldsString}
            variants(first: 1) { edges { node { ${variantFieldsString} } } }
          }
        }
      }
    }`;
};

function buildCollectionProductsQuery(fieldsString: string, variantFieldsString: string) {
  return `
    query ($handle: String!, $limit: Int!, $sortKey: ProductCollectionSortKeys!, $reverse: Boolean) {
      collection(handle: $handle) {
        products(first: $limit, sortKey: $sortKey, reverse: $reverse) {
          edges {
            node {
              ${fieldsString}
              variants(first: 1) { edges { node { ${variantFieldsString} } } }
            }
          }
        }
      }
    }`;
};

function buildSingleProductQuery(fieldsString: string, variantFieldsString: string) {
  return `
    query ($id: ID!) {
      product(id: $id) {
        ${fieldsString}
        variants(first: 1) { edges { node { ${variantFieldsString} } } }
      }
    }`;
};

function buildVariantProductQuery(productFieldsString: string, variantFieldsString: string) {
  return `
    query ($id: ID!) {
      productVariant(id: $id) {
        ${variantFieldsString}
        product {
          ${productFieldsString}
          variants(first: 1) { edges { node { ${variantFieldsString} } } }
        }
      }
    }`;
};

// Public API
export async function fetchProducts(limit: number, collectionHandle: string, sortKey: string, fields: string[] | string, reversed: boolean = false) {
  try {
    const merged = mergeFields(fields, BASE_PRODUCT_FIELDS);
    const fieldsString = expandProductFields(merged);
    const variantFieldsString = variantSelection();
    const isAll = !collectionHandle || collectionHandle === 'all';
    const query = isAll ? buildProductsQuery(fieldsString, variantFieldsString) : buildCollectionProductsQuery(fieldsString, variantFieldsString);
    const reverse = !!reversed;
    const variables: Record<string, any> = isAll ? { limit, sortKey, reverse } : { handle: collectionHandle, limit, sortKey, reverse };
    const data = await shopifyFetch(query, variables);
    const productEdges = data.products?.edges || data.collection?.products?.edges || [];
    return productEdges.map((edge: any) => normalizeProduct(edge.node));
  } catch(error) { 
    console.error('Fetch Products Error:', error); throw error;
  };
};

export async function fetchProductByID(id: string, fields: string[] | string, options?: { variantId?: string }): Promise<NormalizedProduct | null> {
  try {
    if(options?.variantId) return await getVariantProduct(options.variantId, fields);
    const merged = mergeFields(fields, BASE_PRODUCT_FIELDS);
    const fieldsString = expandProductFields(merged);
    const variantFieldsString = variantSelection();
    const query = buildSingleProductQuery(fieldsString, variantFieldsString);
    const data = await shopifyFetch(query, { id });
    const product = data?.product;
    if(!product) return null;
    return normalizeProduct(product);
  } catch(error) { console.error('Fetch Product By ID Error:', error); throw error; };
};

export async function getVariantProduct(variantId: string, fields: string[] | string): Promise<NormalizedProduct | null> {
  try {
    const merged = mergeFields(fields, BASE_PRODUCT_FIELDS);
    const productFieldsString = expandProductFields(merged);
    const variantFieldsString = variantSelection();
    const query = buildVariantProductQuery(productFieldsString, variantFieldsString);
    const data = await shopifyFetch(query, { id: variantId });
    const variantNode = data?.productVariant;
    if(!variantNode) return null;
    const product = variantNode.product;
    if(!product) return null;
    return normalizeProduct(product, variantNode); 
  } catch(error) { console.error('Get Variant Product Error:', error); throw error; };
};

export async function addToCart(options: {
  id: number;
  quantity?: number;
  properties?: Record<string, any>;
}) {
  try {
    console.log('IV add to cart called');
    if(!options.id) throw new Error('No variant id provided for addToCart');
    const quantity = options.quantity || 1;
    const properties = options.properties || {};
    const payload = {
      items: [
        {
          id: options.id,
          quantity,
          properties
        }
      ]
    };
    const url = '/cart/add.js';
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify(payload)
    });
    if(!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText);
    };
    const cartItem = await res.json();
    showToast('Added to cart!', 'success', 3000);
    return cartItem;
  } catch (error) {
    showToast('Error adding to cart', 'error', 5000);
    throw error;
  };
};