import { useState, useEffect } from 'react';
import { StreamStats } from '@/lib/types';

export const useWebTorrent = (magnetURI: string | null) => {
  const [videoURL, setVideoURL] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<StreamStats>({
    peers: 0,
    downloadSpeed: 0,
    uploadSpeed: 0,
    progress: 0,
    timeRemaining: Infinity,
  });

  useEffect(() => {
    if (!magnetURI) return;
    setLoading(true);
    setError(null);
    setVideoURL(null);

    let cancelled = false;
    let torrent: any = null;
    let statsInterval: ReturnType<typeof setInterval> | null = null;

    const init = async () => {
      try {
        const { getWebTorrentClient } = await import('@/lib/webtorrent');
        const client = await getWebTorrentClient();
        if (cancelled) return;

        const infoHash = magnetURI.split('btih:')[1]?.split('&')[0];
        torrent = client.torrents.find(
          (t: any) => t.infoHash === infoHash
        );
        if (!torrent) {
          torrent = client.add(magnetURI);
        }

        torrent.on('error', (err: Error) => {
          if (cancelled) return;
          setError(err.message);
          setLoading(false);
        });

        const onReady = () => {
          if (cancelled) return;
          const file = torrent.files
            .filter((f: any) => /\.(mp4|webm|mkv|avi|mov|ogg)$/i.test(f.name))
            .sort((a: any, b: any) => b.length - a.length)[0];

          if (!file) {
            setError('No video file found in torrent');
            setLoading(false);
            return;
          }

          file.getBlobURL((err: Error | null, url?: string) => {
            if (cancelled) return;
            if (err || !url) {
              setError('Failed to get stream URL');
              setLoading(false);
              return;
            }
            setVideoURL(url);
            setLoading(false);
          });
        };

        if (torrent.ready) {
          onReady();
        } else {
          torrent.on('ready', onReady);
        }

        statsInterval = setInterval(() => {
          if (!torrent || cancelled) return;
          setStats({
            peers: torrent.numPeers || 0,
            downloadSpeed: torrent.downloadSpeed || 0,
            uploadSpeed: torrent.uploadSpeed || 0,
            progress: torrent.progress || 0,
            timeRemaining: torrent.timeRemaining || Infinity,
          });
        }, 1000);
      } catch (err) {
        if (cancelled) return;
        setError('WebTorrent unavailable');
        setLoading(false);
      }
    };

    init();

    return () => {
      cancelled = true;
      if (statsInterval) clearInterval(statsInterval);
    };
  }, [magnetURI]);

  return { videoURL, loading, error, stats };
};
