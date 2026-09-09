const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { loadSite, loadData, read, root } = require('./helpers/site.cjs');
const click = link => {
  let prevented = false;
  link.events.click({ preventDefault() { prevented = true; } });
  assert.ok(prevented);
};

test('content has no initials fields and all local assets exist', () => {
  const data = loadData();
  for (const speaker of data.speakers) assert.equal('initials' in speaker, false);
  for (const item of [...data.speakers, ...data.institutions.hosts, ...data.institutions.supporters]) {
    const asset = item.image || item.logo;
    if (asset) assert.ok(fs.existsSync(path.join(root, asset.split('?')[0])), asset);
  }
  for (const [, file] of read('index.html').matchAll(/(?:href|src)="([^"?#]+\.(?:css|js))/g)) {
    assert.ok(fs.existsSync(path.join(root, file)), file);
  }
  assert.match(read('index.html'), /rel="icon" href="data:,"/);
  assert.doesNotMatch(read('index.html') + read('script.js') + read('styles.css'), /assets\/favicon/);
});

test('program, full-card speaker links, institution counts and map render', () => {
  const { ids } = loadSite();
  const data = loadData();
  assert.equal((ids['speaker-grid'].innerHTML.match(/class="speaker-card /g) || []).length, data.speakers.length);
  assert.equal((ids['speaker-grid'].innerHTML.match(/target="_blank" rel="noopener noreferrer"/g) || []).length, data.speakers.length);
  assert.doesNotMatch(ids['program-list'].innerHTML, /<details|<summary/);
  for (const [id, items] of [['host-grid', data.institutions.hosts], ['support-grid', data.institutions.supporters]]) {
    assert.equal((ids[id].innerHTML.match(/class="institution-card/g) || []).length, items.length);
  }
  assert.equal(ids['venue-map'].src, data.venue.mapEmbedUrl);
  assert.match(ids['venue-actions'].innerHTML, /Open in maps/);
});

test('empty optional fields retain placeholders and text is escaped', () => {
  const data = loadData();
  data.meta.registrationUrl = '';
  data.venue.mapUrl = '';
  data.speakers = [{ name: '<Guest>', image: '', url: '', role: '', talk: '', affiliation: '' }];
  data.institutions.hosts = [{ name: 'A & B', displayName: 'A & B', logo: '', url: '' }];
  const { ids } = loadSite({ data });
  assert.match(ids['hero-actions'].innerHTML, /aria-disabled="true"/);
  assert.match(ids['speaker-grid'].innerHTML, /^<article/);
  assert.match(ids['speaker-grid'].innerHTML, /speaker-initials[^>]*>&lt;G<\/span>/);
  assert.doesNotMatch(ids['speaker-grid'].innerHTML, /<Guest>/);
  assert.match(ids['host-grid'].innerHTML, /institution-wordmark">A &amp; B/);
  assert.match(ids['venue-actions'].innerHTML, /Map link coming soon/);
});

test('all supported logo sizes retain their visual markup', () => {
  const data = loadData();
  data.institutions.hosts = ['large', 'small', 'expanded', 'extra-large', 'unknown'].map(logoScale => ({
    name: 'Logo', logo: 'logo.png', logoScale, url: '',
  }));
  const markup = loadSite({ data }).ids['host-grid'].innerHTML;
  for (const size of ['large', 'small', 'expanded', 'extra-large']) assert.ok(markup.includes('institution-logo-' + size));
  assert.match(markup, /viewBox="209 48 343 105"/);
  assert.doesNotMatch(markup, /institution-logo-unknown/);
});

test('mobile menu opens, closes on links and Escape restores focus', () => {
  const { button, ids, document } = loadSite();
  button.events.click();
  assert.equal(button.getAttribute('aria-expanded'), 'true');
  assert.ok(ids['nav-links'].classList.contains('is-open'));
  ids['nav-links'].events.click({ target: { closest: () => ({}) } });
  assert.equal(button.getAttribute('aria-expanded'), 'false');
  button.events.click();
  document.events.keydown({ key: 'Escape' });
  assert.equal(button.getAttribute('aria-expanded'), 'false');
  assert.ok(button.focused);
});

test('section navigation, skip-link focus, hash cleanup and home reset remain intact', () => {
  const site = loadSite({ hash: '#program' });
  assert.equal(site.window.history.url, '/?preview=1');
  click(site.sectionLink);
  assert.equal(site.ids.program.scrollOptions.behavior, 'smooth');
  click(site.skipLink);
  assert.ok(site.ids['main-content'].focused);
  click(site.homeLink);
  assert.equal(site.window.history.scrollRestoration, 'manual');
  assert.deepEqual(site.window.scrollPosition, [0, 0]);
  assert.equal(site.window.location.assigned, site.homeLink.href);
});

test('reveal repeats downward and is static while scrolling upward', () => {
  const { observer, reveals, window } = loadSite();
  const target = reveals[0];
  const enter = () => observer.callback([{ target, isIntersecting: true, intersectionRatio: 0.5 }]);
  const leave = () => observer.callback([{ target, isIntersecting: false, intersectionRatio: 0 }]);
  enter();
  assert.ok(target.classList.contains('is-visible'));
  leave();
  assert.equal(target.classList.contains('is-visible'), false);
  window.scrollY = 100; window.events.scroll();
  window.scrollY = 50; window.events.scroll();
  enter();
  assert.ok(target.classList.contains('is-reveal-static'));
  leave();
  window.scrollY = 100; window.events.scroll();
  enter();
  assert.equal(target.classList.contains('is-reveal-static'), false);
});

test('reduced motion and missing observer keep content accessible', () => {
  for (const options of [{ reducedMotion: true }, { observer: false }]) {
    const site = loadSite(options);
    assert.ok(site.reveals.every(item => item.classList.contains('is-visible')));
  }
  const site = loadSite({ reducedMotion: true });
  click(site.sectionLink);
  assert.equal(site.ids.program.scrollOptions.behavior, 'auto');
});
