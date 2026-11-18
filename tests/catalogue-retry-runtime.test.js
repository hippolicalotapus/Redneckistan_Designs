import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {validateCatalogue} from '../catalogue/catalogue.js';

const source=readFileSync(new URL('../app.js',import.meta.url),'utf8');
const initSource=source.slice(source.indexOf('async function init()'),source.indexOf('\napplyStorefrontIdentity();'));
assert.ok(initSource.startsWith('async function init()'), 'catalogue initializer exists');

function control(){
 const listeners=new Map();
 return {listeners,dataset:{filter:'all'},value:'',textContent:'',disabled:false,
  addEventListener(type,callback){listeners.set(type,(listeners.get(type)||[]).concat(callback))},
  setAttribute(){},classList:{toggle(){}},focus(){},append(){},
 };
}

test('HTTP 503 retry recovers and registers storefront controls once',async()=>{
 const status=control(),search=control(),sortOrder=control(),clearSearch=control(),resetBrowse=control();
 let retryButton;
 status.append=(...items)=>{retryButton=items.find(item=>item?.listeners)};
 const savedToggle=control(),downloadSaved=control(),wishlistStorageStatus=control(),filter=control();
 const calls=[];let renders=0;
 const valid=JSON.parse(readFileSync(new URL('../catalogue/launch-27.json',import.meta.url),'utf8'));
 assert.equal(validateCatalogue(valid),true);
 const context={status,search,sortOrder,clearSearch,resetBrowse,savedToggle,downloadSaved,
  wishlistStorageStatus,filters:[filter],products:[],saved:new Set(),group:'all',savedOnly:false,
  wishlistStorageDenied:false,availableStorage:()=>({}),
  inspectWishlist:()=>({saved:new Set(),invalid:false}),validateCatalogue,
  render:()=>{renders++},fetch:async()=>{calls.push('fetch');return calls.length===1
   ?{ok:false,status:503}:{ok:true,json:async()=>valid}},
  Blob,URL,document:{createElement:()=>control(),body:{append(){}}},setTimeout,
  safeProduct:x=>x,
 };
 vm.createContext(context);
 vm.runInContext('let catalogueLoading=false,catalogueListenersBound=false;\n'+initSource+'\nthis.start=init;',context);
 await context.start();
 assert.match(status.textContent,/Catalogue unavailable/);
 assert.ok(retryButton, 'failure displays retry button');
 assert.equal(retryButton.textContent,'Retry catalogue');
 await retryButton.listeners.get('click')[0]();
 assert.equal(calls.length,2, 'failed fetch followed by successful retry');
 assert.equal(renders,1, 'successful catalogue renders');
 assert.equal(context.products.length,27);
 assert.ok(context.products.every(p=>p.saleEnabled===false));
 for(const c of [search,sortOrder,clearSearch,resetBrowse,savedToggle,downloadSaved,filter]){
  assert.equal([...c.listeners.values()].flat().length,1, 'control registered once');
 }
 await context.start();
 assert.equal(renders,2, 'subsequent reload renders');
 for(const c of [search,sortOrder,clearSearch,resetBrowse,savedToggle,downloadSaved,filter]){
  assert.equal([...c.listeners.values()].flat().length,1, 'reload does not duplicate handlers');
 }
});
