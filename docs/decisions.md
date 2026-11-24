# Decisions

## Locked

- Free, no sign-in for users, no runtime AI calls, no third-party scripts.
- Static front end on Netlify from GitHub. Only `site/` is published.
- Advent uses Supabase with browser-side AES-GCM encryption. The key lives only after the `#` in the link. The server decides unlocked days. Image and GIF only.
- Edit link instead of accounts. Drafts expire after 14 days without edits. Published calendars are deleted 30 days after the end date.
- Two Advent modes: one person, or a group. No language option. Phone and desktop layouts.
- One shared Supabase project, with a schema, functions and bucket per app (see `supabase/README.md`).
- Host: `xmas-projects.jasonkhanani.com` (chosen Nov 23, "for now"). One site, one folder per app. If it changes later, update the PRD links, the wireframes and the video scripts, and re-check `site/_headers`. Links already shared would break, so settle it before sharing any.
- Built with Claude Code, one PRD iteration at a time.

## Chase the New Year (slot 5 is tentative: may be replaced or dropped)

- A one-night challenge: plan a route of airline flights, catch as many New Year midnights as you can inside the 26-hour window (first midnight 10:00 UTC Dec 31, last 12:00 UTC Jan 1), and try to beat par.
- One fixed regular airliner, no speed presets. Settings: connection time and longest leg. A flight limit per challenge.
- A midnight counts at an airport or in the air. Each UTC offset counts once. Real time zones, read from a precomputed grid of UTC offsets for Jan 1, 2027 (ocean zones included). No waiting at stops.
- Flight times are estimated (overhead plus distance over cruise speed, slower westbound), calibrated by hand on 10 to 15 routes. No real schedules; a flight is always assumed ready on landing.
- Airport list of about 150 to 250 major airports, trimmed by hand from OurAirports.
- Game layer: presets with fixed starts, challenge links (start, limit, score; no server), personal best on the device. Par for presets is computed offline by a script.
- If time, cut first: optional leaderboard (nickname only, server replays routes), live "show me the best", "what this ignores" panel.
- Not in v1: real schedules, live or wind data, accounts.
- Open: whether slot 5 stays. If it is dropped, "five apps in five weeks" in the series intro has to change before filming.

## Open

- **Supabase free-tier pausing.** Check current rules and decide on Pro for December or a keep-alive ping.
- **Platforms you will post to.** Changes the end card and captions only.
- **Later-app dates** have not been re-checked against the shifted Advent schedule.
