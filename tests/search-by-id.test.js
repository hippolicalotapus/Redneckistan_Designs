import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {searchProducts} from '../catalogue/discovery.js';
const products=JSON.parse(readFileSync(new URL('../catalogue/launch-27.json',import.meta.url))).products;
test('a customer can find a design using its exported reference ID',()=>{
 const target=products.find(p=>p.id==='3-7');
 assert.ok(target);
 assert.deepEqual(searchProducts(products,' 3-7 ').map(p=>p.id),['3-7']);
 assert.deepEqual(searchProducts(products,'3-70'),[]);
});
test('product details visibly identify the reference used in saved-list exports',()=>{
 const app=readFileSync(new URL('../app.js',import.meta.url),'utf8');
 assert.match(app,/Reference: '\+p\.id/);
});
