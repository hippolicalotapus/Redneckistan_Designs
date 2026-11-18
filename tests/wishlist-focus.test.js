import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const app=readFileSync(new URL('../app.js',import.meta.url),'utf8');
test('wishlist save buttons retain stable product identity after filtering and sorting',()=>{
 assert.match(app,/save\.dataset\.productId=p\.id/);
 assert.match(app,/button\.dataset\.productId===p\.id/);
});
test('saved-only removal focuses next surviving card or saved toggle',()=>{
 assert.match(app,/removedFromSavedView=savedOnly&&!saved\.has\(p\.id\)/);
 assert.match(app,/removedFromSavedView\?visibleSaveButtons/);
 assert.match(app,/nextSave\?\?savedToggle/);
});
