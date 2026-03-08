const TRACKERS = [
  'wss://tracker.btorrent.xyz',
  'wss://tracker.openwebtorrent.com',
  'wss://tracker.webtorrent.dev',
  'wss://tracker.fastcast.nz',
];

let client: any = null;

export const getWebTorrentClient = async (): Promise<any> => {
  if (!client) {
    const WT = (window as any).WebTorrent;
    if (!WT) throw new Error('WebTorrent not loaded');
    client = new WT({ tracker: { announce: TRACKERS } });
    client.on('error', (err: any) => console.error('WebTorrent error:', err));
    console.log('✅ WebTorrent client initialized');
  }
  return client;
};

export const destroyClient = () => {
  if (client) {
    client.destroy();
    client = null;
  }
};

if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', destroyClient);
}
