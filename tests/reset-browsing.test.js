import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const app=readFileSync(new URL('../app.js',import.meta.url),'utf8');
test('reset browsing is an accessible native button',()=>{assert.match(html,/<button id="resetBrowse" type="button" hidden>Reset browsing<\/button>/)});
test('reset clears search, sort, group, saved view without deleting wishlist',()=>{assert.match(app,/resetBrowse\.addEventListener\('click'/);assert.match(app,/sortOrder\.value='featured';group='all';savedOnly=false/);assert.doesNotMatch(app,/resetBrowse\.addEventListener\('click'[^\n]*writeWishlist/)});
test('reset restores active all filter and returns keyboard focus to search',()=>{assert.match(app,/const active=b\.dataset\.filter==='all'/);assert.match(app,/render\(\);search\.focus\(\)\}\)/)});
