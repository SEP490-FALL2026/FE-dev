# Login reference redesign

**Goal:** Adapt the supplied peach/glass login reference to SaaS-Sentry in light and dark themes.

**Design:** A centered translucent frame contains a focused form on the left and an original 3D bird illustration on the right. Light uses the existing warm cream/orange tokens; dark uses the existing navy/blue tokens. Theme and language controls stay at the top. Mobile displays the form with a compact decorative illustration. Preserve generated API login, validation, Sonner, password visibility, duplicate-submit prevention, rate-limit countdown and role redirect. Remove all home navigation, third-party sign-in and self-registration. Account creation remains invitation based.

**Assets:** Store the generated transparent illustration in `app/assets/auth` and import it in the showcase component so Vite fingerprints and emits it into the deployed client build. No external image service at runtime.

- [x] Add a regression assertion that login exposes no home link; run it against the current implementation.
- [x] Replace the old constellation panel and split-page styles with the reference composition and theme-token styling.
- [x] Save and inspect the mascot asset, including its source prompt.
- [x] Verify login tests, typecheck, changed-file formatting/lint and production build.
- [x] Preview light/dark, mobile, theme/language controls, password visibility, toast errors and deployed image delivery.

Verification: 15 targeted tests passed. TypeScript, changed-file ESLint/Prettier, `git diff --check` and the production build passed. The production preview served the fingerprinted PNG with HTTP 200; both CSS and TSX resolve to that same local asset. Browser checks covered light/dark, Vietnamese/English, 320/375/768/960/1024/1440/1920 px layouts, no horizontal or decorative overflow, password visibility, invalid-login toast, retained input and reduced motion. No browser runtime errors were observed. Screenshots and browser results are in `C:/fe_capstone/scratch/login-mascot-review`.

The repository-wide `pnpm check` stopped at 92 existing Prettier warnings outside the changed files; no unrelated files were reformatted.

Work directly in the existing checkout to preserve and build on the owner's current uncommitted auth work. Do not commit or publish.
