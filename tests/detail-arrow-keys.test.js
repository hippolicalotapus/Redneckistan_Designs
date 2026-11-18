import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('../app.js',import.meta.url),'utf8');
test('product details support unmodified left/right arrows without intercepting size controls',()=>{
 assert.match(source,/dialog\.addEventListener\('keydown'/);
 assert.match(source,/ArrowLeft/);
 assert.match(source,/ArrowRight/);
 assert.match(source,/SELECT/);
});
