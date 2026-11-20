import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('../app.js',import.meta.url),'utf8');
test('product details show position within current filtered results',()=>{
 assert.match(source,/Design '\+\(currentIndex\+1\)\+' of '\+position\.length/);
 assert.match(source,/detail\.append\(brand,heading,positionLabel,/);
});
