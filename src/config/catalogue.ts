/**
 * Catalogue content — one premium "collection" screen per service category.
 *
 * Keyed by the same slugs as `SERVICES` so the catalogue, the service detail
 * pages, and the enquiry dropdown all stay in sync. Titles / taglines are
 * pulled from `SERVICES` at render time; everything here is catalogue-specific.
 */
import type { ServiceSlug } from "@/config/services";

export type Swatch = {
  name: string;
  hex: string;
  /** Real stain-sample photo; when set it replaces the synthetic grain. */
  image?: string;
};

/**
 * One colour chip inside a palette tier.
 * `image` uses a real swatch photo; `woodgrain` uses a synthetic textured fill;
 * otherwise the flat `hex` is shown.
 */
export type PaletteSwatch = { name: string; hex: string; woodgrain?: boolean; image?: string };

/** A palette tier, e.g. "Premium — Textured woodgrain". */
export type PaletteTier = { tier: string; finish: string; swatches: PaletteSwatch[] };

/** A named design profile within a style (e.g. Newbury, Folly, Hudson). */
export type FenceProfile = {
  name: string;
  tagline: string;
  /** Fence elevation illustration shown on the left of the profile page. */
  image?: string;
  panelWidth: string;
  fenceHeight: string;
  note?: string;
  /** Per-profile availability note for the post-cap options. */
  postCapNote?: string;
  palette: PaletteTier[];
};

export type CatalogueStyle = {
  name: string;
  blurb?: string;
  /** Omit for a typographic "made to order" card (no photo). */
  image?: { src: string; alt: string };
  specs?: string[];
  /** Small corner badge, e.g. "Most requested". */
  tag?: string;
  /** Optional labelled face/pattern options (transparent cut-outs). */
  samples?: { label: string; items: MaterialItem[] };
  /** Optional named profiles, each shown as its own showcase page. */
  profiles?: FenceProfile[];
};

export type CatalogueImage = { src: string; alt: string };

export type MaterialItem = { name: string; image: string };

/** Optional "materials & components" reference, grouped into sections. */
export type MaterialSection = { label: string; items: MaterialItem[] };

export type CatalogueCategory = {
  slug: ServiceSlug;
  /** e.g. "Collection 01 — Western Red Cedar". */
  eyebrow: string;
  hero: CatalogueImage;
  lede: string;
  /** Three short facts shown in the collection meta bar. */
  meta: { label: string; value: string }[];
  styles: CatalogueStyle[];
  finishes: { label: string; swatches: Swatch[] };
  specSheet: { label: string; value: string }[];
  /** Optional materials page — real component photos, grouped by section. */
  materials?: { label: string; sections: MaterialSection[] };
};

export const CATALOGUE: CatalogueCategory[] = [
  {
    slug: "cedar-fences",
    eyebrow: "Collection 01 — Western Red Cedar",
    hero: {
      src: "/service-cedar-fence.jpg",
      alt: "Western Red Cedar privacy fence beside a home with a landscaped border",
    },
    lede: "Warm, natural, and unmistakably Pacific Northwest. Every cedar fence is milled, built, and finished to order — the grain, the height, and the line chosen for your yard.",
    meta: [
      { label: "Material", value: "Western Red Cedar" },
      { label: "Heights", value: "4 – 8 ft" },
      { label: "Build", value: "Made to order" },
    ],
    styles: [
      {
        name: "Classic Cedar Fence",
        blurb:
          "The signature full-privacy fence — tight vertical boards, a clean top cap, and posts set to stand straight for years.",
        image: {
          src: "/cedar-classic.jpg",
          alt: "Classic cedar privacy fence with capped posts beside a landscaped border",
        },
        specs: [
          "Vertical board privacy",
          "6 ft standard height",
          "Posts set in concrete",
        ],
        tag: "Most requested",
      },
      {
        name: "Solid Top Cedar Fence",
        blurb:
          "Full-height privacy finished with a continuous solid top rail for a crisp, uninterrupted line.",
        image: {
          src: "/cedar-solid-top.jpg",
          alt: "Solid-top cedar privacy fence running along a garden path",
        },
        specs: [
          "Continuous solid top rail",
          "Full privacy face",
          "Capped posts",
        ],
      },
      {
        name: "Lattice Top Cedar Fence",
        blurb:
          "Full privacy below, a decorative lattice crown above — height and character without visual weight.",
        image: {
          src: "/cedar-lattice-top.jpg",
          alt: "Cedar privacy fence with a decorative lattice top and garden beds",
        },
        specs: ["Decorative lattice crown", "Garden-friendly", "Added height"],
        samples: {
          label: "Lattice face",
          items: [
            { name: "Standard Diagonal Lattice", image: "/cedar-mat-lattice-diagonal.png" },
            { name: "Square Lattice", image: "/cedar-mat-lattice-square.png" },
          ],
        },
      },
      {
        name: "Horizontal Slat Cedar Fence",
        blurb:
          "A modern, architectural line of horizontal boards with concealed fasteners for an uninterrupted face.",
        image: {
          src: "/cedar-horizontal-slat.jpg",
          alt: "Modern horizontal slat cedar fence with landscape lighting at dusk",
        },
        specs: [
          "1×6 horizontal slats",
          "Concealed fasteners",
          "Cedar or powder-coated posts",
        ],
      },
      {
        name: "Shadow Box Cedar Fence",
        blurb:
          "Alternating boards finish the fence identically on both sides and let a little air and light through.",
        image: {
          src: "/cedar-shadowbox.jpg",
          alt: "Cedar shadow box fence finished the same on both sides",
        },
        specs: [
          "Finished both sides",
          "Alternating boards",
          "Shared-boundary favourite",
        ],
      },
      {
        name: "Hog Wire Cedar Fence",
        blurb:
          "A cedar frame around welded hog-wire panels — an open, contemporary boundary that keeps the view.",
        image: {
          src: "/cedar-hog-wire.jpg",
          alt: "Cedar-framed hog wire fence bordering a lawn with a lake view",
        },
        specs: [
          "Welded hog-wire panels",
          "Cedar post-and-rail frame",
          "Open sightlines",
        ],
      },
      {
        name: "Cedar Picket Fence",
        blurb:
          "A classic front-yard picket in warm cedar — spaced boards scaled for gardens and curb appeal.",
        image: {
          src: "/cedar-picket.jpg",
          alt: "Warm cedar picket fence along a front-yard garden border",
        },
        specs: [
          "Spaced picket boards",
          "Garden & front-yard scale",
          "Capped posts",
        ],
      },
    ],
    finishes: {
      label: "Cedar finishes",
      swatches: [
        { name: "Redwood", hex: "#7A2E22", image: "/cedar-stain-redwood.jpg" },
        { name: "Cedar Tone", hex: "#9C5A2E", image: "/cedar-stain-cedar-tone.jpg" },
        { name: "Oxford Brown", hex: "#3E2A1C", image: "/cedar-stain-oxford-brown.jpg" },
        { name: "Cumberland Brown", hex: "#7A4E28", image: "/cedar-stain-cumberland-brown.jpg" },
        { name: "Rustic Oak", hex: "#B06A2C", image: "/cedar-stain-rustic-oak.jpg" },
        { name: "Sable Brown", hex: "#8A6A4A", image: "/cedar-stain-sable-brown.jpg" },
        { name: "Coffee Brown", hex: "#6B5847", image: "/cedar-stain-coffee-brown.jpg" },
        { name: "Timber Gray", hex: "#8D8A84", image: "/cedar-stain-timber-gray.jpg" },
        { name: "Driftwood Gray", hex: "#B0ACA6", image: "/cedar-stain-driftwood-gray.jpg" },
        { name: "Natural (Clear)", hex: "#D9C4A3", image: "/cedar-stain-natural-clear.jpg" },
      ],
    },
    specSheet: [
      { label: "Posts", value: "4×4 pressure-treated, set in concrete" },
      { label: "Rails", value: "2×4 cedar, 2 – 3 per section" },
      { label: "Pickets", value: 'Western Red Cedar, 5/8" – 1"' },
      { label: "Hardware", value: "Hot-dipped galvanized / stainless" },
      { label: "Heights", value: "4, 5, 6, 7, 8 ft" },
      { label: "Finish", value: "Natural, stained, or sealed" },
    ],
    materials: {
      label: "Materials & components",
      sections: [
        {
          label: "Pickets",
          items: [
            { name: "Clear Cedar Picket", image: "/cedar-mat-clear-picket.png" },
            { name: "Grade 1 Cedar Picket", image: "/cedar-mat-grade1-picket.png" },
            { name: "Grade 2 Cedar Picket", image: "/cedar-mat-grade2-picket.png" },
          ],
        },
        {
          label: "Rails",
          items: [
            { name: "Cedar Rail", image: "/cedar-mat-cedar-rail.png" },
            { name: "Pressure Treated Rail", image: "/cedar-mat-pt-rail.png" },
          ],
        },
        {
          label: "Post",
          items: [
            { name: "Pressure Treated Post on Pipe", image: "/cedar-mat-pt-post-pipe.png" },
            { name: "Cedar Post on Pipe", image: "/cedar-mat-cedar-post-pipe.png" },
            { name: "Cedar Post (Standard)", image: "/cedar-mat-cedar-post-std.png" },
            { name: "Pressure Treated Post (Standard)", image: "/cedar-mat-pt-post-std.png" },
          ],
        },
        {
          label: "Post Cap",
          items: [
            { name: "Post Cap", image: "/cedar-mat-post-cap.png" },
            { name: "Solar LED Post Cap", image: "/cedar-mat-solar-post-cap.png" },
          ],
        },
        
      ],
    },
  },
  {
    slug: "vinyl-fences",
    eyebrow: "Collection 02 — Vinyl",
    hero: {
      src: "/service-vinyl.jpg",
      alt: "White vinyl privacy fence along a landscaped backyard border",
    },
    lede: "A crisp, modern line that never needs painting or staining. Vinyl keeps its colour and its edge through every Pacific Northwest winter.",
    meta: [
      { label: "Material", value: "Virgin vinyl" },
      { label: "Heights", value: "4 – 6 ft" },
      { label: "Upkeep", value: "Rinse clean" },
    ],
    styles: [
      {
        name: "Vertical Vinyl Fence",
        blurb:
          "Tongue-and-groove panels with no gaps — a seamless, bright-white wall of privacy.",
        image: {
          src: "/vinyl-privacy.jpg",
          alt: "Solid white vinyl privacy fence beside a landscaped lawn",
        },
        specs: ["Tongue-and-groove panels", "Full privacy", "6 ft standard"],
        tag: "Zero maintenance",
        profiles: [
          {
            name: "Newbury",
            tagline: "Solid vertical privacy",
            image: "/vinyl-profile-newbury.png",
            postCapNote:
              "White/Sand: all 8 caps; Clay: all except Solar; Gray: Pyramid + New England. Select: Cypress/Coastal Cedar P-I-NE, Aspen/Mesquite P-NE, Dark Sequoia P-NE. Premium blends: P-NE.",
            panelWidth: "6' or 8'",
            fenceHeight: "4', 5', 6', 7'*",
            note: "*7-ft height carries a restriction in the source catalog.",
            palette: [
              {
                tier: "Premium",
                finish: "Textured woodgrain",
                swatches: [
                  { name: "Weathered Blend", hex: "#6e5d4e", woodgrain: true, image: "/vinyl-swatch-weathered-blend.png" },
                  { name: "Sierra Blend", hex: "#8a4b33", woodgrain: true, image: "/vinyl-swatch-sierra-blend.png" },
                  { name: "Brazilian Blend", hex: "#4b3226", woodgrain: true, image: "/vinyl-swatch-brazilian-blend.png" },
                  { name: "Arctic Blend", hex: "#3c3e41", woodgrain: true, image: "/vinyl-swatch-arctic-blend.png" },
                ],
              },
              {
                tier: "Select",
                finish: "Smooth woodgrain",
                swatches: [
                  { name: "Weathered Aspen", hex: "#b7b1a4", woodgrain: true, image: "/vinyl-swatch-weathered-aspen.png" },
                  { name: "Mesquite", hex: "#7c5942", woodgrain: true, image: "/vinyl-swatch-mesquite.png" },
                  { name: "Coastal Cedar", hex: "#a9875f", woodgrain: true, image: "/vinyl-swatch-coastal-cedar.png" },
                  { name: "Cypress", hex: "#9a6a33", woodgrain: true, image: "/vinyl-swatch-cypress.png" },
                  { name: "Dark Walnut", hex: "#4a362a", woodgrain: true, image: "/vinyl-swatch-dark-walnut.png" },
                  { name: "Dark Sequoia", hex: "#3a2a25", woodgrain: true, image: "/vinyl-swatch-dark-sequoia.png" },
                ],
              },
              {
                tier: "Standard",
                finish: "Smooth solids",
                swatches: [
                  { name: "White", hex: "#f4f3ef", image: "/vinyl-swatch-white.png" },
                  { name: "Sand", hex: "#ddd0b6", image: "/vinyl-swatch-sand.png" },
                  { name: "Clay", hex: "#a98d6e", image: "/vinyl-swatch-clay.png" },
                  { name: "Gray", hex: "#9b948b", image: "/vinyl-swatch-gray.png" },
                ],
              },
            ],
          },
          {
            name: "Folly",
            tagline: "3-inch vertical semi-private",
            image: "/vinyl-profile-folly.png",
            postCapNote:
              "White and Sand: all 8 cap shapes. Premium blends: Pyramid + New England only.",
            panelWidth: "8'",
            fenceHeight: "4', 5', 6'",
            palette: [
              {
                tier: "Premium",
                finish: "Textured woodgrain",
                swatches: [
                  { name: "Weathered Blend", hex: "#6e5d4e", woodgrain: true, image: "/vinyl-swatch-weathered-blend.png" },
                  { name: "Sierra Blend", hex: "#8a4b33", woodgrain: true, image: "/vinyl-swatch-sierra-blend.png" },
                  { name: "Brazilian Blend", hex: "#4b3226", woodgrain: true, image: "/vinyl-swatch-brazilian-blend.png" },
                  { name: "Arctic Blend", hex: "#3c3e41", woodgrain: true, image: "/vinyl-swatch-arctic-blend.png" },
                ],
              },
              {
                tier: "Standard",
                finish: "Smooth solids",
                swatches: [
                  { name: "White", hex: "#f4f3ef", image: "/vinyl-swatch-white.png" },
                  { name: "Sand", hex: "#ddd0b6", image: "/vinyl-swatch-sand.png" },
                ],
              },
            ],
          },
          {
            name: "Hudson",
            tagline: "6-inch vertical semi-private",
            image: "/vinyl-profile-hudson.png",
            postCapNote:
              "White: all 8 color-matched 5×5 cap styles. Verify the 6 ft × 8 ft Hudson post kit before ordering.",
            panelWidth: "6' or 8'",
            fenceHeight: "4', 5', 6'",
            palette: [
              {
                tier: "Standard",
                finish: "Smooth solids",
                swatches: [
                  { name: "White", hex: "#f4f3ef", image: "/vinyl-swatch-white.png" },
                  { name: "Sand", hex: "#ddd0b6", image: "/vinyl-swatch-sand.png" },
                  { name: "Clay", hex: "#a98d6e", image: "/vinyl-swatch-clay.png" },
                  { name: "Gray", hex: "#9b948b", image: "/vinyl-swatch-gray.png" },
                ],
              },
            ],
          },
        ],
      },
      {
        name: "Lattice Top Vinyl Fence",
        blurb:
          "Full privacy below with a decorative lattice crown above — added height and softness without the upkeep.",
        image: {
          src: "/vinyl-lattice-top.jpg",
          alt: "Vinyl privacy fence with a decorative lattice top and garden beds at dusk",
        },
        specs: ["Decorative lattice crown", "Added height", "Garden-friendly"],
        profiles: [
          {
            name: "Tybee",
            tagline: "Lattice-top privacy",
            image: "/vinyl-profile-tybee.png",
            postCapNote:
              "White/Sand: all 8 shapes; Clay: all except Solar. Cypress: Pyramid, Internal, New England.",
            panelWidth: "6' or 8'",
            fenceHeight: "5' or 6'",
            palette: [
              {
                tier: "Select",
                finish: "Smooth woodgrain",
                swatches: [
                  { name: "Cypress", hex: "#9a6a33", woodgrain: true, image: "/vinyl-swatch-cypress.png" },
                ],
              },
              {
                tier: "Standard",
                finish: "Smooth solids",
                swatches: [
                  { name: "White", hex: "#f4f3ef", image: "/vinyl-swatch-white.png" },
                  { name: "Sand", hex: "#ddd0b6", image: "/vinyl-swatch-sand.png" },
                  { name: "Clay", hex: "#a98d6e", image: "/vinyl-swatch-clay.png" },
                ],
              },
            ],
          },
          {
            name: "Chesapeake",
            tagline: "Closed spindle-top privacy",
            image: "/vinyl-profile-chesapeake.png",
            postCapNote:
              "White: all 8 color-matched 5×5 cap styles. Confirm post kit fit for the 6 ft × 8 ft Chesapeake panel.",
            panelWidth: "6' or 8'",
            fenceHeight: "5' or 6'",
            palette: [
              {
                tier: "Premium",
                finish: "Textured woodgrain",
                swatches: [
                  { name: "Weathered Blend", hex: "#6e5d4e", woodgrain: true, image: "/vinyl-swatch-weathered-blend.png" },
                  { name: "Sierra Blend", hex: "#8a4b33", woodgrain: true, image: "/vinyl-swatch-sierra-blend.png" },
                  { name: "Brazilian Blend", hex: "#4b3226", woodgrain: true, image: "/vinyl-swatch-brazilian-blend.png" },
                  { name: "Arctic Blend", hex: "#3c3e41", woodgrain: true, image: "/vinyl-swatch-arctic-blend.png" },
                ],
              },
              {
                tier: "Standard",
                finish: "Smooth solids",
                swatches: [
                  { name: "White", hex: "#f4f3ef", image: "/vinyl-swatch-white.png" },
                  { name: "Sand", hex: "#ddd0b6", image: "/vinyl-swatch-sand.png" },
                  { name: "Clay", hex: "#a98d6e", image: "/vinyl-swatch-clay.png" },
                  { name: "Gray", hex: "#9b948b", image: "/vinyl-swatch-gray.png" },
                ],
              },
            ],
          },
        ],
      },
      {
        name: "Horizontal Vinyl Fence",
        blurb:
          "A modern, architectural line of horizontal rails for contemporary elevations — no painting, ever.",
        image: {
          src: "/vinyl-horizontal.jpg",
          alt: "Modern horizontal vinyl fence with landscape lighting at dusk",
        },
        specs: ["Horizontal rails", "Modern profile", "Rinse-clean upkeep"],
        profiles: [
          {
            name: "Madison",
            tagline: "Solid horizontal privacy",
            image: "/vinyl-profile-madison.png",
            postCapNote:
              "White/Sand: all 8; Clay: all except Solar; Gray: Pyramid + New England. Cypress/Coastal Cedar: P-I-NE; Premium blends: P-NE.",
            panelWidth: "6' or 8'",
            fenceHeight: "4', 5', 6'",
            palette: [
              {
                tier: "Premium",
                finish: "Textured woodgrain",
                swatches: [
                  { name: "Weathered Blend", hex: "#6e5d4e", woodgrain: true, image: "/vinyl-swatch-weathered-blend.png" },
                  { name: "Sierra Blend", hex: "#8a4b33", woodgrain: true, image: "/vinyl-swatch-sierra-blend.png" },
                  { name: "Brazilian Blend", hex: "#4b3226", woodgrain: true, image: "/vinyl-swatch-brazilian-blend.png" },
                  { name: "Arctic Blend", hex: "#3c3e41", woodgrain: true, image: "/vinyl-swatch-arctic-blend.png" },
                ],
              },
              {
                tier: "Select",
                finish: "Smooth woodgrain",
                swatches: [
                  { name: "Coastal Cedar", hex: "#a9875f", woodgrain: true, image: "/vinyl-swatch-coastal-cedar.png" },
                  { name: "Cypress", hex: "#9a6a33", woodgrain: true, image: "/vinyl-swatch-cypress.png" },
                ],
              },
              {
                tier: "Standard",
                finish: "Smooth solids",
                swatches: [
                  { name: "White", hex: "#f4f3ef", image: "/vinyl-swatch-white.png" },
                  { name: "Sand", hex: "#ddd0b6", image: "/vinyl-swatch-sand.png" },
                  { name: "Clay", hex: "#a98d6e", image: "/vinyl-swatch-clay.png" },
                  { name: "Gray", hex: "#9b948b", image: "/vinyl-swatch-gray.png" },
                ],
              },
            ],
          },
          {
            name: "Largo",
            tagline: "Horizontal semi-private",
            image: "/vinyl-profile-largo.png",
            postCapNote:
              "White/Sand: all 8 cap shapes; Clay: all except Solar. Premium blends: Pyramid + New England only.",
            panelWidth: "8'",
            fenceHeight: "4', 5', 6'",
            palette: [
              {
                tier: "Premium",
                finish: "Textured woodgrain",
                swatches: [
                  { name: "Weathered Blend", hex: "#6e5d4e", woodgrain: true, image: "/vinyl-swatch-weathered-blend.png" },
                  { name: "Sierra Blend", hex: "#8a4b33", woodgrain: true, image: "/vinyl-swatch-sierra-blend.png" },
                  { name: "Brazilian Blend", hex: "#4b3226", woodgrain: true, image: "/vinyl-swatch-brazilian-blend.png" },
                  { name: "Arctic Blend", hex: "#3c3e41", woodgrain: true, image: "/vinyl-swatch-arctic-blend.png" },
                ],
              },
              {
                tier: "Standard",
                finish: "Smooth solids",
                swatches: [
                  { name: "White", hex: "#f4f3ef", image: "/vinyl-swatch-white.png" },
                  { name: "Sand", hex: "#ddd0b6", image: "/vinyl-swatch-sand.png" },
                  { name: "Clay", hex: "#a98d6e", image: "/vinyl-swatch-clay.png" },
                ],
              },
            ],
          },
        ],
      },
      {
        name: "Vinyl Picket Fence",
        blurb:
          "Classic pickets scaled for front yards and garden borders, in fade-resistant white.",
        image: {
          src: "/vinyl-picket.jpg",
          alt: "White vinyl picket fence along a front-yard garden",
        },
        specs: ["Straight picket top", "Garden scale", "Fade-resistant"],
        profiles: [
          {
            name: "Norwalk",
            tagline: "Closed picket | 2-rail or 3-rail",
            image: "/vinyl-profile-norwalk.png",
            postCapNote:
              "White: all 8 color-matched 5×5 accessory cap styles. Check the chosen 2-rail/3-rail post before selection.",
            panelWidth: "8'",
            fenceHeight: "4', 5', 6'*",
            note: '*Picket: 7/8" × 3". Premium: 4\', 5\', 6\'; Standard: 4\' only.',
            palette: [
              {
                tier: "Premium",
                finish: "Textured woodgrain",
                swatches: [
                  { name: "Weathered Blend", hex: "#6e5d4e", woodgrain: true, image: "/vinyl-swatch-weathered-blend.png" },
                  { name: "Sierra Blend", hex: "#8a4b33", woodgrain: true, image: "/vinyl-swatch-sierra-blend.png" },
                  { name: "Brazilian Blend", hex: "#4b3226", woodgrain: true, image: "/vinyl-swatch-brazilian-blend.png" },
                  { name: "Arctic Blend", hex: "#3c3e41", woodgrain: true, image: "/vinyl-swatch-arctic-blend.png" },
                ],
              },
              {
                tier: "Standard",
                finish: "Smooth solids",
                swatches: [
                  { name: "White", hex: "#f4f3ef", image: "/vinyl-swatch-white.png" },
                  { name: "Sand", hex: "#ddd0b6", image: "/vinyl-swatch-sand.png" },
                ],
              },
            ],
          },
          {
            name: "Cape Cod",
            tagline: "Classic picket | Straight or scalloped",
            image: "/vinyl-profile-cape-cod.png",
            postCapNote:
              "White: all 8 matching accessory cap shapes. Cape Cod panel SKU lists Pyramid, New England and Gothic; confirm the remaining shapes with the supplier.",
            panelWidth: "8'",
            fenceHeight: "4', 5', 6'",
            note: 'Picket: 7/8" × 1 1/2". Scalloped: White or Sand only.',
            palette: [
              {
                tier: "Standard",
                finish: "Smooth solids",
                swatches: [
                  { name: "White", hex: "#f4f3ef", image: "/vinyl-swatch-white.png" },
                  { name: "Sand", hex: "#ddd0b6", image: "/vinyl-swatch-sand.png" },
                  { name: "Clay", hex: "#a98d6e", image: "/vinyl-swatch-clay.png" },
                  { name: "Gray", hex: "#9b948b", image: "/vinyl-swatch-gray.png" },
                ],
              },
            ],
          },
        ],
      },
      {
        name: "Shadow Box Vinyl Fence",
        blurb:
          "Alternating boards finish the fence the same on both sides and let air and light filter through.",
        image: {
          src: "/vinyl-shadowbox.jpg",
          alt: "White vinyl shadow box fence finished the same on both sides",
        },
        specs: ["Finished both sides", "Alternating boards", "Semi-private"],
        profiles: [
          {
            name: "Montauk",
            tagline: "Board-on-board semi-private",
            image: "/vinyl-profile-montauk.png",
            postCapNote:
              "White: all 8 accessory cap styles. Montauk 6×6 panel SKU lists Pyramid, Internal and New England; confirm other cap choices for the selected panel kit.",
            panelWidth: "6' or 8'",
            fenceHeight: "4' or 6'",
            palette: [
              {
                tier: "Standard",
                finish: "Smooth solids",
                swatches: [
                  { name: "White", hex: "#f4f3ef", image: "/vinyl-swatch-white.png" },
                  { name: "Sand", hex: "#ddd0b6", image: "/vinyl-swatch-sand.png" },
                  { name: "Clay", hex: "#a98d6e", image: "/vinyl-swatch-clay.png" },
                ],
              },
            ],
          },
        ],
      },
      {
        name: "Vinyl Ranch Rail Fence",
        blurb:
          "Open two- or three-rail vinyl for property lines and paddocks — a clean boundary that keeps the view.",
        image: {
          src: "/vinyl-ranch-rail.jpg",
          alt: "White vinyl ranch rail fence running along a green lawn",
        },
        specs: ["2 – 3 open rails", "Property-line scale", "Open sightlines"],
        profiles: [
          {
            name: "Sierra",
            tagline: "Diamond ranch rail",
            image: "/vinyl-profile-coronado.png",
            postCapNote:
              "White: all 8 cap styles; confirm ranch post fit. Same 5×5 cap size for 2-rail / 3-rail sections.",
            panelWidth: "8'",
            fenceHeight: "3' or 4'",
            palette: [
              {
                tier: "Standard",
                finish: "Smooth solids",
                swatches: [{ name: "White", hex: "#f4f3ef", image: "/vinyl-swatch-white.png" }],
              },
            ],
          },
          {
            name: "Sedona",
            tagline: "Crossbuck ranch rail",
            image: "/vinyl-profile-sedona.png",
            postCapNote:
              "White: all 8 cap styles; confirm crossbuck post fit.",
            panelWidth: "8'",
            fenceHeight: "4'",
            palette: [
              {
                tier: "Standard",
                finish: "Smooth solids",
                swatches: [{ name: "White", hex: "#f4f3ef", image: "/vinyl-swatch-white.png" }],
              },
            ],
          },
          {
            name: "Coronado",
            tagline: "Ranch rail | 2-, 3- or 4-rail configurations",
            image: "/vinyl-profile-sierra-ranch.png",
            postCapNote:
              "White: all 8 cap shapes. Premium blends: Pyramid + New England. Verify compatibility with selected posts.",
            panelWidth: "6' or 8'*",
            fenceHeight: "3', 4' or 5'",
            note: "*Coronado widths carry catalog markings; confirm applicability with supplier.",
            palette: [
              {
                tier: "Premium",
                finish: "Textured woodgrain",
                swatches: [
                  { name: "Weathered Blend", hex: "#6e5d4e", woodgrain: true, image: "/vinyl-swatch-weathered-blend.png" },
                  { name: "Sierra Blend", hex: "#8a4b33", woodgrain: true, image: "/vinyl-swatch-sierra-blend.png" },
                  { name: "Brazilian Blend", hex: "#4b3226", woodgrain: true, image: "/vinyl-swatch-brazilian-blend.png" },
                  { name: "Arctic Blend", hex: "#3c3e41", woodgrain: true, image: "/vinyl-swatch-arctic-blend.png" },
                ],
              },
              {
                tier: "Standard",
                finish: "Smooth solids",
                swatches: [
                  { name: "White", hex: "#f4f3ef", image: "/vinyl-swatch-white.png" },
                  { name: "Sand", hex: "#ddd0b6", image: "/vinyl-swatch-sand.png" },
                ],
              },
            ],
          },
        ],
      },
    ],
    finishes: {
      label: "Vinyl colours",
      swatches: [
        { name: "White", hex: "#f4f3ef", image: "/vinyl-swatch-white.png" },
        { name: "Almond", hex: "#e8dcc3" },
        { name: "Khaki", hex: "#b8a98b" },
        { name: "Black", hex: "#23211f" },
      ],
    },
    specSheet: [
      { label: "Posts", value: "5×5 vinyl, steel-reinforced as needed" },
      { label: "Panels", value: "Tongue-and-groove or picket" },
      { label: "Hardware", value: "Stainless, concealed" },
      { label: "Heights", value: "4, 5, 6 ft" },
      { label: "Care", value: "Rinse with a garden hose" },
      { label: "Warranty", value: "Manufacturer limited lifetime" },
    ],
  },
  {
    slug: "composite-fences",
    eyebrow: "Collection 03 — Composite",
    hero: {
      src: "/composite-privacy.jpg",
      alt: "Wood-grain composite privacy fence along a landscaped backyard border",
    },
    lede: "The warmth of wood with none of the weekends. Composite boards won't rot, warp, or need staining — just a wood-grain finish that holds its colour season after season.",
    meta: [
      { label: "Material", value: "Wood-plastic composite" },
      { label: "Heights", value: "4 – 6 ft" },
      { label: "Upkeep", value: "Rinse clean" },
    ],
    styles: [
      {
        name: "Privacy Composite Fence",
        blurb:
          "Full-height composite boards with a realistic wood grain — a solid privacy wall that never needs refinishing.",
        image: {
          src: "/composite-privacy.jpg",
          alt: "Wood-grain composite privacy fence beside a landscaped lawn",
        },
        specs: ["Full privacy face", "Wood-grain finish", "6 ft standard"],
        tag: "Zero maintenance",
      },
      {
        name: "Horizontal Composite Fence",
        blurb:
          "A modern, architectural line of horizontal composite boards for contemporary elevations — no staining, ever.",
        image: {
          src: "/composite-horizontal.jpg",
          alt: "Modern horizontal composite fence with landscape lighting at dusk",
        },
        specs: ["Horizontal boards", "Modern profile", "Rinse-clean upkeep"],
      },
    ],
    finishes: {
      label: "Composite colours",
      swatches: [
        { name: "Cedar", hex: "#8a5a34" },
        { name: "Walnut", hex: "#5a4030" },
        { name: "Teak", hex: "#9a6b3f" },
        { name: "Slate Gray", hex: "#6f706d" },
        { name: "Charcoal", hex: "#3a3836" },
      ],
    },
    specSheet: [
      { label: "Posts", value: "Aluminum-reinforced composite" },
      { label: "Boards", value: "Capped wood-plastic composite" },
      { label: "Hardware", value: "Stainless, concealed" },
      { label: "Heights", value: "4, 5, 6 ft" },
      { label: "Care", value: "Rinse with a garden hose" },
      { label: "Warranty", value: "Manufacturer limited warranty" },
    ],
  },
  {
    slug: "chain-link-fences",
    eyebrow: "Collection 04 — Chain-Link",
    hero: {
      src: "/service-chain-link.jpg",
      alt: "Black vinyl-coated chain-link fence running along a grassy field",
    },
    lede: "Honest, hard-working enclosure that keeps sightlines open and costs down — for backyards, pet runs, side yards, and secure commercial lots.",
    meta: [
      { label: "Material", value: "Galvanized / coated steel" },
      { label: "Heights", value: "3 – 8 ft" },
      { label: "Use", value: "Home & commercial" },
    ],
    styles: [
      {
        name: "Chain Link Fence",
        blurb:
          "The workhorse — galvanized or black-coated mesh and framework that shrug off weather for decades with almost no upkeep.",
        image: {
          src: "/chain-link-classic.jpg",
          alt: "Black-coated chain-link fence line along a landscaped backyard",
        },
        specs: ["9 – 11.5 gauge mesh", "Galvanized or coated framework", "Low maintenance"],
        tag: "Best value",
      },
      {
        name: "Chain Link Fence with Privacy Slats",
        blurb:
          "Woven slats drop into the mesh to add privacy and screening while keeping the fence's hard-working frame.",
        image: {
          src: "/chain-link-privacy-slats.jpg",
          alt: "Black chain-link fence filled with privacy slats beside a garden bed",
        },
        specs: ["Woven privacy slats", "Added screening", "Pet & yard friendly"],
      },
    ],
    finishes: {
      label: "Mesh finishes",
      swatches: [
        { name: "Galvanized", hex: "#b4b7ba" },
        { name: "Black", hex: "#26282a" },
        { name: "Green", hex: "#2f4a32" },
        { name: "Brown", hex: "#4a3a2c" },
      ],
    },
    specSheet: [
      { label: "Mesh", value: "9 – 11.5 gauge" },
      { label: "Framework", value: "Galvanized steel pipe" },
      { label: "Coating", value: "Galvanized or PVC" },
      { label: "Heights", value: "3 – 8 ft" },
      { label: "Gates", value: "Walk & drive" },
      { label: "Use", value: "Residential, commercial, pet" },
    ],  },
  {
    slug: "aluminum-fences",
    eyebrow: "Collection 05 — Aluminum",
    hero: {
      src: "/service-aluminum.jpg",
      alt: "Black aluminum fence bordering a landscaped backyard with a lake view",
    },
    lede: "The elegance of wrought iron with none of the rust. Aluminum defines a boundary without blocking the view — the finishing touch for front yards, pools, and homes with scenery worth showing off.",
    meta: [
      { label: "Material", value: "Rust-free aluminum" },
      { label: "Heights", value: "4 – 6 ft" },
      { label: "Grade", value: "Residential – industrial" },
    ],
    styles: [
      {
        name: "Classic Aluminium Fence",
        blurb:
          "Slim flush-top pickets, powder-coated and rackable to follow a sloping yard cleanly.",
        image: {
          src: "/aluminum-classic.jpg",
          alt: "Black aluminium fence with flush-top pickets beside a landscaped lawn",
        },
        specs: ["Flush-top pickets", "Rackable for slopes", "Powder-coated"],
        tag: "Pool-code ready",
      },
      {
        name: "Spear Top Aluminium Fence",
        blurb:
          "Pointed spear-top pickets with decorative finials — the elegance of wrought iron, with none of the rust.",
        image: {
          src: "/aluminum-spear-top.jpg",
          alt: "Black aluminium spear-top fence with decorative finials along a garden border",
        },
        specs: ["Spear-top pickets", "Decorative finials", "Powder-coated"],
      },
    ],
    finishes: {
      label: "Powder-coat colours",
      swatches: [
        { name: "Black", hex: "#1f1e1d" },
        { name: "Bronze", hex: "#4b3b2a" },
        { name: "White", hex: "#f1efe9" },
        { name: "Sand", hex: "#cbbfa6" },
      ],
    },
    specSheet: [
      { label: "Material", value: "6005-T5 aluminum" },
      { label: "Finish", value: "AAMA powder-coat" },
      { label: "Grades", value: "Residential / commercial / industrial" },
      { label: "Heights", value: "4 – 6 ft" },
      { label: "Slopes", value: "Rackable panels" },
      { label: "Gates", value: "Self-closing, pool-code" },
    ],  },
  {
    slug: "fence-repair",
    eyebrow: "Collection 06 — Repair & Restore",
    hero: {
      src: "/service-fence-repair.jpg",
      alt: "Worker spray-staining and restoring a wood privacy fence in a backyard",
    },
    lede: "Before you replace, let us assess. Most fences can be brought back to straight, safe, and solid for a fraction of the cost of starting over.",
    meta: [
      { label: "Visit", value: "Free assessment" },
      { label: "Scope", value: "Repair or restore" },
      { label: "Timeline", value: "Often same-week" },
    ],
    styles: [
      {
        name: "Restore & Re-stain",
        blurb:
          "Clean, sand, swap any failed boards, and re-finish — years added to a fence that still has good bones.",
        image: {
          src: "/service-fence-repair.jpg",
          alt: "Restoring and re-staining a wood privacy fence",
        },
        specs: ["Clean, sand & re-finish", "Replace failed boards", "Save vs. replace"],
        tag: "Most cost-effective",
      },
      {
        name: "Structural Repair",
        blurb:
          "Reset leaning posts, re-hang sagging gates, and rebuild storm damage so the fence stands true again.",
        image: {
          src: "/hero-before-fence.jpg",
          alt: "Weathered fence in need of structural repair before work begins",
        },
        specs: ["Reset leaning posts", "Re-hang sagging gates", "Storm-damage rebuild"],
      },
    ],
    finishes: {
      label: "Restoration finishes",
      swatches: [
        { name: "Clear seal", hex: "#d9c7a3" },
        { name: "Honey", hex: "#b9793f" },
        { name: "Gray", hex: "#8d8a84" },
        { name: "Solid", hex: "#3a3330" },
      ],
    },
    specSheet: [
      { label: "Assessment", value: "On-site, no obligation" },
      { label: "Posts", value: "Reset or replace" },
      { label: "Boards", value: "Matched to existing profile" },
      { label: "Gates", value: "Re-hang & re-hardware" },
      { label: "Finish", value: "Clean & re-stain" },
      { label: "Timeline", value: "Often same-week" },
    ],  },
  {
    slug: "custom-gates",
    eyebrow: "Collection 07 — Custom Gates",
    hero: {
      src: "/service-custom-gates.jpg",
      alt: "Custom-built cedar gate with an X-brace and black strap hinges",
    },
    lede: "The part of your fence you touch every day. Built to match, hung to last, and finished with hardware that stays smooth and secure for years.",
    meta: [
      { label: "Build", value: "Made to order" },
      { label: "Operation", value: "Manual or automated" },
      { label: "Match", value: "Built to your fence" },
    ],
    styles: [
      {
        name: "Walk Gate",
        blurb:
          "A single everyday entry, braced to never sag, with self-closing hinges and infill that matches your fence.",
        image: {
          src: "/service-custom-gates.jpg",
          alt: "Custom cedar walk gate with strap hinges",
        },
        specs: ["3 – 4 ft single gate", "Self-closing hinges", "Matching infill"],
        tag: "Everyday entry",
      },
      {
        name: "Double Drive Gate",
        blurb:
          "Wide openings for driveways and side-yard access, with drop-rod, cane bolt, and room for automation.",
        specs: ["Up to 16 ft opening", "Drop-rod & cane bolt", "Automation-ready"],
      },
      {
        name: "Decorative & Arched",
        blurb:
          "A statement entry — arched or scalloped tops, clavos, and strap hinges on a welded or braced frame.",
        specs: ["Arched or scalloped top", "Clavos & strap hinges", "Welded / braced frame"],
      },
    ],
    finishes: {
      label: "Gate hardware",
      swatches: [
        { name: "Black", hex: "#1f1e1d" },
        { name: "Bronze", hex: "#3a2c20" },
        { name: "Stainless", hex: "#b7bbbe" },
        { name: "White", hex: "#f1efe9" },
      ],
    },
    specSheet: [
      { label: "Frame", value: "Welded steel or braced wood" },
      { label: "Hinges", value: "Heavy-duty self-closing" },
      { label: "Latch", value: "Gravity / magnetic / keyed" },
      { label: "Widths", value: "3 – 16 ft" },
      { label: "Automation", value: "Swing & slide operators" },
      { label: "Match", value: "Infill matches your fence" },
    ],  },
];
