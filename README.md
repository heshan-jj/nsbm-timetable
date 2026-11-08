# NSBM VU 25.3 Year 2 timetable

Converts the `2nd YEAR Cyber` worksheet in NSBM's VU BIT timetable into a Google Calendar subscription for **25.3, Year 2, Cyber Security**.

The converter reads weekday dates from columns C–G and text time ranges from column B. It expands merged class and holiday cells, merges adjacent identical slots, and writes `ics/BIT-CYBER.ics` in the `Asia/Colombo` timezone. The four module names and codes are listed in `config.ts`.

Dates and event names are preserved from the workbook. In the supplied workbook, Week 2 contains November 2025 dates alongside November 2026, and Week 7 contains January 2026 dates between January 2027 weeks. These are intentionally not corrected. When NSBM corrects the source, regeneration will use the new dates.

## Generate locally

Requires Node.js 24 or newer. Live downloads also require GNU wget. On Windows, the downloader runs wget in your default WSL distribution. GitHub's Ubuntu runner includes wget.

```sh
npm ci
```

Copy `.env.example` to `.env`. To use a downloaded workbook, set `TIMETABLE_FILE` to its full path, or copy it to `downloaded/vu-25.3-y2.xlsx`. Then run:

```sh
npm run generate
npm test
npm run typecheck
```

The source workbook and `.env` stay out of Git. Generated calendar files and `config.json` are committed for static hosting. The last-updated timestamp changes only when the calendar contents change.

## Automatic updates

1. In the fork's **Settings → Secrets and variables → Actions**, add the repository secret `CAL_LINK` with the live NSBM Excel download/share URL.
2. Ensure Actions are enabled and the workflow may write repository contents.
3. Run **Actions → Update VU timetable → Run workflow** to verify access. The workflow also runs every two hours and on relevant pushes to `main`.

The downloader adds `download=1` to SharePoint links and uses wget, which retains SharePoint's cookies across redirects. It validates that the response is an Excel workbook containing the expected worksheet. It fails without replacing the previous workbook or published calendars if access is denied or SharePoint returns a sign-in page.

The supplied SharePoint link was verified to return a valid workbook with wget and `download=1`. Node's fetch returned HTTP 403 because it did not retain the sharing-link cookie. Future changes to NSBM's sharing permissions can still require a new link or an authenticated integration.

To download manually through the same code:

```sh
npm run download
npm run generate
```

## Publish and subscribe

Enable GitHub Pages for the `main` branch and repository root. The page derives the subscription address from its own URL, supporting GitHub Pages repository paths. The original author's custom domain has been removed. For another calendar host, set `CALENDAR_BASE_URL` when generating `config.json`.

Open the hosted page, copy the calendar URL, then add it through Google Calendar's **Settings → Add calendar → From URL**. Subscribing allows subsequent refreshes; importing a downloaded ICS file creates a one-time copy. Google Calendar controls when it refreshes a subscription, independently of this repository's two-hour download schedule.

This fork includes one VU Cyber Security calendar. The original Plymouth degree calendars are no longer used.
