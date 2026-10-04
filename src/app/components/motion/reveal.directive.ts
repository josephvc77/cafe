import { AfterViewInit, Directive, ElementRef, Input, OnDestroy, inject, numberAttribute } from '@angular/core';
import { gsap } from 'gsap';
import { MotionService } from '../../core/services/motion.service';

export type RevealVariant = 'rise' | 'words' | 'fade' | 'clip' | 'stagger';

/**
 * Scroll-triggered reveal, one motion vocabulary for the whole site.
 *  - rise:    element lifts 32px and fades in
 *  - words:   split-word spans rise from their masks (pair with kilnSplitWords)
 *  - fade:    opacity only
 *  - clip:    wipes in from the bottom edge (images, bags)
 *  - stagger: direct children rise in sequence
 * Content is fully visible when reduced motion is on.
 */
@Directive({ selector: '[kilnReveal]', standalone: true })
export class RevealDirective implements AfterViewInit, OnDestroy {
  @Input('kilnReveal') variant: RevealVariant | '' = 'rise';
  @Input({ transform: numberAttribute }) revealDelay = 0;
  @Input() revealStart = 'top 86%';

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly motion = inject(MotionService);
  private ctx?: gsap.Context;

  ngAfterViewInit(): void {
    if (this.motion.reduced()) return;
    const el = this.el.nativeElement;
    const scrollTrigger = { trigger: el, start: this.revealStart, once: true };
    const delay = this.revealDelay;

    this.ctx = this.motion.context(el, () => {
      switch (this.variant || 'rise') {
        case 'words':
          gsap.from(el.querySelectorAll('.split-word__inner'), {
            yPercent: 110,
            rotate: 2,
            duration: 1.2,
            stagger: 0.045,
            delay,
            scrollTrigger,
          });
          break;
        case 'fade':
          gsap.from(el, { autoAlpha: 0, duration: 1.4, delay, ease: 'power2.out', scrollTrigger });
          break;
        case 'clip':
          gsap.from(el, {
            clipPath: 'inset(100% 0% 0% 0%)',
            y: 40,
            duration: 1.4,
            delay,
            ease: 'expo.inOut',
            scrollTrigger,
          });
          break;
        case 'stagger':
          gsap.from(el.children, { y: 36, autoAlpha: 0, stagger: 0.08, delay, scrollTrigger });
          break;
        default:
          gsap.from(el, { y: 32, autoAlpha: 0, delay, scrollTrigger });
      }
    });
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}
