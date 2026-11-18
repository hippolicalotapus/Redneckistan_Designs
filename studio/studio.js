import {inspectDraft,saveDraft,updateDraft} from './draft.js';
const form=document.getElementById('studioForm');
const fields={side:document.getElementById('studioSide'),slogan:document.getElementById('studioSlogan'),scale:document.getElementById('studioScale'),x:document.getElementById('studioX'),y:document.getElementById('studioY')};
const artworks={front:document.getElementById('studioFrontArt'),back:document.getElementById('studioBackArt')};
let storageAccessDenied=false;
function storage(){try{return window.localStorage}catch{storageAccessDenied=true;return {getItem(){return null},setItem(){throw Error('unavailable')}}}}
const restoration=inspectDraft(storage());
let draft=restoration.draft;
if(storageAccessDenied)document.getElementById('studioStatus').textContent='Local storage unavailable · draft kept for this session';
else if(restoration.invalid){
 const keptText=Object.values(restoration.draft.placements).some(placement=>placement.slogan.length>0);
 document.getElementById('studioStatus').textContent=keptText?'Some saved settings were adjusted during recovery. Your remaining design text was kept; please review placement before continuing.':'Previously saved draft could not be restored. Start a new draft; your earlier changes may be lost.';
}
const brandControl=document.getElementById('studioBrand');
if(brandControl){const option=document.createElement('option');option.value='Sarcastabastard';option.textContent='Sarcastabastard';brandControl.replaceChildren(option);brandControl.value='Sarcastabastard';brandControl.disabled=true;}
function render(){
 document.getElementById('studio').dataset.brand=draft.brand;
 for(const [name,field] of Object.entries(fields))field.value=String(draft[name]);
 for(const name of ['scale','x','y'])document.getElementById('studio'+name[0].toUpperCase()+name.slice(1)+'Value').textContent=draft[name]+'%';
 for(const [side,art] of Object.entries(artworks)){
  const placement=draft.placements[side];art.textContent=placement.slogan;
  art.style.left=placement.x+'%';art.style.top=placement.y+'%';art.style.setProperty('--art-width',placement.scale+'%');art.style.setProperty('--art-scale',String(placement.scale/100));
 }
}
form.addEventListener('input',event=>{
 const field=Object.entries(fields).find(([,node])=>node===event.target);
 if(!field)return;
 draft=updateDraft(draft,{[field[0]]:event.target.value});
 const ok=saveDraft(storage(),draft);
 const status=document.getElementById('studioStatus');
 const message=ok?'Draft saved on this device · not submitted or published':'Local storage unavailable · draft kept for this session';
 if(status.textContent!==message)status.textContent=message;
 render();
});
render();
