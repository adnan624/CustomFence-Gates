/**
 * Minimal service registry for the standalone catalogue.
 *
 * The catalogue only needs each collection's slug and display title; the rest
 * of the marketing-site service data lives in the main project. Keep these
 * slugs in sync with the main site so the two stay aligned.
 */
export const SERVICES = [
  { slug: "cedar-fences", title: "Cedar fences" },
  { slug: "vinyl-fences", title: "Vinyl fences" },
  { slug: "chain-link-fences", title: "Chain-link fences" },
  { slug: "aluminum-fences", title: "Aluminum fences" },
  { slug: "fence-repair", title: "Fence repair" },
  { slug: "custom-gates", title: "Custom gates" },
] as const;

export type ServiceSlug = (typeof SERVICES)[number]["slug"];
export type Service = (typeof SERVICES)[number];

/** Look up a service by its slug. */
export function getServiceBySlug(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
