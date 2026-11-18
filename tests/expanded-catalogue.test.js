import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {combineCatalogue} from '../catalogue/expanded-catalogue.js';
const launch=JSON.parse(readFileSync(new URL('../catalogue/launch-27.json',import.meta.url),'utf8'));
const extra={id:'extra-001',group:'artwear',brand:'One Heart',workingLabel:'Additional verified candidate',saleEnabled:false,priceCad:null};
test('additional previews expand beyond 27 without changing launch records',()=>{
 const result=combineCatalogue(launch,[extra]);
 assert.equal(result.products.length,28);
 assert.deepEqual(result.products.slice(0,27),launch.products);
 assert.equal(launch.products.length,27);
 assert.equal(result.products[27].saleEnabled,false);
});
test('reject duplicate additions and attempted sale activation',()=>{
 assert.throws(()=>combineCatalogue(launch,[{...extra,id:launch.products[0].id}]),/Duplicate/);
 assert.throws(()=>combineCatalogue(launch,[extra,extra]),/Duplicate/);
 assert.throws(()=>combineCatalogue(launch,[{...extra,saleEnabled:true}]),/sale-disabled/);
});
