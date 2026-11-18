import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const app=readFileSync(new URL('../app.js',import.meta.url),'utf8');
test('saved list download is a disabled-by-default native button',()=>assert.match(html,/<button id="downloadSaved" type="button" disabled>Download saved list<\/button>/));
test('download uses the saved ID set, not filtered visible products',()=>{assert.match(app,/products\.filter\(p=>saved\.has\(p\.id\)\)/);assert.match(app,/downloadSaved\.disabled=saved\.size===0/)});
test('download labels concepts as non-purchasable and produces text',()=>{assert.match(app,/Development preview only - products not for sale/);assert.match(app,/text\/plain;charset=utf-8/);assert.match(app,/redneckistan-saved-designs\.txt/)});
test('saved export does not change wishlist persistence',()=>{const fn=app.match(/downloadSaved\.addEventListener\('click',[^\n]*/)?.[0]??'';assert.doesNotMatch(fn,/writeWishlist|toggleSaved|localStorage/)});
