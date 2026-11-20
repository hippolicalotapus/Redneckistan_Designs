const KEY='apparel-design-studio-draft-v1';
export const BRANDS=['Sarcastabastard'];
export const SIDES=['front','back'];
const clamp=(value,min,max,fallback)=>{if(value===null||value===undefined||value===''||typeof value==='boolean')return fallback;const n=Number(value);return Number.isFinite(n)?Math.max(min,Math.min(max,n)):fallback};
export function normalizePlacement(input={}){return {scale:clamp(input.scale,20,100,50),x:clamp(input.x,0,100,50),y:clamp(input.y,0,100,50),slogan:typeof input.slogan==='string'?input.slogan.slice(0,140):''}}
export function normalizeDraft(input={}){
 const brand='Sarcastabastard';
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

// Report damaged saved drafts instead of silently replacing them with defaults.
export function inspectDraft(storage){
 try {
  const raw=storage.getItem(KEY);
  if(raw===null)return {draft:normalizeDraft(),invalid:false};
  const parsed=JSON.parse(raw);
  if(!parsed||typeof parsed!=='object'||Array.isArray(parsed))return {draft:normalizeDraft(),invalid:true};
  const object=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
  let invalid=false;
  if(Object.hasOwn(parsed,'placements')&&!object(parsed.placements))invalid=true;
  if(Object.hasOwn(parsed,'side')&&!SIDES.includes(parsed.side))invalid=true;
  if(Object.hasOwn(parsed,'brand')&&parsed.brand!=='Sarcastabastard')invalid=true;
  for(const placement of [parsed,...SIDES.map(side=>parsed.placements?.[side]).filter(value=>value!==undefined)]){
   if(!object(placement)){invalid=true;continue}
   if(Object.hasOwn(placement,'slogan')&&(typeof placement.slogan!=='string'||placement.slogan.length>140))invalid=true;
   for(const key of ['scale','x','y'])if(Object.hasOwn(placement,key)&&placement[key]!==''&&placement[key]!==null){const raw=placement[key];const value=Number(raw);const min=key==='scale'?20:0;if(typeof raw==='boolean'||!Number.isFinite(value)||value<min||value>100)invalid=true;}
  }
  return {draft:normalizeDraft(parsed),invalid};
 }catch{return {draft:normalizeDraft(),invalid:true}}
}
