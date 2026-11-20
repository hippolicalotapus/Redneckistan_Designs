import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {tmpdir} from 'node:os';
import {fileURLToPath} from 'node:url';
const catalogue=JSON.parse(readFileSync(new URL('../catalogue/launch-27.json',import.meta.url)));
const script=new URL('../scripts/sku-readiness.js',import.meta.url);
const load=()=>import(script);

// Catches a CLI that fails to run, ignores the selected slot, or depends on cwd.
test('offline CLI reports default and selected mountain design from any directory',()=>{
 for(const [args,id,label] of [[[],'1-1','Mount Edith Cavell'],[['1-2'],'1-2','Mountain concept 2']]){
  const result=spawnSync(process.execPath,[fileURLToPath(script),...args],{cwd:tmpdir(),encoding:'utf8'});
  assert.equal(result.status,0,result.stderr);
  assert.match(result.stdout,new RegExp(id));assert.ok(result.stdout.includes(label));
  assert.match(result.stdout,/not an approved SKU/i);
  assert.match(result.stdout,/not evidenced in this repository/i);
  assert.match(result.stdout,/priceCad: null/);assert.match(result.stdout,/saleEnabled: false/);
 }
});

// Catches reports that approve a slot, omit a production gate, or invent a price.
test('builder identifies existing slot and keeps all unsupported production evidence missing',async()=>{
 const {buildReadinessReport}=await load();const report=buildReadinessReport(catalogue);
 assert.deepEqual(report.design,{id:'1-1',brand:'One Heart',workingLabel:'Mount Edith Cavell',assessment:'hoodie',sku:null});
 assert.deepEqual(report.catalogueState,{approved:false,artworkVerified:false,supplierQuoteVerified:false,saleEnabled:false,priceCad:null});
 assert.deepEqual(report.missingEvidence.map(x=>x.category),['garment','artwork','dimensions','quote','landed-cost','sample-proof']);
 assert.ok(report.missingEvidence.every(x=>x.status==='not evidenced in this repository'&&x.needed.length>0));
 assert.match(report.quoteContext,/generic/i);assert.match(report.quoteContext,/not a verified quote for this design/i);
 assert.ok(report.sources.includes('docs/27-design-launch-register.md'));
 assert.equal(buildReadinessReport(catalogue,'1-9').design.workingLabel,'Mountain concept 9');
 const renamed=structuredClone(catalogue);renamed.products[0].workingLabel='Recovered working label';
 assert.equal(buildReadinessReport(renamed).design.workingLabel,'Recovered working label');
});

// Catches accidental mutation of catalogue records or returned references to input.
test('report cannot mutate catalogue or reuse a previous result',async()=>{
 const {buildReadinessReport}=await load();const input=structuredClone(catalogue);const before=structuredClone(input);
 const first=buildReadinessReport(input);first.design.workingLabel='changed';first.catalogueState.saleEnabled=true;first.missingEvidence.length=0;
 assert.deepEqual(input,before);assert.equal(buildReadinessReport(input).missingEvidence.length,6);
});

// Catches bypass of catalogue guards and silent fallback for an unknown design.
test('invalid catalogue, unknown ID and designs outside the mountain scope are rejected',async()=>{
 const {buildReadinessReport}=await load();
 assert.throws(()=>buildReadinessReport(catalogue,'missing'),/Unknown design ID/);
 assert.throws(()=>buildReadinessReport(catalogue,'2-1'),/One Heart mountain/);
 for(const [key,value] of [['approved',true],['artworkVerified',true],['supplierQuoteVerified',true],['saleEnabled',true],['priceCad',25]]){
  const bad=structuredClone(catalogue);bad.products[0][key]=value;assert.throws(()=>buildReadinessReport(bad),/Unverified product must be disabled/);
 }
});

test('CLI errors identify unknown IDs without emitting a report',()=>{
 const result=spawnSync(process.execPath,[fileURLToPath(script),'missing'],{encoding:'utf8'});
 assert.equal(result.status,1);assert.equal(result.stdout,'');assert.match(result.stderr,/Unknown design ID: missing/);
});
