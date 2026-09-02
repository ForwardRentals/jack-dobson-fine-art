import { useState, useEffect } from "react";
import { fetchShopifyProducts } from "../lib/shopify";
import { prints, type Print } from "../data/prints";

const SHOPIFY_DOMAIN = "jack-dobson-fine-art.myshopify.com";

export interface EnrichedPrint extends Print {
  /** Title from Shopify (authoritative) — falls back to local title if no match */
  liveTitle?: string;
  livePrice?: number;
  liveAvailable?: boolean;
  /** Always populated — live URL from Shopify when handle matched, constructed otherwise */
  shopifyUrl: string;
}

export function useShopifyProducts(): {
  prints: EnrichedPrint[];
  loading: boolean;
  error: string | null;
} {
  // Seed immediately with static handles so Buy Now always works before API resolves
  const staticEnriched: EnrichedPrint[] = prints.map((p) => ({
    ...p,
    shopifyUrl: `https://${SHOPIFY_DOMAIN}/products/${p.shopifyHandle}`,
  }));

  const [enriched, setEnriched] = useState<EnrichedPrint[]>(staticEnriched);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchShopifyProducts()
      .then((shopifyProducts) => {
        if (cancelled) return;

        // Log the full Shopify catalogue so you can verify handles in the console
        console.group("[Shopify] Live products fetched from store:");
        shopifyProducts.forEach((p) =>
          console.log(`  • "${p.title}"  →  handle: ${p.handle}  |  url: ${p.url}`)
        );
        console.groupEnd();

        const merged: EnrichedPrint[] = prints.map((print) => {
          // Match by handle — far more reliable than matching by title
          const match = shopifyProducts.find(
            (p) => p.handle === print.shopifyHandle
          );

          if (!match) {
            console.warn(
              `[Shopify] No match for handle "${print.shopifyHandle}" — using static data`
            );
            return {
              ...print,
              shopifyUrl: `https://${SHOPIFY_DOMAIN}/products/${print.shopifyHandle}`,
            };
          }

          return {
            ...print,
            // Shopify title is authoritative — it overwrites the local one
            liveTitle:     match.title,
            livePrice:     parseFloat(match.priceMin),
            liveAvailable: match.availableForSale,
            shopifyUrl:    match.url,
          };
        });

        setEnriched(merged);
      })
      .catch((err: Error) => {
        if (cancelled) return;
        console.warn("[Shopify] Live fetch failed — using static data:", err.message);
        setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  return { prints: enriched, loading, error };
}
