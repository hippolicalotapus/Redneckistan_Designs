import test from 'node:test';
import assert from 'node:assert/strict';
import {auditSloganCandidates,normalizeSlogan} from '../scripts/slogan-collision.js';

test('normalizes case punctuation Unicode and whitespace without changing source',()=>{
 const source='  DO NOT leave unsupervised!!!  ';
 assert.equal(normalizeSlogan(source),'do not leave unsupervised');
 assert.equal(source,'  DO NOT leave unsupervised!!!  ');
 assert.equal(normalizeSlogan('I’m  not  allowed'),'i m not allowed');
});
test('flags duplicate wording and prefix variants without selecting a winner',()=>{
 const source=[
  {id:'lead-1',text:'Do not leave unsupervised.'},
  {id:'lead-2',text:'DO NOT LEAVE UNSUPERVISED!'},
  {id:'lead-3',text:'Do not leave unsupervised. Last time required a lawyer.'},
  {id:'lead-4',text:'Your daughter calls me daddy too.'}
 ];
 const before=structuredClone(source),report=auditSloganCandidates(source);
 assert.deepEqual(report.collisions,[
  {a:'lead-1',b:'lead-2',kind:'same-wording'},
  {a:'lead-1',b:'lead-3',kind:'possible-variant'},
  {a:'lead-2',b:'lead-3',kind:'possible-variant'}
 ]);
 assert.deepEqual(source,before);
 assert.equal(report.count,4);
 assert.equal(Object.hasOwn(report,'approved'),false);
});
test('unrelated slogans do not collide; invalid records are rejected',()=>{
 assert.deepEqual(auditSloganCandidates([{id:'a',text:'Karma is late'},{id:'b',text:'My credit score'}]).collisions,[]);
 assert.throws(()=>auditSloganCandidates([{id:'',text:'text'}]),/Candidate ID/);
 assert.throws(()=>auditSloganCandidates([{id:'a',text:''}]),/Candidate text/);
 assert.throws(()=>auditSloganCandidates(null),/array/);
});
test('duplicate evidence IDs are flagged independently of wording',()=>{
 assert.deepEqual(auditSloganCandidates([{id:'same',text:'First'},{id:'same',text:'Second'}]).collisions,[{a:'same',b:'same',kind:'duplicate-id'}]);
});
