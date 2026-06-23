# Beyond the Plaza — Spanish Travel Course

Digital product for young travellers learning Spanish quickly and efficiently. Fresh, modern design with a heavy focus on real conversation.

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
