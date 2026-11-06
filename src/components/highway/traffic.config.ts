export type Vehicle = 'sedan'|'hatch'|'taxi'|'camper'|'truck'|'swiftship-van'|'rickshaw';
export const ONCOMING_SIDE: 'left'|'right' = 'left';
export const TRAFFIC = {
 sedan:{height:1.4,aspect:620/338,weight:.22,fudge:1,lights:[8,43,53,8]},
 hatch:{height:1.45,aspect:467/321,weight:.2,fudge:1,lights:[5,47,56,10]},
 taxi:{height:1.6,aspect:639/441,weight:.16,fudge:1,lights:[5,66,53,10]},
 camper:{height:2.7,aspect:511/483,weight:.1,fudge:1,lights:[6,63,61,8]},
 truck:{height:3.4,aspect:611/700,weight:.1,fudge:1,lights:[6,60,78,5]},
 'swiftship-van':{height:2.5,aspect:582/599,weight:.04,fudge:1,lights:[3,65,62,12]},
 rickshaw:{height:1.75,aspect:366/467,weight:.04,fudge:1,lights:[9,78,60,9]}
} as const;
export const VEHICLES=Object.keys(TRAFFIC) as Vehicle[];
export const HIGHWAY_LIMITS={traffic:10,mobileTraffic:4,lamps:8,mobileLamps:4,oncoming:6,mobileOncoming:3};
