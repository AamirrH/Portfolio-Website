import { useEffect, useRef, type RefObject } from 'react';
import { messageSprites, type StopConfig } from '../../data/stops';
import { useStopPreferences } from '../../hooks/useStopAnimations';
import { useSceneStore } from '../../state/useSceneStore';

type Signal = 'green' | 'amber' | 'red';
interface Packet { node: HTMLSpanElement; start: number; duration: number; flagged: boolean; route?: Signal; arrival?: number; x: number; }
export function SignalFlow({ root, stop }: { root: RefObject<HTMLDivElement>; stop: StopConfig }) {
  const stage = useRef<HTMLDivElement>(null);
  const { reduced, mobile, hidden } = useStopPreferences();
  const active = useSceneStore(state => state.ignited && !state.plain && state.section === 'signalroute');
  useEffect(() => {
    const scene = root.current, container = stage.current;
    if (!scene || !container) return;
    scene.dataset.signal = 'green';
    if (!active || reduced || hidden) return;
    let frame = 0, start = 0, nextSpawn = 0, lastSignal: Signal = 'green';
    let packets: Packet[] = [];
    const nodes = Array.from(container.querySelectorAll<HTMLSpanElement>('.message-packet'));
    const leds = Array.from(scene.querySelectorAll<HTMLElement>('.rack-led')).map(node => ({node, next:0}));
    const flashes = new Map<HTMLElement,number>();
    const flash = (selector: string, time: number) => { const node = scene.querySelector<HTMLElement>(selector); if(node) flashes.set(node,time); };
    const tick = (now: number) => {
      if (!start) start = now;
      const time = now-start, cycle = time%6200;
      const signal: Signal = cycle<2400 ? 'green' : cycle<3400 ? 'amber' : 'red';
      scene.dataset.signal = signal;
      if (lastSignal !== signal && signal === 'red') flash('.barrier-glow',time);
      lastSignal = signal;
      const box = container.getBoundingClientRect(), road = box.height+(mobile?6:82);
      if (time >= nextSpawn) {
        nextSpawn = time+700+Math.random()*400;
        const node = nodes.find(node => !packets.some(packet=>packet.node===node));
        if (node) {
          const flagged = Math.random()<.2;
          const img = node.querySelector('img')!;
          img.src = `/assets/stops/msg-${flagged ? 'flagged' : messageSprites[Math.floor(Math.random()*messageSprites.length)]}.webp`;
          node.dataset.flagged = String(flagged); node.dataset.phase = 'travel';
          node.querySelector<HTMLElement>('.message-burst')!.style.opacity = '0';
          packets.push({node,start:time,duration:2200+Math.random()*1000,flagged,x:0});
        }
      }
      packets = packets.filter(packet => {
        const elapsed = time-packet.start;
        let x: number, y = road, opacity = 1;
        if (!packet.route && elapsed >= packet.duration) {
          packet.route = packet.flagged ? 'red' : signal;
          packet.arrival = time;
          packet.node.dataset.phase = packet.route === 'amber' ? 'queue' : packet.route === 'red' ? 'blocked' : 'notify';
        }
        const approach = Math.min(1,elapsed/packet.duration);
        if (!packet.route) {
          x = -box.left-40+(box.left+40+box.width*(packet.flagged?.05:.20))*approach;
          y += Math.sin(elapsed/230)*3;
          opacity = Math.min(1,elapsed/200);
        } else {
          const age = time-packet.arrival!;
          const delay = packet.route==='amber'?600:0;
          const t = Math.max(0,Math.min(1,(age-delay)/850));
          const chute = stop.overlays.find(rect=>rect.id===(packet.route==='green'?'notify':packet.route==='amber'?'digest':'mute'))!;
          const end = packet.route==='red' ? box.width*(packet.flagged?.075:.81) : box.width*(chute.x+chute.width/2)/100;
          const from = box.width*(packet.flagged?.05:.2);
          x = packet.route==='amber' ? from+(end-from)*Math.min(1,age/300) : from+(end-from)*t;
          y = packet.route==='red' ? road : road+(box.height*.83-road)*t-(mobile?0:Math.sin(Math.PI*t)*box.height*.13);
          opacity = t>.75 ? (1-t)*4 : 1;
          if (t===1) {
            if(packet.node.dataset.phase !== 'done') {
              flash(`.chute-${packet.route==='green'?'notify':packet.route==='amber'?'digest':'mute'}`,time);
              if(packet.flagged) flash('.barrier-glow',time);
              packet.node.dataset.phase = 'done';
            }
            if (packet.flagged) packet.node.querySelector<HTMLElement>('.message-burst')!.style.opacity = String(Math.max(0,1-(age-delay-850)/250));
            if(age>delay+1100) { packet.node.style.opacity='0'; return false; }
          }
        }
        packet.x=x;
        packet.node.style.transform=`translate(${x}px,${y}px)`;
        packet.node.style.opacity='1';
        packet.node.querySelector('img')!.style.opacity=String(opacity);
        return true;
      });
      for(const led of leds) if(time>=led.next) { led.node.style.opacity=String(.15+Math.random()*.85); led.next=time+400+Math.random()*1200; }
      for(const [node,at] of flashes) { node.style.opacity=String(Math.max(0,1-(time-at)/200)); if(time-at>=200) flashes.delete(node); }
      scene.dataset.messageActive = String(packets.length);
      scene.dataset.signalFrameCount='1';
      frame=requestAnimationFrame(tick);
    };
    frame=requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame); packets=[]; flashes.clear();
      nodes.forEach(node=>{node.style.opacity='0';});
      scene.querySelectorAll<HTMLElement>('.rack-led,.chute-glow,.barrier-glow').forEach(node=>node.style.removeProperty('opacity'));
      scene.dataset.signal='green'; scene.dataset.messageActive='0'; scene.dataset.signalFrameCount='0';
    };
  }, [root, stop, active, reduced, mobile, hidden]);
  return <div ref={stage} className="signal-flow" data-stop-depth="8" aria-hidden="true">
    <div className="signal-road-spill"/>
    {!reduced && Array.from({length:mobile?4:8},(_,i)=><span className="message-packet" key={i}><img src={`/assets/stops/msg-${messageSprites[i%messageSprites.length]}.webp`} alt=""/><span className="message-burst">×</span></span>)}
  </div>;
}
