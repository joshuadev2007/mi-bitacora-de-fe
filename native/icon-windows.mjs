import {readFileSync,writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname,resolve,join} from 'node:path';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const base64=readFileSync(join(root,'desktop','icon.ico.base64'),'utf8').trim();
writeFileSync(join(root,'desktop','icon.ico'),Buffer.from(base64,'base64'));
console.log('Icono para Windows preparado.');
