# eyemonger

Site for eyemonger.com. Plain HTML, CSS and JavaScript, no build step.

- `index.html` home page markup
- `styles.css` all styles (Space Mono from Google Fonts)
- `main.js` the eyes: cursor tracking, blinking, work filters, quick play
- `404.html` not found page
- `CNAME` custom domain for GitHub Pages

Run locally: open `index.html` in a browser, or `python3 -m http.server` in this folder.

Work tiles are defined in the `tiles` array at the top of `main.js`. Bracketed text like `[PROJECT TITLE]` is placeholder content.

## Placeholder loops

`media/` holds six 12 second gradient loops (1920x1080 H.264, no audio) with a matching `.jpg` poster for each. Six tiles in `main.js` point at them through the `v` field, and quick play shows the same loop full screen.

To swap one, drop the new `.mp4` and a poster `.jpg` into `media/` and change that tile's `v` to the new file name (no extension). Tiles without `v` show their flat color. Videos only play while on screen and stay paused for visitors who turn off motion.
