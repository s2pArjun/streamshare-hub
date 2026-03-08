import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Share2, Film, Calendar, Tag, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useGunCatalog } from '@/hooks/useGunCatalog';
import Layout from '@/components/layout/Layout';
import VideoPlayer from '@/components/player/VideoPlayer';
import { formatTimeAgo } from '@/lib/validation';

const Player = () => {
  const { id } = useParams<{ id: string }>();
  const { items, loading } = useGunCatalog();
  const item = items.find((i) => i.id === id);

  if (loading) {
    return (
      <Layout>
        <div className="container py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-32 bg-muted rounded" />
            <div className="aspect-video bg-muted rounded-xl" />
            <div className="h-6 w-64 bg-muted rounded" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!item) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Content Not Found</h1>
          <p className="text-muted-foreground mb-6">This media item doesn't exist in the catalog.</p>
          <Link to="/">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Go Home</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard');
  };

  return (
    <Layout>
      <div className="container py-6 max-w-5xl">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to catalog
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <VideoPlayer item={item} />

          <div className="mt-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">{item.title}</h1>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Film className="h-3.5 w-3.5" /> {item.type}
                  </span>
                  {item.category && (
                    <span className="flex items-center gap-1">
                      <Tag className="h-3.5 w-3.5" /> {item.category}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" /> {formatTimeAgo(item.addedAt)}
                  </span>
                </div>
              </div>
              <Button onClick={handleShare} variant="outline" size="sm" className="border-border text-foreground hover:bg-muted flex-shrink-0">
                <Share2 className="h-4 w-4 mr-1" /> Share
              </Button>
            </div>

            {item.description && (
              <p className="text-muted-foreground">{item.description}</p>
            )}

            {/* Technical details */}
            <details className="glass-card p-4">
              <summary className="text-sm font-medium text-foreground cursor-pointer flex items-center gap-2">
                <LinkIcon className="h-4 w-4 text-primary" />
                Technical Details
              </summary>
              <div className="mt-3 space-y-2 text-xs font-mono text-muted-foreground">
                <div>
                  <span className="text-foreground">Magnet URI:</span>
                  <p className="break-all mt-0.5 p-2 bg-muted/50 rounded">{item.magnetURI}</p>
                </div>
                <div>
                  <span className="text-foreground">IPFS CID:</span>
                  <p className="break-all mt-0.5 p-2 bg-muted/50 rounded">{item.ipfsCID}</p>
                </div>
                {item.fallbackURL && (
                  <div>
                    <span className="text-foreground">HTTP Fallback:</span>
                    <p className="break-all mt-0.5 p-2 bg-muted/50 rounded">{item.fallbackURL}</p>
                  </div>
                )}
              </div>
            </details>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Player;
