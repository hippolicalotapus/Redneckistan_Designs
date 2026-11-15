import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeDraft,readDraft,saveDraft} from '../studio/draft.js';
test('draft bounds protect layout and brand separation',()=>{
 const d=normalizeDraft({brand:'unknown',side:'invalid',scale:999,x:-20,y:NaN,slogan:'x'.repeat(200)});
 assert.deepEqual([d.brand,d.side,d.scale,d.x,d.y,d.slogan.length],['One Heart','front',100,0,50,140]);
 assert.equal(normalizeDraft({brand:'Sarcastabastard',side:'back',scale:36}).brand,'Sarcastabastard');
});
test('draft persists locally without publication or checkout',()=>{
 const data=new Map(),storage={getItem:k=>data.get(k),setItem:(k,v)=>data.set(k,v)};
 assert.equal(saveDraft(storage,{brand:'Sarcastabastard',scale:42,slogan:'Draft only'}),true);
 assert.equal(readDraft(storage).slogan,'Draft only');
 assert.equal(readDraft(storage).scale,42);
 assert.equal(readDraft({getItem(){throw Error('blocked')}}).brand,'One Heart');
 assert.equal(saveDraft({setItem(){throw Error('blocked')}},{}),false);
});

test('front and back retain independent layouts and text',async()=>{
 const {updateDraft}=await import('../studio/draft.js');
 let d=updateDraft({}, {side:'front',slogan:'Front draft',scale:35,x:25,y:30});
 d=updateDraft(d,{side:'back',slogan:'Back draft',scale:70,x:75,y:80});
 assert.equal(d.placements.front.slogan,'Front draft');
 assert.equal(d.placements.back.slogan,'Back draft');
 d=updateDraft(d,{side:'front'});
 assert.equal(d.slogan,'Front draft');
 assert.equal(d.scale,35);
 d=updateDraft(d,{side:'back'});
 assert.equal(d.slogan,'Back draft');
 assert.equal(d.scale,70);
});
test('legacy draft is migrated without losing original placement',async()=>{
 const {normalizeDraft}=await import('../studio/draft.js');
 const d=normalizeDraft({brand:'Sarcastabastard',side:'back',slogan:'Legacy',scale:41,x:33,y:66});
 assert.equal(d.placements.back.slogan,'Legacy');
 assert.equal(d.placements.front.slogan,'');
});
