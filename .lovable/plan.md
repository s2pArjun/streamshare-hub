

## Fix Plan: Build Errors & White Screen

There are 3 issues to fix:

### 1. Missing dependencies: `gun` and `webtorrent`
These packages are imported but not listed in `package.json`. Add them to dependencies:
- `"gun": "^0.2020.1241"`
- `"webtorrent": "^2.5.1"`

### 2. CSS `@import` must come before `@tailwind` directives
The `@import url(...)` for Google Fonts on line 5 of `index.css` must be moved to line 1, before the `@tailwind` statements. CSS spec requires `@import` to precede all other statements.

### 3. WebTorrent build failure (production build only)
WebTorrent's dependency `torrent-discovery` imports `bittorrent-dht` which uses Node.js `dgram`/`dns` modules — these get externalized by Vite for browser compatibility, causing the `"Client" is not exported` build error.

**Fix**: Add Vite `resolve.alias` entries to stub out the Node-only modules that WebTorrent's sub-dependencies try to import, and configure rollup to handle the externals properly. Specifically:
- Add `bittorrent-dht` alias to an empty module shim
- Add `dgram`, `dns`, `net`, `tls`, `fs` to resolve aliases pointing to empty shims
- Update `vite.config.ts` `build.rollupOptions.external` to handle these properly

Alternatively, a simpler and more reliable approach: load WebTorrent via CDN script tag and reference `window.WebTorrent` instead of npm import. This avoids all Node.js polyfill issues. The `webtorrent.ts` file would check for `window.WebTorrent` and the `index.html` would include the CDN script.

### Implementation details

**`index.css`** — Move the `@import` to the very first line.

**`package.json`** — Add `gun` and `webtorrent` to dependencies.

**`index.html`** — Add `<script src="https://cdn.jsdelivr.net/npm/webtorrent@latest/webtorrent.min.js"></script>` before the app script.

**`src/lib/webtorrent.ts`** — Replace npm import with `(window as any).WebTorrent` usage, removing the npm dependency for webtorrent entirely. Keep `gun` as an npm import since it works fine in the browser.

**`vite.config.ts`** — Remove `webtorrent` from `optimizeDeps.include` and `manualChunks`.

