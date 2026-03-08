import Gun from 'gun';
import { MediaItem } from './types';

const getRelayPeers = (): string[] => {
  const envPeers = (import.meta as any).env?.VITE_GUN_RELAY_PEERS;
  if (envPeers) return envPeers.split(',').map((p: string) => p.trim()).filter(Boolean);
  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  return [`http://${hostname}:8765/gun`];
};

export const gun = (Gun as any)({
  peers: getRelayPeers(),
  localStorage: true,
  radisk: false,
  axe: false,
});

const CATALOG_KEY = (import.meta as any).env?.VITE_GUN_NAMESPACE || 'streampeer-catalog-v1';
export const catalogRef = gun.get(CATALOG_KEY);

export const addToCatalog = (item: MediaItem): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!item.id || !item.title || !item.magnetURI || !item.ipfsCID) {
      return reject(new Error('Missing required fields'));
    }
    catalogRef.get(item.id).put(
      {
        id: item.id,
        title: item.title,
        description: item.description || '',
        magnetURI: item.magnetURI,
        ipfsCID: item.ipfsCID,
        type: item.type,
        thumbnailURL: item.thumbnailURL || '',
        category: item.category || '',
        fallbackURL: item.fallbackURL || '',
        addedAt: item.addedAt || Date.now(),
        addedBy: item.addedBy || 'anonymous',
        deleted: false,
      },
      (ack: any) => {
        if (ack.err) reject(new Error(ack.err));
        else resolve();
      }
    );
  });
};

export const removeFromCatalog = (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    catalogRef.get(id).put({ deleted: true, deletedAt: Date.now() }, (ack: any) => {
      if (ack.err) reject(new Error(ack.err));
      else resolve();
    });
  });
};

const isValidItem = (data: any): data is MediaItem => {
  return (
    data &&
    typeof data.id === 'string' && data.id.length > 0 &&
    typeof data.title === 'string' && data.title.length > 0 &&
    typeof data.magnetURI === 'string' && data.magnetURI.startsWith('magnet:') &&
    typeof data.ipfsCID === 'string' &&
    (data.type === 'video' || data.type === 'audio') &&
    !data.deleted
  );
};

export const subscribeToCatalog = (callback: (items: MediaItem[]) => void): (() => void) => {
  const items: Record<string, MediaItem> = {};

  catalogRef.map().on((data: any, id: string) => {
    if (!data || data.deleted) {
      delete items[id];
    } else if (isValidItem(data)) {
      items[id] = { ...data, id };
    }
    callback(Object.values(items).sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0)));
  });

  return () => {};
};

export const getSampleContent = (): MediaItem[] => [
  {
    id: 'demo_big_buck_bunny',
    title: 'Big Buck Bunny',
    description: 'Classic Blender Foundation open movie. Great for testing P2P streaming.',
    magnetURI: 'magnet:?xt=urn:btih:dd8255ecdc7ca55fb0bbf81323d87062db1f6d1c&dn=Big+Buck+Bunny&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&tr=wss%3A%2F%2Ftracker.webtorrent.dev',
    ipfsCID: 'QmSgvgwxZGaBLqkGyWemEDqikCqU52XxsYLKtdy3vGZ8uq',
    fallbackURL: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    type: 'video',
    thumbnailURL: 'https://peach.blender.org/wp-content/uploads/title_anouncement.jpg',
    category: 'Animation',
    addedAt: Date.now() - 5000,
    addedBy: 'system',
  },
  {
    id: 'demo_elephants_dream',
    title: 'Elephants Dream',
    description: 'The first Blender Foundation open movie from 2006.',
    magnetURI: 'magnet:?xt=urn:btih:d2d1d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2&dn=Elephants+Dream&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com',
    ipfsCID: 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG',
    fallbackURL: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    type: 'video',
    thumbnailURL: 'https://orange.blender.org/wp-content/themes/orange/images/media/splash.jpg',
    category: 'Animation',
    addedAt: Date.now() - 4000,
    addedBy: 'system',
  },
  {
    id: 'demo_for_bigger_blazes',
    title: 'For Bigger Blazes',
    description: 'Stunning fire and visual effects demo video.',
    magnetURI: 'magnet:?xt=urn:btih:c9e15763f722f23e98a29decdfae341b98d53056&dn=ForBiggerBlazes&tr=wss%3A%2F%2Ftracker.btorrent.xyz',
    ipfsCID: 'bafybeiemxf5abjwjbikoz4mc3a3dla6ual3jsgpdr4cjr3oz3evfyavhwq',
    fallbackURL: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    type: 'video',
    thumbnailURL: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg',
    category: 'Demo',
    addedAt: Date.now() - 3000,
    addedBy: 'system',
  },
  {
    id: 'demo_sintel_trailer',
    title: 'Sintel (WebTorrent Demo)',
    description: 'Official WebTorrent demo torrent. Has active P2P seeders — best for testing WebTorrent streaming.',
    magnetURI: 'magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&tr=wss%3A%2F%2Ftracker.webtorrent.dev',
    ipfsCID: 'bafybeigagd5nmnn2iys2f3doro7ydrevyr2mzarwidgadawmamiteydbzi',
    fallbackURL: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    type: 'video',
    thumbnailURL: '',
    category: 'Demo',
    addedAt: Date.now() - 2000,
    addedBy: 'system',
  },
];

export const addSampleContent = async (): Promise<void> => {
  for (const item of getSampleContent()) {
    try {
      await addToCatalog(item);
      console.log(`✅ Sample added: ${item.title}`);
    } catch (err) {
      console.error(`❌ Failed: ${item.title}`, err);
    }
  }
};
