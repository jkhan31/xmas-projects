# Advent Calendar Builder

Status: designed, not built. Build window Nov 24-26, filming Nov 27, post Dec 1 (about 8 hours of build).

- `PRD.md`: the full spec. Features F1-F14, unlock rules, links and editing, build iterations 0-8, release gate, daily reminder.
- `wireframes/`: lowfi screens (source files). The master copy is the published canvas: https://claude.ai/artifact/PTyHBJe1SdLDKh7z4yRYMW
- `build-log.md`: one entry per finished iteration.

## Decisions made since the PRD was first drafted (all already reflected in the PRD)

- Two modes: a calendar for one person, or one shared with a group. Named links for groups. "Make a copy for someone else" for one-person calendars (should-have).
- A banner counts down hh:mm:ss to the next gift once every unlocked door is opened.
- The daily reminder event carries the calendar link in its URL, description and location.
- No language option. UI works on phone and desktop.

## Cut order if time runs short

1. Make a copy for someone else
2. Named links
3. Daily reminder
4. Images (iteration 7 is already the first cut)

## Before building

- Check Supabase free-tier pause rules and decide on Pro for December or a keep-alive ping.
- Create the Supabase project the morning of Nov 24.
- Prepare a 12-day demo calendar for filming.

## Themes

Six presets in `site/shared/style.css` (Classic, Snowy Night, Candy Cane, Evergreen, Gingerbread, Aurora) plus 8 safe accent colors and a door icon. Contrast checked: text on background at least 11:1, accent on background at least 5:1. Chosen theme is stored in the encrypted settings. No free color wheel in v1.
