import {validateCatalogue} from './catalogue.js';

// Keep the original 27-design launch register immutable. Additional products are
// separate, optional preview records until independently verified.
export function combineCatalogue(launch,additional=[]){
 validateCatalogue(launch);
 if(!Array.isArray(additional))throw Error('Additional products must be an array');
 const seen=new Set(launch.products.map(p=>p.id));
 const products=[...launch.products];
 for(const item of additional){
  if(!item||typeof item.id!=='string'||!item.id.trim())throw Error('Invalid additional product ID');
  if(seen.has(item.id))throw Error('Duplicate design ID');
  if(typeof item.workingLabel!=='string'||!item.workingLabel.trim())throw Error('Missing design label');
  if(!['mountain','artwear','sarcastabastard'].includes(item.group))throw Error('Invalid collection');
  if(item.brand!==(item.group==='sarcastabastard'?'Sarcastabastard':'One Heart'))throw Error('Brand mismatch');
  if(item.saleEnabled!==false||item.priceCad!==null)throw Error('Additional products must remain sale-disabled');
  seen.add(item.id);
  products.push({...item,saleEnabled:false,priceCad:null});
 }
 return {...launch,products};
}
