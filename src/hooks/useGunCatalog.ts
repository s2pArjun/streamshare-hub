import { useState, useEffect, useRef, useCallback } from 'react';
import { MediaItem } from '@/lib/types';
import { subscribeToCatalog, addToCatalog, removeFromCatalog } from '@/lib/gun';

export const useGunCatalog = () => {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const hasReceivedData = useRef(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!hasReceivedData.current) {
        setLoading(false);
      }
    }, 5000);

    const unsub = subscribeToCatalog((newItems) => {
      hasReceivedData.current = true;
      setItems(newItems);
      setLoading(false);
    });

    return () => {
      clearTimeout(timeout);
      unsub();
    };
  }, []);

  const addItem = useCallback(async (item: MediaItem) => {
    await addToCatalog(item);
  }, []);

  const removeItem = useCallback(async (id: string) => {
    await removeFromCatalog(id);
  }, []);

  return { items, loading, addItem, removeItem };
};
