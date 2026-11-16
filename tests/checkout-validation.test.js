import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validateCheckoutRequest} from '../server/checkout-validation.js';
import {RELEASE} from '../server/release-config.js';

// Fictional test data only: not garment prices, supplier SKUs or real approvals.
function fixture(){return {release:{enabled:true,catalogueVersion:'fixture-v1',currency:'CAD',countries:['CA']},products:[{id:'fixture-tee',approved:true,artworkVerified:true,supplierQuoteVerified:true,saleEnabled:true,artworkApprovalId:'fixture-art',sampleApprovalId:'fixture-sample',supplierApprovalId:'fixture-supplier',variants:[{size:'M',active:true,supplierSku:'fixture-M',currency:'CAD',countries:['CA'],unitAmount:7500},{size:'L',active:true,supplierSku:'fixture-L',currency:'CAD',countries:['CA'],unitAmount:7600}]}]};}
const request=()=>({catalogueVersion:'fixture-v1',country:'CA',lines:[{id:'fixture-tee',size:'M',quantity:2}]});
const codes=result=>(result.errors||[]).map(e=>e.code);
test('prices and merged quantities come only from trusted variants, in CAD cents',()=>{
 const input=request();input.lines.push({id:'fixture-tee',size:'M',quantity:1},{id:'fixture-tee',size:'L',quantity:1});
 const result=validateCheckoutRequest(input,fixture());
 assert.equal(result.ok,true);assert.equal(result.draft.currency,'CAD');assert.equal(result.draft.subtotal,30100);
 assert.deepEqual(result.draft.items.map(i=>[i.size,i.quantity,i.unitAmount]),[['M',3,7500],['L',1,7600]]);
 assert.equal(result.draft.stage,'items-only');assert.equal(Object.hasOwn(result.draft,'total'),false);
});
test('current release cannot create a checkout draft for any real catalogue concept',()=>{
 const products=JSON.parse(readFileSync(new URL('../catalogue/launch-27.json',import.meta.url))).products;
 assert.equal(RELEASE.enabled,false);
 for(const product of products){const result=validateCheckoutRequest({catalogueVersion:RELEASE.catalogueVersion,country:'CA',lines:[{id:product.id,size:'M',quantity:1}]},{release:RELEASE,products});assert.equal(result.ok,false);assert.ok(codes(result).includes('CHECKOUT_DISABLED'));assert.equal(Object.hasOwn(result,'draft'),false);}
});
test('client-supplied prices, approvals, totals and checkout redirects are rejected',()=>{
 for(const patch of [{unitAmount:1},{priceCad:0.01},{saleEnabled:true},{approved:true},{supplierSku:'client-sku'}]){
  const input=request();Object.assign(input.lines[0],patch);assert.ok(codes(validateCheckoutRequest(input,fixture())).includes('UNSUPPORTED_FIELD'));
 }
 for(const patch of [{total:1},{release:{enabled:true}},{checkoutUrl:'https://invalid.example'}])assert.ok(codes(validateCheckoutRequest({...request(),...patch},fixture())).includes('UNSUPPORTED_FIELD'));
});
test('every malformed selection is rejected instead of silently omitted',()=>{
 for(const lines of [[],null,Array(51).fill(request().lines[0]),[null],[{id:'unknown',size:'M',quantity:1}],[{id:'fixture-tee',size:'unknown',quantity:1}],...[0,-1,1.5,11,'2',NaN].map(quantity=>[{id:'fixture-tee',size:'M',quantity}])]){
  const result=validateCheckoutRequest({...request(),lines},fixture());assert.equal(result.ok,false);assert.equal(Object.hasOwn(result,'draft'),false);
 }
});
test('duplicate lines cannot bypass the per-variant quantity limit',()=>{
 const input=request();input.lines=[{id:'fixture-tee',size:'M',quantity:6},{id:'fixture-tee',size:'M',quantity:5}];
 assert.ok(codes(validateCheckoutRequest(input,fixture())).includes('QUANTITY_LIMIT'));
});
test('missing release gates and stale catalogue versions block all drafts',()=>{
 assert.ok(codes(validateCheckoutRequest(request(),{})).includes('CONFIG_UNAVAILABLE'));
 const stale={...request(),catalogueVersion:'old'};assert.ok(codes(validateCheckoutRequest(stale,fixture())).includes('STALE_CATALOGUE'));
 for(const country of ['US','ca','',null])assert.ok(codes(validateCheckoutRequest({...request(),country},fixture())).includes('DESTINATION_UNAVAILABLE'));
});
test('every required product approval is enforced independently',()=>{
 for(const [key,value] of [['approved',false],['artworkVerified',false],['supplierQuoteVerified',false],['saleEnabled',false],['artworkApprovalId',''],['sampleApprovalId',null],['supplierApprovalId',undefined]]){
  const trusted=fixture();trusted.products[0][key]=value;const result=validateCheckoutRequest(request(),trusted);assert.equal(result.ok,false,key);assert.ok(codes(result).includes('PRODUCT_NOT_READY'),key);
 }
});
test('invalid or ambiguous trusted variants and prices cannot enter a draft',()=>{
 for(const patch of [{active:false},{supplierSku:''},{currency:'USD'},{unitAmount:0},{unitAmount:1.5},{unitAmount:Number.MAX_SAFE_INTEGER}]){
  const trusted=fixture();Object.assign(trusted.products[0].variants[0],patch);assert.equal(validateCheckoutRequest(request(),trusted).ok,false);
 }
 const duplicate=fixture();duplicate.products.push(structuredClone(duplicate.products[0]));assert.equal(validateCheckoutRequest(request(),duplicate).ok,false);
 const variants=fixture();variants.products[0].variants.push(structuredClone(variants.products[0].variants[0]));assert.equal(validateCheckoutRequest(request(),variants).ok,false);
});
test('one invalid line rejects the complete request without exposing a partial quote',()=>{
 const input=request();input.lines.push({id:'missing',size:'M',quantity:1});const result=validateCheckoutRequest(input,fixture());
 assert.equal(result.ok,false);assert.equal(Object.hasOwn(result,'draft'),false);
});
test('validation does not mutate requests or server-owned catalogue data',()=>{
 const input=request(),trusted=fixture(),before=JSON.stringify({input,trusted});validateCheckoutRequest(input,trusted);assert.equal(JSON.stringify({input,trusted}),before);
});
test('changing the release flag alone cannot approve current catalogue concepts',()=>{
 const products=JSON.parse(readFileSync(new URL('../catalogue/launch-27.json',import.meta.url))).products;
 for(const product of products){const trusted={release:fixture().release,products};const input=request();input.lines[0].id=product.id;
  assert.ok(codes(validateCheckoutRequest(input,trusted)).includes('PRODUCT_NOT_READY'));
 }
});
test('each variant needs its own confirmed destination, not only a store-wide country',()=>{
 for(const destinations of [undefined,[],['US'],'CA']){
  const trusted=fixture();trusted.products[0].variants[0].countries=destinations;
  assert.ok(codes(validateCheckoutRequest(request(),trusted)).includes('VARIANT_DESTINATION_UNAVAILABLE'));
 }
});
test('empty array slots cannot bypass validation or yield an empty priced draft',()=>{
 for(const lines of [Array(1),[request().lines[0],...Array(1)]]){
  const result=validateCheckoutRequest({...request(),lines},fixture());
  assert.equal(result.ok,false);assert.equal(Object.hasOwn(result,'draft'),false);
 }
});
