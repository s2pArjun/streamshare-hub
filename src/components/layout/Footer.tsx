import { Wifi } from 'lucide-react';

const Footer = () => (
  <footer className="border-t border-border py-8 mt-auto">
    <div className="container flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
      <div className="flex items-center gap-2">
        <Wifi className="h-4 w-4 text-primary" />
        <span>StreamPeer — Decentralized P2P Streaming</span>
      </div>
      <div className="flex items-center gap-4 font-mono text-xs">
        <span>WebTorrent</span>
        <span>•</span>
        <span>Gun.js</span>
        <span>•</span>
        <span>IPFS</span>
      </div>
    </div>
  </footer>
);

export default Footer;
