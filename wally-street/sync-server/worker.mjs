// Wally Street sync server: a Cloudflare Worker that keeps each player's encrypted save, so they can
// log in with their username and password on any device.
//
// It never sees a password or any progress. The app encrypts the save with the player's password before
// uploading it, and proves who it is with a key made from the password (600,000 rounds of PBKDF2).
// The server stores only a SHA-256 hash of that key, and refuses reads and writes that don't match it.
//
// API (all JSON; the account id is 32 hex characters worked out from the username):
//   GET    /v1/accounts/<id>   -> 200 {exists:true, data} | 404 {exists:false} | 403 wrong key | 429 too many wrong keys
//   PUT    /v1/accounts/<id>   body {data:{iv,d,...}, rotate?:<sha256 of a new key>} -> 200 {ok:true, created}
//   DELETE /v1/accounts/<id>   -> 200 {ok:true}
// Every request carries "Authorization: Bearer <64 hex characters>".
//
// Needs one KV namespace bound as WALLY. Optional variable ALLOW_ORIGIN (default *), for example
// https://yourname.github.io, limits which website may call it from a browser.

const MAX_BYTES = 600000;   // the app keeps saves under 500 KB
const MAX_FAILS = 10;       // wrong keys allowed per account ...
const LOCK_SECONDS = 900;   // ... in this many seconds

const hex = (buf) => [...new Uint8Array(buf)].map((x) => x.toString(16).padStart(2, '0')).join('');
const sha256 = async (text) => hex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)));
const isKey = (t) => typeof t === 'string' && /^[0-9a-f]{64}$/.test(t);

export default {
  async fetch(request, env) {
    const headers = {
      'Access-Control-Allow-Origin': env.ALLOW_ORIGIN || '*',
      'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type',
      'Access-Control-Max-Age': '86400',
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
      'X-Content-Type-Options': 'nosniff',
    };
    const reply = (body, status = 200) => new Response(JSON.stringify(body), { status, headers });
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });

    const path = new URL(request.url).pathname;
    const match = path.match(/^\/v1\/accounts\/([0-9a-f]{32})$/);
    if (!match) return path === '/' ? reply({ ok: true, service: 'wally-street-sync', version: 1 }) : reply({ error: 'not_found' }, 404);

    const kv = env.WALLY;
    if (!kv) return reply({ error: 'storage_not_set_up' }, 500);
    const id = match[1];
    const key = (request.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '');
    if (!isKey(key)) return reply({ error: 'unauthorized' }, 401);

    const failKey = 'fail:' + id;
    const fails = Number(await kv.get(failKey)) || 0;
    if (fails >= MAX_FAILS) return reply({ error: 'too_many_attempts' }, 429);

    const record = await kv.get('acct:' + id, 'json');
    const hash = await sha256(key);
    const matches = !!record && record.auth === hash;
    const wrongKey = async () => {
      await kv.put(failKey, String(fails + 1), { expirationTtl: LOCK_SECONDS });
      return reply({ error: 'forbidden' }, 403);
    };

    if (request.method === 'GET') {
      if (!record) return reply({ exists: false }, 404);
      if (!matches) return wrongKey();
      if (fails) await kv.delete(failKey);
      return reply({ exists: true, data: record.data });
    }

    if (request.method === 'PUT') {
      const text = await request.text();
      if (text.length > MAX_BYTES) return reply({ error: 'too_large' }, 413);
      let body;
      try { body = JSON.parse(text); } catch (e) { return reply({ error: 'bad_json' }, 400); }
      const data = body && body.data;
      if (!data || typeof data !== 'object' || typeof data.iv !== 'string' || typeof data.d !== 'string') return reply({ error: 'bad_save' }, 400);
      if (record && !matches) return wrongKey();
      // a password change sends the hash of the new key; only the current key can make that change
      const auth = record && isKey(body.rotate) ? body.rotate : hash;
      await kv.put('acct:' + id, JSON.stringify({ auth, data, t: Date.now() }));
      if (fails) await kv.delete(failKey);
      return reply({ ok: true, created: !record });
    }

    if (request.method === 'DELETE') {
      if (!record) return reply({ ok: true });
      if (!matches) return wrongKey();
      await kv.delete('acct:' + id);
      await kv.delete(failKey);
      return reply({ ok: true });
    }

    return reply({ error: 'method_not_allowed' }, 405);
  },
};
