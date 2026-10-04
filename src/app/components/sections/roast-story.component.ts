import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  inject,
} from '@angular/core';
import { NgFor } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ROAST_STAGES } from '../../core/data/content.data';
import { MotionService } from '../../core/services/motion.service';
import { roastCss, roastName } from '../../core/utils/roast-color';
import {
  ROAST_DURATION,
  TEMP_MAX,
  TEMP_MIN,
  curvePath,
  formatClock,
  roastLevelAt,
  tempAt,
} from '../../core/utils/roast-curve';
import { RevealDirective } from '../motion/reveal.directive';
import { SplitWordsDirective } from '../motion/split-words.directive';
import { RoastBeanComponent } from '../three/roast-bean.component';

const W = 600;
const H = 280;

/**
 * Scroll-driven roast chapter. The visual column is CSS-sticky; scroll progress
 * through the stage list drives the curve, the bean and the readouts directly
 * (no change detection per frame).
 */
@Component({
  selector: 'kiln-roast-story',
  standalone: true,
  imports: [NgFor, RoastBeanComponent, RevealDirective, SplitWordsDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './roast-story.component.html',
  styleUrls: ['./roast-story.component.scss'],
})
export class RoastStoryComponent implements AfterViewInit, OnDestroy {
  readonly stages = ROAST_STAGES;
  readonly w = W;
  readonly h = H;
  readonly path = curvePath(W, H);
  readonly crackX = (520 / ROAST_DURATION) * W;
  readonly minutes = [0, 2, 4, 6, 8, 10].map((m) => ({ label: m, x: ((m * 60) / ROAST_DURATION) * W }));
  readonly temps = [100, 150, 200].map((t) => ({ label: t, y: this.yFor(t) }));
  readonly bands = ROAST_STAGES.map((s, i) => ({
    x: s.at * W,
    w: ((ROAST_STAGES[i + 1]?.at ?? 1) - s.at) * W,
  }));

  @ViewChild('root', { static: true }) private root!: ElementRef<HTMLElement>;
  @ViewChild('steps', { static: true }) private steps!: ElementRef<HTMLElement>;
  @ViewChild('curve', { static: true }) private curve!: ElementRef<SVGPathElement>;
  @ViewChild('marker', { static: true }) private marker!: ElementRef<SVGGElement>;
  @ViewChild('markerLabel', { static: true }) private markerLabel!: ElementRef<SVGTextElement>;
  @ViewChild('time', { static: true }) private time!: ElementRef<HTMLElement>;
  @ViewChild('temp', { static: true }) private temp!: ElementRef<HTMLElement>;
  @ViewChild('shade', { static: true }) private shade!: ElementRef<HTMLElement>;
  @ViewChild('swatch', { static: true }) private swatch!: ElementRef<HTMLElement>;
  @ViewChild(RoastBeanComponent, { static: true }) private bean!: RoastBeanComponent;

  private readonly motion = inject(MotionService);
  private ctx?: gsap.Context;
  private length = 0;

  ngAfterViewInit(): void {
    this.length = this.curve.nativeElement.getTotalLength();
    this.curve.nativeElement.style.strokeDasharray = `${this.length}`;

    if (this.motion.reduced()) {
      this.update(1);
      this.root.nativeElement.classList.add('is-static');
      return;
    }

    this.update(0);
    this.steps.nativeElement.querySelector('.step')?.classList.add('is-active');
    this.ctx = this.motion.context(this.root.nativeElement, () => {
      // Each step owns an equal slice of scroll, mapped onto its own stage of
      // the roast — so the highlighted text always matches the curve.
      const steps = gsap.utils.toArray<HTMLElement>('.step', this.steps.nativeElement);
      const bounds = ROAST_STAGES.map((s, i) => [s.at, ROAST_STAGES[i + 1]?.at ?? 1]);
      let active = -1;

      ScrollTrigger.create({
        trigger: this.steps.nativeElement,
        start: 'top 60%',
        end: 'bottom 70%',
        scrub: 0.6,
        onUpdate: (self) => {
          const scaled = self.progress * steps.length;
          const i = Math.min(steps.length - 1, Math.floor(scaled));
          const [from, to] = bounds[i];
          this.update(from + (to - from) * (scaled - i));
          if (i !== active) {
            steps.forEach((el, k) => el.classList.toggle('is-active', k === i));
            active = i;
          }
        },
      });
    });
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }

  private update(p: number): void {
    const seconds = p * ROAST_DURATION;
    const temp = tempAt(seconds);
    const level = roastLevelAt(p);

    this.curve.nativeElement.style.strokeDashoffset = `${this.length * (1 - p)}`;
    this.marker.nativeElement.setAttribute('transform', `translate(${(p * W).toFixed(1)} ${this.yFor(temp).toFixed(1)})`);
    this.markerLabel.nativeElement.setAttribute('text-anchor', p > 0.82 ? 'end' : 'start');
    this.markerLabel.nativeElement.setAttribute('x', p > 0.82 ? '-12' : '12');
    this.markerLabel.nativeElement.textContent = `${Math.round(temp)} °C`;

    this.time.nativeElement.textContent = formatClock(seconds);
    this.temp.nativeElement.textContent = `${Math.round(temp)} °C`;
    this.shade.nativeElement.textContent = roastName(level);
    this.swatch.nativeElement.style.background = roastCss(level);
    this.bean.setProgress(level);
  }

  private yFor(t: number): number {
    return H - ((t - TEMP_MIN) / (TEMP_MAX - TEMP_MIN)) * H;
  }
}
