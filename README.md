# AuthCost

Finance-grade auth / identity vendor pricing tracker (Clerk, Auth0, Cognito, WorkOS, Stytch, Logto, Kinde, Supabase Auth, Firebase Auth / Identity Platform, Descope) plus a self-hosted (Better Auth / Auth.js) cost guide.

- Build: `npm run build` → `dist/`
- Preview: `npm run preview` (port 4190)
- Check sources: `npm run check` / `npm run baseline`
- Every price row cites an official source URL + checked date. Never invent numbers.

- Build guards (fail the build, never disable): clean internal URLs; RT-20261031-57 every SSO scenario result discloses the SSO-users-per-connection assumption (page + JSON-LD answer clauses); RT-59 no max-minus-min home headline; RT-60 ties render as ties (no "$0/yr less|more"), rates at published precision, MAU/MRU direction.
