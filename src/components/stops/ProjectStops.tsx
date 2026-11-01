import { SceneSky } from '../scene/TravelScenes';
import { SideCar } from '../scene/SideCar';
function StopBase({ name }: { name: string }) { return <div className={`stop-scene stop-${name}`}><SceneSky/><div className="stop-asphalt"/><div className="parked-car"><SideCar/></div></div>; }
export function RoomlyStop() { return <StopBase name="roomly"/>; }
export function SwiftShipStop() { return <StopBase name="swiftship"/>; }
export function SignalRouteStop() { return <StopBase name="signalroute"/>; }
