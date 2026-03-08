import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Plus, Trash2, Upload, Database, Film, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MediaItem } from '@/lib/types';
import { validateMagnetURI, validateIPFSCID } from '@/lib/validation';
import ConnectionStatus from '@/components/common/ConnectionStatus';

interface AdminFormProps {
  onAdd: (item: MediaItem) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
  onLoadSamples: () => Promise<void>;
  items: MediaItem[];
}

const AdminForm = ({ onAdd, onRemove, onLoadSamples, items }: AdminFormProps) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    magnetURI: '',
    ipfsCID: '',
    thumbnailURL: '',
    fallbackURL: '',
    category: '',
    type: 'video' as 'video' | 'audio',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.trim()) { toast.error('Title is required'); return; }
    if (!form.magnetURI.trim() || !validateMagnetURI(form.magnetURI)) {
      toast.error('Valid Magnet URI is required'); return;
    }
    if (!form.ipfsCID.trim() || !validateIPFSCID(form.ipfsCID)) {
      toast.error('Valid IPFS CID is required'); return;
    }

    setSubmitting(true);
    try {
      const item: MediaItem = {
        id: `media_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        title: form.title.trim(),
        description: form.description.trim(),
        magnetURI: form.magnetURI.trim(),
        ipfsCID: form.ipfsCID.trim(),
        type: form.type,
        thumbnailURL: form.thumbnailURL.trim(),
        fallbackURL: form.fallbackURL.trim(),
        category: form.category.trim(),
        addedAt: Date.now(),
        addedBy: 'user',
      };
      await onAdd(item);
      toast.success(`"${item.title}" added to catalog`);
      setForm({ title: '', description: '', magnetURI: '', ipfsCID: '', thumbnailURL: '', fallbackURL: '', category: '', type: 'video' });
    } catch (err: any) {
      toast.error(err.message || 'Failed to add content');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    try {
      await onRemove(id);
      toast.success(`"${title}" removed`);
    } catch {
      toast.error('Failed to remove');
    }
  };

  const handleLoadSamples = async () => {
    try {
      await onLoadSamples();
      toast.success('Demo content loaded!');
    } catch {
      toast.error('Failed to load samples');
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Form */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            Add Content
          </h2>
          <ConnectionStatus />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-foreground">Title *</Label>
            <Input
              value={form.title}
              onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))}
              placeholder="Enter title"
              className="bg-muted/50 border-border"
            />
          </div>

          <div>
            <Label className="text-foreground">Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))}
              placeholder="Enter description"
              className="bg-muted/50 border-border resize-none"
              rows={2}
            />
          </div>

          <div>
            <Label className="text-foreground">Magnet URI *</Label>
            <Input
              value={form.magnetURI}
              onChange={(e) => setForm(p => ({ ...p, magnetURI: e.target.value }))}
              placeholder="magnet:?xt=urn:btih:..."
              className="bg-muted/50 border-border font-mono text-xs"
            />
          </div>

          <div>
            <Label className="text-foreground">IPFS CID *</Label>
            <Input
              value={form.ipfsCID}
              onChange={(e) => setForm(p => ({ ...p, ipfsCID: e.target.value }))}
              placeholder="Qm... or bafy..."
              className="bg-muted/50 border-border font-mono text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-foreground">Thumbnail URL</Label>
              <Input
                value={form.thumbnailURL}
                onChange={(e) => setForm(p => ({ ...p, thumbnailURL: e.target.value }))}
                placeholder="https://..."
                className="bg-muted/50 border-border text-xs"
              />
            </div>
            <div>
              <Label className="text-foreground">Fallback URL</Label>
              <Input
                value={form.fallbackURL}
                onChange={(e) => setForm(p => ({ ...p, fallbackURL: e.target.value }))}
                placeholder="https://...mp4"
                className="bg-muted/50 border-border text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-foreground">Category</Label>
              <Input
                value={form.category}
                onChange={(e) => setForm(p => ({ ...p, category: e.target.value }))}
                placeholder="e.g. Animation"
                className="bg-muted/50 border-border"
              />
            </div>
            <div>
              <Label className="text-foreground">Type</Label>
              <div className="flex mt-1 gap-2">
                <button
                  type="button"
                  onClick={() => setForm(p => ({ ...p, type: 'video' }))}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    form.type === 'video' ? 'bg-primary/20 text-primary' : 'bg-muted/50 text-muted-foreground'
                  }`}
                >
                  <Film className="h-4 w-4" /> Video
                </button>
                <button
                  type="button"
                  onClick={() => setForm(p => ({ ...p, type: 'audio' }))}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    form.type === 'audio' ? 'bg-primary/20 text-primary' : 'bg-muted/50 text-muted-foreground'
                  }`}
                >
                  <Music className="h-4 w-4" /> Audio
                </button>
              </div>
            </div>
          </div>

          <Button type="submit" disabled={submitting} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
            <Upload className="h-4 w-4 mr-2" />
            {submitting ? 'Adding...' : 'Add to Catalog'}
          </Button>
        </form>

        <div className="mt-4 pt-4 border-t border-border">
          <Button onClick={handleLoadSamples} variant="outline" className="w-full border-border text-foreground hover:bg-muted">
            <Database className="h-4 w-4 mr-2" />
            Load Demo Content
          </Button>
        </div>
      </motion.div>

      {/* Current catalog */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass-card p-6"
      >
        <h2 className="text-xl font-bold text-foreground mb-4">
          Catalog ({items.length} items)
        </h2>

        {items.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-8">No content yet. Add something or load demo content.</p>
        ) : (
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 group">
                <img
                  src={item.thumbnailURL || 'https://via.placeholder.com/80x45/1a1a2e/7c3aed?text=🎬'}
                  alt={item.title}
                  className="w-20 h-12 object-cover rounded-md flex-shrink-0"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80x45/1a1a2e/7c3aed?text=🎬'; }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.type} • {item.category || 'No category'}</p>
                </div>
                <button
                  onClick={() => handleDelete(item.id, item.title)}
                  className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminForm;
