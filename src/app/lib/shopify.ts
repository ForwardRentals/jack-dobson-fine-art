// Shopify Storefront API integration
// Store: jack-dobson-fine-art.myshopify.com
// Token: Headless channel Storefront API access token

const STOREFRONT_TOKEN = "a029d61495186b0fb1d54723cfee400f";
const SHOPIFY_DOMAIN  = "jack-dobson-fine-art.myshopify.com";
const API_VERSION     = "2024-10";

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  availableForSale: boolean;
  /** Raw numeric string, e.g. "420.00" */
  priceMin: string;
  currencyCode: string;
  /** Direct product-page URL */
  url: string;
  /** First variant GID (for future cart/checkout use) */
  variantId: string;
}

const PRODUCTS_QUERY = /* GraphQL */ `
  query StorefrontProducts {
    products(first: 50) {
      edges {
        node {
          id
          title
          handle
          availableForSale
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          variants(first: 1) {
            edges {
              node {
                id
              }
            }
          }
        }
      }
    }
  }
`;

export async function fetchShopifyProducts(): Promise<ShopifyProduct[]> {
  const res = await fetch(
    `https://${SHOPIFY_DOMAIN}/api/${API_VERSION}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN,
      },
      body: JSON.stringify({ query: PRODUCTS_QUERY }),
    }
  );

  if (!res.ok) {
    throw new Error(`Shopify Storefront API ${res.status}: ${res.statusText}`);
  }

  const json = await res.json();

  if (json.errors) {
    throw new Error(json.errors.map((e: { message: string }) => e.message).join(", "));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return json.data.products.edges.map(({ node }: any): ShopifyProduct => ({
    id:              node.id,
    title:           node.title,
    handle:          node.handle,
    availableForSale: node.availableForSale,
    priceMin:        node.priceRange.minVariantPrice.amount,
    currencyCode:    node.priceRange.minVariantPrice.currencyCode,
    url:             `https://${SHOPIFY_DOMAIN}/products/${node.handle}`,
    variantId:       node.variants.edges[0]?.node.id ?? "",
  }));
}
