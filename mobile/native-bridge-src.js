// Compiled by esbuild into a browser script for the Capacitor Android wrapper.
// Save personal backup JSON files to private cache, then let the user choose where to share/save them.
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

if (Capacitor.isNativePlatform()) {
  window.__nativeSaveFile = async (name, contents) => {
    try {
      const safeName = String(name).replace(/[^a-zA-Z0-9._-]/g, '_');
      const saved = await Filesystem.writeFile({
        path: `exports/${safeName}`,
        data: String(contents),
        directory: Directory.Cache,
        encoding: Encoding.UTF8,
        recursive: true
      });
      await Share.share({
        title: 'Guardar respaldo de Mi Bitácora de Fe',
        text: 'Elegí una ubicación privada para guardar el archivo.',
        files: [saved.uri],
        dialogTitle: 'Compartir o guardar archivo'
      });
    } catch (err) {
      console.error('Export failed', err);
      alert('No se pudo compartir el respaldo. Revisá las aplicaciones para guardar archivos y volvé a intentar.');
    }
  };
  // Open bundled PDF pages inside the app instead of requesting a new WebView.
  document.addEventListener('click', event => {
    const anchor = event.target.closest?.('a[href]');
    if(!anchor) return;
    const url = new URL(anchor.href, location.href);
    if(url.origin === location.origin && url.pathname.endsWith('/reader.html')) {
      event.preventDefault();
      location.href = url.href;
    }
  }, true);
}
