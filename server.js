// myStrom v9 – nur die Oberfläche. Liefert die Dateien aus public/ aus und reicht /api/ an die mystrom-app weiter,
// die die Steckdosen misst, schaltet und die Regeln ausführt. So läuft die Logik nur einmal.
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PORT = Number(process.env.PORT || 8092);
const API = new URL(process.env.API_URL || 'http://127.0.0.1:8091');
const PUBLIC = path.join(path.dirname(fileURLToPath(import.meta.url)), 'public');
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };

// /api/… an die mystrom-app, Antwort unverändert zurück (auch CSV-Export)
function proxy(req, res) {
  const up = http.request({ hostname: API.hostname, port: API.port, path: req.url, method: req.method, headers: { ...req.headers, host: API.host }, timeout: 15000 }, (r) => {
    res.writeHead(r.statusCode, r.headers);
    r.pipe(res);
  });
  up.on('timeout', () => up.destroy(new Error('timeout')));
  up.on('error', () => {
    if (!res.headersSent) res.writeHead(502, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Die mystrom-app antwortet nicht.' }));
  });
  req.pipe(up);
}

http.createServer(async (req, res) => {
  const p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.startsWith('/api/')) return proxy(req, res);
  const file = path.join(PUBLIC, p === '/' ? 'index.html' : p);
  if (!file.startsWith(PUBLIC)) { res.writeHead(403); return res.end(); }
  try {
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    res.end(body);
  } catch { res.writeHead(404); res.end('Nicht gefunden'); }
}).listen(PORT, () => console.log(`myStrom v9 auf Port ${PORT}, Daten von ${API.origin}`));
