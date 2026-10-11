// Build-time only. Copy the existing GitHub Pages application into the native wrapper.
// Does not modify the original website, the user's data, or the root application.
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { cpSync, copyFileSync, mkdirSync, rmSync, readFileSync, writeFileSync } from 'node:fs';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const platform = process.argv[2];
if (!['desktop', 'mobile'].includes(platform)) throw Error('Usage: node native/prepare.mjs desktop|mobile');
const dest = join(root, platform, 'www');
rmSync(dest, {recursive:true,force:true});
mkdirSync(dest, {recursive:true});
for (const name of ['index.html','app.js','style.css','manifest.webmanifest','icon-192.png','icon-512.png','leer.html','leer.js','leer.css','mis-libros.js','lector-personal.html','lector-personal.js','cloud-config.js','cloud-sync.js','cloud-sync.css','sw.js']) {
  copyFileSync(join(root,name),join(dest,name));
}
cpSync(join(root,'estudios'),join(dest,'estudios'),{recursive:true});
let html = readFileSync(join(dest,'index.html'),'utf8');
// Each platform uses its own stable private storage origin.
if(platform === 'mobile') {
  html = html.replace('</body>', '  <script src="./native-bridge.js" defer></script>\n</body>');
  copyFileSync(join(root,'mobile','reader.html'), join(dest,'reader.html')); 
  let js = readFileSync(join(dest,'app.js'),'utf8');
  const needle = 'function downloadFile(name,content,type){';
  if (!js.includes(needle)) throw Error('No se pudo adaptar la exportación de los respaldos.');
  js = js.replace(needle,needle+"if(typeof window.__nativeSaveFile==='function'){window.__nativeSaveFile(name,content,type);return;}");
  writeFileSync(join(dest,'app.js'),js);
}
writeFileSync(join(dest,'index.html'),html);
console.log(`Native ${platform} web assets ready at ${dest}`);
