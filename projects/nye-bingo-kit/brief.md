# NYE Bingo Kit

Posts Dec 22 and 24. Build Dec 14-15, film Dec 16, edit Dec 17 (original plan, not re-checked).

One group-chat link gives every phone its own bingo board, with a host-chosen win pattern and a time to bingo, plus a print mode. Build phone play first and the PDF last, so the PDF is what you cut if time runs short.

## Build steps

1. Prompt library: ask Claude to draft about 300 prompts as a JSON file: three age groups (kids, adults, mixed family), two styles ("find someone who" and "happened to you this year"), about 50 each. Review for taste. Keep "happened to you" prompts light: nothing about layoffs, illness or breakups.
2. Board maker: pick 24 different prompts at random on each phone, with a free square in the centre.
3. Win patterns: row, column, diagonal, X, cross (middle row plus middle column) and full board. Write a test for each pattern before building the screen.
4. Game link: the host picks age group, style, pattern and a start time. These go in the link, with no names or personal data.
5. Phone screen: tap a square to mark it. In the find-someone-who style an optional name can be typed in each square. Show BINGO and the time since the start when the pattern is complete.
6. Share card: a screenshot-friendly image of the finished board and time.
7. Print mode: a PDF of boards from the same maker, up to 50 boards. Use the browser's own print-to-PDF rather than a PDF library.

## Limits

- Timing: every phone counts from the shared start time using its own clock. A player could fake it, which is fine for a party.
- Leaderboard: skip for v1. It needs a database with nicknames only, an unguessable game code, row-level security, rate limits and games that expire.

## Security

Show typed names as plain text, keep marks on the device, load nothing from outside the site.

## Film

Two or three phones opening the same link and showing different boards, then tapping squares until one shows BINGO. Post 2: the library and two printed boards side by side.

## Done when

Every win pattern passes its test, the link opens in WhatsApp on Android and iPhone, and a printed PDF fits A4.

## Prerequisites

A reviewed prompt library of about 300 prompts by Dec 13, and two or three phones to film with. Biggest risk: prompts that are not light enough, or too many features.
