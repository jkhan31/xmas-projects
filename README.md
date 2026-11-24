# labs

Free, browser-based Christmas and New Year mini web apps, built in public as a December 2026 short-video series. Each app is also a portfolio piece.

Planned host: `xmas-projects.jasonkhanani.com`. Netlify publishes only the `site/` folder.

## Layout

| Folder | What is in it |
| --- | --- |
| `site/` | The public site. One folder per app, plus a hello page and shared styles. |
| `supabase/` | Backend for the Advent Calendar only: SQL migrations and Edge Functions. |
| `projects/` | Planning per project: brief, tests, build log. Never published. |
| `content/` | Video scripts, schedule and shared setup notes, CapCut notes. |
| `docs/` | Decisions and the handoff note. |

## Apps and dates

| App | Folder | Build | Post |
| --- | --- | --- | --- |
| Advent Calendar Builder | `site/advent/` | Nov 24-26 | Dec 1 |
| Secret Santa and White Elephant | `site/santa/` | Nov 30 - Dec 2 | Dec 7 and 9 |
| Gift Wrap Calculator | `site/giftwrap/` | Dec 7-9 | Dec 14 and 16 |
| NYE Bingo Kit | `site/bingo/` | Dec 14-15 | Dec 22 and 24 |
| Chase the New Year | `site/newyear/` | Dec 17, 18, 21 | Dec 29 and 31 |

Series intro video: filmed Nov 27, posts Nov 30 if edited, otherwise Dec 2. Dates for apps after Advent come from the original Build Plans and have not been re-checked against the shifted Advent schedule.

## Start here

1. Read `CLAUDE.md`, then `projects/advent/PRD.md`.
2. Build one PRD iteration at a time. Run its test before the next one.
3. Log what you finished in `projects/advent/build-log.md`.
