import { apiConfig } from './config';
import { createErrorHandler } from '../../utils/error_handling/factory';
import { getIdFromHandleQuery, buildProductsQuery, buildSingleProductQuery, buildVariantProductQuery, buildCollectionProductsQuery } from './queries';
import { normalizeProduct, NormalizedProduct } from './normalize';

const BASE_PRODUCT_FIELDS = ['id','handle','title'];
const DEFAULT_VARIANT_FIELDS = ['id','title','price { amount currencyCode }'];
const errors = createErrorHandler({ component: 'storefront-api-module-config' });

export async function shopifyFetch(query: string, variables: Record<string, any> = {}): Promise<any> {  
  try {
    if(!apiConfig.isConnected()) throw new Error('Shopify config not connected');
    const res = await fetch(apiConfig.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': apiConfig.token
      },
      body: JSON.stringify({ query, variables })
    });
    const json = await res.json();
    if(json.errors) throw new Error(json.errors.map((e: any) => e.message).join(', '));
    return json.data;
  } catch(err: any) {
    errors.handle({
      error: err,
      scope: 'loadProducts',
      userMessage: 'Unable to load products right now.',
      devMessage: 'fetchProducts failed in iv-dynamic-products',
      severity: 'error'
    });
    return null;
  };
};

export async function getIdFromHandle(handle: string): Promise<string | null> {
  try {
    const query = getIdFromHandleQuery();
    const data = await shopifyFetch(query, { handle });
    const id = data?.product?.id;
    if(!id) throw new Error('No product found for given handle');
    return id;
  } catch (err: any) {
    errors.handle({
      error: err,
      scope: 'getIdFromHandle',
      userMessage: 'Unable to get product ID from handle right now.',
      devMessage: 'getIdFromHandle failed in iv-dynamic-products',
      severity: 'error'
    });
    return null;
  };
};

function mergeFields(requested: string[] | string, defaults: string[]): string[] {
  const req = (Array.isArray(requested) ? requested : requested.split(','))
    .map(f => f.trim())
    .filter(Boolean);
  const seen = new Set<string>();
  const ordered: string[] = [];
  for(const f of req) { 
    if(!seen.has(f)) seen.add(f); ordered.push(f); 
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

export async function fetchProducts(
  limit: number, 
  collectionHandle: string, 
  sortKey: string, 
  fields: string[] | string, 
  reversed: boolean = false) {
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
  } catch(error) { 
    console.error('Fetch Product By ID Error:', error); throw error; 
  };
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
  } catch(error) { 
    console.error('Get Variant Product Error:', error); throw error; 
  };
};