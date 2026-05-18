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
