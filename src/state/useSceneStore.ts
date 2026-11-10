import { type QualityTier } from '../config/quality';
import { create } from 'zustand';
import type { Section } from '../data/content';
import { readPreference, savePreference } from '../lib/preferences';
export type CameraPreset = 'rear' | 'side' | 'dash' | 'aerial';
interface SceneState { quality:QualityTier;motion: boolean; timeOfDay: number; weather: number; rainOverride: boolean | null; toggleRain: ()=>void; speed: number; section: Section; camera: CameraPreset; plain: boolean; ignited: boolean; setSpeed: (speed: number) => void; setSection: (section: Section) => void; setCamera: (camera: CameraPreset) => void; setPlain: (plain: boolean) => void; ignite: () => void; }

const initialPlain = matchMedia('(prefers-reduced-motion: reduce)').matches || readPreference('endless-plain') === 'true';
export const useSceneStore = create<SceneState>(set => ({ quality:'high',motion:true, timeOfDay:0, weather:0, rainOverride:null, toggleRain:()=>set(state=>({rainOverride: !(state.rainOverride ?? state.weather>.1)})), speed: 1, section: 'home', camera: 'rear', plain: initialPlain, ignited: true, setSpeed: speed => set({ speed }), setSection: section => set({ section }), setCamera: camera => set({ camera }), setPlain: plain => { savePreference('endless-plain', String(plain)); set({ plain }); }, ignite: () => set({ ignited: true }) }));
