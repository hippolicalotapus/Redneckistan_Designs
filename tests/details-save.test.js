import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const app=readFileSync(new URL('../app.js',import.meta.url),'utf8');
test('product details offer a saved-design action without enabling checkout',()=>{
 assert.match(app,/function openDetails\(p\)/);
 assert.match(app,/detailSave\.addEventListener\('click'/);
 assert.match(app,/detailSave\.setAttribute\('aria-pressed'/);
 assert.match(app,/buy\.disabled=true/);
});
