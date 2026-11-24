# Build log

One entry per finished PRD iteration: date, iteration, test result, anything that changed in the spec.


## 2026-11-24: Iteration 0, skeleton and rules

Result: **not passed yet** (built; local browser checks pass, deployed checks and `node --test` outstanding).

- Built: placeholder `index.html` and `edit.html`, `css/style.css`, `js/` modules and an icon in `site/advent/`; tests in `projects/advent/tests/`. `site/_headers` unchanged, it already had the required CSP.
- Pass, local Chrome with the `/advent/*` CSP: both pages load, no console messages, all requests logged by the local server were for our own files. Builder has no sideways scroll at 360 px, 2 columns at 900 and 3 at 1440. Not a full network-panel check.
- Pass: the live `/advent/` path already sends the CSP over HTTPS (seen on its 404, before these pages were deployed).
- Not run: `node --test` (Node is not installed), so the tests are unproven. Deployed pages, `curl -I` on them, the network panel and the A54.
- Spec changes: none. PRD `advent/` paths mapped to the README layout.
