Converts the NSBM VU 25.3 Year 2 Cyber Security Excel timetable into an automatically updated Google Calendar subscription.

[ICS subscription link](https://raw.githubusercontent.com/heshan-jj/nsbm-timetable/vu-25.3-year-2-cyber-security/ics/BIT-CYBER.ics)

## Google Calendar

1. On a computer, open [Google Calendar](https://calendar.google.com/).
2. Next to **Other calendars**, click **+ → From URL**.
3. Paste the ICS link above and click **Add calendar**.

## Apple Calendar

**iPhone / iPad:** Open **Calendar → Calendars → Add Calendar → Add Subscription Calendar**. Paste the ICS link, tap **Find** (or **Subscribe** on older versions), choose **iCloud**, and save.

**Mac:** Open **Calendar → File → New Calendar Subscription**. Paste the ICS link, click **Subscribe**, set **Location** to **iCloud**, and click **OK**.

Subscribe using the URL to receive updates. The feed updates every six hours; your calendar app controls when it refreshes.

The scheduled workflow on `vu-25.3-year-2-cyber-security` refreshes both `vu-25.3-year-2-cyber-security` (VU 25.3 Year 2) and `soc-26.3-year-1-semester-1` (SOC 26.3 Year 1 Semester 1), committing each feed to its own branch. Runs are scheduled for 00:00, 06:00, 12:00 and 18:00 Sri Lanka time. The VU source uses the `CAL_LINK` repository secret; SOC uses its branch's default workbook URL, optionally overridden by the `SOC_26_3_CAL_LINK` repository variable. Both branches must be pushed for the workflow to update both feeds.
