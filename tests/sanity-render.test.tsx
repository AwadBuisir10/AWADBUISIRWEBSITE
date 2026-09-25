import assert from 'node:assert/strict';
import test from 'node:test';
import React, { type ComponentType } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ContentProvider } from '../components/ContentProvider';
import { About } from '../components/About';
import { CommunitySection } from '../components/CommunitySection';
import { ContactSection } from '../components/ContactSection';
import { CreativeGallery } from '../components/CreativeGallery';
import { CredentialsChapter } from '../components/CredentialsChapter';
import { Footer } from '../components/Footer';
import { GlobeNetwork } from '../components/GlobeNetwork';
import { Hero } from '../components/Hero';
import { LinkedInHighlights } from '../components/LinkedInHighlights';
import { MetricStrip } from '../components/MetricStrip';
import { Navbar } from '../components/Navbar';
import { ReelCarousel } from '../components/ReelCarousel';
import { VelocityMarquee } from '../components/VelocityMarquee';
import { SocialLinks } from '../components/SocialLinks';
import { WorkSection } from '../components/WorkSection';
import { defaultContent, type SiteContent } from '../data/content';
import { INITIAL_SOCIAL_COUNTS, summarizeCounts } from '../data/socialCounts';
import { normalizeContent } from '../lib/sanity/content';
import { makeSeedDocument } from '../lib/sanity/seed';

// Next compiles the app's preserved JSX. The Node/tsx runner uses the classic
// JSX runtime instead, so expose React for those same unmodified components.
(globalThis as typeof globalThis & { React: typeof React }).React = React;

const config = { projectId: 'testproject', dataset: 'production' };
const components: Record<string, ComponentType> = {
  About, CommunitySection, ContactSection, CreativeGallery, CredentialsChapter,
  Footer, GlobeNetwork, Hero, LinkedInHighlights, MetricStrip, Navbar,
  ReelCarousel, SocialLinks, VelocityMarquee, WorkSection
};

function render(Component: ComponentType, content: SiteContent) {
  return renderToStaticMarkup(<ContentProvider content={content}><Component /></ContentProvider>);
}

async function sparseContent() {
  const seed = await makeSeedDocument(defaultContent);
  seed.projects = [{ slug: 'new-project', title: 'New project', link: 'https://example.com/new-project' }];
  seed.socialLinks = [{ label: 'New social link', href: 'https://example.com/profile' }];
  seed.creative = {
    ...(seed.creative as object),
    capabilities: [{ top: 'New capability' }],
    storyFrames: [{ label: 'Image removed' }],
    kitViews: []
  };
  seed.reels = [{ id: 'new-reel', title: 'New reel', url: 'https://www.instagram.com/reel/example/' }];
  return normalizeContent(seed, config);
}

test('all sections survive current content, deleted collections, and incomplete CMS entries', async (t) => {
  const variants: Record<string, SiteContent> = {
    shipped: defaultContent,
    // Sanity unsets list fields when their final item is removed. This exercises
    // empty projects, filters, pillars, globe locations, and both galleries.
    deleted: normalizeContent({ _id: 'siteContent', _type: 'siteContent' }, config),
    incomplete: await sparseContent()
  };
  for (const [variant, content] of Object.entries(variants)) {
    for (const [name, Component] of Object.entries(components)) {
      await t.test(`${variant}: ${name}`, () => {
        assert.doesNotThrow(() => render(Component, content));
      });
    }
  }
});

test('a project with cleared optional labels keeps an accessible destination link', async () => {
  const seed = await makeSeedDocument(defaultContent);
  const projects = seed.projects as Array<Record<string, unknown>>;
  const project: Record<string, unknown> = { ...projects[2], link: 'https://example.com/new-project' };
  delete project.linkLabel;
  delete project.contextAlt;
  delete project.contextCaption;
  seed.projects = [project];
  const content = normalizeContent(seed, config);
  assert.ok(!content.projects[0].linkLabel, 'Clearing the label must not restore a different project’s label.');
  assert.ok(!content.projects[0].contextAlt, 'Clearing the alt text must not inherit another project’s description.');
  const html = render(WorkSection, content);
  const link = html.match(/<a\b[^>]*href="https:\/\/example\.com\/new-project"[^>]*>([\s\S]*?)<\/a>/);
  assert.ok(link, 'The project destination should remain visible when its optional label is cleared.');
  const accessibleText = link[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  assert.equal(accessibleText, 'View (opens in a new tab)', 'The link needs readable text, not only an arrow icon.');
  // Context image details are collapsed during server rendering; this fixture
  // also exercises their missing optional properties without asserting hidden UI.
});

test('renaming and reordering the follower card preserves its live data source', async () => {
  const seed = await makeSeedDocument(defaultContent);
  const metrics = seed.communityMetrics as Array<Record<string, unknown>>;
  seed.communityMetrics = [
    { label: 'Manual milestone', source: 'manual', value: 123456789 },
    { ...metrics[0], label: 'Community audience', value: 987654321 }
  ];
  const html = render(CommunitySection, normalizeContent(seed, config));
  const manual = html.match(/<span[^>]*>01<\/span>([\s\S]*?)<p[^>]*>Manual milestone<\/p>/);
  assert.ok(manual, 'The reordered manual statistic should render first.');
  assert.ok(manual[1].includes('123,456,789'), 'The first position must not force a manual card to show live followers.');
  const followers = html.match(/<span[^>]*>02<\/span>([\s\S]*?)<p[^>]*>Community audience<\/p>/);
  assert.ok(followers, 'The renamed follower card should render in its new position.');
  const expected = summarizeCounts(INITIAL_SOCIAL_COUNTS).totalFollowers.toLocaleString('en-US');
  assert.ok(followers[1].includes(expected), 'The follower card must retain its shared total after renaming and reordering.');
  assert.ok(!followers[1].includes('987,654,321'), 'The editable fallback must not replace the live counter.');
});

test('homepage statistics can hold the live follower card in any position', async () => {
  const seed = await makeSeedDocument(defaultContent);
  const followerCard = (seed.impactMetrics as Array<Record<string, unknown>>).find((metric) => metric.source === 'followers');
  assert.ok(followerCard, 'The shipped homepage statistics include a live follower card.');
  seed.impactMetrics = [
    { label: 'Manual milestone', source: 'manual', value: 123456789 },
    { ...followerCard, label: 'Community audience', value: 987654321 }
  ];
  const strip = render(MetricStrip, normalizeContent(seed, config)).match(/^([\s\S]*?)<p[^>]*>Manual milestone<\/p>([\s\S]*?)<p[^>]*>Community audience<\/p>/);
  assert.ok(strip, 'Both statistics render in their CMS order.');
  const expected = summarizeCounts(INITIAL_SOCIAL_COUNTS).totalFollowers.toLocaleString('en-US');
  assert.ok(strip[1].includes('123,456,789'), 'A manual card keeps its own value.');
  assert.ok(strip[2].includes(expected) && !strip[2].includes('987,654,321'), 'The follower card shows the shared live total.');
});
