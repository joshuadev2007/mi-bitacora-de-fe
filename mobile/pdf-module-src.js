// Shared offline PDF.js module used for user-imported PDF books on Android and Windows.
import * as pdfjs from 'pdfjs-dist/build/pdf.mjs';
pdfjs.GlobalWorkerOptions.workerSrc = './pdf.worker.min.mjs';
export async function loadPdf(bytes) {return pdfjs.getDocument({data:bytes}).promise;}
