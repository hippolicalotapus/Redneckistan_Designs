import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('../app.js',import.meta.url),'utf8');
test('empty saved list provides a browse-all recovery action',()=>{
 assert.match(source,/if\(savedOnly&&saved.size===0\)/);
 assert.match(source,/browse.textContent='Browse all designs'/);
 assert.match(source,/savedOnly=false;group='all';search.value=''/);
 assert.match(source,/render\(\);savedToggle.focus\(\)/);
});
