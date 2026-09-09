const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '../..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const loadData = () => vm.runInNewContext(read('content.js') + '\nWORKSHOP_DATA');

// Minimal DOM doubles for the site's rendering and event handlers, not layout.
function element(attributes = {}) {
  const classes = new Set((attributes.class || '').split(' ').filter(Boolean));
  return {
    attributes: { ...attributes }, innerHTML: '', textContent: '', events: {},
    classList: {
      add: (...names) => names.forEach(name => classes.add(name)),
      remove: (...names) => names.forEach(name => classes.delete(name)),
      contains: name => classes.has(name),
      toggle: (name, enabled) => enabled ? classes.add(name) : classes.delete(name),
    },
    setAttribute(name, value) { this.attributes[name] = value; },
    getAttribute(name) { return this.attributes[name] ?? null; },
    addEventListener(name, listener) { this.events[name] = listener; },
    focus(options) { this.focused = true; this.focusOptions = options; },
    scrollIntoView(options) { this.scrollOptions = options; },
  };
}

function loadSite(options = {}) {
  const html = read('index.html');
  const ids = Object.fromEntries([...html.matchAll(/\bid="([^"]+)"/g)]
    .map(([, id]) => [id, element()]));
  const button = element({ 'aria-expanded': 'false' });
  const metas = {};
  const sectionLink = element({ href: '#program' });
  const skipLink = element({ href: '#main-content', class: 'skip-link' });
  const homeLink = element({ href: './' });
  homeLink.href = 'https://iisl-workshop.github.io/';
  const reveals = [element(), element()];
  let observer;
  const document = {
    events: {}, title: '',
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
      throw new Error('Unexpected selector: ' + selector);
    },
    addEventListener(name, handler) { this.events[name] = handler; },
  };
  const window = {
    events: {}, scrollY: 0,
    matchMedia: () => ({ matches: !!options.reducedMotion }),
    addEventListener(name, handler) { this.events[name] = handler; },
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
    observer = { callback, settings, items: [] };
    this.observe = item => observer.items.push(item);
  }
  if (options.observer !== false) window.IntersectionObserver = IntersectionObserver;
  vm.runInNewContext(options.script || read('script.js'), {
    WORKSHOP_DATA: options.data || loadData(), document, window, IntersectionObserver,
  });
  return { ids, button, metas, document, window, sectionLink, skipLink, homeLink, reveals, observer };
}

module.exports = { loadSite, loadData, read, root };
