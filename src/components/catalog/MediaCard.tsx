import { motion } from 'framer-motion';
import { Play, Film, Music } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MediaItem } from '@/lib/types';
import { formatTimeAgo } from '@/lib/validation';

interface MediaCardProps {
  item: MediaItem;
  index: number;
}

const MediaCard = ({ item, index }: MediaCardProps) => {
  const fallbackThumb = item.type === 'audio'
    ? 'https://via.placeholder.com/640x360/1a1a2e/7c3aed?text=🎵+Audio'
    : 'https://via.placeholder.com/640x360/1a1a2e/7c3aed?text=🎬+Video';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link to={`/player/${item.id}`} className="block group">
        <div className="glass-card overflow-hidden transition-all duration-300 group-hover:border-primary/40 group-hover:glow-primary">
          <div className="relative aspect-video overflow-hidden">
            <img
              src={item.thumbnailURL || fallbackThumb}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              onError={(e) => { (e.target as HTMLImageElement).src = fallbackThumb; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="h-14 w-14 rounded-full bg-primary/90 flex items-center justify-center shadow-lg"
              >
                <Play className="h-6 w-6 text-primary-foreground ml-1" />
              </motion.div>
            </div>

            {/* Type badge */}
            <div className="absolute top-2 left-2">
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-background/70 backdrop-blur-sm text-foreground">
                {item.type === 'video' ? <Film className="h-3 w-3" /> : <Music className="h-3 w-3" />}
                {item.type}
              </span>
            </div>

            {/* Category */}
            {item.category && (
              <div className="absolute top-2 right-2">
                <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-primary/20 text-primary backdrop-blur-sm">
                  {item.category}
                </span>
              </div>
            )}
          </div>

          <div className="p-3">
            <h3 className="font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors">
              {item.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
              {item.description || 'No description'}
            </p>
            <p className="text-xs text-muted-foreground/60 mt-1 font-mono">
              {formatTimeAgo(item.addedAt)}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default MediaCard;
