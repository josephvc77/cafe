import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { BRAND } from '../../core/config/brand.config';
import { MotionService } from '../../core/services/motion.service';
import { SubscriptionStore } from '../../core/state/subscription.store';
import { formatShort } from '../../core/utils/roast-schedule';
import { IconComponent } from '../ui/icon.component';

@Component({
  selector: 'kiln-site-header',
  standalone: true,
  imports: [NgFor, NgIf, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './site-header.component.html',
  styleUrls: ['./site-header.component.scss'],
})
export class SiteHeaderComponent implements AfterViewInit, OnDestroy {
  readonly brand = BRAND;
  readonly open = signal(false);
  readonly nextRoast = formatShort(inject(SubscriptionStore).schedule().roast);

  @ViewChild('bar', { static: true }) private bar!: ElementRef<HTMLElement>;
  @ViewChild('sheet') private sheet?: ElementRef<HTMLElement>;
  @ViewChild('toggle', { static: true }) private toggle!: ElementRef<HTMLButtonElement>;

  private readonly motion = inject(MotionService);
  private removeScroll?: () => void;

  ngAfterViewInit(): void {
    // Scrolled state toggled directly on the element — no change detection per scroll.
    this.motion.outside(() => {
      const el = this.bar.nativeElement;
      let last = -1;
      const onScroll = () => {
        const scrolled = window.scrollY > 24;
        if (+scrolled !== last) {
          el.classList.toggle('is-scrolled', scrolled);
          last = +scrolled;
        }
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
      this.removeScroll = () => window.removeEventListener('scroll', onScroll);
    });
  }

  ngOnDestroy(): void {
    this.removeScroll?.();
    document.body.style.overflow = '';
  }

  toggleMenu(): void {
    this.open() ? this.close() : this.openMenu();
  }

  openMenu(): void {
    this.open.set(true);
    document.body.style.overflow = 'hidden';
    queueMicrotask(() => setTimeout(() => this.focusables()[0]?.focus(), 0));
  }

  close(returnFocus = true): void {
    if (!this.open()) return;
    this.open.set(false);
    document.body.style.overflow = '';
    if (returnFocus) this.toggle.nativeElement.focus();
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(e: KeyboardEvent): void {
    if (!this.open()) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      this.close();
      return;
    }
    if (e.key !== 'Tab') return;
    // Focus trap: toggle button + sheet links.
    const items = [this.toggle.nativeElement, ...this.focusables()];
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  private focusables(): HTMLElement[] {
    return Array.from(this.sheet?.nativeElement.querySelectorAll<HTMLElement>('a, button') ?? []);
  }
}
