// Iteration 0 test: the app skeleton exists, has no inline scripts/handlers,
// and the Netlify CSP header for /advent/* matches the PRD's rule.
// Run from the repo root with: node --test projects/advent/tests

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..', '..', '..');
const sitePath = (...parts) => path.join(repoRoot, 'site', ...parts);

function read(relPath) {
  return fs.readFileSync(sitePath(...relPath.split('/')), 'utf8');
}

test('index.html and edit.html exist and load the shared + advent stylesheets', () => {
  for (const page of ['advent/index.html', 'advent/edit.html']) {
    const html = read(page);
    assert.match(html, /<!doctype html>/i);
    assert.match(html, /href="\.\.\/shared\/style\.css"/);
    assert.match(html, /href="css\/style\.css"/);
  }
});

test('index.html and edit.html load their JS as ES modules, not inline scripts', () => {
  for (const page of ['advent/index.html', 'advent/edit.html']) {
    const html = read(page);
    assert.match(html, /<script type="module" src="js\/(index|edit)\.js"><\/script>/);
  }
});

test('neither page has inline event handlers or inline <script> bodies', () => {
  for (const page of ['advent/index.html', 'advent/edit.html']) {
    const html = read(page);
    assert.doesNotMatch(html, /\son[a-z]+\s*=/i, 'found an inline event handler attribute');
    assert.doesNotMatch(html, /<script(?![^>]*\bsrc=)[^>]*>[^<]+<\/script>/i, 'found an inline script body');
  }
});

test('css/style.css and the js/ ES modules exist', () => {
  assert.ok(fs.existsSync(sitePath('advent', 'css', 'style.css')));
  for (const file of ['index.js', 'edit.js']) {
    const js = read(`advent/js/${file}`);
    assert.match(js, /export\s*\{/, `${file} should be an ES module`);
  }
});

test('_headers sets a strict CSP for /advent/* per the PRD', () => {
  const headers = fs.readFileSync(path.join(repoRoot, 'site', '_headers'), 'utf8');
  const section = headers.split(/\n(?=\/)/).find((block) => block.trim().startsWith('/advent/*'));
  assert.ok(section, '_headers has no /advent/* section');

  const required = [
    "script-src 'self'",
    "style-src 'self'",
    "img-src 'self' blob:",
    "connect-src 'self' https://",
    "frame-ancestors 'none'",
    "base-uri 'none'",
  ];
  for (const rule of required) {
    assert.ok(section.includes(rule), `_headers /advent/* section is missing: ${rule}`);
  }
});

test('_headers sends no third-party connect-src for /advent/* other than Supabase', () => {
  const headers = fs.readFileSync(path.join(repoRoot, 'site', '_headers'), 'utf8');
  const section = headers.split(/\n(?=\/)/).find((block) => block.trim().startsWith('/advent/*'));
  const connectSrc = /connect-src ([^;]+);/.exec(section)[1].trim();
  const sources = connectSrc.split(/\s+/);
  for (const src of sources) {
    assert.ok(
      src === "'self'" || (src.startsWith('https://') && src.endsWith('.supabase.co')),
      `unexpected connect-src entry: ${src}`
    );
  }
});
