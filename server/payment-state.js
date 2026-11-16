// Pure domain model only. Call after provider signature/session verification.
// Persist state + event ID + unique fulfillment intent in one future transaction.
const record=value=>value!==null&&typeof value==='object'&&!Array.isArray(value)&&[Object.prototype,null].includes(Object.getPrototypeOf(value));
const text=value=>typeof value==='string'&&value.trim().length>0&&value.length<=255;
const amount=value=>Number.isSafeInteger(value)&&value>0;
const supported=new Set(['checkout.session.completed','checkout.session.async_payment_succeeded','checkout.session.async_payment_failed']);
const intentKey=id=>id+':fulfillment:v1';
function validOrder(order){
 if(!record(order)||order.schemaVersion!==1||!text(order.id)||!text(order.sessionId)||order.currency!=='CAD'||!amount(order.amountTotal)||!Number.isSafeInteger(order.version)||order.version<0||!['pending','paid','failed'].includes(order.paymentState))return false;
 if(!Array.isArray(order.acceptedEventIds)||!Array.from(order.acceptedEventIds).every(text)||new Set(order.acceptedEventIds).size!==order.acceptedEventIds.length)return false;
 if(order.paymentState!=='paid')return order.fulfillmentIntent===null;
 const intent=order.fulfillmentIntent;
 return order.acceptedEventIds.length>0&&record(intent)&&intent.key===intentKey(order.id)&&['pending','processing','submitted'].includes(intent.state);
}
export function createPendingOrder(input){
 if(!record(input)||!text(input.id)||!text(input.sessionId)||input.currency!=='CAD'||!amount(input.amountTotal))throw Error('A server-owned order, session and final CAD total are required.');
 return {schemaVersion:1,id:input.id,sessionId:input.sessionId,currency:'CAD',amountTotal:input.amountTotal,version:0,paymentState:'pending',acceptedEventIds:[],fulfillmentIntent:null};
}
export function applyVerifiedPayment(order,event){
 if(!validOrder(order))throw Error('Invalid stored payment state.');
 if(!record(event)||!text(event.type))throw Error('Invalid normalized payment event.');
 const state=structuredClone(order);
 if(!supported.has(event.type))return {state,changed:false,result:'ignored'};
 if(!text(event.id)||event.orderId!==order.id||event.sessionId!==order.sessionId||event.currency!==order.currency||!amount(event.amountTotal)||event.amountTotal!==order.amountTotal)throw Error('Payment event does not match the stored order.');
 if(!['paid','unpaid'].includes(event.paymentStatus))throw Error('Unsupported payment status.');
 if(event.type==='checkout.session.async_payment_succeeded'&&event.paymentStatus!=='paid')throw Error('Payment success is not confirmed.');
 if(event.type==='checkout.session.async_payment_failed'&&event.paymentStatus!=='unpaid')throw Error('Contradictory payment failure.');
 if(state.acceptedEventIds.includes(event.id))return {state,changed:false,result:'duplicate'};
 if(state.version===Number.MAX_SAFE_INTEGER)throw Error('Order revision limit reached.');
 state.acceptedEventIds.push(event.id);state.version++;
 if(state.paymentState!=='paid'){
  if(event.paymentStatus==='paid'){
   state.paymentState='paid';state.fulfillmentIntent={key:intentKey(state.id),state:'pending'};
  }else if(event.type==='checkout.session.async_payment_failed')state.paymentState='failed';
 }
 return {state,changed:true,result:'processed'};
}
