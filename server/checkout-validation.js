// Import from a future server handler only. `trusted` must never come from the buyer.
const record=value=>value!==null&&typeof value==='object'&&!Array.isArray(value)&&[Object.prototype,null].includes(Object.getPrototypeOf(value));
const text=value=>typeof value==='string'&&value.trim().length>0&&value.length<=200;
const country=value=>typeof value==='string'&&/^[A-Z]{2}$/.test(value);
const quantity=value=>Number.isInteger(value)&&value>=1&&value<=10;
const permitted=(value,keys)=>Object.keys(value).every(key=>keys.includes(key));
const ready=product=>['approved','artworkVerified','supplierQuoteVerified','saleEnabled'].every(key=>product[key]===true)&&['artworkApprovalId','sampleApprovalId','supplierApprovalId'].every(key=>text(product[key]));

export function validateCheckoutRequest(input,trusted={}){
 const errors=[],fail=(code,line)=>errors.push(line===undefined?{code}:{code,line});
 const rejected=()=>({ok:false,errors});
 const release=trusted?.release,products=trusted?.products;
 if(!record(release)||!text(release.catalogueVersion)||release.currency!=='CAD'||!Array.isArray(release.countries)||!release.countries.every(country)||!Array.isArray(products)){
  fail('CONFIG_UNAVAILABLE');return rejected();
 }
 if(release.enabled!==true){fail('CHECKOUT_DISABLED');return rejected();}
 if(!record(input)){fail('INVALID_REQUEST');return rejected();}
 if(!permitted(input,['catalogueVersion','country','lines']))fail('UNSUPPORTED_FIELD');
 if(input.catalogueVersion!==release.catalogueVersion)fail('STALE_CATALOGUE');
 if(!country(input.country)||!release.countries.includes(input.country))fail('DESTINATION_UNAVAILABLE');
 if(!Array.isArray(input.lines)||input.lines.length<1||input.lines.length>50){fail('INVALID_LINES');return rejected();}
 const catalogue=new Map();
 for(const product of products){
  if(!record(product)||!text(product.id)||catalogue.has(product.id)){fail('CONFIG_UNAVAILABLE');return rejected();}
  catalogue.set(product.id,product);
 }
 const items=[];
 Array.from(input.lines).forEach((line,index)=>{
  if(!record(line)||!text(line.id)||!text(line.size)||!quantity(line.quantity)){fail('INVALID_LINE',index);return;}
  if(!permitted(line,['id','size','quantity'])){fail('UNSUPPORTED_FIELD',index);return;}
  const product=catalogue.get(line.id);
  if(!product){fail('UNKNOWN_PRODUCT',index);return;}
  if(!ready(product)){fail('PRODUCT_NOT_READY',index);return;}
  const matches=Array.isArray(product.variants)?product.variants.filter(v=>record(v)&&v.size===line.size):[];
  const variant=matches[0];
  if(matches.length!==1||variant.active!==true||!text(variant.supplierSku)||variant.currency!=='CAD'){
   fail('VARIANT_UNAVAILABLE',index);return;
  }
  if(!Array.isArray(variant.countries)||!variant.countries.every(country)||!variant.countries.includes(input.country)){
   fail('VARIANT_DESTINATION_UNAVAILABLE',index);return;
  }
  if(!Number.isSafeInteger(variant.unitAmount)||variant.unitAmount<=0){fail('INVALID_PRICE',index);return;}
  const existing=items.find(item=>item.id===line.id&&item.size===line.size);
  const totalQuantity=(existing?.quantity||0)+line.quantity;
  if(totalQuantity>10){fail('QUANTITY_LIMIT',index);return;}
  const lineAmount=variant.unitAmount*totalQuantity;
  if(!Number.isSafeInteger(lineAmount)){fail('INVALID_PRICE',index);return;}
  if(existing){existing.quantity=totalQuantity;existing.lineAmount=lineAmount;}
  else items.push({id:line.id,size:line.size,quantity:line.quantity,unitAmount:variant.unitAmount,lineAmount});
 });
 if(errors.length)return rejected();
 const subtotal=items.reduce((sum,item)=>sum+item.lineAmount,0);
 if(!Number.isSafeInteger(subtotal)){fail('INVALID_PRICE');return rejected();}
 return {ok:true,draft:{stage:'items-only',catalogueVersion:release.catalogueVersion,country:input.country,currency:'CAD',items,subtotal}};
}
