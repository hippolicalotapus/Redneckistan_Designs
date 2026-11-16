import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validateCheckoutRequest} from '../server/checkout-validation.js';
import {RELEASE} from '../server/release-config.js';
import {createPendingOrder,applyVerifiedPayment} from '../server/payment-state.js';

test('the actual disabled catalogue cannot supply a pending payment order',()=>{
 const products=JSON.parse(readFileSync(new URL('../catalogue/launch-27.json',import.meta.url))).products;
 const result=validateCheckoutRequest({catalogueVersion:RELEASE.catalogueVersion,country:'CA',lines:[{id:products[0].id,size:'M',quantity:1}]},{release:RELEASE,products});
 assert.equal(result.ok,false);assert.throws(()=>createPendingOrder(result.draft));
});

test('item validation and payment reconciliation retain the complete expected total',()=>{
 // Fictional fixture and deliberately invented shipping/tax amounts, not checkout rates.
 const trusted={release:{enabled:true,catalogueVersion:'fixture-flow',currency:'CAD',countries:['CA']},products:[{id:'fixture-shirt',approved:true,artworkVerified:true,supplierQuoteVerified:true,saleEnabled:true,artworkApprovalId:'fixture-art',sampleApprovalId:'fixture-sample',supplierApprovalId:'fixture-supplier',variants:[{size:'M',active:true,supplierSku:'fixture-M',currency:'CAD',unitAmount:5000,countries:['CA']}]}]};
 const result=validateCheckoutRequest({catalogueVersion:'fixture-flow',country:'CA',lines:[{id:'fixture-shirt',size:'M',quantity:2}]},trusted);
 assert.equal(result.ok,true);assert.equal(result.draft.subtotal,10000);
 assert.throws(()=>createPendingOrder(result.draft),'an item draft is not a final payable order');
 const expectedTotal=result.draft.subtotal+1200+560;
 const order=createPendingOrder({id:'fixture-order',sessionId:'fixture-session',currency:'CAD',amountTotal:expectedTotal});
 const notification={id:'fixture-paid',type:'checkout.session.completed',orderId:order.id,sessionId:order.sessionId,currency:'CAD',amountTotal:expectedTotal,paymentStatus:'paid'};
 assert.throws(()=>applyVerifiedPayment(order,{...notification,amountTotal:result.draft.subtotal}));
 const paid=applyVerifiedPayment(order,notification).state;
 const restored=JSON.parse(JSON.stringify(paid));
 assert.equal(applyVerifiedPayment(restored,notification).changed,false);
 assert.equal(paid.amountTotal,expectedTotal);assert.equal(paid.paymentState,'paid');assert.equal(paid.fulfillmentIntent.state,'pending');
});
