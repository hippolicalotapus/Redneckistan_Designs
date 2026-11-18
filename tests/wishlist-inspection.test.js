import test from 'node:test';
import assert from 'node:assert/strict';
import {inspectWishlist} from '../catalogue/wishlist-storage.js';
const validIds=new Set(['one','two']);
test('missing wishlist is a valid empty state',()=>{const r=inspectWishlist({getItem:()=>null},validIds);assert.equal(r.invalid,false);assert.equal(r.saved.size,0)});
test('malformed saved wishlist is reported rather than silently treated as empty',()=>{const r=inspectWishlist({getItem:()=>'{'},validIds);assert.equal(r.invalid,true);assert.equal(r.saved.size,0)});
test('non-array storage is invalid',()=>{assert.equal(inspectWishlist({getItem:()=>'{"a":1}'},validIds).invalid,true)});
test('valid saved IDs restore and stale IDs are excluded',()=>{const r=inspectWishlist({getItem:()=>JSON.stringify(['one','stale','two'])},validIds);assert.equal(r.invalid,false);assert.deepEqual([...r.saved],['one','two'])});
test('denied storage access is reported',()=>{assert.equal(inspectWishlist({getItem:()=>{throw Error('denied')}},validIds).invalid,true)});
