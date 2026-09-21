const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '../..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const loadData = () => vm.runInNewContext(read('content.js') + '\nWORKSHOP_DATA');
const loadTranslations = () => vm.runInNewContext(read('translations.js') + '\nWORKSHOP_TRANSLATIONS');

// Minimal DOM doubles for the site's rendering and event handlers, not layout.
function element(attributes = {}) {
  const classes = new Set((attributes.class || '').split(' ').filter(Boolean));
  return {
    attributes: { ...attributes }, innerHTML: '', textContent: '', events: {}, attributeWrites: {},
    classList: {
      add: (...names) => names.forEach(name => classes.add(name)),
      remove: (...names) => names.forEach(name => classes.delete(name)),
      contains: name => classes.has(name),
      toggle: (name, enabled) => enabled ? classes.add(name) : classes.delete(name),
    },
    setAttribute(name, value) {
      this.attributes[name] = value;
      this.attributeWrites[name] = (this.attributeWrites[name] || 0) + 1;
    },
    getAttribute(name) { return this.attributes[name] ?? null; },
    get src() { return this.attributes.src; },
    set src(value) { this.setAttribute('src', value); },
    closest(selector) {
      if (selector === 'a' && this.attributes.href) return this;
      if (selector === 'a[href^="#"]' && this.attributes.href?.startsWith('#')) return this;
      return null;
    },
    addEventListener(name, listener) { this.events[name] = listener; },
    focus(options) { this.focused = true; this.focusOptions = options; },
    scrollIntoView(options) { this.scrollOptions = options; },
  };
}

function loadSite(options = {}) {
  const html = read('index.html');
  const storage = options.storage || new Map();
  const sessionStorage = {
    getItem: key => storage.get(key) ?? null,
    setItem(key, value) {
      if (options.storageWriteBlocked) throw new Error('Storage write blocked');
      storage.set(key, String(value));
    },
  };
  const ids = Object.fromEntries([...html.matchAll(/\bid="([^"]+)"/g)]
    .map(([, id]) => [id, element()]));
  const button = element({ 'aria-expanded': 'false' });
  const metas = {};
  const sectionLink = element({ href: '#program' });
  const skipLink = element({ href: '#main-content', class: 'skip-link' });
  const homeLink = element({ href: './' });
  homeLink.href = 'https://iisl-workshop.github.io/';
  const reveals = [element(), element()];
  const observers = [];
  const translatedElements = [...html.matchAll(/\bdata-i18n="([^"]+)"/g)]
    .map(([, text]) => element({ 'data-i18n': text }));
  const translatedLabels = [...html.matchAll(/\bdata-i18n-aria-label="([^"]+)"/g)]
    .map(([, text]) => element({ 'data-i18n-aria-label': text }));
  const document = {
    events: {}, title: '', documentElement: { lang: 'en' },
    getElementById: id => ids[id] || null,
    querySelector(selector) {
      if (selector === '.menu-button') return button;
      if (selector.startsWith('meta[')) return metas[selector] ||= element();
      throw new Error('Unexpected selector: ' + selector);
    },
    querySelectorAll(selector) {
      if (selector === 'a[href^="#"]') return [sectionLink, skipLink];
      if (selector === 'a.brand[href="./"]') return [homeLink];
      if (selector === '.reveal') return reveals;
      if (selector === '[data-i18n]') return translatedElements;
      if (selector === '[data-i18n-aria-label]') return translatedLabels;
      throw new Error('Unexpected selector: ' + selector);
    },
    addEventListener(name, handler) { this.events[name] = handler; },
  };
  const window = {
    events: {}, scrollY: 0, listeners: new Set(),
    get sessionStorage() {
      if (options.storageUnavailable) throw new Error('Storage access blocked');
      return sessionStorage;
    },
    matchMedia: () => ({ matches: !!options.reducedMotion }),
    addEventListener(name, handler) { this.events[name] = handler; this.listeners.add(handler); },
    removeEventListener(name, handler) {
      if (this.events[name] === handler) delete this.events[name];
      this.listeners.delete(handler);
    },
    requestAnimationFrame: handler => handler(),
    scrollTo(x, y) { this.scrollPosition = [x, y]; },
    location: {
      hash: options.hash || '', pathname: '/', search: '?preview=1',
      assign(url) { this.assigned = url; },
    },
    history: {
      scrollRestoration: 'auto',
      replaceState(state, title, url) { this.url = url; window.location.hash = ''; },
    },
  };
  function IntersectionObserver(callback, settings) {
    const observer = { callback, settings, items: [], disconnected: false };
    observers.push(observer);
    this.observe = item => observer.items.push(item);
    this.disconnect = () => { observer.disconnected = true; };
  }
  if (options.observer !== false) window.IntersectionObserver = IntersectionObserver;
  vm.runInNewContext(options.script || read('script.js'), {
    WORKSHOP_DATA: options.data || loadData(), WORKSHOP_TRANSLATIONS: loadTranslations(),
    document, window, IntersectionObserver,
  });
  return {
    ids, button, metas, document, window, sectionLink, skipLink, homeLink, reveals,
    observer: observers[0], observers, translatedElements, translatedLabels, storage,
  };
}

module.exports = { loadSite, loadData, loadTranslations, read, root };
