import test from 'node:test';
import assert from 'node:assert/strict';
import {createPendingOrder,applyVerifiedPayment} from '../server/payment-state.js';

// Explicitly fictional normalized server data; these are not signed provider events.
const order=()=>createPendingOrder({id:'fixture-order',sessionId:'fixture-session',currency:'CAD',amountTotal:12345});
const event=(patch={})=>({id:'fixture-event-1',type:'checkout.session.completed',orderId:'fixture-order',sessionId:'fixture-session',currency:'CAD',amountTotal:12345,paymentStatus:'paid',...patch});
test('pending order requires a complete positive CAD total, not an item subtotal',()=>{
 assert.equal(order().paymentState,'pending');assert.equal(order().fulfillmentIntent,null);
 for(const patch of [{amountTotal:undefined,subtotal:12345},{amountTotal:0},{amountTotal:1.5},{amountTotal:NaN},{currency:'USD'},{sessionId:''},{id:''}]){
  assert.throws(()=>createPendingOrder({id:'fixture-order',sessionId:'fixture-session',currency:'CAD',amountTotal:12345,...patch}));
 }
});
test('a completed but unpaid checkout never creates a fulfillment intent',()=>{
 const next=applyVerifiedPayment(order(),event({paymentStatus:'unpaid'}));
 assert.equal(next.state.paymentState,'pending');assert.equal(next.state.fulfillmentIntent,null);assert.equal(next.changed,true);
});
test('matching paid confirmation creates one stable fulfillment intent',()=>{
 const next=applyVerifiedPayment(order(),event());
 assert.equal(next.state.paymentState,'paid');assert.equal(next.state.fulfillmentIntent.state,'pending');
 assert.equal(next.state.fulfillmentIntent.key,'fixture-order:fulfillment:v1');
 assert.deepEqual(next.state.acceptedEventIds,['fixture-event-1']);assert.equal(next.state.version,1);
});
test('the same event ID is a no-op even after serializing and restoring the order',()=>{
 const first=applyVerifiedPayment(order(),event());const restored=JSON.parse(JSON.stringify(first.state));
 const repeated=applyVerifiedPayment(restored,event());
 assert.equal(repeated.changed,false);assert.equal(repeated.result,'duplicate');assert.deepEqual(repeated.state,first.state);
});
test('delayed success after unpaid completion transitions once to paid',()=>{
 const first=applyVerifiedPayment(order(),event({paymentStatus:'unpaid'}));
 const next=applyVerifiedPayment(first.state,event({id:'fixture-event-2',type:'checkout.session.async_payment_succeeded'}));
 assert.equal(next.state.paymentState,'paid');assert.ok(next.state.fulfillmentIntent);assert.equal(next.state.acceptedEventIds.length,2);
});
test('different success event IDs cannot create an additional fulfillment intent',()=>{
 const first=applyVerifiedPayment(order(),event());
 const next=applyVerifiedPayment(first.state,event({id:'fixture-event-2',type:'checkout.session.async_payment_succeeded'}));
 assert.deepEqual(next.state.fulfillmentIntent,first.state.fulfillmentIntent);assert.equal(next.state.acceptedEventIds.length,2);
});
test('failed delayed payment does not fulfill; a later confirmed success can recover',()=>{
 const failed=applyVerifiedPayment(order(),event({type:'checkout.session.async_payment_failed',paymentStatus:'unpaid'}));
 assert.equal(failed.state.paymentState,'failed');assert.equal(failed.state.fulfillmentIntent,null);
 const recovered=applyVerifiedPayment(failed.state,event({id:'fixture-event-2',type:'checkout.session.async_payment_succeeded'}));
 assert.equal(recovered.state.paymentState,'paid');assert.ok(recovered.state.fulfillmentIntent);
});
test('late failure or unpaid completion cannot downgrade an already paid order',()=>{
 const paid=applyVerifiedPayment(order(),event()).state;
 for(const type of ['checkout.session.async_payment_failed','checkout.session.completed']){
  const next=applyVerifiedPayment(paid,event({id:'fixture-late-'+type,type,paymentStatus:'unpaid'}));
  assert.equal(next.state.paymentState,'paid');assert.deepEqual(next.state.fulfillmentIntent,paid.fulfillmentIntent);
 }
});
test('wrong order, session, amount or currency rejects without mutating state',()=>{
 const original=order(),snapshot=JSON.stringify(original);
 for(const patch of [{orderId:'other'},{sessionId:'other'},{amountTotal:1},{amountTotal:'12345'},{currency:'USD'},{id:''}])assert.throws(()=>applyVerifiedPayment(original,event(patch)));
 assert.equal(JSON.stringify(original),snapshot);
});
test('success notification still requires paid status; contradictory failure is rejected',()=>{
 assert.throws(()=>applyVerifiedPayment(order(),event({type:'checkout.session.async_payment_succeeded',paymentStatus:'unpaid'})));
 assert.throws(()=>applyVerifiedPayment(order(),event({type:'checkout.session.async_payment_failed',paymentStatus:'paid'})));
 assert.throws(()=>applyVerifiedPayment(order(),event({paymentStatus:'no_payment_required'})));
});
test('unsupported events leave the order unchanged rather than causing side effects',()=>{
 const original=order(),next=applyVerifiedPayment(original,{id:'fixture-other',type:'customer.updated'});
 assert.equal(next.changed,false);assert.equal(next.result,'ignored');assert.deepEqual(next.state,original);
});
test('malformed stored orders are rejected and inputs remain immutable',()=>{
 const original=order(),notification=event(),before=JSON.stringify({original,notification});
 applyVerifiedPayment(original,notification);assert.equal(JSON.stringify({original,notification}),before);
 for(const patch of [{version:-1},{acceptedEventIds:'invalid'},{paymentState:'unknown'},{amountTotal:0},{fulfillmentIntent:{key:'unexpected',state:'pending'}}])assert.throws(()=>applyVerifiedPayment({...original,...patch},notification));
});
test('revision exhaustion permits duplicate reads but never unsafe increments',()=>{
 const paid=applyVerifiedPayment(order(),event()).state;
 const nearLimit={...paid,version:Number.MAX_SAFE_INTEGER-1};
 const last=applyVerifiedPayment(nearLimit,event({id:'fixture-last'})).state;
 assert.equal(last.version,Number.MAX_SAFE_INTEGER);
 assert.equal(applyVerifiedPayment(last,event({id:'fixture-last'})).changed,false);
 assert.throws(()=>applyVerifiedPayment(last,event({id:'fixture-overflow'})),/revision/i);
 assert.equal(last.version,Number.MAX_SAFE_INTEGER);
});
