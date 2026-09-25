import assert from 'node:assert/strict';
import test from 'node:test';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { defaultContent } from '../data/content';
import { getSanityConfig, normalizeContent, resolveMedia, safeContentUrl } from '../lib/sanity/content';
import { makeSeedDocument } from '../lib/sanity/seed';

const config = { projectId: 'testproject', dataset: 'production' };

test('unconfigured or absent CMS preserves the shipped site', () => {
  assert.equal(getSanityConfig({}), null);
  assert.equal(normalizeContent(null, config), defaultContent);
  assert.equal(normalizeContent({ _id: 'drafts.siteContent', _type: 'siteContent' }, config), defaultContent);
  assert.throws(() => getSanityConfig({ SANITY_PROJECT_ID: 'bad/id' }));
});

test('seed round-trip preserves current copy and local media with stable keys', async () => {
  const seed = await makeSeedDocument(defaultContent);
  assert.deepEqual(await makeSeedDocument(defaultContent), seed);
  const content = normalizeContent(seed, config);
  // Missing optional keys may be normalized to empty strings; every present
  // field in the source must keep its original value and order.
  function compare(actual: unknown, expected: unknown, at = '') {
    if (Array.isArray(expected)) {
      assert.ok(Array.isArray(actual), at);
      assert.equal(actual.length, expected.length, at);
      expected.forEach((item, i) => compare(actual[i], item, `${at}[${i}]`));
    } else if (expected && typeof expected === 'object') {
      for (const [key, value] of Object.entries(expected)) compare((actual as Record<string, unknown>)[key], value, `${at}.${key}`);
    } else assert.equal(actual, expected, at);
  }
  compare(content, defaultContent);
  const projects = seed.projects as Array<Record<string, unknown>>;
  assert.ok(projects.every(project => project._key && project._type === 'item'));
  assert.equal(new Set(projects.map(project => project._key)).size, projects.length);
});

test('edits, additions, reordering and deletion come from CMS without resurrecting defaults', async () => {
  const seed = await makeSeedDocument(defaultContent);
  const projects = seed.projects as Array<Record<string, unknown>>;
  seed.projects = [{ ...projects[1], slug: 'new-project', title: 'A new project' }, projects[0]];
  seed.hero = { ...(seed.hero as object), headline: 'Published replacement' };
  seed.experiences = [];
  delete seed.reels; // Sanity may unset a field when its last item is removed.
  seed.cities = [];
  const content = normalizeContent(seed, config);
  assert.equal(content.hero.headline, 'Published replacement');
  assert.equal(content.projects.length, 2);
  assert.equal(content.projects[0].slug, 'new-project');
  assert.equal(content.projects[1].slug, defaultContent.projects[0].slug);
  assert.deepEqual(content.experiences, []);
  assert.deepEqual(content.reels, []);
  assert.deepEqual(content.cities, []);
});

test('uploaded image and file take precedence over migration paths', () => {
  const image = resolveMedia({ _type: 'siteImage', path: '/old.jpg', image: { _type: 'image', asset: { _type: 'reference', _ref: 'image-abc123-1200x800-jpg' } } }, config);
  assert.match(String(image), /^https:\/\/cdn.sanity.io\/images\/testproject\/production\/abc123-1200x800.jpg\?/);
  const video = resolveMedia({ _type: 'siteMedia', path: '/old.mp4', file: { _type: 'file', asset: { _type: 'reference', _ref: 'file-abc123-mp4' } } }, config);
  assert.equal(video, 'https://cdn.sanity.io/files/testproject/production/abc123.mp4');
});

test('bad URL protocols and invalid image hosts are rejected', async () => {
  for (const url of ['javascript:alert(1)', '//evil.example/test', 'data:text/html,test', '/\\evil.example', ' https://example.com']) assert.equal(safeContentUrl(url), false);
  for (const url of ['/file.pdf', '#work', 'https://example.com', 'mailto:me@example.com']) assert.equal(safeContentUrl(url), true);
  assert.equal(resolveMedia({ _type: 'siteImage', path: 'https://unknown.example/x.jpg' }, config), null);
  assert.equal(resolveMedia({ _type: 'siteImage', path: 'https://cdn.sanity.io/files/test/production/image.jpg' }, config), null);
  assert.equal(resolveMedia({ _type: 'siteMedia', path: 'https://cdn.sanity.io/files/test/production/file.pdf' }, config), null);
  assert.equal(resolveMedia({ _type: 'siteMedia', file: { asset: { _ref: 'file-abc123-pdf' } } }, config), null);
  const seed = await makeSeedDocument(defaultContent);
  seed.socialLinks = [{ label: 'Bad', network: 'github', href: 'javascript:alert(1)' }];
  assert.equal(normalizeContent(seed, config).socialLinks[0].href, '');
});

test('every seeded local image/file/video exists and can be uploaded', async () => {
  let count = 0;
  await makeSeedDocument(defaultContent, async media => {
    if (media.path.startsWith('/')) {
      assert.ok(existsSync(path.join(process.cwd(), 'public', media.path)), media.path);
      count++;
    }
    return media;
  });
  assert.ok(count >= 20, `Expected all media fields, found ${count}`);
});
