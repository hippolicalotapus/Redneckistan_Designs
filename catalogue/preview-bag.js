const KEY='apparel-preview-bag-v1';
export const PREVIEW_SIZES=Object.freeze(['S','M','L','XL','2XL']);
const validQuantity=q=>Number.isInteger(q)&&q>=1&&q<=10;
const validLine=(item,ids)=>item&&typeof item.id==='string'&&ids.has(item.id)&&PREVIEW_SIZES.includes(item.size)&&validQuantity(item.quantity);
export function normalizeBag(input,ids){
 if(!Array.isArray(input))return [];
 const result=[];
 for(const item of input.slice(0,512)){
  if(!validLine(item,ids))continue;
  const existing=result.find(row=>row.id===item.id&&row.size===item.size);
  if(existing)existing.quantity=Math.min(10,existing.quantity+item.quantity);
  else result.push({id:item.id,size:item.size,quantity:item.quantity});
 }
 return result;
}
export function addPreviewLine(input,item,ids){
 if(!validLine(item,ids))throw Error('Choose a preview size and a whole quantity from 1 to 10.');
 const bag=normalizeBag(input,ids),existing=bag.find(row=>row.id===item.id&&row.size===item.size);
 if(existing){if(existing.quantity+item.quantity>10)throw Error('Keep each design and size to 10 items or fewer.');existing.quantity+=item.quantity;}
 else bag.push({id:item.id,size:item.size,quantity:item.quantity});
 return bag;
}
export function updatePreviewQuantity(input,id,size,quantity,ids){
 if(!validQuantity(quantity))throw Error('Enter a whole quantity from 1 to 10.');
 const bag=normalizeBag(input,ids),existing=bag.find(row=>row.id===id&&row.size===size);
 if(!existing)throw Error('This selection is no longer in the preview bag.');
 existing.quantity=quantity;return bag;
}
export function removePreviewLine(input,id,size,ids){return normalizeBag(input,ids).filter(row=>row.id!==id||row.size!==size)}
export function readPreviewBag(storage,ids){try{const raw=storage.getItem(KEY)||'[]';return raw.length>100000?[]:normalizeBag(JSON.parse(raw),ids)}catch{return []}}
export function writePreviewBag(storage,bag,ids){try{storage.setItem(KEY,JSON.stringify(normalizeBag(bag,ids)));return true}catch{return false}}
