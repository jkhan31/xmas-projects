# Advent Calendar Builder: PRD and Build Guide

Nov 23, 2026 · Jason Kester Hanani

## Scope and architecture decision

Use Supabase from day one, and encrypt each message and image in the browser before it is stored. The server can then release a day's content only when that day arrives, without ever being able to read it. A pure link-as-data app can't do that, because every message would sit inside the link from the start.

This replaces the text-only, link-as-data design in the Advent section of the Build Plans doc. Scope is now messages (text) and images or GIFs only. Video and outside URLs are out.

| Your requirement | How it is met | Honest limit |
| --- | --- | --- |
| Start and end dates, inclusive | Stored as calendar dates. Days = end − start + 1, capped at 31 | None |
| Message and image or GIF per day | Text up to 280 characters. Images are resized in the browser. GIFs are kept as they are, up to 2 MB | No video, no outside URLs |
| Opens at midnight in the recipient's timezone | The server works out the recipient's local date from the timezone their browser reports, and sends only the days that have arrived | A recipient could claim a timezone ahead of their own and open at most about one day early. Pinning a calendar to one fixed timezone removes this |
| Earlier days stay open, opened stays opened | The server sends every day up to today. The browser remembers which doors were opened | If browser data is cleared, doors look unopened again, but open instantly |
| Privacy | Content is encrypted with a key that exists only in the part of the link after the `#`, which is never sent to any server | A lost link means a lost calendar. You cannot recover or read it |
| Editing | The creator gets a separate edit link with a secret | Rules in the editing section |

Schedule impact, stated plainly: the build is now about 8 hours, not 5. Plan it as Tuesday to Thursday, film Friday Nov 27, edit Monday Nov 30, post the Advent video Dec 1. The intro posts Nov 30 only if its edit is finished by then, otherwise Dec 2. The weekend stays off. Images are the cut line: if time runs short, ship text only on Dec 1 and add images the next week.

What you take on by running a server:

- A Supabase project to keep alive. Check the current free-tier limits and the rule that pauses inactive projects before relying on it.
- Stored data you are responsible for. Calendars are deleted automatically 30 days after their end date, and the privacy footer says so.
- Abuse risk. Because content is encrypted you cannot see it, so the defences are limits, not moderation: caps per calendar, a daily global upload cap, rate limits and a kill switch that turns uploads off.

## Feature requirements

Fourteen features, eleven of them must-haves. Your four asks are F1 to F4, and the rest are the small additions I'd make to keep it safe, testable and fun. Images (F2b) are the first thing to cut if time runs short.

| ID | Feature | Priority | Requirement |
| --- | --- | --- | --- |
| F1 | Start and end dates | Must | Both dates are plain calendar dates, and both days are included. Days = end − start + 1, between 1 and 31. End cannot be before start. A start date in the past is allowed, with a warning that those days will already be open |
| F2a | Message per day | Must | Plain text up to 280 characters, with emoji. Every day needs a message or an image before the link can be shared |
| F2b | Image or GIF per day | Should | JPEG, PNG, WebP or GIF. Images are resized in the browser to 1,280 px on the long side. GIFs are kept as they are, up to 2 MB. Encrypted in the browser before upload. At most one per day |
| F3 | Midnight unlock | Must | A day opens at 00:00 on its date in the recipient's timezone. Decided by the server, never by the page alone. Not-yet-unlocked content is never sent to the browser |
| F4 | Open state | Must | Any unlocked day that hasn't been opened, today or earlier, gets the full unwrap when opened. A day that has been opened stays shown as opened on that device and reopens instantly with no animation |
| F5 | Personalization | Must | First choice: one person or a group. Then the To name (a person's or the group's name), From name, a colour theme, a door icon and a cover greeting. Group calendars can also make named links |
| F6 | Share | Must | Copy link, plus the phone's share sheet where available. The creator also gets a separate edit link, always visible in the builder with a clear Copy edit link button and a prompt to save it |
| F7 | Editing | Must | The edit link opens the builder with the saved content. Rules for what can change and when are in the editing section |
| F8 | Opening moment | Must | Each door opens as unwrapping a gift: a tap-to-open interaction, a different wrapper each day, a short reveal. Details in the interaction section |
| F9 | Preview as recipient | Must | From the builder, a date slider shows exactly what the recipient will see on any day. Needed for testing and for filming |
| F10 | Privacy and safety | Must | Encryption in the browser, text always shown as plain text, a Content-Security-Policy, rate limits, a daily upload cap, a kill switch, automatic deletion 30 days after the end date, and a Delete button on the edit link |
| F11 | Live midnight | Must | If the page is open at midnight, tomorrow's door unlocks without a refresh. Next-gift countdown: once every unlocked door, today's included, has been opened, a banner at the top of the doors screen counts down in hh:mm:ss to the next gift |
| F12 | Accessibility | Should | Works with the keyboard, honours the "reduce motion" setting, readable contrast, and an image caption taken from the message |
| F13 | Fixed timezone | Should | The creator can pin the calendar to one timezone, such as Asia/Jakarta, so family in different countries open it at the same moment |

Themes (part of F8 personalization): six presets, set with one `data-theme` attribute and CSS variables, so a theme is a few lines of CSS and no extra images.

| Preset | Background | Text | Accent | Mood |
| --- | --- | --- | --- | --- |
| Classic | #FFF4E0 | #1F2933 | #C0392B (green #2E7D5B, gold #F2B134) | Traditional red, green and gold on cream |
| Snowy Night | #14213D | #F5F7FA | #F2B134 | Dark navy with a gold accent |
| Candy Cane | #FFF5F5 | #3B1F1F | #C62828 (pink #F8BBD0) | Light, red and pink |
| Evergreen | #14342B | #F3EFE0 | #E0B04C (berry #B23A48) | Deep forest green, warm and quiet |
| Gingerbread | #FBEFE0 | #3A2416 | #8B4A2B (#D98E4A) | Warm browns, good for family |
| Aurora | #0F1B2D | #EAF2FF | #5EEAD4 (violet #A78BFA) | Cool teal and violet, suits New Year |

Customization is deliberately small: pick a preset, optionally pick one of 8 safe accent colors that override the accent, and pick a door icon. No free color wheel in v1, so text always stays readable. The choice is stored in the encrypted settings. Test: switch through all six themes on the cover, the door grid and the reveal screen, and confirm text stays readable on each (at least 4.5:1 contrast) and the unwrap ring and countdown banner are visible. The CSS is in `site/shared/style.css`.

Layout, for every screen: the builder and the recipient pages are one fluid design that works from phone to desktop. Mobile comes first, with a single column below about 640 px. On a wide screen the builder becomes two or three columns (settings, days and day editor, edit link), and the recipient's grid grows from 4 to 8 doors a row, with the opened message shown in a side panel instead of a full screen. Press and hold works with a finger, a mouse, and the keyboard (hold Space or Enter). Test at 360, 768 and 1280 px wide.

Nice-to-haves for later, none of them needed for Dec 1: a progress counter ("7 of 24 opened"), a bigger finale on the last day, a printable QR card for a physical card, and optional sound, off by default.

Out of scope: video, outside URLs, accounts, comments, and any way for the creator to read what the recipient did.

## Unlock rules

The server decides what is unlocked, using its own clock and the recipient's timezone. The browser only displays what the server sends. Everything below follows from that.

Rules:

1. **Dates have no time.** Day N is the start date plus N − 1, stored as a plain calendar date.
2. **"Today" is local.** For a recipient, today is the calendar date right now in their timezone. The browser reports its timezone name (for example `Asia/Jakarta`) with each request. If the calendar is pinned to a timezone (F13), the server ignores the browser's and uses the pinned one.
3. **Unlocked means date ≤ today.** The server computes today as the current time converted to that timezone, after checking the name is a real timezone. It returns the encrypted content of unlocked days only. For locked days it returns just the date, so the grid can still show doors.
4. **The server also returns the next midnight** as an exact moment, worked out from the calendar date so daylight saving can't shift it, plus its own current time. The browser corrects for any clock difference and sets a timer for that moment, then asks again. It also asks again whenever the page comes back to the foreground.
5. **After the end date,** every day is unlocked until the calendar is deleted. **Before the start date,** every door is locked and the grid shows a countdown to day 1.
6. **Opened state:** the browser remembers which doors were opened, and keeps a copy of each opened day's text. An opened door never shows as locked again on that device. An earlier day that was never opened still plays the full unwrap the first time.
7. **Make "now" an input** to the server function, with the real clock as the default. That is what makes the rules testable with fixed times.

Edge cases and how each should behave:

| Case | Expected behaviour |
| --- | --- |
| 23:59:59 the day before the start date, then 00:00:00 | Locked, then day 1 is unlocked |
| Page open across midnight | Tomorrow's door unlocks within a few seconds with no refresh, and animates to its ready state |
| Phone asleep over midnight | On waking, the app checks at once and shows the right doors |
| Daylight saving day (a 23 or 25 hour day, such as in New York) | Days still unlock at local 00:00, because midnight comes from the calendar date and not "plus 24 hours" |
| Far-east and far-west timezones (`Pacific/Kiritimati` and `Etc/GMT+12`) | Each unlocks at its own midnight |
| Recipient flies west and their local date steps back | Opened days keep their cached text. An opened image waits for its midnight and shows "returns at midnight" |
| Recipient claims a timezone that isn't theirs | At most about a day early. A pinned calendar ignores the claim |
| Device clock is wrong | No effect on what unlocks. Only the countdown display uses the correction |
| Link missing its key, or calendar deleted or expired | A friendly message, and no content shown |

## Personalization, links and editing

The creator chooses one of two modes first: a calendar made for one person, or one calendar shared with a group. Editing works through a separate secret edit link, and a day can no longer be edited once it has unlocked anywhere in the world.

|  | For one person | For a group |
| --- | --- | --- |
| Typical use | Partner, family member, close friend | A group chat, a church small group, a team |
| The To field | The person's name (required) | The group's name, such as "Small group" (required) |
| Content | Written just for them, so it can be personal | Kept general, with a hint to write for everyone in the group |
| Links | One link, sent privately | One link posted in the group. Optional named links greet people by name |
| Opened state | On their own device | On each person's own device. Nobody can see who opened what |
| Opening time | Their own midnight | Each person's own midnight, or one pinned timezone so the whole group opens together, with a hint for groups in different timezones |
| Reuse | **Make a copy for someone else** duplicates the messages and settings into a new calendar with its own edit link | Not needed |
| Warning at share time | "This link is private to them. Anyone who has it can read the days that have opened." | "Anyone who gets this link can open it, including people outside the group if it is forwarded." |

Make a copy for someone else (should-have, about 30 to 40 minutes after iteration 6): the browser decrypts the days with the edit link's key, re-encrypts them with a new key into a new calendar, and returns a new edit link. Names and messages can then be changed for that person. It counts toward the upload and creation limits.

What the creator can personalize, all optional except the first two: the To name, the From name, a colour theme (red, green, gold, navy or cream), one emoji used on every door, and a greeting of up to 140 characters shown on the cover before the first door. Per-day content is the message and image.

The three links:

| Link | Contains | Who gets it |
| --- | --- | --- |
| Recipient link | Calendar id, the content key, and an optional To name, all after the `#` | The person who opens the doors |
| Edit link | Everything in the recipient link, plus the edit secret | Only the creator. Shown once with a prompt to save it, and kept in the creator's browser |
| Personal link | The recipient link with a different To name | Each person in a group. The name is read from the link and shown as plain text, so no extra server data is needed |

Key points: the calendar id is 128 random bits and the content key and edit secret are 256 random bits each. The database makes the id and the browser makes the key and secret. The server stores only a hash of the edit secret, so even you can't edit someone's calendar. Opened state is saved per calendar in each person's browser.

Editing rules:

| What | Rule | Why |
| --- | --- | --- |
| Who can edit | Only a person holding the edit link | Recipients can't change anything |
| A day's message or image | Editable until that date has started anywhere on Earth (the earliest timezone, UTC+14). Then read-only | Nobody can change what the recipient may already have opened |
| Start date | Can move only while day 1 is still editable, and never into the past | Moving it later would re-lock content that could be open |
| End date | Can be extended at any time, and the new days need content. Can be shortened only down to the last day already unlocked | Opened days are never removed |
| Pinned timezone | Can change only while day 1 is still editable | It changes when doors open |
| From name, theme, door emoji, greeting | Editable any time | Cosmetic only |
| Delete the whole calendar | Any time, with a confirmation. Rows and images are removed at once | The creator is in control of the data |

After an edit the existing recipient link keeps working, because the id and key never change. The recipient sees the update the next time they open it. If two browser tabs edit the same day, the later save is refused with a message, so one doesn't silently overwrite the other.

## Sharing, drafts and the edit link

The calendar is created on the server at the first save and autosaved after that, so the draft and its edit link exist from the start. The edit link is always visible in the builder with a clear Copy edit link button, because it is the only way back in. No sign-in is needed.

How each piece is generated:

| Piece | Made by | How | Where it lives |
| --- | --- | --- | --- |
| Content key | The creator's browser, once, at the first save | 256-bit AES key from the browser's Web Crypto, written as base64url | Only in the links. Never sent to any server |
| Edit secret | The creator's browser, once | 32 random bytes, written as base64url. Its SHA-256 hash is sent to the server at creation | The edit link. The server keeps only the hash and compares it on every edit |
| Calendar id | The database, at creation | A random UUID returned to the browser | Both links |
| Recipient link | The browser, by joining the parts | `https://xmas-projects.jasonkhanani.com/advent/#c=<id>&k=<key>` with an optional `&n=<To name>` | Given to the recipient |
| Edit link | The browser, by joining the parts | `https://xmas-projects.jasonkhanani.com/advent/edit.html#c=<id>&k=<key>&e=<secret>` | Kept by the creator only |
| Personal link | The browser | The recipient link with a different `n` for each person | Given to each person in a group |

Everything after the `#` stays in the browser and is never sent to any server, so it doesn't appear in server logs. The trade-off is that the link is the key: anyone who has it can read the unlocked days, and anyone who has the edit link can edit.

The edit link panel, shown in the builder at all times:

- A read-only field with the link and a prominent **Copy edit link** button that changes to "Copied".
- The line: "Save this link somewhere safe, such as a notes app or password manager. It is the only way to edit this calendar later, and nobody can recover it for you."
- An **Email this to myself** button that opens a pre-filled email from the creator's own phone. It needs no server.
- **Ready to share** stays disabled until the edit link has been copied or emailed at least once, and every day has a message or image.

Drafts:

- The first save creates the calendar. Changed days autosave about 1.5 seconds after typing stops, with a "Saved" indicator. Images upload, encrypted, as soon as they are added.
- Unsent text is also kept in the browser, so a refresh doesn't lose a half-typed message.
- The calendar is unpublished until **Ready to share** is pressed. While unpublished, the recipient link shows "This calendar isn't ready yet".
- Unpublished calendars are deleted 14 days after the last edit. Once published, they follow the normal rule: deleted 30 days after the last day.
- The calendar table needs `last_edited_at` and `published` columns, and the update and publish functions are built in iteration 3.

Sharing:

- The main button is the phone's share sheet, with Copy link as the fallback and WhatsApp, Telegram and email buttons for desktop. Discord is covered by Copy link.
- A pre-written message the creator can edit, such as "I made you something: a calendar that opens a new gift each day. Open it on your phone."
- A generic link preview ("An advent calendar for you"), because the server can't see the part after the `#`.
- The edit link never appears behind a share button.

Tests:

1. Tap Copy edit link, paste it into a notes app, open it on another phone, and confirm it opens the builder with all content.
2. Open the recipient link on another phone and confirm there is no way to edit.
3. Open the recipient link of an unpublished calendar and confirm it says it isn't ready.
4. Backdate an unpublished calendar's last edit by 15 days, run the expiry job, and confirm it and its files are gone.

## Daily reminder (should-have)

Yes: a Remind me every morning button that works entirely in the browser, with no server and no push permission. It adds a repeating event to the recipient's own calendar app, which then alerts them each day. Build it after iteration 6 if you are ahead, otherwise first thing after Dec 1. It is about 30 to 40 minutes.

How it works:

- The button shows on the cover and right after the recipient opens a door, which is when they are most likely to say yes. A time picker defaults to 08:00.
- **Add to calendar** downloads a small `.ics` file made in the browser. It opens the Add to Calendar sheet on an iPhone and the calendar app on Android. **Add to Google Calendar** is a link that pre-fills the same repeating event.
- The event repeats daily from tomorrow (or today if the chosen time hasn't passed) until the end date, is titled "Open today's gift", has the recipient link in it, and alerts at the event time. The link goes in three places so it works in every calendar app: the event's URL field, the first line of its description, and its location field. In the .ics these are URL, DESCRIPTION and LOCATION; in the Google Calendar link they are details and location. The link includes the key after the #, so tapping it from the reminder opens the calendar directly. Test: import the .ics, open the event, and confirm the link is tappable and opens the calendar.
- It uses the device's local time. If the calendar is pinned to a timezone, it uses that timezone, so a reminder never fires before that day's door has unlocked.

Why not the alternatives: push notifications need a service worker, a push server, stored subscriptions and a permission prompt, and on iPhone they only work after the page is added to the home screen. Email or WhatsApp reminders need the server to hold contact details and send messages. Both break the no-accounts, nothing-tracked promise.

Limits to state in the interface: if the creator later changes the end date, reminders already added don't change. The link is stored in the recipient's own calendar and may sync with their calendar account. Browsers built into chat apps can block file downloads, so show the Google Calendar link beside it and a hint to open the page in the main browser.

```text
Add a "Remind me every morning" feature to index.html, shown on the cover and after a door is opened, with a time picker (default 08:00). Generate a standards-compliant .ics file in the browser with no library: one daily repeating event from tomorrow (or today if the chosen time hasn't passed) through the calendar's end date, titled "Open today's gift", with the recipient link in the URL and description, and an alert at the event time. Use floating local time, or the pinned timezone when the calendar has one. Escape text as iCalendar requires and never build HTML from it. Also add an "Add to Google Calendar" link using Google's event template link with the same repeat rule. Add a Node test that checks the file has the right number of days and valid line folding.
```

- **Test:**
  - Import the file on an iPhone (Safari), on an Android phone (Google Calendar) and in Google Calendar on a computer.
  - Check the event repeats the right number of days and then stops, and that the alert fires at the chosen time.
  - Change the phone's timezone and confirm a local-time event moves with it, while a pinned calendar's event stays in its own timezone.
  - Use a To name with commas, semicolons and emoji, and confirm it shows intact.
  - Open the page from inside WhatsApp and confirm the fallback works.
- **Pass:** Each event appears once with the right count, the alert fires on time on both phones, and no stray characters show.

## Opening interaction design

Treat every day as a wrapped gift that you unwrap with your thumb, not a button that shows text. The core gesture is press and hold to untie the ribbon, followed by a short reveal that can be skipped. It works on every phone and needs no permissions, so shake and tilt are out for version one.

Door states:

| State | Look | What a tap does |
| --- | --- | --- |
| Locked | Greyed gift with a lock and its date. Tomorrow's door just says "tomorrow"; the live countdown ("Next gift unlocks in 07:12:45") is the banner at the top, shown only when every unlocked door is opened | The gift rattles and a short teaser appears, such as "Not yet. Come back on Dec 12." It never hints at the content |
| Ready | Every unlocked door that hasn't been opened yet. Today's glows and gives a small wiggle every few seconds, and earlier unopened doors glow more calmly | Starts the full unwrap, for today's door or any earlier day that was never opened |
| Opened | The gift shows as unwrapped, with a small mark if it holds an image | Reopens the message instantly, with no animation |

The unwrap, about 2 seconds in total:

1. **Press and hold** for 0.8 seconds. A ring fills around the ribbon, and a light vibration plays on phones that support it.
2. **The wrapper comes off.** The wrapping style depends on the day number (ribbon, paper tear, lid lift, door swing), so each day feels different but is fully predictable and testable.
3. **A small burst** of confetti or snow, under 30 pieces, then the message fades in and the image comes in with a gentle zoom.
4. **A "Day 7 of 24" tag and a "come back tomorrow" line** finish it. If earlier days are still unopened, the line says how many are left instead. A tap anywhere skips the animation.

Surprise without randomness: a few fixed days get a special reveal, such as a different burst on days 5 and 12, and a full-screen finale with the From name on the last day. After the finale, a button lets the recipient browse every day again.

Small details that carry a lot:

- Fetch today's content when the page loads and decrypt it only when the gift is opened, so the reveal never waits on the network.
- Show the cover with the To name and greeting before the grid. It is the first thing a recipient sees and it makes the calendar feel made for them.
- Honour "reduce motion": swap the animations for a simple fade, and never flash more than three times a second.
- Sound is off by default with one visible mute toggle. iPhones don't support vibration in the browser, so treat it as a bonus.
- Draw the four wrappers as inline SVG in the palette, and use emoji for the door icon. No animation libraries, only transforms and opacity so it stays smooth on a mid-range phone.

Pass test: five people who have never seen it open a door without any instruction, and at least four say the moment felt different from tapping a button.

## Build iterations 0 to 3 (Tuesday and Wednesday morning)

Build in small slices that each end in a test you can run. Export this doc as Markdown into the repo as `advent/PRD.md` so Claude Code can read the exact rules, and paste one prompt at a time. Commit only when an iteration's pass criteria are met, and fix failures before moving on. Time boxes are my estimates, and Claude Code's speed varies.

### Iteration 0: skeleton and rules (Tuesday, about 20 min)

```text
Read CLAUDE.md and advent/PRD.md (sections "Scope and architecture decision" and "Feature requirements"). Create the app skeleton in advent/: index.html (recipient view), edit.html (builder), css/style.css using the palette, and js/ as plain ES modules. No framework, no build step, no CDN. Add a Netlify _headers file with a strict Content-Security-Policy: script-src 'self', style-src 'self', img-src 'self' blob:, connect-src 'self' plus my Supabase project URL, frame-ancestors 'none', base-uri 'none'. Add a tests/ folder that runs with `node --test`. Pages are fluid from 360 px to 1440 px wide, designed mobile first, with the builder in two or three columns from about 900 px. Each page shows a placeholder only. Add no feature yet. Tell me what you created.
```

- **Test:** Deploy, open both pages on the A54, run `curl -I` on the page, run `node --test`.
- **Pass:** Both pages load over HTTPS, the CSP header is present, the console shows no errors, and the network panel shows no request to any other site.

### Iteration 1: database and unlock function (Tuesday, about 60 min)

You do first: create a Supabase project, and keep the service-role key out of the repo and out of the browser (it goes only into Edge Function secrets).

```text
In supabase/migrations/001_schema.sql create two tables. calendars: id uuid, edit_hash, start_date, end_date, pinned_tz (nullable), settings_ct (encrypted settings text), created_at, last_edited_at, published (default false), delete_after (end_date + 30 days once published, and 14 days after last_edited_at while unpublished). days: calendar_id, day_date, text_ct, image_path (nullable), updated_at, primary key (calendar_id, day_date), cascade delete. Enable row level security on both tables with NO policies, so the public key can read and write nothing. Add checks: end_date >= start_date, end_date - start_date <= 30, text_ct <= 2000 characters, settings_ct <= 4000. Add a SQL function unlocked_days(p_calendar uuid, p_tz text, p_now timestamptz default now()) that rejects a timezone not in pg_timezone_names, uses pinned_tz when set, works out the local date, and returns each day with its date and an unlocked flag, with text_ct and image_path only when unlocked and null otherwise. It also returns the exact next local midnight, computed from the calendar date and not by adding 24 hours, and the server time. Then write supabase/tests/unlock_test.sql covering the cases below using fixed p_now values.
```

Cases the test must include (calendar Dec 1 to Dec 24):

| p\_now (UTC) | Timezone | Expected |
| --- | --- | --- |
| 2026-12-01 16:59:59 | Asia/Jakarta | Local 23:59:59 on Dec 1: day 1 unlocked, day 2 locked |
| 2026-12-01 17:00:00 | Asia/Jakarta | Local Dec 2 00:00: day 2 now unlocked |
| 2026-11-30 10:00:00 | Pacific/Kiritimati | Local Dec 1 00:00: day 1 unlocked |
| 2026-11-30 10:00:00 | Etc/GMT+12 | Local Nov 29: nothing unlocked |
| 2026-11-01 12:00:00 | America/New\_York | Next midnight is 2026-11-02 05:00:00 UTC, because Nov 1 has 25 hours |
| 2026-12-25 00:00:00 | Asia/Jakarta | Every day unlocked, after the end date |
| any | `Not/AZone` | Rejected |

- **Pass:** Every row matches. With the public key, reading `calendars` through the REST address returns no rows and an insert is refused.

### Iteration 2: encryption helper and create/get functions (Tuesday, about 70 min)

```text
Add js/crypto.js using only the browser's Web Crypto: generate a 256-bit AES-GCM key, export and import it as base64url, encrypt(text or bytes) to base64url with a random 12-byte IV at the front, and decrypt as the reverse. Add two Edge Functions in supabase/functions: create-calendar (takes start and end dates, optional pinned timezone, encrypted settings, and the hash of an edit secret; returns the new calendar id) and get-calendar (takes a calendar id and a timezone, calls unlocked_days, returns the result). Use the service-role key from function secrets only. Validate every input (dates, lengths, timezone name, ciphertext size) and return generic error messages. Add per-IP rate limits (20 creates per hour, 120 reads per minute) using a small rate_limits table, plus a global daily cap on creates. Write a Node test script that creates a 3-day calendar, reads it back with a fixed timezone, and checks that locked days come back with no content.
```

- **Test:** Round-trip text including emoji, Indonesian and exactly 280 characters. Flip one character in a ciphertext. Create 21 calendars within an hour. Check the function logs.
- **Pass:** Every round trip matches, the tampered text fails to decrypt, locked days return no content, the 21st create is refused, and the logs contain no plain text and no key.

### Iteration 3: builder screen (Wednesday morning, about 60 min)

```text
Build edit.html using js/crypto.js and the create-calendar function. Fields: a first choice between "For one person" and "For a group", start date, end date (inclusive, show "N days" live), To name (the group's name in group mode), From name, theme, door emoji, cover greeting, and one message per day with a live 280-character counter. Rules from the PRD: end not before start, 1 to 31 days, every day needs a message before sharing, and warn if the start date is in the past. On the first Save, generate the key and edit secret in the browser, encrypt messages and settings, call create-calendar, then keep autosaving changed days. Also add update-calendar and publish-calendar Edge Functions that check the edit secret against its hash in constant time. Show a persistent edit link panel with a clear "Copy edit link" button, the text "Save this link somewhere safe. It is the only way to edit this calendar later", and an "Email this to myself" button. Show the recipient link and share buttons only after "Ready to share", which needs every day filled and the edit link copied or emailed once. Both links put their data after the # only. Render all user text with textContent, never innerHTML.
```

- **Test:** Make a 3-day calendar on the A54. Try an end before the start, 32 days, a 281-character message and an empty day. Put `<img src=x onerror=alert(1)>` in a message. Open the network panel while creating. Look at the rows in the Supabase table view.
- **Pass:** Each invalid case is blocked with a clear message, the script text shows as typed and nothing runs, the request body holds ciphertext only, the database shows unreadable text, and both links carry the key and id after the `#`.

## Build iterations 4 to 8 (Wednesday and Thursday)

The recipient screen comes first, because everything you film depends on it. Iteration 6 is the heaviest, and iteration 7 (images) is the first thing to cut.

### Iteration 4: recipient view and unlocking (Wednesday, about 70 min)

```text
Build index.html. Read the calendar id, key and optional To name from the part after the #. If any is missing, show a friendly message. Call get-calendar with the browser's timezone (Intl.DateTimeFormat().resolvedOptions().timeZone), decrypt the settings and the unlocked days, and render a cover (To name and greeting) followed by a grid of doors in the three states from the PRD: locked (date, and a countdown on tomorrow's door), ready, and opened. A tap on a ready or earlier door opens a plain message view, with no animation yet. Remember opened doors and a copy of each opened day's text in localStorage under the calendar id. Set a timer for the server's next-midnight moment, corrected by the difference between server time and the phone's clock, and ask the server again when it fires and whenever the page becomes visible. After the end date, every door is unlocked. Render all text with textContent.
```

- **Test:**
  - Create a calendar starting today and open it. Check the JSON response in the network panel: locked days must have no content.
  - Live midnight: create a calendar pinned to a timezone where the local time is about 23:57 right now (ask Claude Code which one). Keep the page open and watch the door unlock at midnight with no refresh.
  - Sleep test: repeat it with the screen locked across midnight, then wake the phone.
  - Reload after opening a door. Then clear site data and reload.
  - Switch off the network and open the page.
- **Pass:** Locked content never appears in any response, the door unlocks within about 3 seconds of midnight, opened doors survive a reload, cleared data shows doors as unopened but openable, and offline shows a friendly message.

### Iteration 5: the opening moment (Thursday morning, about 70 min)

```text
Implement the opening interaction from the PRD section "Opening interaction design". Press and hold any unlocked door that hasn't been opened yet, today's or an earlier day's, for 0.8 seconds with a progress ring around the ribbon. Four wrappers drawn as inline SVG in the palette, chosen by day number modulo 4. A burst of fewer than 30 pieces, then the message fades in with a "Day N of M" tag and a "come back tomorrow" line. Special reveals on days 5 and 12 and a full-screen finale on the last day with the From name. A tap anywhere skips the animation. A door that was already opened reopens instantly with no animation. A locked door rattles and shows a short teaser that gives no hint of the content. Today's door wiggles every few seconds. Use only transform and opacity. Add vibration where supported and a mute toggle with no sound files yet. Honour prefers-reduced-motion by using a simple fade.
```

- **Test:** Run it on the A54 and on a desktop browser with the CPU slowed 4 times. Turn on the phone's "remove animations" setting and run it again. Film one open on the phone and play it back looking for stutter. Open an earlier day that was never opened, which must play the full unwrap, then reopen an opened day, which must open instantly with no animation. Then the five-person test from the interaction section.
- **Pass:** The unwrap takes 2.5 seconds or less, the skip works, reduced motion gives a fade with no movement, there is no visible stutter on the A54, and at least four of five people say it felt different from tapping a button.

### Iteration 6: personal links, share, edit, delete and preview (Thursday, about 80 min)

```text
Add personalization and editing from the PRD sections "Personalization, links and editing" and "Unlock rules". Named links (group mode only): read an optional To name from the link and show it as plain text. Apply theme, door emoji and cover greeting. Add a Share button using the phone's share sheet, with copy as the fallback. Add three Edge Functions that check the edit secret against its stored hash in constant time: get-calendar-for-edit, update-calendar (enforcing every row of the editing-rules table, using a day's date against the earliest timezone UTC+14, and refusing a stale save), and delete-calendar (removes rows and files). The edit link opens the builder with saved content. Add a "Preview as recipient" date slider on the edit page that shows each day as the recipient would see it. Keep a "My calendars" list in this browser only.
```

- **Test:** With fixed times, check each editing rule: a day that has started anywhere is refused, the end date extends, shortening below an unlocked day is refused, a wrong secret is refused, delete removes everything, and a second tab's stale save is refused. In group mode, open one calendar with two different To names. In one-person mode, make a copy and check that it has its own edit link and that editing the copy doesn't change the original. Use the slider to preview day 1, day 12 and the last day.
- **Pass:** Every rule row passes, the wrong-secret and stale-save cases give clear errors, deleted calendars show "This calendar has ended", and the slider matches what a real recipient sees.
- **If short on time, cut in this order:** the pinned timezone, the "My calendars" list.

### Iteration 7: images and GIFs (Thursday afternoon, about 70 min, the first cut)

```text
Add one optional image or GIF per day. Accept JPEG, PNG, WebP and GIF. For non-GIF images, resize in the browser to 1,280 px on the long side and re-encode as WebP or JPEG at quality 0.8 using a canvas, which also strips location data. Keep GIFs as they are, up to 2 MB. Verify the file really decodes as an image before accepting it. Encrypt the bytes in the browser. Put the image type inside the encrypted day text so the server never learns it. Add an Edge Function request-upload that checks the edit secret, the day's editable status, the ciphertext size (3 MB maximum), at most 31 files and 40 MB per calendar, and a global daily upload cap, then returns a signed upload address for a private storage bucket. The bucket has no public access. get-calendar returns short-lived signed download addresses for unlocked days only. The browser downloads, decrypts and shows the image through a blob address, and uses the day's message as its caption. Add a kill switch setting that turns uploads off.
```

- **Test:** Upload a 1,280 px photo, a 1.8 MB animated GIF, a 3 MB GIF (must be refused), and a text file renamed to `.jpg` (must be refused). Use a photo that has location data and check the result has none. Try to fetch a locked day's image using a guessed storage path. Switch the kill switch on. View on the A54 and an iPhone.
- **Pass:** Valid files show correctly and animated GIFs animate, invalid files are refused with a clear message, no location data remains, a locked day's image cannot be downloaded in any way, and the kill switch blocks uploads.

### Iteration 8: hardening pass (Thursday evening, about 40 min)

```text
Review all of advent/ and supabase/ against the security rules in CLAUDE.md. Search for innerHTML, outerHTML, insertAdjacentHTML, document.write and eval. Search for any secret in the repo. Check that no page loads anything from another host. Check that error messages are generic and that every input is validated on the server, not only in the page. Check that the rate limits and caps work. List each finding, fix it, and re-run every test from iterations 1 to 7.
```

- **Pass:** No dangerous calls found, no secrets in the repo, the network panel shows only your site and Supabase, and every earlier test still passes.

## Release gate and what comes after

Do not film until every box below is ticked. The expiry job is the one feature from the PRD that has no iteration above, so it comes first.

```text
Add automatic deletion. Create a daily scheduled job (pg_cron or a scheduled Edge Function) that deletes every calendar whose delete_after date has passed, including its day rows and its files in the storage bucket. Add a test that inserts a calendar with delete_after set to yesterday, runs the job, and checks that its rows and files are gone and that a calendar with a future date is untouched.
```

Release gate:

- [ ] The expiry test passes
- [ ] Every test from iterations 1 to 8 passes on the final deployed version
- [ ] The live-midnight test passed on a real phone, once with the screen on and once with it locked
- [ ] A link from a WhatsApp chat opens correctly on the A54 and on an iPhone, and a door opens and an image shows on both. The builder and the calendar also work at 768 px and 1280 px wide with a mouse and keyboard
- [ ] Tampering with the link shows a friendly error, and the network panel shows no request to any site except yours and Supabase
- [ ] The footer says: messages and images are encrypted on your device before they are stored, calendars are deleted 30 days after the last day, and there are no accounts or tracking. It also has a way to contact you
- [ ] The kill switch has been switched on and off once and works
- [ ] A test calendar has been deleted with its edit link and is really gone
- [ ] You have checked Supabase's current free-plan limits and what happens when one is reached
- [ ] A demo calendar with made-up messages and one sample image is ready for filming, starting today with 12 days, so the screen shows an open door, a ready door and locked doors with a countdown

After Dec 1:

- Look at the Supabase usage page and the function logs once a day for the first week, for upload counts, rate-limit hits and storage size.
- If anyone abuses uploads, switch uploads off first. If it keeps happening, add a simple creator code before creating a calendar, even though it adds a step.
- Nice-to-haves, in the order I'd do them: a progress counter, a duplicate-calendar button, a printable QR card, then sound.
- The crypto helper and the create, get and edit functions are reusable, so a later app that needs private, dated content can build on them instead of starting again.

Open questions for you: is Supabase's free plan enough for the number of calendars you expect, and are you comfortable running a service that stores other people's encrypted images? If not, ship text only and keep images off.
