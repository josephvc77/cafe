import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgSwitch, NgSwitchCase } from '@angular/common';

export type IconName = 'arrow-right' | 'arrow-down' | 'menu' | 'close' | 'plus' | 'check' | 'pin';

/**
 * Minimal inline icon set (Lucide-style 1.75 stroke). Kept tiny on purpose —
 * the brand is typographic and uses icons only where they clarify an action.
 */
@Component({
  selector: 'kiln-icon',
  standalone: true,
  imports: [NgSwitch, NgSwitchCase],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true', style: 'display:contents' },
  template: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"
         stroke-linecap="round" stroke-linejoin="round" focusable="false" [attr.width]="size" [attr.height]="size"
         [ngSwitch]="name">
      <path *ngSwitchCase="'arrow-right'" d="M5 12h14M13 6l6 6-6 6" />
      <path *ngSwitchCase="'arrow-down'" d="M12 5v14M6 13l6 6 6-6" />
      <path *ngSwitchCase="'menu'" d="M4 8h16M4 16h16" />
      <path *ngSwitchCase="'close'" d="M6 6l12 12M18 6L6 18" />
      <path *ngSwitchCase="'plus'" d="M12 5v14M5 12h14" />
      <path *ngSwitchCase="'check'" d="M5 12.5l4.5 4.5L19 7" />
      <g *ngSwitchCase="'pin'"><path d="M12 21s-7-6.1-7-11.5a7 7 0 0114 0C19 14.9 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></g>
    </svg>
  `,
})
export class IconComponent {
  @Input({ required: true }) name!: IconName;
  @Input() size = 18;
}
