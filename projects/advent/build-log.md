# Build log

One entry per finished PRD iteration: date, iteration, test result, anything that changed in the spec.

## 2026-11-24 — Iteration 0: skeleton and rules

Created `site/advent/index.html` (recipient view) and `site/advent/edit.html`
(builder), both placeholders only, plus `site/advent/css/style.css` (fluid
layout, builder goes to 3 columns at 900px) and `site/advent/js/index.js` +
`js/edit.js` as empty ES modules. Both pages link `site/shared/style.css` for
the palette. No inline scripts or event handlers.

`site/_headers` already had a strict CSP for `/advent/*` from the previous
commit (script-src/style-src 'self', img-src 'self' blob:, connect-src 'self'
+ the Supabase project URL, frame-ancestors 'none', base-uri 'none') — no
changes needed there.

Tests live in `projects/advent/tests/` (not under `site/`, per the README
layout table), as `iteration0.test.js`, runnable with `node --test
projects/advent/tests`. Checks: both pages exist, load the shared + advent
stylesheets, load JS only as `<script type="module" src="...">` with no
inline scripts/handlers, `css/style.css` and the two JS files exist and are
ES modules, and the `/advent/*` CSP section in `_headers` has every required
directive and no stray connect-src host besides Supabase.

**Test result: `node --test projects/advent/tests` PASS (6/6)** on Node
v26.13.1, installed via winget on 2026-11-24. Still unverified: the deploy
part of the pass criteria (HTTPS load on the A54, `curl -I` showing the CSP,
clean console, no requests to other sites). Needs a Netlify deploy.

Open question for Iteration 2: `_headers` has a baseline `/*` CSP with
`connect-src 'self'` and a separate `/advent/*` CSP that allows Supabase. If
Netlify applies both, browsers enforce both and Supabase calls would be
blocked. Check on the first deploy.

No spec changes. Note: the PRD's iteration-0 prompt says "in advent/"; built
under `site/advent/` instead, matching the README layout table and
CLAUDE.md's "only site/ is published" rule — not treated as a spec conflict.
