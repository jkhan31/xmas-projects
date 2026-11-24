// Run from the repo root: node --test "projects/advent/tests/*.test.mjs"
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const site = new URL('../../../site/', import.meta.url);
const read = (path) => readFileSync(new URL(path, site), 'utf8');

test('the advent CSP has the expected sources', () => {
  const section = read('_headers').split(/\r?\n\/advent\/\*\r?\n/)[1] ?? '';
  const csp = section.match(/Content-Security-Policy: (.*)/)?.[1].trim() ?? '';
  const directives = Object.fromEntries(csp.split(';').map((d) => {
    const [name, ...sources] = d.trim().split(/\s+/);
    return [name, sources.join(' ')];
  }));
  assert.equal(directives['default-src'], "'none'");
  assert.equal(directives['script-src'], "'self'");
  assert.equal(directives['style-src'], "'self'");
  assert.equal(directives['img-src'], "'self' blob:");
  assert.match(directives['connect-src'], /^'self' https:\/\/[a-z0-9]{20}\.supabase\.co$/);
  assert.equal(directives['frame-ancestors'], "'none'");
  assert.equal(directives['base-uri'], "'none'");
});

for (const page of ['advent/index.html', 'advent/edit.html']) {
  test(`${page}: local assets only, nothing inline`, () => {
    const html = read(page);
    assert.match(html, /<meta name="viewport" content="width=device-width, initial-scale=1">/);
    assert.match(html, /<script type="module" src="/);
    assert.doesNotMatch(html, /<style|\sstyle=|\son\w+=|https?:|["']\/\//i);
    assert.doesNotMatch(html, /<script(?![^>]*\ssrc=)/i);
    const refs = [...html.matchAll(/\s(?:href|src)="([^"]+)"/g)].map((m) => m[1]);
    assert.ok(refs.length >= 4);
    for (const ref of refs) {
      assert.ok(ref.startsWith('/'), `${ref} is not a site path`);
      assert.ok(existsSync(new URL(ref.slice(1), site)), `${ref} is missing`);
    }
  });
}
