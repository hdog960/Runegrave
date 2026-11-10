/** Gate A warning shapes: urgency is encoded as solid beats, not only red color.
 * This is presentation-only; AI windup and damage timing never change here.
 */
export type WarningBeat=0|1|2|3;
export function warningBeat(remainingSeconds:number):WarningBeat {
  if(!Number.isFinite(remainingSeconds)||remainingSeconds<0)throw new RangeError('Invalid warning time');
  return remainingSeconds>.65?0:remainingSeconds>.40?1:remainingSeconds>=.20?2:3;
}
/** Keep both the warning inscription and its beat bar inside the camera. */
export function warningLabelY(enemyY:number,radius:number,height:number,warden:boolean):number {
  if(![enemyY,radius,height].every(Number.isFinite)||radius<0||height<70)throw new RangeError('Invalid warning frame');
  const intended=enemyY-radius-(warden?38:27);
  return Math.max(19,Math.min(height-9,intended));
}
/** Three separated countdown blocks, high contrast even without red/green cues. */
export function drawWarningBeats(g:CanvasRenderingContext2D,x:number,baseline:number,remainingSeconds:number,urgentColor:string):void {
  const filled=warningBeat(remainingSeconds);
  g.save();
  for(let i=0;i<3;i++){
    g.fillStyle=i<filled?urgentColor:'#354448';
    g.fillRect(Math.round(x-11+i*8),Math.round(baseline),6,3);
    g.strokeStyle='#e1c8a2';g.lineWidth=.5;g.strokeRect(Math.round(x-11+i*8),Math.round(baseline),6,3);
  }
  g.restore();
}
