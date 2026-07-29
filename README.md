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
4. Build and deploy normally.

Visitors see an explicit allow/deny prompt before the tracking script is
loaded. The tracker uses no cookies or persistent visitor identifier; the only
first-party cookie stores the visitor's consent choice. It records normalized
page paths, timestamps, the referrer needed to estimate unique visits, and an
anonymized user agent used to reject bots. Unneeded metrics are disabled.

The public widget asks the Stats API for anonymous visitor estimates for the
current day, month, and year. Simple Analytics' free plan retains only 30 days,
so the annual number reflects available history rather than a complete year.
The `<noscript>` tracking pixel is intentionally omitted: a JavaScript-disabled
visitor cannot see or use the opt-out control before that pixel records a page
view.
