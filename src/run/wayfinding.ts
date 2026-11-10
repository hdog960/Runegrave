/** Gate A clarity: curated cardinal exits, NOT a v0.10 procedural room graph. */
export const EXIT_DIRECTIONS=['north','west','south','east'] as const;
export type ExitDirection=typeof EXIT_DIRECTIONS[number];
const ROUTE_DIRECTIONS:readonly ExitDirection[]=['north','west','south','east','south','north','west','east'];
export const directionForChamber=(index:number):ExitDirection=>{
  if(!Number.isSafeInteger(index)||index<0||index>=ROUTE_DIRECTIONS.length)throw new RangeError('Invalid First Soul chamber');
  return ROUTE_DIRECTIONS[index]!;
};
export const EXIT_LABELS:Readonly<Record<ExitDirection,Readonly<{label:string;arrow:string;short:string}>>>=Object.freeze({
  north:{label:'NORTH',arrow:'↑',short:'UP'},
  south:{label:'SOUTH',arrow:'↓',short:'DOWN'},
  east:{label:'EAST',arrow:'→',short:'RIGHT'},
  west:{label:'WEST',arrow:'←',short:'LEFT'}
});
