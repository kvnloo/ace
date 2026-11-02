import http from 'node:http'; import { createReadStream, statSync } from 'node:fs'; import { extname, join, normalize } from 'node:path';
const root = process.argv[2]; const port = Number(process.argv[3] ?? 5320);
const types = { '.json': 'application/json', '.mp4': 'video/mp4', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.dzi': 'application/xml', '.png': 'image/png' };
http.createServer((req, res) => {
  const p = normalize(join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname))); if (!p.startsWith(root)) { res.writeHead(403).end(); return; }
  let st; try { st = statSync(p); } catch { res.writeHead(404, { 'Access-Control-Allow-Origin': '*' }).end(); return; }
  const h = { 'Access-Control-Allow-Origin': '*', 'Content-Type': types[extname(p)] ?? 'application/octet-stream', 'Accept-Ranges': 'bytes' };
  const m = /bytes=(\d*)-(\d*)/.exec(req.headers.range ?? '');
  if (m) { const s = Number(m[1] || 0), e = m[2] ? Number(m[2]) : st.size - 1; res.writeHead(206, { ...h, 'Content-Range': `bytes ${s}-${e}/${st.size}`, 'Content-Length': e - s + 1 }); createReadStream(p, { start: s, end: e }).pipe(res); }
  else { res.writeHead(200, { ...h, 'Content-Length': st.size }); createReadStream(p).pipe(res); }
}).listen(port, '127.0.0.1');
