import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeBag,addPreviewLine,updatePreviewQuantity,removePreviewLine,readPreviewBag,writePreviewBag} from '../catalogue/preview-bag.js';
const ids=new Set(['one-heart','sarcastabastard']);
const line=(id='one-heart',size='M',quantity=1)=>({id,size,quantity});
test('same design and size merge; different sizes and brands stay separate',()=>{
 let bag=addPreviewLine([],line(),ids);
 bag=addPreviewLine(bag,line('one-heart','M',2),ids);
 bag=addPreviewLine(bag,line('one-heart','L'),ids);
 bag=addPreviewLine(bag,line('sarcastabastard'),ids);
 assert.deepEqual(bag,[line('one-heart','M',3),line('one-heart','L'),line('sarcastabastard')]);
});
test('invalid IDs, sizes and quantities cannot become bag lines',()=>{
 for(const item of [line('missing'),line('one-heart','XXXL'),line('one-heart','M',0),line('one-heart','M',-1),line('one-heart','M',1.5),line('one-heart','M',11),line('one-heart','M','2'),null]){
  assert.deepEqual(normalizeBag([item],ids),[]);
  assert.throws(()=>addPreviewLine([],item,ids));
 }
});
test('quantity updates are bounded, immutable and cannot invent items',()=>{
 const bag=[line()];const changed=updatePreviewQuantity(bag,'one-heart','M',4,ids);
 assert.deepEqual(changed,[line('one-heart','M',4)]);assert.deepEqual(bag,[line()]);
 for(const quantity of [0,11,1.2,NaN])assert.throws(()=>updatePreviewQuantity(bag,'one-heart','M',quantity,ids));
 assert.throws(()=>updatePreviewQuantity(bag,'missing','M',2,ids));
 assert.throws(()=>addPreviewLine([line('one-heart','M',10)],line(),ids));
});
test('corrupt and stale storage are discarded; duplicates remain bounded',()=>{
 assert.deepEqual(readPreviewBag({getItem:()=>'{broken'},ids),[]);
 assert.deepEqual(readPreviewBag({getItem:()=>JSON.stringify({items:[line()]})},ids),[]);
 assert.deepEqual(normalizeBag([line('old'),line('one-heart','M',9),line('one-heart','M',9)],ids),[line('one-heart','M',10)]);
});
test('stored prices, names and sale permissions are never retained',()=>{
 const malicious={...line(),priceCad:0.01,saleEnabled:true,approved:true,name:'Injected',checkoutUrl:'https://invalid.example'};
 const bag=readPreviewBag({getItem:()=>JSON.stringify([malicious])},ids);
 assert.deepEqual(bag,[line()]);
 let written;assert.equal(writePreviewBag({setItem:(key,value)=>{written=value}},[malicious],ids),true);
 assert.deepEqual(JSON.parse(written),[line()]);
});
test('storage errors do not lose the in-memory selection',()=>{
 const bag=[line()];const blocked={getItem(){throw Error('blocked')},setItem(){throw Error('blocked')}};
 assert.deepEqual(readPreviewBag(blocked,ids),[]);assert.equal(writePreviewBag(blocked,bag,ids),false);
 assert.deepEqual(bag,[line()]);
});
test('bag persists and removes the selected size without touching other lines',()=>{
 const map=new Map(),storage={getItem:key=>map.get(key),setItem:(key,value)=>map.set(key,value)};
 const bag=[line(),line('one-heart','L'),line('sarcastabastard')];
 assert.equal(writePreviewBag(storage,bag,ids),true);assert.deepEqual(readPreviewBag(storage,ids),bag);
 const next=removePreviewLine(bag,'one-heart','M',ids);
 assert.deepEqual(next,[line('one-heart','L'),line('sarcastabastard')]);
 assert.equal(writePreviewBag(storage,[],ids),true);assert.deepEqual(readPreviewBag(storage,ids),[]);
});
