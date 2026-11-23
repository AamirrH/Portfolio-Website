import { projects } from '../../data/content';
import { stops } from '../../data/stops';
import { StopScene } from './StopScene';
export function RoomlyStop() { return <StopScene stop={stops.roomly}/>; }
export function SwiftShipStop() { return <StopScene stop={stops.swiftship}/>; }
export function SignalRouteStop() { return <StopScene stop={stops.signalroute}/>; }
export function FrutigerStop() {
  const project = projects.find(item => item.id === 'frutiger-aero');
  return <StopScene stop={stops['frutiger-aero']} sky={project?.stop?.sky}/>;
}
