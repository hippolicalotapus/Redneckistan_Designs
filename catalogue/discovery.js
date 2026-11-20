export function searchProducts(products,query){const q=String(query||'').trim().toLocaleLowerCase();return q?products.filter(p=>[p.workingLabel,p.brand,p.group,p.id].some(v=>String(v).toLocaleLowerCase().includes(q))):products;}
export function toggleSaved(saved,id){const next=new Set(saved);if(next.has(id))next.delete(id);else next.add(id);return next;}
export function filterSaved(products,saved,only){return only?products.filter(p=>saved.has(p.id)):products;}

// Stable, non-mutating catalogue ordering for customer browsing.
export function sortProducts(products, order="featured") {
 const items=[...products];
 if(order==="name-asc"||order==="name-desc") {
  items.sort((a,b)=>String(a.workingLabel).localeCompare(String(b.workingLabel),"en",{sensitivity:"base",numeric:true}) || String(a.id).localeCompare(String(b.id)));
  if(order==="name-desc") items.reverse();
 }
 return items;
}
