/**
 * Minimal type declaration for `page-flip` (StPageFlip), which ships no types.
 * We only use the handful of members declared here.
 */
declare module "page-flip" {
  export class PageFlip {
    constructor(element: HTMLElement, settings: Record<string, unknown>);
    loadFromHTML(items: NodeListOf<Element> | Element[]): void;
    loadFromImages(images: string[]): void;
    flipNext(corner?: "top" | "bottom"): void;
    flipPrev(corner?: "top" | "bottom"): void;
    turnToPage(page: number): void;
    getPageCount(): number;
    getCurrentPageIndex(): number;
    on(event: string, callback: (e: { data: number }) => void): void;
    update(): void;
    destroy(): void;
  }
}
