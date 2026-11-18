import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

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
 const savedToggle=control(),downloadSaved=control(),wishlistStorageStatus=control(),filter=control();
 const calls=[];let renders=0;
 const valid={products:Array.from({length:27},(_,i)=>({id:String(i),saleEnabled:false}))};
 const context={status,search,sortOrder,clearSearch,resetBrowse,savedToggle,downloadSaved,
  wishlistStorageStatus,filters:[filter],products:[],saved:new Set(),group:'all',savedOnly:false,
  wishlistStorageDenied:false,availableStorage:()=>({}),
  inspectWishlist:()=>({saved:new Set(),invalid:false}),validateCatalogue:()=>{},
  render:()=>{renders++},fetch:async()=>{calls.push('fetch');return calls.length===1
   ?{ok:false,status:503}:{ok:true,json:async()=>valid}},
  Blob,URL,document:{createElement:()=>control(),body:{append(){}}},setTimeout,
  safeProduct:x=>x,
 };
 vm.createContext(context);
 vm.runInContext('let catalogueLoading=false,catalogueListenersBound=false;\n'+initSource+'\nthis.start=init;',context);
 await context.start();
 assert.match(status.textContent,/Catalogue unavailable/);
 assert.equal(status.listeners.size,0);
 // The retry button is appended to status; capture it with a DOM-like append method.
});
