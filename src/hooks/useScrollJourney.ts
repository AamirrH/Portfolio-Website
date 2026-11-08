import { useEffect } from 'react';
import gsap from 'gsap';
import { useSceneStore } from '../state/useSceneStore';
import { readHash, routeOrder } from './useJourney';
export function useScrollJourney(enabled:boolean){useEffect(()=>{
 if(!enabled)return;let disposed=false,release=()=>{};
 void import('gsap/ScrollTrigger').then(({ScrollTrigger})=>{
  if(disposed)return;gsap.registerPlugin(ScrollTrigger);ScrollTrigger.config({autoRefreshEvents:'visibilitychange,DOMContentLoaded,load',ignoreMobileResize:true});
  let syncing=true,timer:ReturnType<typeof setTimeout>;const previous=history.scrollRestoration;history.scrollRestoration='manual';
  const trigger=ScrollTrigger.create({start:0,end:()=>(routeOrder.length-1)*innerHeight,invalidateOnRefresh:true,onUpdate:self=>{if(syncing)return;const section=routeOrder[Math.round(self.progress*(routeOrder.length-1))];if(section!==useSceneStore.getState().section){useSceneStore.getState().setSection(section);history.replaceState(null,'',`#${section}`);}}});
  const syncHash=()=>{syncing=true;clearTimeout(timer);const section=readHash();useSceneStore.getState().setSection(section);window.scrollTo({top:routeOrder.indexOf(section)*innerHeight,behavior:'instant'});timer=setTimeout(()=>{trigger.refresh();syncing=false;trigger.update();},0);};
  syncHash();window.addEventListener('hashchange',syncHash);window.addEventListener('resize',syncHash);
  release=()=>{trigger.kill();clearTimeout(timer);window.removeEventListener('hashchange',syncHash);window.removeEventListener('resize',syncHash);history.scrollRestoration=previous;};
 });return()=>{disposed=true;release();};
},[enabled]);}
