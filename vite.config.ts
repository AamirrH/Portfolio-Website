import { bundleReport } from './scripts/bundle-report.mjs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({ plugins: [react(),bundleReport()], resolve: { dedupe: ['react', 'react-dom'] }, optimizeDeps: { include: ['react', 'react-dom/client', 'zustand', 'gsap', 'gsap/ScrollTrigger'] } });
