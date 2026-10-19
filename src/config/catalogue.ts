/**
 * Catalogue content — one premium "collection" screen per service category.
 *
 * Keyed by the same slugs as `SERVICES` so the catalogue, the service detail
 * pages, and the enquiry dropdown all stay in sync. Titles / taglines are
 * pulled from `SERVICES` at render time; everything here is catalogue-specific.
 */
import type { ServiceSlug } from "@/config/services";

/** Known-good Unsplash imagery (hosts are allow-listed in next.config.ts). */
const U = {
  fenceLine:
    "https://images.unsplash.com/photo-1757673747333-ebd0b68ef400?q=80&w=1400&auto=format&fit=crop",
  picket:
    "https://images.unsplash.com/photo-1647539211130-9daca4990c41?q=80&w=1400&auto=format&fit=crop",
  horizontalSlat:
    "https://images.unsplash.com/photo-1748908271592-d9d5690b288b?q=80&w=1400&auto=format&fit=crop",
} as const;

export type Swatch = { name: string; hex: string };

export type CatalogueStyle = {
  name: string;
  blurb: string;
  /** Omit for a typographic "made to order" card (no photo). */
  image?: { src: string; alt: string };
  specs: string[];
  /** Small corner badge, e.g. "Most requested". */
  tag?: string;
};

export type CatalogueImage = { src: string; alt: string };

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
        name: "Classic Privacy",
        blurb:
          "The signature full-privacy fence — tight pickets, clean cap, and posts set to stand straight for years.",
        image: {
          src: "/service-cedar-fence.jpg",
          alt: "Classic cedar privacy fence with dog-ear pickets",
        },
        specs: [
          "Dog-ear or flat-top pickets",
          "6 ft standard height",
          "Posts set in concrete",
        ],
        tag: "Most requested",
      },
      {
        name: "Horizontal Slat",
        blurb:
          "A modern, architectural line of horizontal boards with concealed fasteners for an uninterrupted face.",
        image: {
          src: U.horizontalSlat,
          alt: "Freshly built horizontal timber slat fence with green landscaping",
        },
        specs: [
          "1×6 horizontal slats",
          "Concealed fasteners",
          "Cedar or powder-coated posts",
        ],
      },
      {
        name: "Lattice Top",
        blurb:
          "Full privacy below, a decorative lattice crown above — height and character without visual weight.",
        image: {
          src: "/gallery2-after.png",
          alt: "Cedar privacy fence with a decorative lattice top and garden beds",
        },
        specs: ["Decorative lattice crown", "Garden-friendly", "Added height"],
      },
      {
        name: "Good-Neighbour Shadowbox",
        blurb:
          "Alternating boards finish the fence identically on both sides and let a little air and light through.",
        image: {
          src: "/gallery1-after-fence.jpg",
          alt: "New cedar shadowbox-style privacy fence along a backyard",
        },
        specs: [
          "Finished both sides",
          "Alternating boards",
          "Shared-boundary favourite",
        ],
      },
    ],
    finishes: {
      label: "Cedar finishes",
      swatches: [
        { name: "Natural", hex: "#c89b6a" },
        { name: "Honey", hex: "#b9793f" },
        { name: "Cedartone", hex: "#8a4b2a" },
        { name: "Driftwood", hex: "#8d8a84" },
        { name: "Ebony", hex: "#2a2622" },
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
        name: "Solid Privacy",
        blurb:
          "Tongue-and-groove panels with no gaps — a seamless, bright-white wall of privacy.",
        image: {
          src: "/service-vinyl.jpg",
          alt: "Solid white vinyl privacy fence",
        },
        specs: ["Tongue-and-groove panels", "Full privacy", "6 ft standard"],
        tag: "Zero maintenance",
      },
      {
        name: "Picket & Scallop",
        blurb:
          "Classic or scalloped pickets scaled for front yards and garden borders, in fade-resistant white.",
        image: {
          src: U.picket,
          alt: "White picket fence with garden greenery",
        },
        specs: ["Straight or scalloped top", "Garden scale", "Fade-resistant"],
      },
      {
        name: "Contemporary Black",
        blurb:
          "A matte black co-extrusion for modern elevations that want contrast, not glare.",
        image: {
          src: "/gallery3-after-fence.jpg",
          alt: "Modern black vinyl privacy fence with fresh landscaping",
        },
        specs: ["Matte black finish", "UV-stable colour", "Modern profile"],
      },
    ],
    finishes: {
      label: "Vinyl colours",
      swatches: [
        { name: "White", hex: "#f4f3ef" },
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
    slug: "chain-link-fences",
    eyebrow: "Collection 03 — Chain-Link",
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
        name: "Galvanized Classic",
        blurb:
          "The workhorse — galvanized mesh and framework that shrug off weather for decades with almost no upkeep.",
        image: {
          src: "/service-chain-link.jpg",
          alt: "Galvanized chain-link fence line",
        },
        specs: ["9 – 11.5 gauge mesh", "Galvanized framework", "Low maintenance"],
        tag: "Best value",
      },
      {
        name: "Black Vinyl-Coated",
        blurb:
          "A powder-black coating that lets the fence recede into the landscape — ideal around views, pools, and pets.",
        image: {
          src: U.fenceLine,
          alt: "Dark-coated fence line disappearing into a grassy field",
        },
        specs: ["PVC-coated mesh", "Low-profile look", "Pet & pool friendly"],
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
    eyebrow: "Collection 04 — Aluminum",
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
        name: "Estate Picket",
        blurb:
          "Slim flush-top or spear-top pickets, powder-coated and rackable to follow a sloping yard cleanly.",
        image: {
          src: "/service-aluminum.jpg",
          alt: "Black aluminum estate picket fence",
        },
        specs: ["Flush or spear-top", "Rackable for slopes", "Powder-coated"],
        tag: "Pool-code ready",
      },
      {
        name: "Made to Order",
        blurb:
          "Custom heights, picket spacing, decorative finials, and matching self-closing gates — specified to your property.",
        specs: ["Custom heights & spacing", "Decorative finials", "Matching gates"],
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
    eyebrow: "Collection 05 — Repair & Restore",
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
    eyebrow: "Collection 06 — Custom Gates",
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
