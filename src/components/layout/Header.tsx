import { Link, useLocation } from 'react-router-dom';
import { Wifi, Plus, Home } from 'lucide-react';
import ConnectionStatus from '@/components/common/ConnectionStatus';

const Header = () => {
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/admin', label: 'Add Content', icon: Plus },
  ];

  return (
    <header className="sticky top-0 z-40 glass-header">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-primary/20 flex items-center justify-center">
            <Wifi className="h-5 w-5 text-primary" />
          </div>
          <span className="text-xl font-bold text-gradient">StreamPeer</span>
        </Link>

        <nav className="flex items-center gap-1">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === to
                  ? 'bg-primary/15 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          ))}
          <div className="ml-3 pl-3 border-l border-border">
            <ConnectionStatus />
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
