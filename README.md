# Interactive System Hierarchy Visualization

A small client-side visualization project to explore and interact with hierarchical system diagrams in the browser. The app is implemented with plain HTML, CSS and JavaScript and includes utilities for camera control, hit-testing, drawing and UI/input handling.

This repository is intentionally lightweight and intended to be run as a static site.

## Quick start

1. Ensure you have a local HTTP server (recommended) or open `index.html` directly in a browser. Serving over HTTP avoids CORS and resource-loading issues.

2a. Serve with Python (works in Bash on Windows):

   python -m http.server 8000

Then open http://localhost:8000/ in your browser.

2b. Or use a Node.js static server (if you have npm installed):

   npx http-server -c-1

2c. If `index.html` is missing or intentionally removed, regenerate it with the included helper script:

   bash target/scripts/setup-index.sh

## Files of interest

- `index.html` — main entry (the top-level page that loads the app). If it is missing, run the setup script above.
- `css/styles.css` — styling for the page and UI
- `js/` — application logic
  - `main.js` — app bootstrap
  - `drawing.js` — drawing primitives and box sizing
  - `camera.js` — camera transforms and navigation
  - `hit-testing.js` — hit-test logic for mouse/touch interaction
  - `input.js` — input handling and gestures
  - `state.js` — client-side app state and selection
  - `ui.js` — UI layer and event wiring
  - `config.js` — main visualization configuration (labels, sizes, half-extents, etc.)
  - `config-cloudfoundry.js` — an alternate configuration (Cloud Foundry themed)
- `target/` — helper and build scripts, and generated artifacts

## Configuration

Edit `js/config.js` (or `js/config-cloudfoundry.js`) to change labels, colors and layout parameters. The config file controls sizes such as half-extents, scale factors, and predefined legend items used by the renderer.

## Development notes

- The project is purely client-side; there is no build step. Editing the files under `js/` and `css/` is sufficient for most changes.
- If you add new dependencies you should also include instructions and a minimal manifest (`package.json` or `requirements.txt`) — currently there are none.
- The `target/scripts` folder contains convenience scripts used for preparing the demo `index.html` and for basic verification tasks.

## Troubleshooting

- If assets fail to load or interactions feel broken, make sure you're serving the site over HTTP (see Quick start).
- If `index.html` is accidentally deleted, restore it with:

  bash target/scripts/setup-index.sh

- If you change `config.js` and see no effect, clear your browser cache or do a hard reload (Ctrl+Shift+R).

## Tests and CI

There are no automated tests or CI configured in this repository. Adding a tiny static-server smoke test or a headless browser smoke test is a low-risk improvement.

## Contributing

Contributions are welcome. Please open issues or pull requests. If you plan larger changes, add a brief description of the goal and any compatibility concerns.

## License

No license file is present in the repo. If you plan to publish or share this project, add a `LICENSE` file (for example, the MIT license) to make the terms explicit.

---

If you'd like, I can:

- add a minimal `package.json` and an npm `start` script (http-server) for convenience
- add a small demo screenshot or GIF to the README
- create a basic smoke test script using Puppeteer or Playwright

Tell me which of the above (if any) you'd like next.
