import * as pdfjs from 'pdfjs-dist/build/pdf.mjs';
pdfjs.GlobalWorkerOptions.workerSrc = './pdf.worker.min.mjs';
const documents = new Set(['EL_LIBRO_DEL_JUDAISMO.pdf','EL_LIBRO_DEL_ISLAM.pdf','Volumen_III_Judaismo_vs_Cristianismo.pdf']);
const params = new URLSearchParams(location.search);
const name = params.get('pdf');
const pages = Number(params.get('page')) || 1;
const $ = id => document.getElementById(id);
const setStatus = text => { $('status').textContent=text; };
if(!documents.has(name)) {
  setStatus('Libro no disponible.');
} else {
  const title = name === 'EL_LIBRO_DEL_JUDAISMO.pdf' ? 'El Libro del Judaísmo' : name === 'EL_LIBRO_DEL_ISLAM.pdf' ? 'El Libro del Islam' : 'Judaísmo y Cristianismo';
  $('title').textContent = title;
  let pdf;
  let current = pages;
  let rendering = false;
  async function renderPage() {
    if(!pdf || rendering) return;
    rendering=true;
    try {
      current = Math.max(1,Math.min(pdf.numPages,current));
      setStatus(`Página ${current} de ${pdf.numPages}`);
      const page = await pdf.getPage(current);
      const maxWidth = Math.min(Math.max(document.documentElement.clientWidth-24,320),1080);
      const vp = page.getViewport({scale:1});
      const scale=Math.min(2.2,maxWidth / vp.width);
      const viewport=page.getViewport({scale});
      const canvas=$('page');
      const ctx=canvas.getContext('2d',{alpha:false});
      canvas.width=Math.ceil(viewport.width);canvas.height=Math.ceil(viewport.height);
      canvas.style.width=Math.round(viewport.width)+'px';canvas.style.height=Math.round(viewport.height)+'px';
      await page.render({canvasContext:ctx,viewport}).promise;
      history.replaceState({},'',`?pdf=${encodeURIComponent(name)}&page=${current}`);
    } catch(error) {
      setStatus('Error al mostrar el PDF: '+(error?.message||error));
    } finally { rendering=false; }
  }
  $('previous').onclick=async()=>{if(!rendering){current-=1;await renderPage();}};
  $('next').onclick=async()=>{if(!rendering){current+=1;await renderPage();}};
  $('back').onclick=()=>{location.href='./index.html#libros';};
  try {
    setStatus('Cargando el libro…');
    pdf = await pdfjs.getDocument({url:'./estudios/'+encodeURIComponent(name)}).promise;
    await renderPage();
  } catch(error) {setStatus('No se pudo abrir el libro: '+(error?.message||error));}
}
