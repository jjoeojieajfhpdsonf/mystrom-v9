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
// Ohne Keep-Alive: die mystrom-app schliesst ruhende Verbindungen nach 5 s, eine wiederverwendete bräche sonst ab (502).
const agent = new http.Agent({ keepAlive: false });
function proxy(req, res, body, retry = req.method === 'GET') {
  const headers = { ...req.headers, host: API.host, connection: 'close' };
  const up = http.request({ hostname: API.hostname, port: API.port, path: req.url, method: req.method, headers, agent, timeout: 15000 }, (r) => {
    res.writeHead(r.statusCode, r.headers);
    r.pipe(res);
  });
  up.on('timeout', () => up.destroy(new Error('timeout')));
  up.on('error', () => {
    if (retry && !res.headersSent) { setTimeout(() => proxy(req, res, body, false), 200); return; }
    if (!res.headersSent) res.writeHead(502, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Die mystrom-app antwortet nicht.' }));
  });
  up.end(body);
}
// Anfrage ganz lesen, damit sie bei einem Fehler wiederholt werden kann
const readAll = (req) => new Promise((ok, fail) => { const parts = []; req.on('data', (c) => parts.push(c)); req.on('end', () => ok(Buffer.concat(parts))); req.on('error', fail); });

http.createServer(async (req, res) => {
  const p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.startsWith('/api/')) return proxy(req, res, await readAll(req));
  const file = path.join(PUBLIC, p === '/' ? 'index.html' : p);
  if (!file.startsWith(PUBLIC)) { res.writeHead(403); return res.end(); }
  try {
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    res.end(body);
  } catch { res.writeHead(404); res.end('Nicht gefunden'); }
}).listen(PORT, () => console.log(`myStrom v9 auf Port ${PORT}, Daten von ${API.origin}`));
