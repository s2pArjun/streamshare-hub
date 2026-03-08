import MediaCard from './MediaCard';
import { MediaItem } from '@/lib/types';

interface CatalogGridProps {
  items: MediaItem[];
}

const CatalogGrid = ({ items }: CatalogGridProps) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
    {items.map((item, i) => (
      <MediaCard key={item.id} item={item} index={i} />
    ))}
  </div>
);

export default CatalogGrid;
