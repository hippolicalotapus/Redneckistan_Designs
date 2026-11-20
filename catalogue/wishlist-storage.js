const KEY='apparel-preview-wishlist-v1';
export function readWishlist(storage,validIds){
 try {const raw=JSON.parse(storage.getItem(KEY)||'[]');return new Set(Array.isArray(raw)?raw.filter(id=>typeof id==='string'&&validIds.has(id)):[])} catch{return new Set()}
}
export function writeWishlist(storage,saved){try{storage.setItem(KEY,JSON.stringify([...saved]));return true}catch{return false}}

// Distinguish an empty wishlist from data that cannot be restored.
export function inspectWishlist(storage,validIds){
 try {
  const stored=storage.getItem(KEY);
  if(stored===null)return {saved:new Set(),invalid:false};
  const raw=JSON.parse(stored);
  if(!Array.isArray(raw))return {saved:new Set(),invalid:true};
  const retained=raw.filter(id=>typeof id==='string'&&validIds.has(id));
  return {saved:new Set(retained),invalid:retained.length!==raw.length||new Set(retained).size!==retained.length};
 }catch{return {saved:new Set(),invalid:true}}
}
