import {readDraft,saveDraft,normalizeDraft} from './studio/draft.js';
const form=document.getElementById('studioForm');
const fields={brand:document.getElementById('studioBrand'),side:document.getElementById('studioSide'),slogan:document.getElementById('studioSlogan'),scale:document.getElementById('studioScale'),x:document.getElementById('studioX'),y:document.getElementById('studioY')};
const artworks={front:document.getElementById('studioFrontArt'),back:document.getElementById('studioBackArt')};
function storage(){try{return window.localStorage}catch{return {getItem(){return null},setItem(){throw Error('unavailable')}}}}
let draft=readDraft(storage());
function render(){
 document.getElementById('studio').dataset.brand=draft.brand;
 for(const [name,field] of Object.entries(fields))field.value=String(draft[name]);
 for(const name of ['scale','x','y'])document.getElementById('studio'+name.toUpperCase()+'Value').textContent=draft[name]+'%';
 for(const [side,art] of Object.entries(artworks)){
  art.textContent=side===draft.side?draft.slogan:'';
  art.style.left=draft.x+'%';art.style.top=draft.y+'%';art.style.setProperty('--art-width',draft.scale+'%');
 }
}
form.addEventListener('input',event=>{
 const field=Object.entries(fields).find(([,node])=>node===event.target);
 if(!field)return;
 draft=normalizeDraft({...draft,[field[0]]:event.target.value});
 const ok=saveDraft(storage(),draft);
 document.getElementById('studioStatus').textContent=ok?'Draft saved on this device · not submitted or published':'Local storage unavailable · draft kept for this session';
 render();
});
render();
