import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {sortProducts} from '../catalogue/discovery.js';
const products=JSON.parse(readFileSync(new URL('../catalogue/launch-27.json',import.meta.url))).products;
test('featured preserves catalogue order and input',()=>{const result=sortProducts(products);assert.deepEqual(result,products);assert.notStrictEqual(result,products)});
test('alphabetical sorting is reversible and nonmutating',()=>{const original=products.map(p=>p.id);const asc=sortProducts(products,'name-asc');const desc=sortProducts(products,'name-desc');assert.deepEqual(desc.map(p=>p.id),asc.map(p=>p.id).reverse());assert.deepEqual(products.map(p=>p.id),original)});
test('sorting never enables checkout',()=>{sortProducts(products,'name-asc');assert.ok(products.every(p=>p.saleEnabled===false&&p.priceCad===null))});
