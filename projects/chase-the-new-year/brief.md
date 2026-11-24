# Chase the New Year (tentative: slot 5 may be replaced or dropped)

Posts Dec 29 and 31. Build Dec 17, 18 and 21, film Dec 22, edit Dec 23 (original plan, not re-checked). The hardest build, so keep v1 small. If time runs short, cut in this order: the leaderboard, the live "show me the best" button, the "what this ignores" panel. Never cut the sanity checks.

Goal: a one-night challenge. Plan a route of airline flights to catch as many New Year midnights as you can inside the 26-hour window, and try to beat the best the app finds. It is a simulation with estimated flight times, not flight advice.

## The hook to open with

"Can you outrun midnight?" Midnight sweeps west at about 40,075 km x cos(latitude) / 24 hours: roughly 1,670 km/h at the equator, slowing with latitude. A regular airliner at about 850 km/h can only outrun it above roughly 57 degrees. (Back-of-envelope, check it before filming.)

## What the player does

1. Pick a start airport (or a preset challenge) from a searchable list.
2. Add stops one at a time. After each stop the app shows the estimated arrival time and a running count of midnights caught.
3. Finish and get a result card: midnights caught, route, total time and distance, a shareable image, and par on preset challenges (for example "You: 3, best I found: 4").

## Decisions so far

- One fixed plane: a regular airliner. No speed presets.
- Settings: connection time (default 2 to 3 hours) and longest leg (about 15 to 16 hours). Flight limit per challenge (for example 4 flights, tune in testing).
- A midnight counts if you are at an airport or in the air when it arrives. Each UTC offset counts once, because zones with the same offset share one midnight.
- Time zones are the real ones. In the air, the zone is that of the land or ocean beneath the plane.
- No waiting for midnight. At each stop the plane moves on after the connection time.
- Flight times are estimated, not real schedules, and a flight is always assumed to be ready when you land.
- Game framing: the 26-hour window is the clock, presets have fixed starts (for example Sydney, Auckland, London, plus "start from where you live"), and challenge links let friends try to beat a score.
- Par for the presets is worked out ahead of time by running the search in a script.

## Build steps

1. One-page model: write down the assumptions you will state in the video: airliner speed, connection time, longest leg, flight limit, the flight-time formula, the in-air zone rule.
2. Airports: about 150 to 250 major airports with coordinates and IANA time zone names, trimmed by hand from OurAirports (public domain). Include a few near the first and last midnights (for example Kiritimati, Honolulu, Pago Pago). Check coordinates and zones for a handful by hand.
3. Zone map: a one-time script builds a grid (about 0.5 degrees, roughly 55 km) of UTC offsets for Jan 1, 2027 from timezone-boundary-builder data that includes ocean zones. Ship it as one compact file. Read the ODbL licence terms first. Check known points: Jakarta +7, Honolulu -10, Kiritimati +14.
4. Midnight moments: for each UTC offset from +14 to -12, the UTC instant when local Jan 1 begins. The first is 10:00 UTC on Dec 31 and the last 12:00 UTC on Jan 1, so the window is 26 hours. Check three by hand.
5. Flight-time model: about 45 minutes of overhead, plus great-circle distance x 1.05 divided by about 850 km/h, with long westbound legs slower than eastbound ones. Calibrate by hand against 10 to 15 routes you know (short, medium, long, and a few in both directions) until estimates are within about 10 to 15 percent. These numbers are starting guesses.
6. One simulation function: `simulate(path, settings)`. It steps along each flight every few minutes, looks up the zone beneath the plane in the zone map, and counts each offset whose midnight falls in the step. The player's path, the par script and the optional live search all use it. Write the tests (below) before building screens.
7. Outrun view: sweep speed by latitude with a slider and the 850 km/h airliner line.
8. Map and planner: flat world bands with a moving midnight line and a plane dot (skip coastlines in v1), a searchable airport list, and the stop list with live feedback.
9. Game layer: flight limit, preset challenges, challenge links that carry the start, the limit and a score, and a personal best saved on the device (wrap storage in try/catch).
10. Par script: run a simple greedy search offline for each preset and store the result with the app.
11. Result card: midnights caught, route, total time and distance, par, and a screenshot-friendly share image.
12. Honest labels: "Estimated flight times, not real schedules. Assumes a regular flight is ready whenever you land; real schedules will do worse."

## If time

- Live "show me the best" button for any start airport, using the same search and simulation function that sets par.
- A "what this ignores" panel (schedules, wind, airspace, airport hours) and the date-line shortcut as a featured example (Kiritimati to Honolulu).
- Optional global leaderboard (cut first). Nickname only, no accounts. The server replays each submitted route with the same simulation and zone map, so faked scores are rejected. Needs rate limits, a name filter, an unguessable entry code and automatic deletion after a set time. A one-off Dec 31 board is a possible extension.

## Not in v1

Real flight schedules or availability, live data, wind data, accounts or sign-in.

## Sanity checks

- The gap between the first and last midnight is 26 hours.
- A traveller who stays put catches exactly one midnight.
- A longer distance is never faster.
- Westbound is never faster than eastbound on the same long route.
- No offset is ever counted twice.
- Known points return the right zone offset (Jakarta +7, Honolulu -10, Kiritimati +14).
- Estimates stay within tolerance on the calibration routes.

## Limits

- Times are estimates. The app does not check which airport pairs really have flights.
- Zones are looked up on a grid, so the plane can be off by one cell near a border.
- A score in a challenge link can be edited by anyone, which is fine between friends. A real leaderboard needs server-side replay.

## Security

No accounts, and no names or personal data in links. Load nothing from outside the site. Zone and airport data ship with the app. The personal best stays on the device. If the leaderboard is built, it goes through an Edge Function with row-level security on and no policies, rate limits, a name filter and expiry.

## Film

Open with the question and the sweep-speed slider ("can you stay in the old year?"). Then plan a route live, with the midnight line moving and the count going up. End on the result card against par. State which numbers are assumptions, and show one thing that went wrong.

## Done when

Three hand-checked midnights match the app, every sanity check passes, the calibration routes are within tolerance, a challenge link opens and plays on a phone, and the result changes sensibly when the flight limit and connection time move.

## Prerequisites

The one-page note of speed and time-zone maths, checked against sources. An airport list and a zone grid built and spot-checked a few days early, since these two items can quietly run late. A list of 10 to 15 known routes with their real durations for calibration. The ODbL terms read before the zone grid ships.
