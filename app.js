import { validateCatalogue, filterProducts, safeProduct } from './catalogue/catalogue.js';
const grid=document.getElementById('catalogue');
const status=document.getElementById('status');
const buttons=[...document.querySelectorAll('[data-filter]')];
let products=[];
function render(filter='all'){
  const visible=filterProducts(products,filter);
  grid.replaceChildren();
  for(const item of visible){
    const product=safeProduct(item);
    const card=document.createElement('article');card.className=`product ${product.group}`;
    const art=document.createElement('div');art.className='art';art.textContent='ARTWORK PENDING';art.setAttribute('aria-label','Original artwork not yet verified');
    const details=document.createElement('div');details.className='details';
    const brand=document.createElement('small');brand.textContent=product.brand;
    const name=document.createElement('h2');name.textContent=product.workingLabel;
    const note=document.createElement('p');note.textContent='Concept label · awaiting artwork and supplier verification';
    const buy=document.createElement('button');buy.className='buy';buy.disabled=true;buy.type='button';buy.textContent='Not available';
    details.append(brand,name,note,buy);card.append(art,details);grid.append(card);
  }
  status.textContent=`Showing ${visible.length} of ${products.length} design positions · no purchases enabled`;
}
async function init(){try{const response=await fetch('./catalogue/launch-27.json',{cache:'no-store'});if(!response.ok)throw Error('Catalogue unavailable');const data=await response.json();validateCatalogue(data);products=data.products;render();buttons.forEach(button=>button.addEventListener('click',()=>{buttons.forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});render(button.dataset.filter);}));}catch(e){status.textContent='Catalogue preview unavailable: '+e.message;}}
init();
