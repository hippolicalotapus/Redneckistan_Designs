import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const app=readFileSync(new URL('../app.js',import.meta.url),'utf8');
test('product details provide a direct accessible path to saved designs',()=>{
 assert.match(app,/viewSaved\.textContent='View saved designs'/);
 assert.match(app,/savedOnly=true;group='all';search\.value=''/);
 assert.match(app,/dialog\.close\(\);render\(\);savedToggle\.focus\(\)/);
 assert.match(app,/buy\.disabled=true/);
});
