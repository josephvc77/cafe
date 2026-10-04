import { AfterViewInit, ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MotionService } from './core/services/motion.service';
import { SiteFooterComponent } from './components/footer/site-footer.component';
import { SubscriptionBuilderComponent } from './components/forms/subscription-builder.component';
import { HeroComponent } from './components/hero/hero.component';
import { MobileCtaBarComponent } from './components/navigation/mobile-cta-bar.component';
import { SiteHeaderComponent } from './components/navigation/site-header.component';
import { CafeComponent } from './components/sections/cafe.component';
import { CoffeeLineupComponent } from './components/sections/coffee-lineup.component';
import { FaqComponent } from './components/sections/faq.component';
import { FinalCtaComponent } from './components/sections/final-cta.component';
import { ProofStripComponent } from './components/sections/proof-strip.component';
import { RoastStoryComponent } from './components/sections/roast-story.component';
import { SourcingLedgerComponent } from './components/sections/sourcing-ledger.component';
import { TestimonialsComponent } from './components/sections/testimonials.component';

/**
 * Page composition only — each section owns its content, layout and motion.
 * Reorder or swap sections here when adapting to another business.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    SiteHeaderComponent,
    HeroComponent,
    ProofStripComponent,
    RoastStoryComponent,
    CoffeeLineupComponent,
    SubscriptionBuilderComponent,
    SourcingLedgerComponent,
    TestimonialsComponent,
    CafeComponent,
    FaqComponent,
    FinalCtaComponent,
    SiteFooterComponent,
    MobileCtaBarComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a class="skip-link" href="#main">Skip to content</a>
    <kiln-site-header />
    <main id="main" tabindex="-1">
      <kiln-hero />
      <kiln-proof-strip />
      <kiln-roast-story />
      <kiln-coffee-lineup />
      <kiln-subscription-builder />
      <kiln-sourcing-ledger />
      <kiln-testimonials />
      <kiln-cafe />
      <kiln-faq />
      <kiln-final-cta />
    </main>
    <kiln-site-footer id="site-footer" />
    <kiln-mobile-cta-bar />
  `,
  styles: [':host { display: block; } main { outline: none; }'],
})
export class AppComponent implements AfterViewInit {
  private readonly motion = inject(MotionService);

  ngAfterViewInit(): void {
    // Web fonts change line lengths; re-measure scroll triggers once they're in.
    document.fonts?.ready.then(() => this.motion.refresh());
  }
}
