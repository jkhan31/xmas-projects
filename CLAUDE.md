# Rules for Claude Code in this repo

Read `README.md` for the layout. The current project is the Advent Calendar Builder: the spec is `projects/advent/PRD.md` and the screens are in `projects/advent/wireframes/`.

## Standing rules (every app)

- Static front end only: plain HTML, CSS and ES modules. No framework, no build step, no CDN. Copy any library into the app's folder.
- No accounts for users, no tracking cookies, no third-party scripts, no runtime AI calls, no API keys in any page.
- Show anything a user types as plain text. Never use `innerHTML` with user or link data.
- Strict Content-Security-Policy via `site/_headers`. No inline scripts or inline event handlers. Only apps that need a backend may connect to Supabase, each with its own CSP section.
- System fonts only. Use the palette in `site/shared/style.css`.
- Pages are fluid from 360 px to 1440 px, mobile first. No language switcher.
- Only `site/` is published. Planning, scripts and docs stay outside it.

## Advent Calendar specifics

- Supabase backend. Messages and images are encrypted in the browser (AES-GCM 256). The key lives only in the URL fragment after `#`. Never log, send or store the key, the edit secret, or anything after the `#`.
- Supabase is shared across apps: use a Postgres schema per app (`advent` for this one), app-prefixed Edge Functions and buckets. See `supabase/README.md`.
- Server-side tables have RLS enabled with no policies. All access goes through Edge Functions that use the service-role key from secrets.
- The server decides which days are unlocked. Never trust the browser for that.
- Images and GIFs only. No video and no outside URLs.
- No sign-in. The creator gets an edit link. Store only a hash of the edit secret.

## How to work

- Do one PRD iteration at a time, in order. After each, run the iteration's test and report pass or fail before moving on.
- Say what you are about to do before you do it. Keep changes small.
- If the spec and the code disagree, stop and ask. Do not quietly change the spec.
- Append a short entry to `projects/advent/build-log.md` after each iteration.
- Never commit secrets. Supabase keys go in environment secrets, not in files.
