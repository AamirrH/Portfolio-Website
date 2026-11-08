import { environmentMotion } from '../lib/environment';
import { useEffect } from 'react';
import gsap from 'gsap';
import { useSceneStore } from '../state/useSceneStore';
export function useHighwayState() {
 const section=useSceneStore(s=>s.section), rainOverride=useSceneStore(s=>s.rainOverride), motion=useSceneStore(s=>s.motion), plain=useSceneStore(s=>s.plain);
 useEffect(()=>{
  const values=environmentMotion;
  const timeOfDay=section==='home'?0:section==='contact'?1:.5;
  const weather=new URLSearchParams(location.search).get('weather')==='rain'?1:rainOverride===null?(section==='contact'?.7:0):rainOverride? .8:0;
  const a=gsap.to(values,{timeOfDay,duration:1.2,onComplete:()=>useSceneStore.setState({timeOfDay:values.timeOfDay})});
  const b=gsap.to(values,{weather,duration:1.5,onComplete:()=>useSceneStore.setState({weather:values.weather})});
  return()=>{a.kill();b.kill();};
 },[section,rainOverride]);
 useEffect(()=>{
  document.documentElement.classList.toggle('motion-off',!motion || plain);
  const key=(e:KeyboardEvent)=>{if(e.key.toLowerCase()==='r'&&!e.repeat&&!(e.target as HTMLElement).closest('input,textarea,select,[contenteditable]'))useSceneStore.getState().toggleRain();};
  window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key);
 },[motion,plain]);
}
