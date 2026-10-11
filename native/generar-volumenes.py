"""Regenera los textos y el índice de búsqueda de los volúmenes originales independientes."""
import json
from pathlib import Path
import fitz
ROOT=Path(__file__).resolve().parents[1]
EST=ROOT/'estudios'
READ=EST/'lecturas'
READ.mkdir(exist_ok=True,parents=True)
SPEC=[
 ('juda1','Judaísmo · Volumen I','Fundamentos, historia y práctica','Judaísmo_Volumen_I.pdf'),
 ('juda2','Judaísmo · Volumen II','Judaísmo a fondo, edición anotada','Judaísmo_Volumen_II.pdf'),
 ('juda3','Judaísmo · Volumen III','Judaísmo y cristianismo','Judaísmo_Volumen_III.pdf'),
 ('islam','El Libro del Islam','Edición integral, 10 volúmenes','EL_LIBRO_DEL_ISLAM.pdf'),
 ('comparativo','Judaísmo y Cristianismo','Edición independiente','Volumen_III_Judaismo_vs_Cristianismo.pdf'),
]
index={}
for key,title,subtitle,filename in SPEC:
    doc=fitz.open(EST/filename)
    pages=[{'n':i+1,'texto':p.get_text('text',sort=True).replace('\x00','').strip()} for i,p in enumerate(doc)]
    (READ/f'{key}.json').write_text(json.dumps({'id':key,'title':title,'subtitle':subtitle,'source':filename,'pages':pages},ensure_ascii=False,separators=(',',':')),encoding='utf-8')
    index[key]=[{'p':p['n'],'t':p['texto']} for p in pages]
    print(f'{key}: {len(pages)} páginas')
(EST/'indice_volumenes.json').write_text(json.dumps(index,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
