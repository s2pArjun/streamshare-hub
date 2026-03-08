# StreamPeer — Decentralized P2P Streaming

A decentralized peer-to-peer media streaming platform built with React, WebTorrent, Gun.js, and IPFS.

## Quick Start

### 1. Start the Gun.js Relay Server
```bash
cd gun-relay
npm install
node server.js
```

### 2. Start the Frontend
```bash
npm install
npm run dev
```

Then open: **http://localhost:8080**

## Testing Gun.js Sync

1. Start relay: `cd gun-relay && node server.js`
2. Start app: `npm run dev`
3. Open Tab 1: http://localhost:8080/admin
4. Open Tab 2: http://localhost:8080
5. In Tab 1: Add a new video → click "Add Content"
6. In Tab 2: Watch the homepage — the video should appear within 1-2 seconds
7. No refresh needed. If it appears → Gun.js sync is working ✅

## Architecture

- **WebTorrent** — Real P2P streaming via browser WebRTC
- **Gun.js** — Decentralized real-time catalog database
- **IPFS** — Content-addressed fallback via public gateways
- **HTTP** — Final fallback for reliable playback

### Streaming Fallback Chain
1. ⚡ Try WebTorrent P2P (15s timeout)
2. 🌐 Try IPFS gateways (4 gateways in sequence)
3. 📡 Fall back to HTTP direct URL

## Tech Stack

- React 18 + TypeScript + Vite
- Tailwind CSS + shadcn/ui + Framer Motion
- WebTorrent (browser, fully enabled)
- Gun.js (local relay server)
- IPFS (public gateways)
