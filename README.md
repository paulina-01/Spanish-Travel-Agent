# Beyond the Plaza — Spanish Travel Course

Digital product for young travellers learning Spanish quickly and efficiently. Fresh, modern design with a heavy focus on real conversation.

## Course access and paid modules

Modules 0 and 1 are free. Paid module source files are deliberately excluded
from Netlify production deployments by `.netlifyignore`; do not remove those
entries. The live app requests paid content only through a Netlify Function
after it checks a signed-in user's entitlement.

Keep the Git repository private while premium source files remain in it.
`.netlifyignore` protects the deployed site, not a public source repository.

### One-time setup

1. Create a Supabase project and enable **Email / Magic Link** authentication.
2. In Supabase SQL Editor, run `supabase/course-access.sql`.
3. In Supabase Storage, create a bucket named `course-modules`. It must remain
   **private**.
4. Add these Netlify environment variables (never place the last three in a
   browser file):

   ```text
   SUPABASE_URL=https://YOUR_PROJECT.supabase.co
   SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   STRIPE_FULL_COURSE_PRICE_ID=price_...
   ```

5. Put the first two values only in `js/course-config.js`. The Supabase anon
   key is safe to publish; Stripe secret keys and the Supabase service-role key
   are not.
6. In Stripe test mode, create a one-time product called **Beyond the Plaza —
   Full Course**, copy its Price ID into Netlify, and create a webhook endpoint:
   `https://YOUR_DOMAIN/.netlify/functions/stripe-webhook`. Subscribe it to
   `checkout.session.completed`.
7. Upload each module only when it is ready to release. In the private
   `course-modules` bucket, use these exact object names:

   ```text
   m2-going-places.html
   m4-day-in-life.html
   m8-para-vs-por.html
   m12-subjunctive.html
   m16-poetry-song-culture.html
   ```

   The existing corresponding files under `modules/` are local authoring
   copies. They are excluded from Netlify production deploys. A paid user sees
   a polite “not published yet” result until the private file is uploaded.

### Authoring and release workflow

1. Write and test a lesson locally in `modules/`.
2. Keep it out of the storage bucket while it is a draft.
3. Test it using a private preview copy if needed.
4. Upload the finished HTML file to the private bucket to publish it to paid
   members. Removing that private object immediately unpublishes it.

This is access control, not DRM: a paid member can still copy what they can
read. It prevents anonymous visitors and guessed URLs from receiving premium
lesson content.

## File structure

```
Splash-draftv3-parrot.html   — shell (link CSS, module script, React tweaks panel)
styles/main.css              — all CSS extracted from the shell
data/modules.js              — ES module: modules[], drillWords[], stepLabels[]
js/app.js                    — ES module: render(), goStep(), signup logic, M0 fetch
modules/
  m0-sound-like-spanish.html — M0 multi-step panel HTML (fetched by app.js)
  m1-who-are-you.html        — standard module reference HTML
  m2-going-places.html
  m4-day-in-life.html
  m8-para-vs-por.html
  m12-subjunctive.html
  m16-poetry-song-culture.html
tweaks-panel.jsx             — React tweaks panel (loaded via Babel CDN)
outline.html                 — full syllabus map (16 modules across 3 tracks)
index.html                   — landing / entry point
```

## Local preview

`fetch()` requires HTTP — open via a local server, not `file://`:

```bash
python3 -m http.server 8080
# then open http://localhost:8080/Splash-draftv3-parrot.html
```

# M1 "Who Are You?" — drop-in changes

Overwrite these 5 files in your local `Spanish-Travel-Agent` repo, keeping the
folder structure exactly as below. All paths are relative to the repo root.

    data/modules.js                  ← isM1 flag + m1StepLabels export
    js/app.js                        ← goStep() scoped to active module + M1 fetch/branch
    styles/main.css                  ← --irr variable + "Module 1" CSS block (appended)
    modules/m1-who-are-you.html      ← replaced: now the 7-step partial
    Splash-draftv3-parrot.html       ← #m1-dots, #m1-step-label, #panel-m1 added

## Order doesn't matter — they're consistent as a set.

CRITICAL FILE: js/app.js. Its goStep() rewrite is what lets M0 and M1 coexist
in the DOM without duplicate-ID navigation clashes. Don't cherry-pick the other
four without this one.

No new dependencies. No build step. Open Splash-draftv3-parrot.html and click
the "M1 — Who Are You?" switcher button to see the 7 pages.
