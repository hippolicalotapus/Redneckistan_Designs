import test from 'node:test';
import assert from 'node:assert/strict';
import {auditSloganCandidates} from '../scripts/slogan-collision.js';

// Historical leads from docs/SARCASTABASTARD_SLOGAN_RECOVERY_2026-11-18.md.
// This fixture does not assert product approval or a catalogue slot assignment.
const leads = [
 ['lead-01','Do not leave unsupervised.'],
 ['lead-02','Do not leave unsupervised. Last time required a lawyer.'],
 ['lead-03','I was going to wait for karma, but then I decided to identify as karma.'],
 ['lead-04','Your daughter calls me daddy too.'],
 ['lead-05','I came. I saw. I made it awkward.'],
 ['lead-06',"I'm not allowed near the suggestion box anymore. Apparently, 'fuck off' isn't a business strategy."],
 ['lead-07',"I don't have a drinking problem. I have a problem with what I do after drinking."],
 ['lead-08',"I like my relationships like my browser history. Complicated, questionable, and nobody else's fucking business."],
 ['lead-09','She told me to talk dirty. So I explained my credit score.'],
 ['lead-10',"I'm not saying I'm your stepdad. I'm just saying your mom knows my Wi-Fi password."],
 ['lead-11',"I'm not a homewrecker. I just provide free structural inspections."],
 ['lead-12','My dating history is proof that God has a drinking problem.'],
 ['lead-13','Stop inbreeding. Ban country music.'],
 ['lead-14','I fuck up everything your sleep schedule could be next.'],
 ['gim-SB-T01','I FUCK UP EVERYTHING'],
].map(([id,text])=>({id,text}));

test('historical candidates have two prefix variants and no exact wording duplicates',()=>{
 const original=structuredClone(leads);
 const result=auditSloganCandidates(leads);
 assert.equal(result.count,15);
 assert.deepEqual(result.collisions,[
  {a:'lead-01',b:'lead-02',kind:'possible-variant'},
  {a:'lead-14',b:'gim-SB-T01',kind:'possible-variant'}
 ]);
 assert.deepEqual(leads,original);
});

test('historical audit never assigns approvals or sale slots',()=>{
 const result=auditSloganCandidates(leads);
 assert.equal(Object.hasOwn(result,'approved'),false);
 assert.equal(Object.hasOwn(result,'slots'),false);
 assert.equal(Object.hasOwn(result,'saleEnabled'),false);
});
