Converts the NSBM Faculty of Computing 26.3 Year 1 Semester 1 Excel timetable into a Google Calendar subscription, including Monday–Saturday classes, holidays and exam blocks.

[ICS subscription link](https://raw.githubusercontent.com/heshan-jj/nsbm-timetable/soc-26.3-year-1-semester-1/ics/SOC-26.3.ics).

[Source workbook](https://nsbm365.sharepoint.com/:x:/g/SOC/IQDhIbZmFWZmSpbHiek_EkwwAXoXUu5D0ezXkIkE7BoBrlQ?e=xDbeYn)

## Google Calendar

1. On a computer, open [Google Calendar](https://calendar.google.com/).
2. Next to **Other calendars**, click **+ → From URL**.
3. Paste the ICS link above and click **Add calendar**.

## Apple Calendar

**iPhone / iPad:** Open **Calendar → Calendars → Add Calendar → Add Subscription Calendar**. Paste the ICS link, tap **Find** (or **Subscribe** on older versions), choose **iCloud**, and save.

**Mac:** Open **Calendar → File → New Calendar Subscription**. Paste the ICS link, click **Subscribe**, set **Location** to **iCloud**, and click **OK**.

Subscribe using the URL to receive updates; your calendar app controls when it refreshes.

## Updating the feed

Run `npm ci`, `npm run download`, then `npm run generate` with Node.js 24 or later and wget (in WSL on Windows). The linked workbook is the default source; `CAL_LINK` can override it locally. Module codes and names follow the timetable worksheet's legend.

The scheduled workflow on `vu-25.3-year-2-cyber-security` refreshes both timetable branches at 00:00, 06:00, 12:00 and 18:00 Sri Lanka time, committing each feed to its own branch. Pushes to either branch and manual workflow runs also refresh both feeds. Both branches and the updated workflow on `vu-25.3-year-2-cyber-security` must be pushed to enable this. The optional repository variable `SOC_26_3_CAL_LINK` overrides this intake's source independently of main's `CAL_LINK` secret.
