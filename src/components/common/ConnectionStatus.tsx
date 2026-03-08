import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ConnectionStatusProps {
  compact?: boolean;
}

const ConnectionStatus = ({ compact = false }: ConnectionStatusProps) => {
  const [status, setStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');

  useEffect(() => {
    const checkRelay = async () => {
      try {
        const hostname = window.location.hostname || 'localhost';
        const res = await fetch(`http://${hostname}:8765/health`, { signal: AbortSignal.timeout(3000) });
        if (res.ok) setStatus('connected');
        else setStatus('error');
      } catch {
        setStatus('error');
      }
    };
    checkRelay();
    const interval = setInterval(checkRelay, 10000);
    return () => clearInterval(interval);
  }, []);

  const colors = {
    connecting: 'bg-yellow-400',
    connected: 'bg-emerald-400',
    error: 'bg-red-400',
  };

  const labels = {
    connecting: 'Connecting...',
    connected: 'P2P Connected',
    error: 'Relay Offline',
  };

  return (
    <div className="flex items-center gap-2">
      <motion.div
        className={`h-2.5 w-2.5 rounded-full ${colors[status]}`}
        animate={status === 'connected' ? { scale: [1, 1.3, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      />
      {!compact && (
        <span className="text-xs font-mono text-muted-foreground">{labels[status]}</span>
      )}
    </div>
  );
};

export default ConnectionStatus;
