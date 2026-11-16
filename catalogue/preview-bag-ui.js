import {addPreviewLine,updatePreviewQuantity,removePreviewLine,readPreviewBag,writePreviewBag} from './preview-bag.js';

export function createPreviewBag(products,storage){
 const ids=new Set(products.map(p=>p.id)),byId=new Map(products.map(p=>[p.id,p]));
 const dialog=document.getElementById('previewBag'),list=document.getElementById('bagItems'),status=document.getElementById('bagStatus'),toggle=document.getElementById('bagToggle'),clear=document.getElementById('bagClear');
 let bag=readPreviewBag(storage,ids),durable=true;
 const element=(tag,text)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;return e;};
 function persist(){durable=writePreviewBag(storage,bag,ids);render();}
 function render(){
  list.replaceChildren();const count=bag.reduce((sum,row)=>sum+row.quantity,0);
  document.getElementById('bagCount').textContent=String(count);toggle.setAttribute('aria-label','Preview bag, '+count+' items');
  clear.disabled=!bag.length;
  status.textContent=durable?'Saved on this device when storage is available. Nothing is ordered or reserved.':'Local storage unavailable. This bag is kept only for this session.';
  if(!bag.length)list.append(element('p','Your preview bag is empty. Choose a design to try sizes and quantities.'));
  bag.forEach((row,index)=>{
   const product=byId.get(row.id),section=element('section');section.className='bag-item';
   const title=element('h3',product.workingLabel),brand=element('p',product.brand+' · Preview size '+row.size);
   const label=element('label','Quantity for '+product.workingLabel+' · '+row.size),input=element('input');
   input.id='bag-quantity-'+index;input.type='number';input.min='1';input.max='10';input.step='1';input.value=String(row.quantity);label.htmlFor=input.id;
   const message=element('p');message.setAttribute('role','status');
   const update=element('button','Update quantity');update.type='button';update.addEventListener('click',()=>{try{bag=updatePreviewQuantity(bag,row.id,row.size,Number(input.value),ids);persist();document.getElementById(input.id)?.focus();}catch(error){message.textContent=error.message;input.focus();}});
   const remove=element('button','Remove '+product.workingLabel+' · '+row.size);remove.type='button';remove.addEventListener('click',()=>{bag=removePreviewLine(bag,row.id,row.size,ids);persist();document.querySelector('#bagItems button')?.focus();if(!bag.length)document.getElementById('bagClose').focus();});
   section.append(title,brand,label,input,update,remove,message);list.append(section);
  });
 }
 toggle.disabled=false;toggle.addEventListener('click',()=>{render();dialog.showModal();});
 clear.addEventListener('click',()=>{bag=[];persist();document.getElementById('bagClose').focus();});
 render();
 return {add(id,size,quantity){bag=addPreviewLine(bag,{id,size,quantity},ids);persist();return durable;}};
}
