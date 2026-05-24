# Module Completion Popups — Drop-in Package

Six "destination unlocked" popups that fire when a student finishes a module.
Each one reuses the favicon vocabulary (fountain, compass, arch, tile, parrot…)
with its own palette and a poetic header.

## File layout (mirror into your repo)

```
your-repo/
├── styles/
│   └── popups.css              ← new
├── js/
│   └── popups.js               ← new
└── modules/
    └── popups/                 ← new folder
        ├── m0-complete.html
        ├── m1-complete.html
        ├── m2-complete.html
        ├── m4-complete.html
        ├── m8-complete.html
        └── m12-complete.html
```

## Wire it into your main page (e.g. Splash-draftv3-parrot.html or index.html)

### 1. Add the stylesheet (after main.css)
```html
<link rel="stylesheet" href="styles/main.css">
<link rel="stylesheet" href="styles/popups.css">
```

### 2. Add the script (just before </body>)
```html
<script src="js/popups.js" defer></script>
```

### 3. Add an empty mount point (anywhere in <body>)
```html
<div id="popup-host"></div>
```

### 4. Trigger the popup from your "Complete" button

In `modules/m0-sound-like-spanish.html`, the final step currently has:

```html
<button class="nav-btn" ... disabled>Complete ✓</button>
```

Change it to:

```html
<button class="nav-btn" ... onclick="showPopup('m0')">Complete ✓</button>
```

Same pattern for the other modules — call `showPopup('m1')`, `showPopup('m2')`, etc.

## Customising next-module URLs

`js/popups.js` has a `POPUP_ROUTES` map at the top defining where "Review"
and "Begin M_N_ →" navigate to. Edit it if your file paths change.

## Behaviour

- Clicking the dimmed backdrop, pressing `Esc`, or clicking "Review" navigates
  back to the just-completed module.
- "Begin M_N_ →" jumps to the next module.
- The popup HTML is fetched on first show then cached.

## Preview

`m0-complete-popup-options.html` in this project shows all six popups
side-by-side as a journey storyboard.
