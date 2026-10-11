'use strict';
(()=>{
  const BOOKS={juda1:{pdf:'Judaísmo_Volumen_I.pdf'},juda2:{pdf:'Judaísmo_Volumen_II.pdf'},juda3:{pdf:'Judaísmo_Volumen_III.pdf'},islam:{pdf:'EL_LIBRO_DEL_ISLAM.pdf'},comparativo:{pdf:'Volumen_III_Judaismo_vs_Cristianismo.pdf'}};
  const params=new URLSearchParams(location.search),id=params.get('libro'),book=BOOKS[id];
  const $=id=>document.getElementById(id),store='bitacora-lector-v1';
  let data=null,page=1,font=1.12;
  let progress={};try{progress=JSON.parse(localStorage.getItem(store)||'{}')||{}}catch{}
  const safe=(s)=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const save=()=>{try{localStorage.setItem(store,JSON.stringify(progress))}catch{}};
  function render(){
    if(!data)return;
    page=Math.min(Math.max(page,1),data.pages.length);
    const record=data.pages[page-1];
    $('page-content').textContent=record?.texto||'Esta página no tiene texto extraíble. Abrí el PDF original para ver el diseño completo.';
    $('page-heading').textContent=data.title;
    $('page-meta').textContent=`${data.subtitle} · Página ${page}`;
    $('progress-label').textContent=`Página ${page} de ${data.pages.length}`;
    $('page-total').textContent=`/ ${data.pages.length}`;
    $('page-number').value=String(page);
    $('progress-bar').style.width=`${page/data.pages.length*100}%`;
    $('prev').disabled=page<=1;$('next').disabled=page>=data.pages.length;
    $('bookmark').textContent=progress[id]?.bookmarks?.includes(page)?'★ Marcada':'☆ Marcar';
    progress[id]={...(progress[id]||{}),page};save();
    history.replaceState(null,'',`?libro=${encodeURIComponent(id)}&pagina=${page}`);
    window.scrollTo({top:0,behavior:'instant'});
  }
  function go(n){page=n;render()}
  $('prev').addEventListener('click',()=>go(page-1));$('next').addEventListener('click',()=>go(page+1));
  $('page-number').addEventListener('change',e=>go(Number(e.target.value)||1));
  $('larger').addEventListener('click',()=>{$('page-content').style.fontSize=`${font=Math.min(1.7,font+.1)}rem`});
  $('smaller').addEventListener('click',()=>{$('page-content').style.fontSize=`${font=Math.max(.9,font-.1)}rem`});
  const theme=localStorage.getItem('bitacora-reader-theme')||'light';
  document.documentElement.dataset.theme=theme;
  $('theme').addEventListener('click',()=>{const x=document.documentElement.dataset.theme==='light'?'dark':'light';document.documentElement.dataset.theme=x;localStorage.setItem('bitacora-reader-theme',x)});
  $('bookmark').addEventListener('click',()=>{const x=progress[id]||{page};const marks=new Set(x.bookmarks||[]);marks.has(page)?marks.delete(page):marks.add(page);progress[id]={...x,bookmarks:[...marks]};save();render()});
  const search=()=>{const term=$('find').value.trim().normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase();if(!data||term.length<2){$('matches').textContent='Escribí al menos dos caracteres.';return}const matches=data.pages.filter(x=>x.texto.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase().includes(term));$('matches').innerHTML=`<p>${matches.length} página(s) encontradas. ${matches.length>30?'Se muestran las primeras 30.':''}</p>`+matches.slice(0,30).map(m=>`<button class="match" type="button" data-page="${m.n}"><strong>Página ${m.n}</strong><span>${safe(m.texto.replace(/\s+/g,' ').slice(0,170))}…</span></button>`).join('');};
  $('find-btn').addEventListener('click',search);$('find').addEventListener('keydown',e=>{if(e.key==='Enter')search()});$('matches').addEventListener('click',e=>{const btn=e.target.closest('[data-page]');if(btn)go(Number(btn.dataset.page))});
  async function start(){
    if(!book){$('page-content').textContent='No se encontró este volumen. Volvé a la biblioteca.';return}
    $('download-pdf').href=`./estudios/${encodeURIComponent(book.pdf)}`;
    try{
      const response=await fetch(`./estudios/lecturas/${id}.json`);
      if(!response.ok)throw Error(`HTTP ${response.status}`);
      data=await response.json();$('book-title').textContent=data.title;
      if(!Array.isArray(data.pages)||!data.pages.length)throw Error('Volumen vacío');
      const p=Number(params.get('pagina'))||progress[id]?.page||1;
      page=Number.isFinite(p)?p:1;render();
    }catch(err){$('page-content').textContent='No se pudo cargar el volumen. Revisá tu conexión o descargá el PDF original.';console.error(err)}
  }
  start();
})();
