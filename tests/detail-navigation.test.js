import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('../app.js',import.meta.url),'utf8');
test('details provide previous and next navigation within the current filtered order',()=>{
 assert.match(source,/function visibleProducts\(/);
 assert.match(source,/Previous design/);
 assert.match(source,/Next design/);
 assert.match(source,/openDetails\(adjacent\)/);
});
