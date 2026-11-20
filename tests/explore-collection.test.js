import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const app=readFileSync(new URL('../app.js',import.meta.url),'utf8');
test('product details allow exploring the current collection without checkout',()=>{
 assert.match(app,/explore\.textContent='Explore this collection'/);
 assert.match(app,/group=p\.group;search\.value='';savedOnly=false/);
 assert.match(app,/dialog\.close\(\);render\(\);filters\.find/);
 assert.match(app,/buy\.disabled=true/);
});
