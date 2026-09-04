const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function load(file, dependencies = {}, globals = {}) {
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
  }).outputText;
  const context = { exports: {}, URL, AbortSignal, TextDecoder, ...globals,
    require(name) { if (!(name in dependencies)) throw Error(`Unexpected import: ${name}`); return dependencies[name]; }
  };
  vm.runInNewContext(code, context);
  return context.exports;
}
const data = load('data/socialCounts.ts');
const parser = load('lib/social-scraper.ts');
const instagram = '<meta content="https://www.instagram.com/libyansclub/" property="og:url"><meta property="og:description" content="26K Followers, 260 Following, 49 Posts">';
const facebook = '<meta property="og:url" content="https://www.facebook.com/p/Libyansclub-61586181910399/"><meta property="og:description" content="Libyansclub. 17,042 likes">';
function tiktok(user = 'libyanclub', exact = '11965') {
  return `<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__" type="application/json">${JSON.stringify({__DEFAULT_SCOPE__: {'webapp.user-detail': {statusCode: 0, userInfo: {user: {uniqueId: user}, statsV2: {followerCount: exact}, stats: {followerCount: 12000, heartCount: 259302}}}}})}</script>`;
}

test('reads profile metadata and distinguishes rounded counts', () => {
  assert.equal(parser.parsePublicFollowers('instagram', instagram).followers, 26000);
  assert.equal(parser.parsePublicFollowers('instagram', instagram).approximate, true);
  assert.equal(parser.parsePublicFollowers('tiktok', tiktok()).followers, 11965);
  assert.equal(parser.parsePublicFollowers('tiktok', tiktok()).approximate, false);
});
test('does not confuse likes, recommendations, login pages, or other accounts', () => {
  assert.equal(parser.parsePublicFollowers('facebook', facebook), null);
  assert.equal(parser.parsePublicFollowers('facebook', facebook.replace('likes', 'followers')).followers, 17042);
  assert.equal(parser.parsePublicFollowers('instagram', instagram.replace('/libyansclub/', '/other/')), null);
  assert.equal(parser.parsePublicFollowers('tiktok', tiktok('other')), null);
  assert.equal(parser.parsePublicFollowers('instagram', '<title>Log in</title>100K followers'), null);
  assert.equal(parser.parsePublicFollowers('tiktok', '<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__">broken</script>'), null);
});
test('validates count formats, including zero and Retry-After', () => {
  for (const invalid of [-1, null, {}, Infinity, '1,2', '12.5', 'three', '5e4']) assert.equal(parser.parseFollowerNumber(invalid), null);
  assert.equal(parser.parseFollowerNumber('0').followers, 0);
  assert.equal(parser.parseFollowerNumber('17,042').followers, 17042);
  assert.equal(parser.parseFollowerNumber('1.2M').followers, 1200000);
  assert.equal(parser.retryDelay('3600', 0), 3600000);
  assert.equal(parser.retryDelay('bad', 0), 1800000);
  assert.equal(parser.retryDelay(new Date(3600000).toUTCString(), 0), 3600000);
});

function routeHarness() {
  let now = Date.now(), mode = 'ok', calls = 0;
  const cache = new Map();
  class Clock extends Date { static now() { return now; } }
  const route = load('app/api/social-count/route.ts', {
    '@/data/socialCounts': data, '@/lib/social-scraper': parser,
    'next/server': { NextResponse: { json: (body, options) => ({body, options}) } },
    'next/cache': { unstable_cache: (fn, keys, options) => async network => {
      assert.equal(options.revalidate, 300);
      const saved = cache.get(network);
      if (saved && now - saved.time < options.revalidate * 1000) return saved.value;
      const value = await fn(network); cache.set(network, {value, time: now}); return value;
    } }
  }, { Date: Clock, fetch: async url => {
    calls++;
    if (mode === 'blocked') return new Response('', {status: 429, headers: {'Retry-After': '3600'}});
    if (mode === 'network') throw Error('Offline');
    return new Response(url.includes('instagram') ? instagram : url.includes('tiktok') ? tiktok() : facebook);
  }});
  return { get: route.GET, calls: () => calls, advance: ms => now += ms, mode: value => mode = value };
}
test('shared refresh cache, per-platform fallback, cooldown and recovery', async () => {
  const h = routeHarness();
  const first = await h.get();
  assert.equal(first.body.totalFollowers, 55007);
  assert.equal(first.body.platforms.facebook.source, 'confirmed');
  assert.equal(first.body.platforms.facebook.status, 'saved');
  assert.equal(first.body.platforms.tiktok.status, 'updated');
  await h.get(); await h.get(); assert.equal(h.calls(), 3);
  h.advance(301000); h.mode('blocked');
  const blocked = await h.get(); assert.equal(h.calls(), 6);
  assert.equal(blocked.body.platforms.tiktok.status, 'saved');
  assert.equal(blocked.body.platforms.tiktok.observedAt, first.body.platforms.tiktok.observedAt);
  h.advance(301000); await h.get(); assert.equal(h.calls(), 6);
  h.advance(3600000); h.mode('ok'); await h.get(); assert.equal(h.calls(), 9);
  h.advance(301000); h.mode('network'); const offline = await h.get();
  assert.equal(offline.body.totalFollowers, 55007);
});
test('concurrent cold requests share one scrape per profile', async () => {
  const h = routeHarness();
  await Promise.all([h.get(), h.get(), h.get()]);
  assert.equal(h.calls(), 3);
});
