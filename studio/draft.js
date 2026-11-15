const KEY='apparel-design-studio-draft-v1';
export const BRANDS=['One Heart','Sarcastabastard'];
export const SIDES=['front','back'];
export function normalizeDraft(input={}){
 const brand=BRANDS.includes(input.brand)?input.brand:'One Heart';
 const side=SIDES.includes(input.side)?input.side:'front';
 const scale=Number(input.scale);
 const x=Number(input.x),y=Number(input.y);
 return {brand,side,scale:Number.isFinite(scale)?Math.max(20,Math.min(100,scale)):50,
 x:Number.isFinite(x)?Math.max(0,Math.min(100,x)):50,
 y:Number.isFinite(y)?Math.max(0,Math.min(100,y)):50,
 slogan:typeof input.slogan==='string'?input.slogan.slice(0,140):''};
}
export function readDraft(storage){try{return normalizeDraft(JSON.parse(storage.getItem(KEY)||'{}'))}catch{return normalizeDraft()}}
export function saveDraft(storage,draft){try{storage.setItem(KEY,JSON.stringify(normalizeDraft(draft)));return true}catch{return false}}
