import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { NgIf } from '@angular/common';
import type { BeanScene } from './bean.scene';
import { DeviceService } from '../../core/services/device.service';
import { MotionService } from '../../core/services/motion.service';
import { roastCss } from '../../core/utils/roast-color';

let uid = 0;

/**
 * Angular host for the WebGL bean.
 *  - Shows an SVG bean immediately (same roast colour) — never an empty frame.
 *  - Lazy-loads Three.js only when the component nears the viewport.
 *  - Renders only while visible; disposes everything on destroy.
 *  - Stays on the SVG fallback for no-WebGL, save-data or failed loads.
 */
@Component({
  selector: 'kiln-roast-bean',
  standalone: true,
  imports: [NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './roast-bean.component.html',
  styleUrls: ['./roast-bean.component.scss'],
  host: { role: 'img', '[attr.aria-label]': 'label' },
})
export class RoastBeanComponent implements AfterViewInit, OnDestroy {
  @Input() label = 'A single coffee bean, roasting';
  @Input() initialProgress = 0;
  /** Idle float/rotation. */
  @Input() animate = true;

  @ViewChild('canvas', { static: true }) private canvasRef!: ElementRef<HTMLCanvasElement>;

  readonly ready = signal(false);
  readonly gradId = `beanLight${uid++}`;

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly device = inject(DeviceService);
  private readonly motion = inject(MotionService);
  private scene?: BeanScene;
  private io?: IntersectionObserver;
  private progress = 0;
  private visible = false;
  private destroyed = false;

  ngAfterViewInit(): void {
    this.setProgress(this.initialProgress);
    if (this.device.tier === 'none') return;

    this.motion.outside(() => {
      this.io = new IntersectionObserver(
        ([entry]) => {
          this.visible = entry.isIntersecting;
          if (this.visible && !this.scene) void this.load();
          this.syncLoop();
        },
        { rootMargin: '200px 0px' },
      );
      this.io.observe(this.host.nativeElement);
    });
  }

  /** Drive the roast level (0–1). Safe to call every frame, outside Angular. */
  setProgress(p: number): void {
    this.progress = p;
    this.host.nativeElement.style.setProperty('--bean-color', roastCss(p));
    this.scene?.setProgress(p);
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.io?.disconnect();
    this.scene?.dispose();
  }

  private async load(): Promise<void> {
    try {
      const { BeanScene } = await import('./bean.scene');
      if (this.destroyed) return;
      const lowTier = this.device.tier === 'low' || this.device.isCompact;
      this.scene = new BeanScene(this.canvasRef.nativeElement, {
        quality: lowTier ? 'low' : 'high',
        animate: this.animate && !this.motion.reduced(),
        pointer: this.motion.finePointer && !this.motion.reduced(),
      });
      this.scene.setProgress(this.progress);
      this.motion.inside(() => this.ready.set(true));
      this.syncLoop();
    } catch (err) {
      console.warn('[kiln] WebGL bean unavailable, using SVG fallback.', err);
    }
  }

  private syncLoop(): void {
    if (!this.scene) return;
    if (this.visible && !this.motion.reduced()) this.scene.start();
    else this.scene.stop();
  }
}
