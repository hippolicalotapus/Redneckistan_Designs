const KEY='apparel-design-studio-draft-v1';
export const BRANDS=['One Heart','Sarcastabastard'];
export const SIDES=['front','back'];
const clamp=(value,min,max,fallback)=>{if(value===null||value===undefined||value==='')return fallback;const n=Number(value);return Number.isFinite(n)?Math.max(min,Math.min(max,n)):fallback};
export function normalizePlacement(input={}){return {scale:clamp(input.scale,20,100,50),x:clamp(input.x,0,100,50),y:clamp(input.y,0,100,50),slogan:typeof input.slogan==='string'?input.slogan.slice(0,140):''}}
export function normalizeDraft(input={}){
 const brand=BRANDS.includes(input.brand)?input.brand:'One Heart';
 const side=SIDES.includes(input.side)?input.side:'front';
 const legacy=normalizePlacement(input);
 const placements={front:normalizePlacement(input.placements?.front??(side==='front'?legacy:{})),back:normalizePlacement(input.placements?.back??(side==='back'?legacy:{}))};
 return {brand,side,placements,...placements[side]};
}
export function updateDraft(input,patch){const draft=normalizeDraft(input);const nextSide=SIDES.includes(patch.side)?patch.side:draft.side;const placements={...draft.placements};if(['scale','x','y','slogan'].some(k=>Object.hasOwn(patch,k))){placements[nextSide]=normalizePlacement({...placements[nextSide],...patch})}
 return normalizeDraft({brand:patch.brand??draft.brand,side:nextSide,placements});
}
export function readDraft(storage){try{return normalizeDraft(JSON.parse(storage.getItem(KEY)||'{}'))}catch{return normalizeDraft()}}
export function saveDraft(storage,draft){try{storage.setItem(KEY,JSON.stringify(normalizeDraft(draft)));return true}catch{return false}}
