import { create } from 'zustand';
import type { Section } from '../data/content';
export type CameraPreset = 'rear' | 'side' | 'dash' | 'aerial';
interface SceneState { speed: number; section: Section; camera: CameraPreset; plain: boolean; ignited: boolean; setSpeed: (speed: number) => void; setSection: (section: Section) => void; setCamera: (camera: CameraPreset) => void; setPlain: (plain: boolean) => void; ignite: () => void; }
export const useSceneStore = create<SceneState>(set => ({ speed: 1, section: 'home', camera: 'rear', plain: false, ignited: false, setSpeed: speed => set({ speed }), setSection: section => set({ section }), setCamera: camera => set({ camera }), setPlain: plain => set({ plain }), ignite: () => set({ ignited: true }) }));
