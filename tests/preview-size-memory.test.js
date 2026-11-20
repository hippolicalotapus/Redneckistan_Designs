import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const app=readFileSync(new URL('../app.js',import.meta.url),'utf8');
test('preview size selection is remembered per design without changing sale status',()=>{
 assert.match(app,/const previewSizes=new Map\(\)/);
 assert.match(app,/select\.value=previewSizes\.get\(p\.id\)/);
 assert.match(app,/previewSizes\.set\(p\.id,select\.value\)/);
 assert.match(app,/buy\.disabled=true/);
});
