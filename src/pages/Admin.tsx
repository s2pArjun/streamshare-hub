import Layout from '@/components/layout/Layout';
import AdminForm from '@/components/admin/AdminForm';
import { useGunCatalog } from '@/hooks/useGunCatalog';
import { addSampleContent } from '@/lib/gun';

const Admin = () => {
  const { items, addItem, removeItem } = useGunCatalog();

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-2xl font-bold text-foreground mb-6">Manage Content</h1>
        <AdminForm
          items={items}
          onAdd={addItem}
          onRemove={removeItem}
          onLoadSamples={addSampleContent}
        />
      </div>
    </Layout>
  );
};

export default Admin;
