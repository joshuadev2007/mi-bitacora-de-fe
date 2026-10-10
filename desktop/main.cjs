'use strict';
const { app, BrowserWindow, protocol, net, shell, session } = require('electron');
const { join, resolve, sep, basename } = require('node:path');
const { mkdirSync, copyFileSync, existsSync } = require('node:fs');
const { pathToFileURL } = require('node:url');

// Secure origin for bundled pages, keeping localStorage persistent in this app.
protocol.registerSchemesAsPrivileged([{
  scheme: 'bitacora',
  privileges: {standard: true, secure: true, supportFetchAPI: true, stream: true}
}]);
let windowRef;
const assetRoot = join(__dirname, 'www');
const homeURL = 'bitacora://app/index.html';

function safeBundledPath(url) {
  const u = new URL(url);
  if(u.protocol !== 'bitacora:' || u.hostname !== 'app') return null;
  let rel;
  try { rel = decodeURIComponent(u.pathname).replace(/^\/+/, ''); } catch { return null; }
  if(!rel) rel = 'index.html';
  if(rel.split('/').some(part => part === '..' || part === '.')) return null;
  const absolute = resolve(assetRoot, rel);
  if(!absolute.startsWith(resolve(assetRoot)+sep) && absolute !== resolve(assetRoot)) return null;
  return absolute;
}

async function openBookExternally(url) {
  const bundled = safeBundledPath(url);
  if(!bundled || !bundled.toLowerCase().endsWith('.pdf') || !bundled.includes(sep + 'estudios' + sep)) return;
  // The OS PDF viewer is more reliable than Chromium's embedded PDF plugin.
  const dir = join(app.getPath('userData'), 'libros');
  mkdirSync(dir, {recursive: true});
  const name = basename(bundled);
  const dest = join(dir, name);
  try {
    copyFileSync(bundled, dest);
    const err = await shell.openPath(dest);
    if(err) await shell.openExternal('https://joshuadev2007.github.io/mi-bitacora-de-fe/estudios/'+encodeURIComponent(name));
  } catch(error) { console.error('No se pudo abrir el libro:', error); }
}

app.whenReady().then(async () => {
  app.setAppUserModelId('com.joshuadev2007.bitacoradefe.windows');
  protocol.handle('bitacora', async request => {
    const file = safeBundledPath(request.url);
    if(!file || !existsSync(file)) return new Response('Not found', {status: 404});
    return net.fetch(pathToFileURL(file).toString());
  });
  windowRef = new BrowserWindow({
    title: 'Mi Bitácora de Fe', width: 1260, height: 830,
    minWidth: 760, minHeight: 600, backgroundColor: '#f6f7f2',
    autoHideMenuBar: true,
    webPreferences: { nodeIntegration: false, contextIsolation: true, sandbox: true }
  });
  windowRef.webContents.setWindowOpenHandler(({url}) => {
    if(url.startsWith('bitacora://app/')) {
      if(new URL(url).pathname.toLowerCase().endsWith('.pdf')) void openBookExternally(url);
      else void windowRef.loadURL(url);
    } else if(/^https:\/\//i.test(url)) void shell.openExternal(url);
    return {action:'deny'};
  });
  windowRef.webContents.on('will-navigate', (event,url) => {
    if(url.startsWith('bitacora://app/')) {
      if(new URL(url).pathname.toLowerCase().endsWith('.pdf')) {event.preventDefault();void openBookExternally(url);}
    } else {event.preventDefault();if(/^https:\/\//i.test(url)) void shell.openExternal(url);}
  });
  session.defaultSession.on('will-download', (_event,item) => {
    item.setSaveDialogOptions({defaultPath:join(app.getPath('downloads'),item.getFilename())});
  });
  await windowRef.loadURL(homeURL);
});
app.on('window-all-closed',()=>{if(process.platform!=='darwin') app.quit()});
app.on('activate',()=>{if(BrowserWindow.getAllWindows().length === 0) app.emit('ready')});
