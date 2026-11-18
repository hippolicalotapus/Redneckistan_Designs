import test from 'node:test';import assert from 'node:assert/strict';import {readWishlist,writeWishlist} from '../catalogue/wishlist-storage.js';
const storage=()=>{const m=new Map();return {getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,v)}};
test('wishlist persists and restores valid product IDs',()=>{const s=storage();assert.equal(writeWishlist(s,new Set(['1-1','2-2'])),true);assert.deepEqual([...readWishlist(s,new Set(['1-1','2-2']))],['1-1','2-2']);});
test('stale IDs and corrupted storage are discarded',()=>{const s=storage();writeWishlist(s,new Set(['1-1','deleted']));assert.deepEqual([...readWishlist(s,new Set(['1-1']))],['1-1']);s.setItem('apparel-preview-wishlist-v1','{bad');assert.equal(readWishlist(s,new Set(['1-1'])).size,0)});
test('unavailable storage does not crash',()=>{const s={getItem(){throw Error('blocked')},setItem(){throw Error('blocked')}};assert.equal(readWishlist(s,new Set()).size,0);assert.equal(writeWishlist(s,new Set()),false)});

import {inspectWishlist} from '../catalogue/wishlist-storage.js';
test('stale and duplicate saved IDs report incomplete restoration while retaining valid items',()=>{const s=storage();s.setItem('apparel-preview-wishlist-v1',JSON.stringify(['1-1','deleted','1-1',null]));const result=inspectWishlist(s,new Set(['1-1']));assert.deepEqual([...result.saved],['1-1']);assert.equal(result.invalid,true);});
test('valid unique saved IDs do not warn',()=>{const s=storage();s.setItem('apparel-preview-wishlist-v1',JSON.stringify(['1-1','2-1']));assert.equal(inspectWishlist(s,new Set(['1-1','2-1'])).invalid,false);});
