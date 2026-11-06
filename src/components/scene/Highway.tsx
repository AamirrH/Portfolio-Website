export function Highway() { return <><svg className="road-base" viewBox="0 0 1440 800" preserveAspectRatio="none"><defs><linearGradient id="asphalt" x2="0" y2="1"><stop stopColor="#45203f"/><stop offset="1" stopColor="#100f20"/></linearGradient><linearGradient id="wet" x2="0" y2="1"><stop stopColor="#ff719c" stopOpacity=".25"/><stop offset="1" stopColor="#ff2a8a" stopOpacity="0"/></linearGradient></defs><path d="M-300 800L630 525H810L1740 800Z" fill="url(#asphalt)"/><path d="M666 525H774L980 800H435Z" fill="url(#wet)"/><g fill="none"><path d="M0 678L628 526M1440 678L812 526" stroke="#e0588b" strokeWidth="3" opacity=".7"/><path d="M0 695L628 531M1440 695L812 531" stroke="#1c1828" strokeWidth="18"/><path d="M0 687L628 529M1440 687L812 529" stroke="#ff3e89" strokeWidth="2"/><path d="M0 733L628 534M1440 733L812 534" stroke="#7d405d" strokeWidth="2"/><path d="M0 752L628 538M1440 752L812 538" stroke="#141522" strokeWidth="22"/><path d="M95 800L664 527M1345 800L776 527" stroke="#d9abcb" strokeWidth="2" opacity=".5"/></g><g stroke="#42263e" strokeWidth="5"><path d="M95 661v49M250 623v34M386 589v26M501 560v18M1345 661v49M1190 623v34M1054 589v26M939 560v18"/></g></svg><svg className="highway-reflections" viewBox="0 0 1440 800" preserveAspectRatio="none" aria-hidden="true">
  <defs>
    <clipPath id="wet-road-clip"><path d="M664 525H776L1345 800H95Z"/></clipPath>
    <linearGradient id="road-reflection" x1="0" y1="0" x2="0" y2="1">
      <stop stopColor="#ff9cbb" stopOpacity="0"/>
      <stop offset=".6" stopColor="#ff9cbb" stopOpacity=".25"/>
      <stop offset="1" stopColor="#ff9cbb" stopOpacity="0"/>
    </linearGradient>
  </defs>
  <g clipPath="url(#wet-road-clip)">
    {[570, 625, 682, 758, 815, 870].map((x,i)=><rect key={x} className="wet-road-flow" x={x} y={565} width={i%2 ? 2 : 3} height={55+i%3*14} fill="url(#road-reflection)" style={{animationDelay:`${-i*.61}s`}}/>)}
  </g>
</svg><svg className="lane-guides" viewBox="0 0 1440 800" preserveAspectRatio="none" aria-hidden="true">{[-1.5,-.5,.5,1.5].map((lane,i)=><g key={lane} className={i===0||i===3?'desktop-lane':''}>{Array.from({length:12},(_,j)=>{const d=.02+Math.pow(j/11,2)*.62,e=d+.007+d*.04;return <path key={j} d={`M${720+lane*1080*d} ${525+440*d}L${720+lane*1080*e} ${525+440*e}`} stroke="#d5bdcb" strokeWidth={.3+d*3} opacity=".24"/>;})}</g>)}</svg></>; }
