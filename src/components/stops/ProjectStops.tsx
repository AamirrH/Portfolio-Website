import { stops } from '../../data/stops';
import { StopScene } from './StopScene';
export function RoomlyStop() { return <StopScene stop={stops.roomly}/>; }
export function SwiftShipStop() { return <StopScene stop={stops.swiftship}/>; }
export function SignalRouteStop() { return <StopScene stop={stops.signalroute}/>; }
