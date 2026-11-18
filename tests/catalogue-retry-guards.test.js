import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const source=readFileSync(new URL('../app.js',import.meta.url),'utf8');
const catalogue=JSON.parse(readFileSync(new URL('../catalogue/launch-27.json',import.meta.url),'utf8'));

test('catalogue loading failure offers a retry that calls init',()=>{
 assert.match(source,/if\(!res\.ok\)throw Error\('Catalogue unavailable'\)/);
 assert.match(source,/retry\.textContent='Retry catalogue'/);
 assert.match(source,/retry\.addEventListener\('click',init,\{once:true\}\)/);
});
test('retry guards concurrent requests and registers controls once',()=>{
 assert.match(source,/if\(catalogueLoading\)return;catalogueLoading=true/);
 assert.match(source,/finally\{catalogueLoading=false\}/);
 assert.match(source,/if\(!catalogueListenersBound\)\{catalogueListenersBound=true/);
});
test('all launch positions remain sale-disabled',()=>{
 assert.equal(catalogue.products.length,27);
 assert.ok(catalogue.products.every(p=>p.saleEnabled===false));
});
