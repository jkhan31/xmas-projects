# Secret Santa and White Elephant

Posts Dec 7 and 9. Build Nov 30 - Dec 2, film Dec 3, edit Dec 4 (original plan, not re-checked).

One app, two modes: a Secret Santa draw and a White Elephant game. No server. The organizer's browser makes the draw.

## Honest limit (say it in the video)

Each person gets a private link holding only their own match. The organizer never sees the pairs. A technically skilled organizer could still decode a link. Fine for a family or office. Do not promise it is unbreakable.

## Secret Santa build steps

1. Inputs: names, optional exclusions (for example couples), budget note.
2. The draw: shuffle with the browser's secure random generator. Reject any draw where someone gets themselves or an excluded person. If no valid draw exists, say so clearly.
3. Private links: one per person holding their match, encrypted with a random key inside the link (Web Crypto). The organizer sees names with a copy button for each, never the matches.
4. Reveal page: tap to reveal the name and budget, then an "I've seen it" button that hides it again.
5. Pass-the-phone mode: the same draw on one phone, for people in the same room.

## White Elephant build steps

1. Turn order: random order from the same name list.
2. Host screen: whose turn it is, the gift list, a steal counter per gift.
3. Rules the host chooses: steals allowed per gift, no instant steal-back, optional last-turn swap for the first player.
4. Finish screen: who ended up with which gift.

## Tests before filming

- Run the draw 1,000 times with six names and two exclusions. Nobody gets themselves or an excluded person.
- Two people who exclude each other give a clear message, not a crash.
- A link opens only its own match, and an edited link fails gracefully.

## Security

Show all names as plain text. Store nothing except an optional setup on the host's phone with a clear button. Load nothing from outside the site.

## Film

Two phones, one organizer and one guest. For the "what broke" post, use a real bug from the build, such as exclusions making a draw impossible. Do not invent one.

## Done when

Tests pass, links open on another phone, and a six-name White Elephant game runs start to finish.

## Prerequisites

Six fake names with two exclusions, a short list of White Elephant house rules. Web Crypto needs HTTPS (Netlify provides it).
