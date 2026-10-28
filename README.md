# eyemonger

Site for eyemonger.com. Plain HTML, CSS and JavaScript, no build step.

- `index.html` home page markup
- `project.html` case study template, filled from the address: `project.html#project-01`
- `projects.js` the list of projects: tiles, quick play and case studies all read from it. Add a project's real copy here (title, client, year, role, format, line, lede, brief, made, reception, quote, quoteBy, press, awards, credits); anything left out shows the placeholder from `EM_CASE_DEFAULTS`
- `eyes.js` shared by both pages: the eyes, video playback, smooth links, copy email, back-to-top eye
- `project.js` fills the case study template
- `styles.css` all styles (Space Mono from Google Fonts). Palette: ink #0E0E0E, paper #EDEBE4, slate #8FA5B5, olive #8D7B3C, violet #6E5AA8, blue #2C5FD0, rust #7B4A2A, green #5F7D52, ochre #C9892F, brown #3A2418
- `main.js` home page: work wall, filters, quick play
- `404.html` not found page
- `CNAME` custom domain for GitHub Pages

Run locally: open `index.html` in a browser, or `python3 -m http.server` in this folder.

Work tiles are defined in `projects.js`. Bracketed text like `[PROJECT TITLE]` is placeholder content.

## Placeholder loops

`media/` holds six 12 second gradient loops (1920x1080 H.264, no audio) with a matching `.jpg` poster for each. Loop 06 plays behind the hero (set in `index.html`). Five tiles in `projects.js` point at the others through the `v` field, and quick play shows the same loop full screen. Media links carry `?v=2` so Cloudflare fetches new files; bump it when you replace a video under the same name.

To swap one, drop the new `.mp4` and a poster `.jpg` into `media/` and change that tile's `v` to the new file name (no extension). Tiles without `v` show their flat color. Videos only play while on screen and stay paused for visitors who turn off motion.
