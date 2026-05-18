Refactor `spanish-travel-agent/Splash-draft-v3-parrot.html` into a modular file structure.

STRICT REQUIREMENT: The rendered page must look and behave exactly identical to the original — zero visual or functional changes.

## Current file inventory (read all before touching anything)
spanish-travel-agent/
├── index.html
├── outline.html          # Module outline — M0 is currently missing
├── README.md
├── Splash-draft-v3-parrot.html   # Source — split this file
└── tweaks-panel.jsx              # Already external — do not touch

## Target structure
spanish-travel-agent/
├── index.html                    # Do not touch
├── outline.html                  # Add M0 entry only (see rule 9)
├── README.md                     # Update with new structure notes
├── Splash-draft-v3-parrot.html   # Becomes the shell (see rule 8)
├── tweaks-panel.jsx              # Do not touch
├── styles/
│   └── main.css
├── data/
│   └── modules.js
├── modules/
│   ├── m0-sound-like-spanish.html     # Multi-step panel — extracted from #panel-m0
│   ├── m1-who-are-you.html         # Data-driven — comment block only (see rule 6), reverted back to 1 module since we will re-do this after
│   ├── m2-going-places.html
│   ├── m4-day-in-life.html
│   ├── m8-para-vs-por.html
│   ├── m12-subjunctive.html
│   └── m16-poetry-song-culture.html
└── js/
    └── app.js

## Rules

### Extraction
1. Read Splash-draft-v3-parrot.html fully before writing a single file.
2. Extract the <style> block verbatim into styles/main.css — no changes, no reordering.
3. Extract the modules array, drillWords array, and stepLabels array into data/modules.js using ES module syntax:
   export const modules = [...];
   export const drillWords = [...];
   export const stepLabels = [...];
4. Move the entire inner HTML of <div id="panel-m0"> into modules/m0-pronunciation.html as a plain fragment (no doctype, no html/body wrapper). This panel has 6 steps (step-0 through step-5).

### Standard module files (m1 through m16)
5. The standard modules (M1, M2, M4, M8, M12, M16) are data-driven — their content is populated by render() from the modules array. They have no unique panel HTML to extract.
6. For each standard module, create a module file containing only a structured HTML comment block:
   <!-- MODULE: M[n] — [Title] -->
   <!-- Level: [level] | Track: [track] | Students: [students] -->
   <!--
     Data-driven module — content injected by render() in js/app.js.
     To edit content, update the matching entry in data/modules.js.
     To add a multi-step panel (like M0), add a <div id="panel-mN"> 
     to Splash-draft-v3-parrot.html and add a fetch() call in js/app.js.
   -->
   Fill in the actual values from the modules array for each file.

### JS
7. Extract all JS (from the vanilla <script> block only) into js/app.js as an ES module:
   - import { modules, drillWords, stepLabels } from '../data/modules.js';
   - Contains: goStep(), render(), switcher init, showSignup(), handleSignup()
   - Keep currentStep = 0 as module-level state
   - Do NOT extract the React/Babel <script type="text/babel"> block — that stays inline in the shell

### Shell
8. Splash-draft-v3-parrot.html becomes the shell:
   - Keep <head> with all existing meta, font links, React/Babel CDN scripts, and tweaks-panel.jsx script tag exactly as-is
   - Add <link rel="stylesheet" href="styles/main.css"> in <head> (remove the <style> block)
   - Keep all structural body HTML exactly as-is (page-header, switcher, slide, panel-left, panel-standard, panel-m0 container div, tweaks-root div)
   - The #panel-m0 div stays in the shell as an empty container: <div class="panel-right" id="panel-m0" style="display:none"></div>
   - Keep the React <script type="text/babel"> block exactly as-is (inline, untouched)
   - Replace the vanilla <script> block with: <script type="module" src="js/app.js"></script>
   - In js/app.js, fetch('modules/m0-pronunciation.html') and inject into #panel-m0 before calling render(0). Use async/await. The fetch must complete before render(0) runs.

### outline.html
9. Open outline.html, read the existing format for module entries, then prepend M0 as the first entry using that exact same format. Values: n=0, title="Vocal Roots: Sound like Spanish", track="Beginner", level="A1", students="All students", steps=6.

### General
10. Add /* SOURCE: Splash-draft-v3-parrot.html */ as the first line of each newly created file.
11. Do NOT rename any CSS classes, IDs, or JS variable/function names.
12. Do NOT add any new features, styles, animations, or logic.
13. The CK_API_KEY and CK_FORM_ID placeholder strings in handleSignup() must be preserved exactly as-is in app.js.
14. After creating all files, serve spanish-travel-agent/ with python3 -m http.server 8080 and verify:
    - All 7 module switcher buttons appear and are clickable
    - M0 multi-step panel loads (all 6 steps navigate correctly)
    - Standard modules (M1, M2, M4, M8, M12, M16) render their data correctly
    - The "Next →" button on standard modules shows the signup screen
    - The tweaks panel is visible and functional