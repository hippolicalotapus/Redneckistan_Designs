export function searchProducts(products,query){const q=String(query||'').trim().toLocaleLowerCase();return q?products.filter(p=>[p.workingLabel,p.brand,p.group].some(v=>String(v).toLocaleLowerCase().includes(q))):products;}
export function toggleSaved(saved,id){const next=new Set(saved);if(next.has(id))next.delete(id);else next.add(id);return next;}
export function filterSaved(products,saved,only){return only?products.filter(p=>saved.has(p.id)):products;}
