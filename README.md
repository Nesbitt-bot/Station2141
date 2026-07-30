# Station2141
Personal blogsite: A fictional continuation of Nesbitt's thinking to create impact beyond human lifespan.

## Anonymous visitor statistics

The site uses [Simple Analytics](https://www.simpleanalytics.com/) with GitHub
Pages and does not require a database, API server, or analytics secret in this
repository. The production hostname is set in
`params.analytics.simpleAnalyticsHostname` in `hugo.toml`.

To finish activation:

1. Create a Simple Analytics account and add `blog.trance-0.com`.
2. Make the website statistics public so the left-hand widget can read the
   aggregate Stats API without credentials.
3. After the trial, select the free hobby plan if its limits are sufficient.
   The visitor widget includes the provider's official badge, as required by
   that plan.
4. Add these repository Actions secrets so the scheduled collector can use an
   authenticated API request:
   - `SIMPLE_ANALYTICS_API_KEY`
   - `SIMPLE_ANALYTICS_USER_ID`
5. Build and deploy normally.

Visitors see an explicit allow/deny prompt before the tracking script is
records a page view. The Simple Analytics library is embedded in Hugo's footer
so installation detectors can find it, but `data-auto-collect="false"` prevents
automatic collection. Only the consent handler calls `sa_pageview` after the
visitor opts in. The tracker uses no cookies or persistent visitor identifier;
the only first-party cookie stores the visitor's consent choice. It records
normalized page paths, timestamps, the referrer needed to estimate unique
visits, and an anonymized user agent used to reject bots. Unneeded metrics are
disabled.

The public widget asks the Stats API for anonymous visitor estimates for the
current day, month, and year. The scheduled
`.github/workflows/archive-analytics.yml` workflow runs at 02:20
Asia/Shanghai, stores each completed day's aggregate site and page totals in
`static/analytics/daily.json`, commits that file directly to `main`, and
deploys the resulting site. It deploys in the same run because a commit made
with `GITHUB_TOKEN` does not trigger the regular push workflow.

On its first run the collector backfills up to the most recent 30 completed
days still available on the free plan. Later runs fill any gap since the newest
archived day. Use **Archive visitor statistics and deploy → Run workflow** to
request a specific `start_date` and `end_date`. Main-branch protection must
allow GitHub Actions to push for direct storage to work.

The widget combines the public archive with live Simple Analytics totals. The
archive contains only daily aggregate counts and aggregate page paths; API
credentials remain in GitHub Actions secrets and are never written to the
public file.

The `<noscript>` tracking pixel is intentionally omitted: a JavaScript-disabled
visitor cannot see or use the opt-out control before that pixel records a page
view.
