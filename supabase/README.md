# Supabase (shared by all apps that need a backend)

One Supabase project can serve several apps. Today only the Advent Calendar needs one. The other four planned apps are fully static.

## Conventions so apps never collide

- **Schema per app.** Advent tables live in a Postgres schema named `advent` (`advent.calendars`, `advent.days`, `advent.unlocked_days(...)`), not in `public`. A future app gets its own schema, such as `santa`. The PRD says `calendars` and `days`; create them inside the `advent` schema.
- **Edge Functions prefixed by app:** `advent-create-calendar`, `advent-get-calendar`, and so on. The PRD's plain names map to these.
- **Storage bucket per app:** `advent-media` (private).
- **Migrations prefixed by app:** `migrations/20261124_advent_0001_init.sql`.
- **RLS on, no policies, everything through Edge Functions** for every app. Never expose a table directly to the browser.
- **CSP per app:** each app's section in `site/_headers` allows only its own Supabase calls.
- **Keys:** the service-role key lives only in Supabase secrets, never in files. The browser only ever sees the project URL.

## Trade-offs of sharing one project

- One free quota, one pause rule and one bill for everything, so a busy app can starve the others. Check current free-tier limits and pausing before relying on it.
- Two free projects are normally allowed per account (check current terms). If a later app has very different needs, give it its own project instead of forcing it into this one.
- Deleting an app means dropping its schema, functions and bucket. The naming above makes that clean.

Setup order: create the project before PRD iteration 1, then follow `projects/advent/PRD.md`.
