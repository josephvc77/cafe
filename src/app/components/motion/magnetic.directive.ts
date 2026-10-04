import { AfterViewInit, Directive, ElementRef, Input, OnDestroy, inject } from '@angular/core';
import { gsap } from 'gsap';
import { MotionService } from '../../core/services/motion.service';

/**
 * Subtle magnetic pull toward the pointer. Fine pointers only; disabled for
 * reduced motion and touch, where it would feel broken.
 */
@Directive({ selector: '[kilnMagnetic]', standalone: true })
export class MagneticDirective implements AfterViewInit, OnDestroy {
  @Input() magneticStrength = 0.28;

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly motion = inject(MotionService);
  private cleanup?: () => void;

  ngAfterViewInit(): void {
    if (this.motion.reduced() || !this.motion.finePointer) return;
    const el = this.el.nativeElement;

    this.motion.outside(() => {
      const x = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
      const y = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });

      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        x((e.clientX - (r.left + r.width / 2)) * this.magneticStrength);
        y((e.clientY - (r.top + r.height / 2)) * this.magneticStrength);
      };
      const leave = () => {
        x(0);
        y(0);
      };

      el.addEventListener('pointermove', move);
      el.addEventListener('pointerleave', leave);
      this.cleanup = () => {
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerleave', leave);
        gsap.killTweensOf(el);
      };
    });
  }

  ngOnDestroy(): void {
    this.cleanup?.();
  }
}
