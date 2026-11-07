import type { ReactNode } from 'react';
interface Props { children:ReactNode; className?:string; href?:string; label?:string; }
export function RoadSign({children,className='',href,label}:Props){return href?<a href={href} className={'road-sign '+className} aria-label={label}>{children}</a>:<div className={'road-sign '+className} aria-label={label}>{children}</div>;}
