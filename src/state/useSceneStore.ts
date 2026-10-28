import { create } from 'zustand';
import type { Section } from '../data/content';
import { readPreference, savePreference } from '../lib/preferences';
export type CameraPreset = 'rear' | 'side' | 'dash' | 'aerial';
interface SceneState { speed: number; section: Section; camera: CameraPreset; plain: boolean; ignited: boolean; setSpeed: (speed: number) => void; setSection: (section: Section) => void; setCamera: (camera: CameraPreset) => void; setPlain: (plain: boolean) => void; ignite: () => void; }
const initialPlain = matchMedia('(prefers-reduced-motion: reduce)').matches || readPreference('endless-plain') === 'true';
export const useSceneStore = create<SceneState>(set => ({ speed: 1, section: 'home', camera: 'rear', plain: initialPlain, ignited: initialPlain, setSpeed: speed => set({ speed }), setSection: section => set({ section }), setCamera: camera => set({ camera }), setPlain: plain => { savePreference('endless-plain', String(plain)); set({ plain }); }, ignite: () => set({ ignited: true }) }));
