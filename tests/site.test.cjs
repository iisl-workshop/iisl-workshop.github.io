const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { loadSite, loadData, loadTranslations, read, root } = require('./helpers/site.cjs');
const click = (site, link) => {
  let prevented = false;
  const event = { target: link, preventDefault() { prevented = true; } };
  if (link.events.click) link.events.click(event);
  else site.document.events.click(event);
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
  for (const [, file] of read('styles.css').matchAll(/url\("([^"?#]+)(?:\?[^\"]*)?"\)/g)) {
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
  click(site, site.sectionLink);
  assert.equal(site.ids.program.scrollOptions.behavior, 'smooth');
  click(site, site.skipLink);
  assert.ok(site.ids['main-content'].focused);
  click(site, site.homeLink);
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
  click(site, site.sectionLink);
  assert.equal(site.ids.program.scrollOptions.behavior, 'auto');
});

test('language defaults to English, translates the whole page and restores the English content', () => {
  const data = loadData();
  const originalData = JSON.stringify(data);
  const site = loadSite({ data });
  const { ids, document, metas } = site;
  const toggle = ids['language-toggle'];
  const snapshot = () => JSON.stringify(Object.fromEntries(Object.entries(ids)
    .map(([id, item]) => [id, [item.innerHTML, item.textContent]])));
  const english = snapshot();
  assert.equal(document.documentElement.lang, 'en');
  assert.equal(toggle.textContent, 'KO');
  const dictionary = loadTranslations().ko;
  toggle.events.click();
  assert.equal(document.documentElement.lang, 'ko');
  assert.equal(toggle.textContent, 'EN');
  assert.equal(toggle.getAttribute('aria-label'), 'Switch to English');
  assert.equal(toggle.getAttribute('lang'), 'en');
  assert.equal(ids['hero-theme'].textContent, 'AI 기반 자율 보안');
  assert.equal(ids['hero-title-accent'].textContent, dictionary[data.meta.titleAccent]);
  assert.equal(ids['hero-date'].textContent, '2026년 10월 12일');
  assert.match(ids['about-copy'].innerHTML, /미래의 연결 시스템/);
  assert.match(ids['program-list'].innerHTML, /기조강연 I/);
  assert.match(ids['program-list'].innerHTML, /패널 토론 및 폐회/);
  assert.match(ids['speaker-grid'].innerHTML, /교수 · 기조강연/);
  assert.match(ids['organizer-grid'].innerHTML, /조직위원회/);
  assert.match(ids['host-grid'].innerHTML, /광주과학기술원 로고/);
  assert.match(ids['support-grid'].innerHTML, /GIST AI연구소/);
  assert.ok(ids['venue-actions'].innerHTML.includes(dictionary['Open in maps']));
  assert.ok(ids['hero-actions'].innerHTML.includes(dictionary[data.meta.registrationLabel]));
  assert.match(ids['event-facts'].innerHTML, /날짜/);
  assert.match(document.title, /AI 기반 자율 보안/);
  assert.equal(metas['meta[name="description"]'].getAttribute('content'), dictionary[data.meta.summary]);
  for (const item of site.translatedElements) {
    assert.equal(item.textContent, dictionary[item.getAttribute('data-i18n')]);
  }
  for (const item of site.translatedLabels) {
    assert.equal(item.getAttribute('aria-label'), dictionary[item.getAttribute('data-i18n-aria-label')]);
  }
  for (const speaker of data.speakers) {
    assert.ok(ids['speaker-grid'].innerHTML.includes(speaker.url.replaceAll('&', '&amp;')));
    assert.ok(ids['speaker-grid'].innerHTML.includes(speaker.image));
  }
  for (const item of data.program.items) {
    if (item.time) assert.ok(ids['program-list'].innerHTML.includes(item.time));
    if (item.endTime) assert.ok(ids['program-list'].innerHTML.includes(item.endTime));
  }
  assert.ok(ids['hero-actions'].innerHTML.includes(dictionary[data.meta.registrationUrl] || data.meta.registrationUrl));
  assert.equal(ids['venue-map'].src, data.venue.mapEmbedUrl);
  assert.equal(ids['venue-map'].attributeWrites.src, 1);
  toggle.events.click();
  assert.equal(document.documentElement.lang, 'en');
  assert.equal(snapshot(), english);
  assert.equal(JSON.stringify(data), originalData);
  assert.equal(loadSite().document.documentElement.lang, 'en');
});

test('repeated switches keep navigation, mobile labels, map state and one reveal observer active', () => {
  const site = loadSite();
  site.button.events.click();
  site.window.scrollY = 400;
  for (let i = 0; i < 5; i++) {
    site.ids['language-toggle'].events.click();
    assert.equal(site.window.listeners.size, 1);
    assert.equal(site.observers.filter(observer => !observer.disconnected).length, 1);
    assert.equal(site.window.scrollY, 400);
    assert.equal(site.window.scrollPosition, undefined);
    assert.equal(site.window.location.assigned, undefined);
    click(site, site.sectionLink);
    assert.equal(site.ids.program.scrollOptions.behavior, 'smooth');
  }
  assert.equal(site.ids['menu-label'].textContent, '메뉴 닫기');
  site.document.events.keydown({ key: 'Escape' });
  assert.equal(site.ids['menu-label'].textContent, '메뉴 열기');
  assert.ok(site.button.focused);
  assert.equal(site.ids['venue-map'].attributeWrites.src, 1);
  // A newly rendered hero link, including clicks on its nested arrow, is delegated.
  let prevented = false;
  const freshLink = {
    getAttribute: () => '#program',
    classList: { contains: () => false },
  };
  site.document.events.click({
    target: { closest: selector => selector === 'a[href^="#"]' ? freshLink : null },
    preventDefault() { prevented = true; },
  });
  assert.ok(prevented);
  assert.equal(site.ids.program.scrollOptions.behavior, 'smooth');
  const observer = site.observers.at(-1);
  observer.callback([{ target: site.reveals[0], isIntersecting: true, intersectionRatio: 0.5 }]);
  assert.ok(site.reveals[0].classList.contains('is-visible'));
  site.window.scrollY = 300;
  site.window.events.scroll();
  observer.callback([{ target: site.reveals[1], isIntersecting: true, intersectionRatio: 0.5 }]);
  assert.ok(site.reveals[1].classList.contains('is-reveal-static'));
});

test('Korean fallbacks remain safe and switching supports reduced motion or no observer', () => {
  for (const options of [{ reducedMotion: true }, { observer: false }]) {
    const data = loadData();
    data.meta.registrationUrl = '';
    data.venue.mapUrl = '';
    data.speakers.push({ name: '<New guest>', role: '', affiliation: '', talk: 'New title & topic' });
    const site = loadSite({ ...options, data });
    site.ids['language-toggle'].events.click();
    assert.ok(site.reveals.every(item => item.classList.contains('is-visible')));
    assert.ok(site.ids['hero-actions'].innerHTML.includes('aria-disabled="true">' + loadTranslations().ko[data.meta.registrationLabel]));
    assert.match(site.ids['venue-actions'].innerHTML, /지도 링크 준비 중/);
    assert.match(site.ids['speaker-grid'].innerHTML, /&lt;New guest&gt;/);
    assert.match(site.ids['speaker-grid'].innerHTML, /New title &amp; topic/);
    site.ids['language-toggle'].events.click();
    assert.equal(site.document.documentElement.lang, 'en');
  }
});

test('current display text has Korean translations except proper names and existing Korean drafts', () => {
  const data = loadData();
  const dictionary = loadTranslations().ko;
  const properNames = new Set(['IISL Workshop', 'GIST', 'KENTECH', 'DGIST', 'IEEE', ...data.speakers.map(speaker => speaker.name)]);
  const sharedFields = new Set(['type', 'image', 'url', 'logo', 'logoScale', 'registrationUrl', 'mapUrl', 'mapEmbedUrl', 'email', 'contactEmail']);
  function check(value, key = '') {
    if (sharedFields.has(key)) return;
    if (typeof value === 'string' && /[A-Za-z]/.test(value) && !/[가-힣]/.test(value)) {
      assert.ok(properNames.has(value) || Object.hasOwn(dictionary, value), 'Missing Korean translation: ' + value);
    } else if (Array.isArray(value)) value.forEach(item => check(item));
    else if (value && typeof value === 'object') Object.entries(value).forEach(([field, item]) => check(item, field));
  }
  check(data);
});

test('language starts in English and survives reloads in the same tab in both directions', () => {
  const storage = new Map();
  const firstVisit = loadSite({ storage });
  assert.equal(firstVisit.document.documentElement.lang, 'en');
  firstVisit.ids['language-toggle'].events.click();
  assert.equal(storage.get('iisl-workshop-language'), 'ko');

  const koreanReload = loadSite({ storage });
  assert.equal(koreanReload.document.documentElement.lang, 'ko');
  assert.equal(koreanReload.ids['language-toggle'].textContent, 'EN');
  assert.equal(koreanReload.ids['hero-theme'].textContent, 'AI 기반 자율 보안');
  koreanReload.ids['language-toggle'].events.click();
  assert.equal(storage.get('iisl-workshop-language'), 'en');

  const englishReload = loadSite({ storage });
  assert.equal(englishReload.document.documentElement.lang, 'en');
  assert.equal(englishReload.ids['language-toggle'].textContent, 'KO');
  assert.equal(englishReload.ids['hero-theme'].textContent, loadData().meta.themeTitle);
  assert.equal(loadSite().document.documentElement.lang, 'en');
});

test('Korean professor names appear in speaker cards and match the program translations', () => {
  const site = loadSite();
  const dictionary = loadTranslations().ko;
  const names = ['Euiseok Hwang', 'Hyuk Lim', 'Youngsik Kim', 'Yongwoo Lee', 'Duk-jo Kong'];
  site.ids['language-toggle'].events.click();
  for (const name of names) {
    const korean = dictionary[name];
    assert.match(korean, /[가-힣]/);
    assert.ok(site.ids['speaker-grid'].innerHTML.includes('<h3>' + korean + '</h3>'));
    assert.ok(site.ids['speaker-grid'].innerHTML.includes('alt="' + korean + '"'));
    assert.ok(site.ids['program-list'].innerHTML.includes(dictionary['Prof. ' + name]));
    assert.equal(dictionary['Prof. ' + name], korean + ' 교수');
  }
  site.ids['language-toggle'].events.click();
  for (const name of names) {
    assert.ok(site.ids['speaker-grid'].innerHTML.includes('<h3>' + name + '</h3>'));
  }
});

test('registration buttons use the correct absolute URL in each language', () => {
  const englishUrl = loadData().meta.registrationUrl;
  // A Korean-specific URL is optional; without one both pages share the base URL.
  const koreanUrl = loadTranslations().ko[englishUrl] || englishUrl;
  assert.equal(new URL(koreanUrl).protocol, 'https:');
  const site = loadSite();
  const registrationHref = () => site.ids['hero-actions'].innerHTML.match(/class="button button-registration" href="([^"]+)"/)[1];
  assert.equal(registrationHref(), englishUrl);
  site.ids['language-toggle'].events.click();
  assert.equal(registrationHref(), koreanUrl);
  assert.match(site.ids['hero-actions'].innerHTML, /target="_blank" rel="noopener noreferrer"/);
  const reloaded = loadSite({ storage: site.storage });
  assert.ok(reloaded.ids['hero-actions'].innerHTML.includes('href="' + koreanUrl + '"'));
  site.ids['language-toggle'].events.click();
  assert.equal(registrationHref(), englishUrl);
});

test('invalid or blocked language storage never prevents rendering or switching', () => {
  for (const options of [
    { storage: new Map([['iisl-workshop-language', 'invalid']]) },
    { storageUnavailable: true },
    { storageWriteBlocked: true },
  ]) {
    const site = loadSite(options);
    assert.equal(site.document.documentElement.lang, 'en');
    site.ids['language-toggle'].events.click();
    assert.equal(site.document.documentElement.lang, 'ko');
    site.ids['language-toggle'].events.click();
    assert.equal(site.document.documentElement.lang, 'en');
  }
});
