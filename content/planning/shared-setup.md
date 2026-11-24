# Shared setup: do these first

Only the subdomain has a waiting time (DNS can take hours), so tonight's one job is step 1. Everything else can wait.

1. **Tonight, about 30 minutes: hosting and subdomain.** Create the GitHub repo and a Netlify site connected to it, publishing the `site/` folder (already set in `netlify.toml`). In Netlify add your chosen subdomain as the custom domain. Netlify shows the exact DNS record it wants. Add that CNAME in Hostinger and leave every existing record alone. HTTPS turns on by itself once DNS checks out.
2. **Tomorrow morning, 15 minutes: the rules file.** `CLAUDE.md` is already in the repo. Read it once and adjust.
3. **Tomorrow, 10 minutes: palette and fonts.** `site/shared/style.css` holds the palette: red #C0392B, green #2E7D5B, gold #F2B134, navy #1F3A5F, cream #FFF4E0. Emoji are the icons for now.
4. **Before Wednesday night: test phones.** Your A54 plus one borrowed iPhone, both with WhatsApp. The Advent link has to open and unlock correctly on both before you film.
5. **Wednesday evening, 20 minutes: filming kit check.** Phone stand, wireless mic paired, a 20-second test clip in vertical 1080p, at least 10 GB free. Record the screen without sound and your voice on its own, then line them up in CapCut.
6. **Friday, first 30 minutes of editing: CapCut template.** A 9:16 project with your caption style, palette swatches and an end card with your handle. Reuse it every week.

Not needed: paid plans (except possibly Supabase Pro, see below), model accounts. Check Netlify's current free-plan limits once.

Open question: which platforms will you post to? It changes the end card and caption style, not the builds.

## Prerequisites per project

| Project | Get ready before the build | Libraries and data | Real-world test | Biggest risk |
| --- | --- | --- | --- | --- |
| Advent Calendar Builder | Three fake sample messages and a Supabase project | One small image library if needed, copied into the repo | A 24-day link opens in WhatsApp on Android and iPhone | Over-scoping |
| Secret Santa and White Elephant | Six fake names with two exclusions, a short list of house rules | Web Crypto (built in, needs HTTPS) | The draw runs 1,000 times with no one getting themselves or an excluded person | Overclaiming privacy |
| Gift Wrap Calculator | Three real boxes of different shapes by Dec 6, paper, tape measure, scissors, tape | None. Claude draws the layout as SVG | Three boxes wrapped with no gaps | Formula wrong for odd shapes |
| NYE Bingo Kit | A reviewed library of about 300 prompts by Dec 13, two or three phones | None. Use the browser's print-to-PDF | The link opens a different board on Android and iPhone | Prompts too heavy, too many features |
| Chase the New Year (tentative) | One-page note of the speed and time-zone maths, checked against sources; 10 to 15 known routes with real durations for calibration | An open airport list (about 150 to 250 airports, OurAirports) and a zone grid built from open time zone boundary data (check the ODbL terms) | Three midnights hand-checked against real cities; flight-time estimates within 10 to 15 percent on the calibration routes | Hardest build. Cut the leaderboard first, then the live "show me the best" button |

The prompt library, and for Chase the airport list and zone grid, are the things that can quietly run late, so give each a short slot a few days early.
