// Cart Queries
export const DEFAULT_CART_FIELDS = [
  'id',
  'checkoutUrl',
  'totalQuantity',
  'lines(first: 10) { edges { node { id quantity merchandise { ... on ProductVariant { id title product { id title } } } } } }',
  'cost { subtotalAmount { amount currencyCode } totalAmount { amount currencyCode } }'
];

export function buildCartQuery(fields: string[] = DEFAULT_CART_FIELDS): string {
  return `
    query ($cartId: ID!) {
      cart(id: $cartId) {
        ${fields.join('\n')}
      }
    }`;
};

export function getIdFromHandleQuery(): string {
  return `
    query ($handle: String!) {
      product(handle: $handle) {
        id
      }
    }`;
};

export function buildProductsQuery(fieldsString: string, variantFieldsString: string) {
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

export function buildCollectionProductsQuery(fieldsString: string, variantFieldsString: string) {
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

export function buildSingleProductQuery(fieldsString: string, variantFieldsString: string) {
  return `
    query ($id: ID!) {
      product(id: $id) {
        ${fieldsString}
        variants(first: 1) { edges { node { ${variantFieldsString} } } }
      }
    }`;
};

export function buildVariantProductQuery(productFieldsString: string, variantFieldsString: string) {
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

// Change this to emit an event that the toast component can listen for

// getCurrency
// addToCart
// Update cart (quantity, remove items)
// getProductByID
// getProductByHandle
// getProducts
// getCollections (with sorting)
// getMetafield
// getMetafields