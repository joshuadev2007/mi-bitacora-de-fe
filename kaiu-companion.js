/* Kaiu local gratuito para Mi Bitácora de Fe y LevelUp Life independientes.
   Solo genera borradores locales. No usa API, ni envía datos fuera de la app. */
(()=>{'use strict';if(window.top!==window.self)return;
const kind=window.KaiuCompanionKind;if(!['faith','levelup'].includes(kind))return;
const KEY=kind==='faith'?'mi-bitacora-fe-v1':'levelup-life-v1',baseTitle=kind==='faith'?'Kaiu · Estudio y reflexión':'Kaiu · Misiones y hábitos';
const $=id=>document.getElementById(id);const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&quot;',"'":'&#39;'}[c]));
const today=()=>{const d=new Date();return new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,10)};
const uid=()=>crypto.randomUUID?.()||'kaiu-'+Date.now()+'-'+Math.random().toString(36).slice(2);
let shown=false,proposals=[];
function options(){const view=(location.hash||'').slice(1);
 if(kind==='faith'){
  if(view==='versiculos'||view==='hoy')return [['Guardar una referencia para estudiar','verse',{reference:'Mateo 11:28',title:'Descanso y reflexión',reflection:'¿Qué aprendo de este pasaje?'}],['Preguntas para mi reflexión','note',{title:'Preguntas sobre mi lectura',content:'¿Qué dice el texto?\n¿Qué preguntas me quedan?\n¿Qué fuentes compararé?',type:'Estudio'}]];
  if(view==='investigaciones'||view==='comparar'||view==='biblia')return [['Preparar un estudio bíblico','note',{title:'Estudio de un pasaje',content:'Pasaje por estudiar:\nContexto histórico:\nInterpretaciones por contrastar:\nMis propias conclusiones:',type:'Estudio'}],['Una pregunta que investigar','note',{title:'Mi pregunta de investigación',content:'¿Qué necesito investigar?\n¿Qué textos consultaré?',type:'Pregunta'}]];
  if(view==='oraciones'||view==='shabat')return [['Organizar mis agradecimientos','note',{title:'Agradecimientos personales',content:'Quiero agradecer por:\nQuiero reflexionar sobre:',type:'Agradecimiento'}]];
  return [['Crear un borrador de reflexión','note',{title:'Lo que quiero aprender hoy',content:'Hoy quiero estudiar:\nLo que descubrí:\nPreguntas que me quedan:',type:'Reflexión'}],['Guardar referencia para estudiar','verse',{reference:'Salmo 23:1',title:'Una referencia para meditar',reflection:'¿Qué enseñanza encuentro aquí?'}]];
 }
 if(view==='habits')return [['Mi hábito de lectura','habit',{title:'Leer diez minutos',category:'estudio',schedule:'all'}],['Mi hábito de organización','habit',{title:'Elegir tres prioridades',category:'personal',schedule:'all'}]];
 if(view==='focus')return [['Preparar una sesión de enfoque','quest',{title:'Una sesión de enfoque de 25 minutos',category:'estudio',description:'Elegir una sola tarea importante.',difficulty:'easy'}]];
 if(view==='quests'||view==='challenges')return [['Mi próxima misión','quest',{title:'Completar un paso de mi proyecto',category:'trabajo',description:'Un paso concreto y medible.',difficulty:'medium'}],['Misión de aprendizaje','quest',{title:'Estudiar 20 minutos',category:'estudio',description:'Escribir una idea aprendida.',difficulty:'easy'}]];
 return [['Hábito de constancia','habit',{title:'Revisar mis prioridades',category:'personal',schedule:'all'}],['Misión del día','quest',{title:'Avanzar en mi meta principal',category:'personal',description:'Un paso pequeño y realista.',difficulty:'easy'}]];
}
function render(){const aside=$('kaiu-comp-panel');if(!aside)return;aside.hidden=!shown;if(!shown)return;
const choices=proposals.length?`<div class="kaiu-comp-choices">${proposals.map((x,i)=>`<label><input type="checkbox" checked data-kaiu-comp-check="${i}"><span><b>${esc(x[0])}</b><small>${esc(x[2]?.title||x[2]?.reference)}</small></span></label>`).join('')}</div><button type="button" data-kaiu-comp-save>✓ Revisar y guardar</button>`:'';
aside.innerHTML=`<header><strong>✦ ${baseTitle}</strong><button type="button" data-kaiu-comp-close aria-label="Cerrar">×</button></header><p>Este es un copiloto <b>local y gratuito</b>: prepara borradores y preguntas. No es una IA generativa.</p><button type="button" data-kaiu-comp-ideas>✨ Sugerencias para esta sección</button>${choices}<small>Los borradores se guardan solamente después de tu confirmación. Podés editarlos desde la aplicación.</small>`}
function save(){const indices=[...document.querySelectorAll('[data-kaiu-comp-check]:checked')].map(e=>Number(e.dataset.kaiuCompCheck));if(!indices.length)return;const selected=indices.map(i=>proposals[i]).filter(Boolean);
if(!confirm('¿Guardar '+selected.length+' propuestas en '+(kind==='faith'?'Mi Bitácora de Fe':'LevelUp Life')+'? Podrás editarlas más tarde.'))return;
let db;try{db=JSON.parse(localStorage.getItem(KEY)||'null')}catch{}if(!db){alert('Abrí primero la app e intentá de nuevo.');return}
const copy=structuredClone(db),t=today();for(const [,type,d]of selected){const id=uid();if(kind==='faith'){
 if(type==='note'){if(!Array.isArray(copy.notes))throw Error('No hay colección de notas');copy.notes.push({id,title:d.title,content:d.content,date:t,type:d.type,volumeId:'',references:'',tags:[],favorite:false,createdAt:Date.now(),updatedAt:Date.now()})}
 if(type==='verse'){if(!Array.isArray(copy.verses))throw Error('No hay colección de versículos');if(!copy.verses.some(v=>v.reference===d.reference))copy.verses.push({id,date:t,reference:d.reference,title:d.title,category:'Para estudiar',passage:'',reflection:d.reflection})}
 }else{
 if(type==='habit'){if(!Array.isArray(copy.habits))throw Error('No hay hábitos');copy.habits.push({id,title:d.title,category:d.category,schedule:d.schedule,history:[],createdAt:t})}
 if(type==='quest'){if(!Array.isArray(copy.quests))throw Error('No hay misiones');copy.quests.push({id,title:d.title,category:d.category,difficulty:d.difficulty,repeat:'one',createdAt:t,doneDates:[],description:d.description})}
 }}
try{localStorage.setItem(KEY,JSON.stringify(copy));window.JoshCloud?.notify?.(KEY);alert('¡Guardado! Abriremos la app para mostrar los nuevos registros.');location.reload()}catch(e){alert('No fue posible guardar. Exportá primero un respaldo JSON. '+e.message)}
}
function mount(){const btn=document.createElement('button');btn.id='kaiu-comp-fab';btn.textContent='✦ Kaiu';btn.setAttribute('aria-label','Abrir Kaiu local');const aside=document.createElement('aside');aside.id='kaiu-comp-panel';aside.hidden=true;aside.setAttribute('role','dialog');aside.setAttribute('aria-label',baseTitle);document.body.append(btn,aside);btn.addEventListener('click',()=>{shown=!shown;render()});aside.addEventListener('click',e=>{if(e.target.closest('[data-kaiu-comp-close]')){shown=false;render()}else if(e.target.closest('[data-kaiu-comp-ideas]')){proposals=options();render()}else if(e.target.closest('[data-kaiu-comp-save]'))save()});window.addEventListener('hashchange',()=>{if(shown){proposals=[];render()}})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();
