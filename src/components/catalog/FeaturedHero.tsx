import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MediaItem } from '@/lib/types';
import { Button } from '@/components/ui/button';

const FeaturedHero = ({ item }: { item: MediaItem }) => {
  const fallbackBg = 'https://via.placeholder.com/1920x600/0a0a1a/7c3aed?text=StreamPeer';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative w-full h-[50vh] min-h-[320px] max-h-[500px] overflow-hidden rounded-2xl mb-8"
    >
      <img
        src={item.thumbnailURL || fallbackBg}
        alt={item.title}
        className="absolute inset-0 w-full h-full object-cover"
        onError={(e) => { (e.target as HTMLImageElement).src = fallbackBg; }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />
      
      <div className="absolute bottom-0 left-0 right-0 p-8">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {item.category && (
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/20 text-primary mb-3">
              {item.category}
            </span>
          )}
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{item.title}</h2>
          <p className="text-muted-foreground max-w-lg mb-4 text-sm">
            {item.description || 'No description available'}
          </p>
          <Link to={`/player/${item.id}`}>
            <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6">
              <Play className="h-4 w-4" />
              Play Now
            </Button>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default FeaturedHero;
