const KEY='apparel-preview-wishlist-v1';
export function readWishlist(storage,validIds){
 try {const raw=JSON.parse(storage.getItem(KEY)||'[]');return new Set(Array.isArray(raw)?raw.filter(id=>typeof id==='string'&&validIds.has(id)):[])} catch{return new Set()}
}
export function writeWishlist(storage,saved){try{storage.setItem(KEY,JSON.stringify([...saved]));return true}catch{return false}}
