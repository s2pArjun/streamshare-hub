import Gun from 'gun';
import http from 'http';

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.writeHead(200); res.end(); return; }
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', uptime: process.uptime() }));
    return;
  }
  res.writeHead(404); res.end('Not Found');
});

const gun = Gun({ web: server, file: 'radata', radisk: true, localStorage: false, axe: false });

gun.on('hi', peer => console.log('✅ Peer connected:', peer?.url || 'browser'));
gun.on('bye', peer => console.log('❌ Peer disconnected:', peer?.url || 'browser'));

const PORT = process.env.PORT || 8765;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🔫 Gun.js relay running on http://localhost:${PORT}`);
  console.log(`📡 Gun endpoint: http://localhost:${PORT}/gun`);
});

process.on('SIGTERM', () => server.close(() => process.exit(0)));
process.on('SIGINT', () => server.close(() => process.exit(0)));
