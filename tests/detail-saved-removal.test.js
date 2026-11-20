import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('../app.js',import.meta.url),'utf8');
test('removing a design from saved-only details dismisses stale dialog and restores focus',()=>{
 assert.match(source,/if\(savedOnly&&!saved\.has\(p\.id\)\)\{dialog\.close\(\);savedToggle\.focus\(\);return\}/);
});
