import { formatBytes } from '@/lib/validation';
import { StreamStats as StreamStatsType } from '@/lib/types';
import { motion } from 'framer-motion';
import { Users, ArrowDown, ArrowUp, X } from 'lucide-react';

interface StreamStatsProps {
  stats: StreamStatsType;
  source: string;
  onClose: () => void;
}

const StreamStatsPanel = ({ stats, source, onClose }: StreamStatsProps) => {
  const sourceConfig: Record<string, { icon: string; label: string; color: string }> = {
    p2p: { icon: '⚡', label: 'P2P (WebTorrent)', color: 'text-primary' },
    ipfs: { icon: '🌐', label: 'IPFS Gateway', color: 'text-secondary' },
    http: { icon: '📡', label: 'HTTP Direct', color: 'text-yellow-400' },
    loading: { icon: '⏳', label: 'Connecting...', color: 'text-muted-foreground' },
  };

  const cfg = sourceConfig[source] || sourceConfig.loading;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="absolute top-3 right-3 z-10 glass-card p-3 min-w-[200px] text-xs"
    >
      <div className="flex items-center justify-between mb-2">
        <span className={`font-semibold ${cfg.color}`}>
          {cfg.icon} {cfg.label}
        </span>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="h-3 w-3" />
        </button>
      </div>

      <div className="space-y-1.5 font-mono text-muted-foreground">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1"><Users className="h-3 w-3" /> Peers</span>
          <span className="text-foreground">{stats.peers}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1"><ArrowDown className="h-3 w-3" /> Down</span>
          <span className="text-foreground">{formatBytes(stats.downloadSpeed)}/s</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1"><ArrowUp className="h-3 w-3" /> Up</span>
          <span className="text-foreground">{formatBytes(stats.uploadSpeed)}/s</span>
        </div>
        {stats.progress > 0 && stats.progress < 1 && (
          <div className="pt-1">
            <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${stats.progress * 100}%` }}
              />
            </div>
            <span className="text-[10px]">{(stats.progress * 100).toFixed(1)}%</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StreamStatsPanel;
