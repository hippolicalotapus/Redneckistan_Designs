import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const app=readFileSync(new URL('../app.js',import.meta.url),'utf8');
test('product details provide copyable design reference with accessible feedback',()=>{
 assert.match(app,/copyReference\.textContent='Copy reference'/);
 assert.match(app,/navigator\.clipboard\.writeText\(p\.id\)/);
 assert.match(app,/copyFeedback\.setAttribute\('role','status'\)/);
});
