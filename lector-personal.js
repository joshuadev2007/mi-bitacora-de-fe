'use strict';
(async()=>{
  const $=id=>document.getElementById(id),params=new URLSearchParams(location.search),getId=params.get('id'),included=params.get('incluido'),key=`bitacora-libro-personal-${getId||included}`;
  const allowed=new Set(['Judaísmo_Volumen_I.pdf','Judaísmo_Volumen_II.pdf','Judaísmo_Volumen_III.pdf','EL_LIBRO_DEL_ISLAM.pdf','Volumen_III_Judaismo_vs_Cristianismo.pdf','Guia_metodo.pdf','Guia_fuentes.pdf']);
  let record=null,objectURL=null,reader=null,current=1,total=1,scale=1,processing=false;
  const report=s=>{$('private-message').textContent=s;};
  const progress=()=>{try{localStorage.setItem(key,String(current))}catch{};$('private-progress').textContent=total>1?`Página ${current} de ${total}`:'Lectura personal';$('private-prev').disabled=current<=1;$('private-next').disabled=current>=total};
  async function dbGet(){return new Promise((resolve,reject)=>{const req=indexedDB.open('bitacora-biblioteca-personal-v1',1);req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains('books'))req.result.createObjectStore('books',{keyPath:'id'})};req.onsuccess=()=>{const db=req.result,tx=db.transaction('books','readonly'),get=tx.objectStore('books').get(getId);get.onsuccess=()=>{resolve(get.result);db.close()};get.onerror=()=>reject(get.error)};req.onerror=()=>reject(req.error)})}
  async function draw(){if(!reader||processing)return;processing=true;try{current=Math.min(Math.max(1,current),total);const page=await reader.getPage(current);const maxWidth=Math.max(250,Math.min(document.documentElement.clientWidth-60,1000));const vp=page.getViewport({scale:1}),viewport=page.getViewport({scale:scale*maxWidth/vp.width});const canvas=$('private-canvas');canvas.width=Math.ceil(viewport.width);canvas.height=Math.ceil(viewport.height);canvas.style.width=Math.round(viewport.width)+'px';await page.render({canvasContext:canvas.getContext('2d',{alpha:false}),viewport}).promise;progress();report('')}catch(error){report('No se pudo mostrar esta página: '+error.message)}finally{processing=false}}
  $('private-prev').onclick=()=>{if(current>1){current--;void draw()}};
  $('private-next').onclick=()=>{if(current<total){current++;void draw()}};
  $('private-larger').onclick=()=>{if(reader){scale=Math.min(2.6,scale+.15);void draw()}else{$('private-text').style.fontSize=`${Math.min(1.8,scale+=.1)}rem`}};
  $('private-smaller').onclick=()=>{if(reader){scale=Math.max(.55,scale-.15);void draw()}else{$('private-text').style.fontSize=`${Math.max(.8,scale-=.1)}rem`}};
  try{
    if(included){if(!allowed.has(included))throw Error('Este libro no está en la biblioteca incluida.');const response=await fetch('./estudios/'+encodeURIComponent(included));if(!response.ok)throw Error('No fue posible abrir este libro incluido.');record={title:included.replace(/\.pdf$/i,'').replaceAll('_',' '),kind:'pdf',blob:await response.blob()}}else{record=await dbGet()}if(!record)throw Error('Este libro no existe en este dispositivo. Volvé a importarlo desde Biblioteca.');
    $('private-title').textContent=record.title;objectURL=URL.createObjectURL(record.blob);$('private-save').href=objectURL;$('private-save').download=record.title+(record.kind==='pdf'?'.pdf':'.txt');
    if(record.kind==='text'){
      const text=await record.blob.text();$('private-text').textContent=text;const savePos=Number(localStorage.getItem(key)||0);if(savePos>0)window.scrollTo(0,savePos);window.addEventListener('scroll',()=>{try{localStorage.setItem(key,String(window.scrollY))}catch{}},{passive:true});$('private-prev').hidden=$('private-next').hidden=true;report('');progress();return;
    }
    let pdfModule;
    try{pdfModule=await import('./lector-pdf.mjs')}catch(error){console.warn('PDF.js no está empaquetado; se prueba visor del navegador',error)}
    if(pdfModule?.loadPdf){
      const bytes=new Uint8Array(await record.blob.arrayBuffer());reader=await pdfModule.loadPdf(bytes);total=reader.numPages;current=Math.max(1,Math.min(total,Number(localStorage.getItem(key))||1));$('private-canvas').hidden=false;await draw();
    }else{
      $('private-pdf-fallback').hidden=false;$('private-pdf-fallback').src=objectURL;$('private-prev').hidden=$('private-next').hidden=$('private-smaller').hidden=$('private-larger').hidden=true;report('Visor PDF del navegador. En Android y Windows instalados se usa el lector integrado.');progress();
    }
  }catch(error){report(error.message||'No se pudo abrir el libro.');console.error(error)}
  window.addEventListener('pagehide',()=>{if(objectURL)URL.revokeObjectURL(objectURL)});
})();
