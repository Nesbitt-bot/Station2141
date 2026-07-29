# Station2141
Personal blogsite: A fictional continuation of Nesbitt's thinking to create impact beyond human lifespan.

## Anonymous visitor statistics

The site includes an optional GoatCounter integration that works with GitHub
Pages and does not require a database, API server, or analytics secret in this
repository. It stays disabled until `params.analytics.goatCounterEndpoint` is
set in `hugo.toml`.

To activate it:

1. Create a GoatCounter site and set its linked domain to
   `blog.trance-0.com`.
2. In GoatCounter settings, keep sessions enabled, leave individual pageview
   storage disabled, and disable browser, system, location, language, screen
   size, and referrer collection. Only aggregate page paths and visit counts
   are needed.
3. Make the dashboard public and enable **Allow adding visitor counts on your
   website**.
4. Set `goatCounterEndpoint` to the site's origin, such as
   `https://station2141.goatcounter.com`, then build and deploy normally.

Visitors see an explicit allow/deny prompt before the tracking script is
loaded. The tracker uses no persistent identifier; the only first-party cookie
stores the visitor's consent choice. The public widget reports anonymous visits
for the current day, month, and year. These are not exact distinct-person
counts because a cookie-free visitor may be counted again after the temporary
session expires.
