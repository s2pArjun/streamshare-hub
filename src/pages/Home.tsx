import { motion } from 'framer-motion';
import { Wifi, Zap, Globe, Shield, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGunCatalog } from '@/hooks/useGunCatalog';
import { addSampleContent } from '@/lib/gun';
import { toast } from 'sonner';
import Layout from '@/components/layout/Layout';
import CatalogGrid from '@/components/catalog/CatalogGrid';
import FeaturedHero from '@/components/catalog/FeaturedHero';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';
import { Link } from 'react-router-dom';

const features = [
  { icon: Zap, title: 'P2P Streaming', desc: 'Stream directly from peers via WebTorrent' },
  { icon: Globe, title: 'IPFS Fallback', desc: 'Content-addressed storage as backup' },
  { icon: Shield, title: 'Decentralized', desc: 'No central server — Gun.js mesh network' },
];

const Home = () => {
  const { items, loading } = useGunCatalog();

  const handleAddSamples = async () => {
    try {
      await addSampleContent();
      toast.success('Demo content loaded!');
    } catch (err) {
      toast.error('Failed to load demo content');
    }
  };

  if (loading) {
    return (
      <Layout>
        <LoadingSkeleton />
      </Layout>
    );
  }

  if (items.length === 0) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="h-20 w-20 rounded-3xl bg-primary/20 flex items-center justify-center mx-auto mb-6 glow-primary">
              <Wifi className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
              Stream<span className="text-gradient">Peer</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Decentralized P2P media streaming. No servers, no censorship, just content.
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="grid sm:grid-cols-3 gap-4 max-w-2xl mb-10"
          >
            {features.map(({ icon: Icon, title, desc }, i) => (
              <div key={i} className="glass-card p-5 text-center">
                <Icon className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-foreground text-sm mb-1">{title}</h3>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex gap-3"
          >
            <Button onClick={handleAddSamples} className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 px-6">
              <Database className="h-4 w-4" />
              Load Demo Content
            </Button>
            <Link to="/admin">
              <Button variant="outline" className="border-border text-foreground hover:bg-muted">
                Add Your Own
              </Button>
            </Link>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-6">
        <FeaturedHero item={items[0]} />
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">All Content</h2>
          <span className="text-sm text-muted-foreground font-mono">{items.length} items</span>
        </div>
        <CatalogGrid items={items} />
      </div>
    </Layout>
  );
};

export default Home;
