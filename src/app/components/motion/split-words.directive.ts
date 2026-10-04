import { AfterContentInit, Directive, ElementRef, inject } from '@angular/core';

/**
 * Wraps each word of an element's text in masked spans so it can be revealed
 * word-by-word. Nested inline elements (<em>, <br>) are preserved.
 * Screen readers get the original text via aria-label; the spans are hidden.
 * Runs after content init so interpolated text is already rendered; the result
 * is static — don't use on text that changes after first render.
 */
@Directive({ selector: '[kilnSplitWords]', standalone: true })
export class SplitWordsDirective implements AfterContentInit {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

  ngAfterContentInit(): void {
    const host = this.el.nativeElement;
    host.setAttribute('aria-label', host.textContent?.replace(/\s+/g, ' ').trim() ?? '');
    this.split(host);
  }

  private split(node: Node): void {
    for (const child of Array.from(node.childNodes)) {
      if (child.nodeType === Node.TEXT_NODE) {
        const parts = (child.textContent ?? '').split(/([^\S\u00A0]+)/);
        const frag = document.createDocumentFragment();
        for (const part of parts) {
          if (!part) continue;
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(' '));
            continue;
          }
          const outer = document.createElement('span');
          outer.className = 'split-word';
          outer.setAttribute('aria-hidden', 'true');
          const inner = document.createElement('span');
          inner.className = 'split-word__inner';
          inner.textContent = part;
          outer.appendChild(inner);
          frag.appendChild(outer);
        }
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE && (child as Element).tagName !== 'BR') {
        (child as Element).setAttribute('aria-hidden', 'true');
        this.split(child);
      }
    }
  }
}
