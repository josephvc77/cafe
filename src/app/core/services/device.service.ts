import { Injectable } from '@angular/core';

export type RenderTier = 'none' | 'low' | 'high';

/** Decides how much visual effect this device can afford. */
@Injectable({ providedIn: 'root' })
export class DeviceService {
  readonly tier: RenderTier = this.detect();

  get isCompact(): boolean {
    return typeof window !== 'undefined' && window.innerWidth < 768;
  }

  private detect(): RenderTier {
    if (typeof window === 'undefined') return 'none';
    const nav = navigator as Navigator & {
      deviceMemory?: number;
      connection?: { saveData?: boolean };
    };
    if (nav.connection?.saveData) return 'none';
    if (!this.hasWebGL()) return 'none';
    const lowCpu = (nav.hardwareConcurrency ?? 8) <= 4;
    const lowMem = (nav.deviceMemory ?? 8) <= 4;
    return lowCpu && lowMem ? 'low' : 'high';
  }

  private hasWebGL(): boolean {
    try {
      const canvas = document.createElement('canvas');
      return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
    } catch {
      return false;
    }
  }
}
