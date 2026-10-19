# Cloudflare rate limiting for sign-up and log-in

The limits inside `Wally_Street.html` run in the browser, so a determined person can bypass them by clearing storage or using another browser. Real enforcement has to happen on a server. Cloudflare can do that, but only for requests that pass through your Cloudflare-proxied domain.

Wally Street currently has no sign-up or log-in endpoints of its own, because it uses the host's built-in database. If you move accounts to your own API behind Cloudflare, add the rules below. The paths are placeholders, so swap in your real ones.

Where: Cloudflare dashboard > your domain > Security > WAF > Rate limiting rules > Create rule.

## Rule 1: Sign-up (4 accounts)

- Expression: `(http.request.method eq "POST" and http.request.uri.path eq "/api/signup")`
- Characteristic: IP address
- Requests: 4
- Period: the longest your plan allows (a longer window is closer to "4 accounts per person")
- Action: Block, for the longest duration your plan allows

## Rule 2: Log-in and password change

- Expression: `(http.request.method eq "POST" and http.request.uri.path in {"/api/login" "/api/password"})`
- Characteristic: IP address
- Requests: 5
- Period: 1 minute, or the closest your plan allows
- Action: Block, or Managed Challenge

## Rule 3: Every other auth endpoint

- Expression: `(starts_with(http.request.uri.path, "/api/auth/"))`
- Characteristic: IP address
- Requests: 20 per minute
- Action: Managed Challenge

Notes:
- Periods, block durations and the number of rules depend on your Cloudflare plan, so check the current limits for yours.
- Also enforce the 4-account cap in your server code (count accounts per IP or per device), since a Cloudflare rule only limits request rates.
- Add Cloudflare Turnstile to the sign-up form to slow down bots.
