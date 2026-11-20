export const GROUPS=['mountain','artwear','sarcastabastard'];
export function validateCatalogue(data){
 if(!data||!Array.isArray(data.products)||data.products.length!==27)throw Error('Expected exactly 27 designs');
 const ids=new Set();
 for(const p of data.products){
  if(!GROUPS.includes(p.group))throw Error('Invalid collection');
  if(ids.has(p.id))throw Error('Duplicate design ID');ids.add(p.id);
  if(p.brand!==(p.group==='sarcastabastard'?'Sarcastabastard':'One Heart'))throw Error('Brand mismatch');
  if(p.saleEnabled!==false||p.approved!==false||p.artworkVerified!==false||p.supplierQuoteVerified!==false||p.priceCad!==null)throw Error('Unverified product must be disabled');
 }
 for(const group of GROUPS)if(data.products.filter(p=>p.group===group).length!==9)throw Error('Expected nine in '+group);
 return true;
}
export function filterProducts(products,group){if(group==='all')return products;if(!GROUPS.includes(group))return [];return products.filter(p=>p.group===group);}
export function safeProduct(product){return {...product,saleEnabled:false,priceCad:null};}
