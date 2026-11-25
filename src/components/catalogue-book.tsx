"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { CATALOGUE } from "@/config/catalogue";
import type { CatalogueCategory } from "@/config/catalogue";
import { getServiceBySlug } from "@/config/services";
import { ENQUIRY_EMAIL, PHONE_DISPLAY } from "@/config/site";

const BRAND = "Custom Fence & Gates";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function titleFor(slug: string) {
  return getServiceBySlug(slug)?.title ?? slug;
}

type PageSize = { width: number; height: number; portrait: boolean };

/** Fit a single page to the viewport so the book never overflows the screen. */
function computePageSize(): PageSize {
  const vw = typeof window !== "undefined" ? window.innerWidth : 1024;
  const vh = typeof window !== "undefined" ? window.innerHeight : 768;
  const ratio = 560 / 400; // page height / width
  const chrome = 184; // room for eyebrow, controls, hint, gaps, padding
  const availH = Math.max(300, vh - chrome);
  const portrait = vw < 760;

  if (portrait) {
    let w = Math.min(vw * 0.92, 440);
    if (w * ratio > availH) w = availH / ratio;
    return { width: Math.round(w), height: Math.round(w * ratio), portrait: true };
  }
  // Landscape shows a two-page spread, so each page gets half the width.
  let w = Math.min((vw * 0.92) / 2, 460);
  if (w * ratio > availH) w = availH / ratio;
  return { width: Math.round(w), height: Math.round(w * ratio), portrait: false };
}

/**
 * The whole catalogue as a single full-page flipbook, chapter by chapter.
 * The StPageFlip library is loaded only in the browser, so it never affects
 * SSR or the initial bundle.
 */
export function CatalogueBook() {
  const bookRef = useRef<HTMLDivElement | null>(null);
  const flipRef = useRef<import("page-flip").PageFlip | null>(null);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [size, setSize] = useState<PageSize>(computePageSize);
  

  const { pages, chapters } = useMemo(() => buildBookPages(), []);

  // Re-fit the book to the viewport on resize (debounced to a frame).
  useEffect(() => {
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setSize(computePageSize()));
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // (Re)initialise StPageFlip when the pages or the fitted size change.
  useEffect(() => {
    let cancelled = false;
    let instance: import("page-flip").PageFlip | null = null;
    setTotal(0);

    (async () => {
      const el = bookRef.current;
      if (!el) return;
      const { PageFlip } = await import("page-flip");
      if (cancelled || !bookRef.current) return;

      instance = new PageFlip(el, {
        width: size.width,
        height: size.height,
        size: "fixed",
        usePortrait: size.portrait,
        showCover: true,
        mobileScrollSupport: false,
        drawShadow: true,
        maxShadowOpacity: 0.5,
        flippingTime: 800,
      });

      instance.loadFromHTML(el.querySelectorAll(".cf-page"));
      instance.on("flip", (e) => setPage(e.data));
      setTotal(instance.getPageCount());
      flipRef.current = instance;
    })();

    return () => {
      cancelled = true;
      try {
        instance?.destroy();
      } catch {
        /* instance may not have finished initialising */
      }
      flipRef.current = null;
    };
  }, [pages, size.width, size.height, size.portrait]);

  // Arrow-key page turning.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") flipRef.current?.flipNext();
      else if (e.key === "ArrowLeft") flipRef.current?.flipPrev();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const atStart = page <= 0;
  const atEnd = total > 0 && page >= total - 1;

  return (
    <main
      aria-label="Catalogue flipbook"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 overflow-y-auto bg-[var(--color-night)] p-4 sm:p-8"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--color-gold)]">
        {chapters[page] ?? "The Catalogue"}
      </p>

      <div className="flex justify-center" style={{ perspective: "2400px" }}>
        <div
          ref={bookRef}
          className={`cf-book transition-opacity duration-500 ${total > 0 ? "opacity-100" : "opacity-0"}`}
          style={{
            maxHeight: total > 0 ? undefined : "70vh",
            overflow: total > 0 ? undefined : "hidden",
          }}
        >
          {pages}
        </div>
      </div>

      <div className="flex items-center gap-6 text-white">
        <button
          type="button"
          onClick={() => flipRef.current?.flipPrev()}
          disabled={atStart}
          aria-label="Previous page"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20 disabled:opacity-30"
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4l-6 6 6 6" />
          </svg>
        </button>
        <span className="min-w-[5ch] text-center text-sm font-medium tracking-widest text-white/70">
          {pad(page + 1)} / {pad(total || pages.length)}
        </span>
        <button
          type="button"
          onClick={() => flipRef.current?.flipNext()}
          disabled={atEnd}
          aria-label="Next page"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20 disabled:opacity-30"
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 4l6 6-6 6" />
          </svg>
        </button>
      </div>

      {atStart && (
        <p className="flex items-center gap-2 text-center text-xs font-medium text-white/50">
          Drag a corner or use the arrows to turn the page
          <svg className="cf-hint-arrow h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 10h12m0 0-4-4m4 4-4 4" />
          </svg>
        </p>
      )}
    </main>
  );
}

/* ---------- shared bits ---------- */

function chipList(specs: readonly string[]) {
  return (
    <ul className="mt-3 flex flex-wrap gap-1.5">
      {specs.map((spec) => (
        <li
          key={spec}
          className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-2.5 py-1 text-[9px] font-medium text-[var(--color-ink)] ring-1 ring-[var(--color-border)]"
        >
          <span className="h-1 w-1 rounded-full bg-[var(--color-gold)]" aria-hidden />
          {spec}
        </li>
      ))}
    </ul>
  );
}

function pageFooter(label: string) {
  return (
    <div className="mt-auto flex items-center justify-between pt-4 text-[8px] font-medium uppercase tracking-[0.18em] text-[var(--color-muted)]">
      <span>{BRAND}</span>
      <span>{label}</span>
    </div>
  );
}

/* ---------- page builders ---------- */

function buildBookPages(): { pages: ReactNode[]; chapters: string[] } {
  const pages: ReactNode[] = [];
  const chapters: string[] = [];
  const push = (node: ReactNode, chapter: string) => {
    pages.push(node);
    chapters.push(chapter);
  };

  // Front cover (hard)
  push(
    <div key="cover" className="cf-page cf-dark" data-density="hard">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url("${CATALOGUE[0].hero.src}")` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0c1612] via-[#0c1612]/75 to-[#0c1612]/35" />
      <div className="relative flex h-full flex-col justify-between p-8 text-white">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-[family-name:var(--font-display)] text-base font-semibold leading-none">
              {BRAND}
            </p>
            <p className="mt-1 text-[8px] uppercase tracking-[0.2em] text-white/60">
              King County · Pierce County
            </p>
          </div>
          <p className="text-[8px] font-semibold uppercase tracking-[0.25em] text-[var(--color-gold)]">
            {pad(CATALOGUE.length)} Collections
          </p>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--color-gold)]">
            The Catalogue
          </p>
          <h2 className="font-[family-name:var(--font-display)] mt-2 text-[34px] font-semibold leading-[1.02] tracking-tight">
            Fence &amp; gate collections.
          </h2>
          <p className="mt-3 max-w-[34ch] text-[11px] leading-relaxed text-white/85">
            Six collections — cedar, vinyl, chain-link, aluminum, repairs, and
            custom gates. Flip through for styles, finishes, and specifications.
          </p>
        </div>
        <p className="text-[8px] uppercase tracking-[0.2em] text-white/60">
          {PHONE_DISPLAY} · Free, no-obligation estimates
        </p>
      </div>
    </div>,
    "The Catalogue",
  );

  // Contents
  push(
    <div key="toc" className="cf-page" data-density="soft">
      <div className="relative flex h-full flex-col p-7">
        <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--color-gold)]">
          Contents
        </p>
        <h3 className="font-[family-name:var(--font-display)] mt-2 text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
          The collections
        </h3>
        <ol className="mt-5 space-y-3.5">
          {CATALOGUE.map((c, i) => (
            <li key={c.slug} className="flex items-center gap-3">
              <span className="font-[family-name:var(--font-impact)] w-8 text-lg leading-none text-[var(--color-gold)]">
                {pad(i + 1)}
              </span>
              <span className="h-px w-4 shrink-0 bg-[var(--color-gold)]/60" aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="font-[family-name:var(--font-display)] truncate text-[13px] font-semibold text-[var(--color-ink)]">
                  {titleFor(c.slug)}
                </p>
                <p className="truncate text-[9px] uppercase tracking-[0.12em] text-[var(--color-muted)]">
                  {/* {c.eyebrow} */}
                </p>
              </div>
            </li>
          ))}
        </ol>
        {pageFooter("Contents")}
      </div>
    </div>,
    "Contents",
  );

  // Chapters
  CATALOGUE.forEach((collection: CatalogueCategory, ci) => {
    const title = titleFor(collection.slug);
    const featuredTag = collection.styles.find((s) => s.tag)?.tag;

    // Chapter opener (hero)
    push(
      <div key={`${collection.slug}-divider`} className="cf-page cf-dark" data-density="soft">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url("${collection.hero.src}")` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c1612] via-[#0c1612]/70 to-[#0c1612]/25" />
        <div className="relative flex h-full flex-col justify-between p-7 text-white">
          <div className="flex items-start justify-between">
            <div className="flex flex-col items-start gap-2">
              <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[var(--color-gold)]">
                Chapter {pad(ci + 1)}
              </p>
              {featuredTag ? (
                <span className="rounded-full bg-white/15 px-2.5 py-1 text-[8px] font-semibold uppercase tracking-wider text-white ring-1 ring-white/20 backdrop-blur-sm">
                  {featuredTag}
                </span>
              ) : null}
            </div>
            <span className="font-[family-name:var(--font-impact)] text-5xl leading-none text-white/25">
              {pad(ci + 1)}
            </span>
          </div>
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--color-gold)]">
              {collection.eyebrow}
            </p>
            <h2 className="font-[family-name:var(--font-display)] mt-2 text-[30px] font-semibold leading-[1.05] tracking-tight">
              {title}
            </h2>
            <p className="mt-3 text-[11px] leading-relaxed text-white/85">
              {collection.lede}
            </p>
            <div className="mt-5 flex gap-6 border-t border-white/20 pt-3">
              {collection.meta.map((m) => (
                <div key={m.label}>
                  <p className="text-[7px] uppercase tracking-[0.15em] text-white/55">
                    {m.label}
                  </p>
                  <p className="mt-1 text-[11px] font-semibold text-white">{m.value}</p>
                </div>
              ))}
            </div>
          </div>
          <p className="text-[8px] uppercase tracking-[0.2em] text-white/55">{BRAND}</p>
        </div>
      </div>,
      collection.eyebrow,
    );

    // Styles
    collection.styles.forEach((style, si) => {
      push(
        <div key={`${collection.slug}-style-${si}`} className="cf-page" data-density="soft">
          <div className="relative flex h-full flex-col p-7">
            <div className="flex items-center gap-3">
              <span className="font-[family-name:var(--font-impact)] text-[26px] leading-none text-[var(--color-gold)]">
                {pad(si + 1)}
              </span>
              <span className="h-px flex-1 bg-[var(--color-border)]" aria-hidden />
            </div>
            <h3 className="font-[family-name:var(--font-display)] mt-3 text-xl font-semibold tracking-tight text-[var(--color-ink)]">
              {style.name}
            </h3>
            <div
              className={`mt-3 w-full overflow-hidden rounded-xl ring-1 ring-[var(--color-border)] ${
                style.samples ? "h-28" : "h-36"
              }`}
            >
              {style.image ? (
                <div
                  className="h-full w-full bg-cover bg-center"
                  style={{ backgroundImage: `url("${style.image.src}")` }}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[var(--color-brand)]">
                  <span className="font-[family-name:var(--font-impact)] text-5xl text-white/20">
                    {pad(si + 1)}
                  </span>
                </div>
              )}
            </div>
            {style.blurb ? (
              <p className="mt-3 text-[11px] leading-relaxed text-[var(--color-muted)]">
                {style.blurb}
              </p>
            ) : null}
            {style.specs && style.specs.length > 0 ? chipList(style.specs) : null}
            {style.samples ? (
              <div className="mt-3">
                <div className="flex items-center gap-2">
                  <span className="text-[8px] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                    {style.samples.label}
                  </span>
                  <span className="h-px flex-1 bg-[var(--color-border)]" aria-hidden />
                </div>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  {style.samples.items.map((item) => (
                    <div key={item.name} className="flex flex-col items-center gap-1">
                      <span
                        className="h-12 w-full"
                        style={{
                          backgroundImage: `url("${item.image}")`,
                          backgroundSize: "contain",
                          backgroundPosition: "center",
                          backgroundRepeat: "no-repeat",
                          filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.14))",
                        }}
                        role="img"
                        aria-label={item.name}
                      />
                      <span className="text-center text-[8px] font-medium leading-tight text-[var(--color-muted)]">
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
            {pageFooter(collection.eyebrow)}
          </div>
        </div>,
        collection.eyebrow,
      );

      // Each named profile is one page: elevation image on top, then the
      // design profile and colour palette stacked below. Image and swatch
      // sizes scale to the swatch count so dense profiles (e.g. Newbury,
      // 14 swatches) still fit while sparse ones stay large.
      (style.profiles ?? []).forEach((profile, pi) => {
        // One universal layout for every profile — sized to fit the densest
        // page (Newbury, 14 swatches) so all pages look consistent.
        const layout = {
          title: "text-xl",
          img: "h-24",
          tile: "h-8 w-12",
          label: "w-12",
          groupGap: "gap-1.5",
          rowGap: "gap-y-1",
          rowGapX: "gap-x-2",
        };
        push(
          <div
            key={`${collection.slug}-style-${si}-profile-${pi}`}
            className="cf-page"
            data-density="soft"
          >
            <div className="relative flex h-full flex-col p-7">
              <h3 className={`font-[family-name:var(--font-display)] ${layout.title} font-semibold uppercase leading-tight tracking-tight text-[var(--color-ink)]`}>
                {style.name}
              </h3>
              <p className="mt-1 text-[11px] text-[var(--color-muted)]">{profile.tagline}</p>
              <div className={`mt-3 flex w-full shrink-0 ${layout.img} gap-3`}>
                {profile.image ? (
                  <div
                    className="h-full flex-1"
                    style={{
                      backgroundImage: `url("${profile.image}")`,
                      backgroundSize: "contain",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                    role="img"
                    aria-label={`${profile.name} elevation`}
                  />
                ) : null}
                <div className="flex h-full w-[44%] shrink-0 flex-col">
                  <p className="flex items-baseline justify-between text-[8px] font-semibold uppercase tracking-[0.16em] text-[var(--color-gold)]">
                    Post cap options
                    <span className="text-[6.5px] tracking-[0.1em] text-[var(--color-muted)]">
                      5×5 posts
                    </span>
                  </p>
                  <div
                    className="mt-1 min-h-0 w-full flex-1"
                    style={{
                      backgroundImage: 'url("/vinyl-postcaps.png")',
                      backgroundSize: "contain",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                    role="img"
                    aria-label="Post cap options: Pyramid, Internal, New England, Gothic, Ball, Federation, Contemporary, Solar"
                  />
                </div>
              </div>
              {profile.postCapNote ? (
                <p className="mt-1.5 shrink-0 text-[6.5px] leading-snug text-[var(--color-muted)]">
                  {profile.postCapNote}
                </p>
              ) : null}
              <p className="mt-2 shrink-0 text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--color-gold)]">
                Colour palette
              </p>
              <div
                className={`mt-2 flex min-h-0 flex-1 flex-col overflow-hidden px-1 ${layout.groupGap}`}
              >
                {profile.palette.map((group) => (
                  <div key={group.tier}>
                    <div className="flex items-baseline gap-2">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink)]">
                        {group.tier}
                      </span>
                      <span className="text-[8px] text-[var(--color-muted)]">{group.finish}</span>
                    </div>
                    <div className={`mt-1.5 flex flex-wrap ${layout.rowGapX} ${layout.rowGap}`}>
                      {group.swatches.map((sw) => (
                        <div key={sw.name} className="flex flex-col items-center gap-1">
                          <span
                            className={`${layout.tile} overflow-hidden rounded-[4px] shadow-inner ring-1 ring-black/15`}
                            style={
                              sw.image
                                ? {
                                    backgroundColor: sw.hex,
                                    backgroundImage: `url("${sw.image}")`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                  }
                                : sw.woodgrain
                                  ? {
                                      backgroundColor: sw.hex,
                                      backgroundImage:
                                        "repeating-linear-gradient(90deg, rgba(0,0,0,0.22) 0px, rgba(0,0,0,0.22) 0.5px, rgba(0,0,0,0) 0.5px, rgba(0,0,0,0) 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 2.5px, rgba(0,0,0,0) 2.5px, rgba(0,0,0,0) 5px), linear-gradient(90deg, rgba(255,255,255,0.16), rgba(0,0,0,0) 35%, rgba(0,0,0,0.2))",
                                      backgroundBlendMode: "overlay, multiply",
                                    }
                                  : { backgroundColor: sw.hex }
                            }
                            aria-hidden
                          />
                          <span
                            className={`${layout.label} text-center text-[7px] font-medium leading-tight text-[var(--color-muted)]`}
                          >
                            {sw.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {profile.note ? (
                <p className="mt-1.5 shrink-0 text-[7px] italic leading-snug text-[var(--color-muted)]">
                  {profile.note}
                </p>
              ) : null}
              <p className="mt-1.5 shrink-0 border-t border-[var(--color-border)] pt-1.5 text-[7.5px] text-[var(--color-muted)]">
                <span className="font-semibold uppercase tracking-[0.12em]">Panel width</span>{" "}
                <span className="font-bold text-[var(--color-ink)]">{profile.panelWidth}</span>
                <span className="mx-2 text-[var(--color-border)]">|</span>
                <span className="font-semibold uppercase tracking-[0.12em]">Fence height</span>{" "}
                <span className="font-bold text-[var(--color-ink)]">{profile.fenceHeight}</span>
              </p>
              {pageFooter(collection.eyebrow)}
            </div>
          </div>,
          collection.eyebrow,
        );
      });
    });

    // Finishes & specifications (combined)
    push(
      <div key={`${collection.slug}-specs`} className="cf-page" data-density="soft">
        <div className="relative flex h-full flex-col p-7">
          <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--color-gold)]">
            Finishes &amp; specifications
          </p>
          <h3 className="font-[family-name:var(--font-display)] mt-2 text-lg font-semibold tracking-tight text-[var(--color-ink)]">
            {collection.finishes.label}
          </h3>
          <div className="mt-4 flex flex-wrap gap-x-2 gap-y-3">
            {collection.finishes.swatches.map((sw) => (
              <div key={sw.name} className="flex flex-col items-center gap-1.5">
                <span
                  className="h-20 w-12 overflow-hidden rounded-[4px] shadow-inner ring-1 ring-black/15"
                  style={
                    sw.image
                      ? {
                          backgroundColor: sw.hex,
                          backgroundImage: `url("${sw.image}")`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }
                      : {
                          backgroundColor: sw.hex,
                          backgroundImage:
                            "repeating-linear-gradient(90deg, rgba(0,0,0,0.18) 0px, rgba(0,0,0,0.18) 0.5px, rgba(0,0,0,0) 0.5px, rgba(0,0,0,0) 2px, rgba(255,255,255,0.08) 2px, rgba(255,255,255,0.08) 2.5px, rgba(0,0,0,0) 2.5px, rgba(0,0,0,0) 5px), linear-gradient(90deg, rgba(255,255,255,0.14), rgba(0,0,0,0) 35%, rgba(0,0,0,0.18))",
                          backgroundBlendMode: "overlay, multiply",
                        }
                  }
                  aria-hidden
                />
                <span className="w-14 text-center text-[8px] font-medium leading-tight text-[var(--color-muted)]">
                  {sw.name}
                </span>
              </div>
            ))}
          </div>
          <dl className="mt-5 border-t border-[var(--color-border)]">
            {collection.specSheet.map((row) => (
              <div
                key={row.label}
                className="flex items-baseline gap-3 border-b border-[var(--color-border)] py-2"
              >
                <dt className="w-[72px] shrink-0 text-[7.5px] font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)]">
                  {row.label}
                </dt>
                <dd className="text-[9.5px] leading-snug text-[var(--color-ink)]">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
          {pageFooter(collection.eyebrow)}
        </div>
      </div>,
      collection.eyebrow,
    );

    // Materials & components (optional)
    if (collection.materials) {
      push(
        <div key={`${collection.slug}-materials`} className="cf-page" data-density="soft">
          <div className="relative flex h-full flex-col p-7">
            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--color-gold)]">
              {collection.materials.label}
            </p>
            <h3 className="font-[family-name:var(--font-display)] mt-2 text-base font-semibold tracking-tight text-[var(--color-ink)]">
              Cedar grades &amp; lumber
            </h3>
            <div className="mt-2.5 flex min-h-0 flex-1 flex-col gap-2.5">
              {collection.materials.sections.map((section) => (
                <div key={section.label}>
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                      {section.label}
                    </span>
                    <span className="h-px flex-1 bg-[var(--color-border)]" aria-hidden />
                  </div>
                  <div className="mt-1.5 grid grid-cols-3 gap-x-2 gap-y-1.5">
                    {section.items.map((item) => (
                      <div key={item.name} className="flex flex-col items-center gap-0.5">
                        <span
                          className="h-[42px] w-full"
                          style={{
                            backgroundImage: `url("${item.image}")`,
                            backgroundSize: "contain",
                            backgroundPosition: "center bottom",
                            backgroundRepeat: "no-repeat",
                            filter: "drop-shadow(0 1.5px 2px rgba(0,0,0,0.16))",
                          }}
                          role="img"
                          aria-label={item.name}
                        />
                        <span className="text-center text-[7px] font-medium leading-tight text-[var(--color-muted)]">
                          {item.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {pageFooter(collection.eyebrow)}
          </div>
        </div>,
        collection.eyebrow,
      );
    }
  });

  // Back cover (hard)
  push(
    <div key="back" className="cf-page cf-dark" data-density="hard">
      <div className="relative flex h-full flex-col justify-between p-8 text-white">
        <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[var(--color-gold)]">
          Let&rsquo;s build it
        </p>
        <div>
          <h3 className="font-[family-name:var(--font-display)] text-[26px] font-semibold leading-tight tracking-tight">
            Request a free estimate.
          </h3>
          <p className="mt-3 text-[11px] leading-relaxed text-white/75">
            Tell us your yard size, the collection you like, and a height. We&rsquo;ll
            reply with a clear, no-obligation estimate.
          </p>
          <div className="mt-6 space-y-3">
            <div>
              <p className="text-[7px] uppercase tracking-[0.2em] text-white/50">Call</p>
              <p className="mt-0.5 text-sm font-semibold text-[var(--color-amber)]">{PHONE_DISPLAY}</p>
            </div>
            <div>
              <p className="text-[7px] uppercase tracking-[0.2em] text-white/50">Email</p>
              <p className="mt-0.5 text-sm font-semibold text-[var(--color-amber)]">{ENQUIRY_EMAIL}</p>
            </div>
          </div>
        </div>
        <p className="text-[8px] uppercase tracking-[0.2em] text-white/55">
          {BRAND} · Seattle Metro
        </p>
      </div>
    </div>,
    "Enquire",
  );

  return { pages, chapters };
}
