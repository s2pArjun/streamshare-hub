import { useState, useEffect, useRef } from 'react';
import { useWebTorrent } from '@/hooks/useWebTorrent';
import { getIPFSUrl } from '@/lib/ipfs';
import { MediaItem } from '@/lib/types';
import StreamStatsPanel from './StreamStats';
import { AnimatePresence } from 'framer-motion';
import { Users, Loader2 } from 'lucide-react';

interface VideoPlayerProps {
  item: MediaItem;
}

type Source = 'loading' | 'p2p' | 'ipfs' | 'http';

const P2P_TIMEOUT = 15000;

const VideoPlayer = ({ item }: VideoPlayerProps) => {
  const { videoURL, loading: wtLoading, error: wtError, stats } = useWebTorrent(item.magnetURI);
  const [currentSource, setCurrentSource] = useState<Source>('loading');
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [ipfsGatewayIndex, setIpfsGatewayIndex] = useState(0);
  const [showStats, setShowStats] = useState(true);
  const [statusMsg, setStatusMsg] = useState('Connecting to P2P swarm...');
  const videoRef = useRef<HTMLVideoElement>(null);
  const p2pTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triedP2P = useRef(false);

  // Stage 1: P2P
  useEffect(() => {
    if (videoURL) {
      setVideoSrc(videoURL);
      setCurrentSource('p2p');
      setStatusMsg('Streaming via P2P');
      if (p2pTimerRef.current) clearTimeout(p2pTimerRef.current);
      return;
    }

    if (!triedP2P.current) {
      triedP2P.current = true;
      setStatusMsg('Searching for P2P peers...');
      p2pTimerRef.current = setTimeout(() => {
        if (!videoURL) {
          tryIPFS();
        }
      }, P2P_TIMEOUT);
    }

    return () => {
      if (p2pTimerRef.current) clearTimeout(p2pTimerRef.current);
    };
  }, [videoURL]);

  // If WebTorrent errors, try IPFS immediately
  useEffect(() => {
    if (wtError && currentSource === 'loading') {
      if (p2pTimerRef.current) clearTimeout(p2pTimerRef.current);
      tryIPFS();
    }
  }, [wtError]);

  const tryIPFS = () => {
    const url = getIPFSUrl(item.ipfsCID, ipfsGatewayIndex);
    if (url) {
      setStatusMsg(`Trying IPFS gateway ${ipfsGatewayIndex + 1}...`);
      setCurrentSource('ipfs');
      setVideoSrc(url);
    } else {
      tryHTTP();
    }
  };

  const tryHTTP = () => {
    if (item.fallbackURL) {
      setStatusMsg('Using HTTP fallback');
      setCurrentSource('http');
      setVideoSrc(item.fallbackURL);
    } else {
      setStatusMsg('No playable source found');
    }
  };

  const handleVideoError = () => {
    if (currentSource === 'ipfs') {
      const nextIdx = ipfsGatewayIndex + 1;
      const nextUrl = getIPFSUrl(item.ipfsCID, nextIdx);
      if (nextUrl) {
        setIpfsGatewayIndex(nextIdx);
        setVideoSrc(nextUrl);
        setStatusMsg(`Trying IPFS gateway ${nextIdx + 1}...`);
      } else {
        tryHTTP();
      }
    } else if (currentSource === 'http') {
      setStatusMsg('Playback failed on all sources');
    }
  };

  return (
    <div className="relative w-full rounded-xl overflow-hidden glass-card">
      <div className="relative aspect-video bg-background">
        {videoSrc ? (
          <video
            ref={videoRef}
            src={videoSrc}
            controls
            autoPlay
            className="w-full h-full"
            onError={handleVideoError}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground font-mono">{statusMsg}</p>
          </div>
        )}

        <AnimatePresence>
          {showStats && (videoSrc || currentSource === 'loading') && (
            <StreamStatsPanel
              stats={stats}
              source={currentSource}
              onClose={() => setShowStats(false)}
            />
          )}
        </AnimatePresence>

        {/* Peer count badge */}
        {stats.peers > 0 && (
          <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/70 backdrop-blur-sm text-xs font-mono">
            <Users className="h-3 w-3 text-primary" />
            <span className="text-foreground">{stats.peers} peers</span>
          </div>
        )}
      </div>

      {!showStats && (
        <button
          onClick={() => setShowStats(true)}
          className="absolute top-3 right-3 z-10 px-2 py-1 rounded-md text-xs font-mono glass-card text-muted-foreground hover:text-foreground"
        >
          Stats
        </button>
      )}
    </div>
  );
};

export default VideoPlayer;
