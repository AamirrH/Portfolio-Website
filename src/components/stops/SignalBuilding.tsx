import { stopLabels } from '../../data/stops';
export function SignalBuilding() {
  return <svg className="signal-building" viewBox="0 0 460 400" preserveAspectRatio="none">
    <g stroke="#171625" strokeWidth="2" strokeLinejoin="round">
      <path d="M30 135H340V398H30Z" fill="#303a43"/>
      <path d="M20 125H350V146H20Z" fill="#bc7d97"/>
      <path d="M45 155H326V195H45Z" fill="#192a30"/>
      <path d="M55 213H126V375H55ZM149 213H220V375H149ZM243 213H314V375H243Z" fill="#171c29"/>
      {[55,149,243].flatMap((x,column) => Array.from({length:7},(_,row) => <g key={`${column}-${row}`}><rect x={x+5} y={220+row*21} width="61" height="16" rx="2" fill="#333749"/><path d={`M${x+11} ${228+row*21}h31`} stroke="#141827"/><circle className="server-led" style={{ animationDelay: `${-row*.4-column}s` }} cx={x+55} cy={228+row*21} r="2" stroke="none" fill="#8cd8b2"/></g>))}
      <rect x="365" y="95" width="13" height="303" fill="#405151"/>
      <rect x="329" y="10" width="85" height="167" rx="16" fill="#232633"/>
      <rect x="337" y="18" width="69" height="151" rx="12" fill="#121823"/>
      <circle cx="371.5" cy="45" r="17" fill="#492c36"/>
      <circle cx="371.5" cy="92" r="17" fill="#514635"/>
      <circle cx="371.5" cy="139" r="17" fill="#2c493d"/>
      <circle className="traffic-lamp red-lamp" cx="371.5" cy="45" r="15" fill="#ff606e"/>
      <circle className="traffic-lamp amber-lamp" cx="371.5" cy="92" r="15" fill="#ffc568"/>
      <circle className="traffic-lamp green-lamp" cx="371.5" cy="139" r="15" fill="#8bd5ab"/>
      <rect x="244" y="201" width="207" height="42" rx="4" fill="#204737" stroke="#c9cba0"/>
      <path d="M23 386H345V399H23Z" fill="#6b5363"/>
    </g>
    <g fill="#d6d9ba" fontFamily="sans-serif" textAnchor="middle"><text x="185" y="181" fontSize="13" letterSpacing="1">{stopLabels.dataCentre}</text><text x="347" y="227" fontSize="16" fontWeight="700">{stopLabels.signal}</text></g>
  </svg>;
}
