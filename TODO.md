# TODO

- [ ] Patch auth login error handling and token generation to surface real cause on Vercel (without exposing internals in production).
- [ ] Replace Tailwind CDN usage with a production-safe approach (no `cdn.tailwindcss.com` in production).
- [ ] Add minimal cookie hardening (sameSite/secure) if needed without breaking local auth.
- [ ] (After deploy) Verify:
  - [ ] POST /auth/login returns success or a meaningful error.
  - [ ] UI loads Tailwind styles without CDN.

