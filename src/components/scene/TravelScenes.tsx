import { DeckEdge } from './Skyline';
import { RoadMarkings } from './RoadMarkings';
import { Rain,HighwayPerf } from '../highway/Rain';
import { useRef } from 'react';
import { useSceneMotion } from '../../hooks/useSceneMotion';
import { SceneLayer as Layer } from './SceneLayer';
import { Sky } from './Sky';
import { Sun } from './Sun';
import { FarSkyline, MidSkyline, NearBuildings } from './Skyline';
import { PowerLines } from './PowerLines';
import { Highway } from './Highway';
import { Gantry } from './Gantry';
import { RearCar } from './Car';
import { useSceneStore } from '../../state/useSceneStore';
import { SCENE_QUALITY } from '../../config';
import { Cockpit } from './Cockpit';
export function SceneSky() {
  return <><Layer name="sky"><Sky/></Layer><Layer name="sun"><Sun/></Layer><Layer name="far-skyline"><FarSkyline/></Layer><Layer name="mid-skyline"><MidSkyline/></Layer></>;
}
export function RearScene() {
  const ref = useRef<HTMLDivElement>(null);
  useSceneMotion(ref);
  const section = useSceneStore(state => state.section);
  const home = section === 'home';
  const quality=useSceneStore(s=>s.quality);
  const bloom = home && SCENE_QUALITY.bloom && quality!=='low';
  return <div ref={ref} className={`travel-scene rear-scene${bloom ? ' home-sunset-bloom' : ''}`}><SceneSky/><Layer name="near-buildings"><NearBuildings/></Layer><Layer name="power-lines"><PowerLines/></Layer><Layer name="highway"><div className="rear-road"><DeckEdge/><Highway/><RoadMarkings/></div></Layer>{bloom && <div className="home-sunlight" aria-hidden="true"><div className="horizon-bloom"/><div className="road-sunlight"/></div>}<Layer name="gantry"><Gantry/></Layer><Layer name="car-rear"><div className="rear-car"><RearCar sunset={bloom}/></div></Layer>{section !== 'contact' && <Rain/>}<HighwayPerf/></div>;
}
export function DashScene() {
  const ref = useRef<HTMLDivElement>(null);
  useSceneMotion(ref);
  return <div ref={ref} className="travel-scene dash-scene"><SceneSky/><Layer name="near-buildings"><NearBuildings/></Layer><Layer name="highway"><div className="rear-road"><Highway/><RoadMarkings/></div></Layer><Cockpit/></div>;
}
export function AerialScene() {
  return <div className="travel-scene aerial-scene"><SceneSky/>
    <svg className="aerial-road" viewBox="0 0 1440 900" preserveAspectRatio="none">
      <path d="M490 120H610L1080 900H0Z" fill="#171526" stroke="#dd5588" strokeWidth="2"/>
      <path d="M520 120L270 900M580 120L800 900" fill="none" stroke="#b08fae" strokeWidth="2" strokeDasharray="22 30"/>
      <path d="M472 151L0 850M629 151L1095 900" fill="none" stroke="#a53e70" strokeWidth="4"/>
      <g fill="#342039" stroke="#211726" strokeWidth="2"><path d="M70 230h160v120H70zM90 410h120v160H90zM820 190h120v130H820zM990 350h150v160H990z"/></g>
      <g transform="translate(455 520)"><rect width="68" height="122" rx="12" fill="#5c506c" stroke="#ba85a7" strokeWidth="2"/><rect x="7" y="25" width="54" height="61" rx="5" fill="#171c2e"/><path d="M9 109h15m20 0h15" stroke="#ff315b" strokeWidth="5"/></g>
    </svg>
  </div>;
}
