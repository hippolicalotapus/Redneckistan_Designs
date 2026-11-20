// Read-only collision check for proposed slogan evidence; never assigns catalogue slots.
export function normalizeSlogan(text){
 if(typeof text!=='string')throw TypeError('Slogan must be text');
 return text.normalize('NFKC').toLowerCase().replace(/[’‘]/g,"'").replace(/[^a-z0-9]+/g,' ').trim().replace(/\s+/g,' ');
}
export function auditSloganCandidates(candidates){
 if(!Array.isArray(candidates))throw TypeError('Expected slogan candidates array');
 const records=candidates.map((candidate,index)=>{
  if(!candidate||typeof candidate.id!=='string'||!candidate.id.trim())throw TypeError('Candidate ID required at '+index);
  const normalized=normalizeSlogan(candidate.text);
  if(!normalized)throw TypeError('Candidate text required at '+index);
  return {id:candidate.id,text:candidate.text,normalized};
 });
 const collisions=[];
 for(let i=0;i<records.length;i++)for(let j=i+1;j<records.length;j++){
  const a=records[i],b=records[j];
  if(a.id===b.id)collisions.push({a:a.id,b:b.id,kind:'duplicate-id'});
  if(a.normalized===b.normalized)collisions.push({a:a.id,b:b.id,kind:'same-wording'});
  else if(a.normalized.startsWith(b.normalized+' ')||b.normalized.startsWith(a.normalized+' '))collisions.push({a:a.id,b:b.id,kind:'possible-variant'});
 }
 return {count:records.length,collisions};
}
