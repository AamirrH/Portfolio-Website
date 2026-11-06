import type { propAssets } from './propAssets';
import type { ProjectId } from './content';
export interface OverlayRect { id: string; kind: 'vacancy' | 'window' | 'blade' | 'neon' | 'status' | 'interior' | 'tickets' | 'signal' | 'chute' | 'led' | 'fascia' | 'dish' | 'barrier'; x: number; y: number; width: number; height: number; }
export interface StopProp {
  asset: keyof typeof propAssets;
  x: number; // Percent of the usable stop width, excluding the project card.
  height: number; // Height as a percentage of the building height.
  scale: number;
  z: number;
  placement: 'front' | 'behind';
  mobile: boolean;
  mobileX?: number;
}
export interface StopConfig {
  props: StopProp[];
  neighbors?: boolean;
  id: ProjectId;
  building: { src?: string; silhouette?: string; heightVh: number; mobileHeightVh: number; anchorXPct: number; alignBottomToCurb: true; aspect: number };
  door?: { x: number; y: number; width: number; height: number };
  overlays: OverlayRect[];
}
export const stops: Record<ProjectId, StopConfig> = {
  roomly: {
    id: 'roomly', neighbors: true, props: [
      {asset:'parisian-lamp',x:38,height:34,scale:1,z:6,placement:'front',mobile:true,mobileX:15},
      {asset:'parisian-lamp',x:94,height:34,scale:1,z:6,placement:'front',mobile:false},
      {asset:'bistro',x:78,height:9,scale:1,z:7,placement:'front',mobile:false},
      {asset:'topiary',x:87,height:14,scale:1,z:6,placement:'front',mobile:true,mobileX:80}
    ], door: { x: 41, y: 85, width: 17, height: 15 }, building: { src: '/assets/stops/roomly.webp', silhouette: '/assets/stops/roomly-silhouette.png', heightVh: 62, mobileHeightVh: 38, anchorXPct: 46, alignBottomToCurb: true, aspect: 948 / 1200 },
    overlays: [
      { id: 'vacancy', kind: 'vacancy', x: 89.7, y: 60.15, width: 9.9, height: 3.1 },
      { id: 'roomly-blade', kind: 'blade', x: 89.5, y: 32.35, width: 10.1, height: 26.8 },
      { id: 'attic-west', kind: 'window', x: 12.5, y: 6.2, width: 1.7, height: 3.7 },
      { id: 'attic-east', kind: 'window', x: 66.6, y: 6.2, width: 1.9, height: 3.7 },
      { id: 'fourth-west', kind: 'window', x: 30.3, y: 17.1, width: 2, height: 3.8 },
      { id: 'fourth-center', kind: 'window', x: 47.4, y: 17.1, width: 2, height: 3.8 },
      { id: 'third-west', kind: 'window', x: 11.9, y: 29.2, width: 1.9, height: 6.3 },
      { id: 'third-center', kind: 'window', x: 30.2, y: 29.2, width: 2.1, height: 6.3 },
      { id: 'third-east', kind: 'window', x: 47.4, y: 29.2, width: 1.9, height: 6.3 },
      { id: 'second-west', kind: 'window', x: 30.2, y: 43.1, width: 2.1, height: 6.1 },
      { id: 'second-east', kind: 'window', x: 64.4, y: 43.1, width: 2.1, height: 6.1 },
      { id: 'first-center', kind: 'window', x: 47.4, y: 66.4, width: 2.1, height: 6.2 }
    ]
  },
  swiftship: {
    id: 'swiftship', props: [
      {asset:'modern-lamp',x:12,height:60,scale:1,z:4,placement:'behind',mobile:true,mobileX:9},
      {asset:'bike-rack',x:18,height:14,scale:1,z:6,placement:'front',mobile:false},
      {asset:'trash-bin',x:96,height:13,scale:1,z:6,placement:'front',mobile:false},
      {asset:'scooter',x:82,height:22,scale:1,z:7,placement:'front',mobile:true,mobileX:86}
    ], door: { x: 63, y: 55, width: 14, height: 45 }, building: { src: '/assets/stops/swiftship.webp', silhouette: '/assets/stops/swiftship-silhouette.png', heightVh: 44, mobileHeightVh: 30, anchorXPct: 42, alignBottomToCurb: true, aspect: 1445 / 900 },
    overlays: [
      { id: 'open-neon', kind: 'neon', x: 46.6, y: 50.1, width: 12.4, height: 14.2 },
      { id: 'door-status', kind: 'status', x: 76.15, y: 72.3, width: .9, height: 2.5 },
      { id: 'interior', kind: 'interior', x: 9.5, y: 44.2, width: 81, height: 44.8 },
      { id: 'dispatch-tickets', kind: 'tickets', x: 76, y: 35.8, width: 2.2, height: 1.8 }
    ]
  },
  signalroute: {
    id: 'signalroute', props: [
      {asset:'bollards',x:88,height:13,scale:1,z:6,placement:'front',mobile:true,mobileX:87},
      {asset:'modern-lamp',x:90,height:70,scale:1,z:4,placement:'behind',mobile:false},
      {asset:'hydrant',x:17,height:15,scale:1,z:6,placement:'front',mobile:false}
    ], building: { src: '/assets/stops/signalroute.webp', silhouette: '/assets/stops/signalroute-silhouette.png', heightVh: 43, mobileHeightVh: 29, anchorXPct: 42, alignBottomToCurb: true, aspect: 1439 / 720 }, overlays: [
      { id: 'red', kind: 'signal', x: 3.5, y: 37.4, width: 3.2, height: 6.2 },
      { id: 'amber', kind: 'signal', x: 3.5, y: 46.0, width: 3.2, height: 6.2 },
      { id: 'green', kind: 'signal', x: 3.5, y: 54.6, width: 3.2, height: 6.2 },
      { id: 'notify', kind: 'chute', x: 27.0, y: 69.7, width: 1.1, height: 2.2 },
      { id: 'digest', kind: 'chute', x: 49.0, y: 69.7, width: 1.1, height: 2.2 },
      { id: 'mute', kind: 'chute', x: 71.0, y: 69.7, width: 1.1, height: 2.2 },
      { id: 'gate', kind: 'barrier', x: 83.0, y: 89.3, width: 16.8, height: 2.3 },
      { id: 'sign', kind: 'fascia', x: 26.5, y: 24.5, width: 48, height: 13 },
      { id: 'dish', kind: 'dish', x: 63.5, y: 3.5, width: 4, height: 6 },
      ...Array.from({ length: 12 }, (_, i): OverlayRect => ({ id: `rack-${i}`, kind: 'led', x: [25.2,32.1,42.6,47.6,57.6,68.1][i % 6], y: i < 6 ? 50.3 : 54.7, width: .5, height: .4 }))
    ]
  }
};
export const stopArtOrder: ProjectId[] = ['roomly', 'swiftship', 'signalroute'];
export const stopLabels = { vacancy: 'VACANCY', full: 'NO VACANCY', signal: 'SIGNALROUTE AI', dataCentre: 'DETERMINISTIC ROUTING', safety: 'SAFETY GATE', signalStates: ['green', 'amber', 'red'] as const };

export const messageSprites = ['text-cyan', 'text-pink', 'image', 'voice', 'envelope'] as const;
