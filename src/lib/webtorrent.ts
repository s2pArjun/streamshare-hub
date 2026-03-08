import WebTorrent from 'webtorrent';

const TRACKERS = [
  'wss://tracker.btorrent.xyz',
  'wss://tracker.openwebtorrent.com',
  'wss://tracker.webtorrent.dev',
  'wss://tracker.fastcast.nz',
];

let client: WebTorrent.Instance | null = null;

export const getWebTorrentClient = async (): Promise<WebTorrent.Instance> => {
  if (!client) {
    client = new WebTorrent({ tracker: { announce: TRACKERS } } as any);
    client.on('error', (err) => console.error('WebTorrent error:', err));
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
