// Runs the sync server on your own computer, with the saves kept in memory, for testing:
//   node sync-server/dev-server.mjs 8788
// Then set SYNC_URL to http://127.0.0.1:8788 in a test copy of the app.
import http from 'node:http';
import worker from './worker.mjs';

export function memoryKV() {
  const map = new Map();
  return {
    map,
    async get(k, type) {
      const v = map.get(k);
      if (!v || (v.exp && v.exp < Date.now())) return null;
      return type === 'json' ? JSON.parse(v.value) : v.value;
    },
    async put(k, value, opts = {}) { map.set(k, { value: String(value), exp: opts.expirationTtl ? Date.now() + opts.expirationTtl * 1000 : 0 }); },
    async delete(k) { map.delete(k); },
  };
}

export function start(port = 8788, env = { WALLY: memoryKV() }) {
  const server = http.createServer(async (req, res) => {
    const chunks = [];
    for await (const c of req) chunks.push(c);
    const body = chunks.length ? Buffer.concat(chunks) : undefined;
    const request = new Request('http://127.0.0.1:' + port + req.url, {
      method: req.method,
      headers: req.headers,
      body: ['GET', 'HEAD', 'OPTIONS'].includes(req.method) ? undefined : body,
    });
    const response = await worker.fetch(request, env);
    res.writeHead(response.status, Object.fromEntries(response.headers));
    res.end(Buffer.from(await response.arrayBuffer()));
  });
  return new Promise((resolve) => server.listen(port, '127.0.0.1', () => resolve({ server, env })));
}

if (import.meta.url === 'file://' + process.argv[1]) {
  const port = Number(process.argv[2]) || 8788;
  start(port).then(() => console.log('Wally Street sync server (in memory) on http://127.0.0.1:' + port));
}
