import { motion } from 'framer-motion';
import { Wifi } from 'lucide-react';

const SplashScreen = () => (
  <motion.div
    className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
    initial={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
  >
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="flex flex-col items-center gap-4"
    >
      <div className="h-16 w-16 rounded-2xl bg-primary/20 flex items-center justify-center glow-primary">
        <Wifi className="h-8 w-8 text-primary" />
      </div>
      <h1 className="text-3xl font-bold text-gradient">StreamPeer</h1>
      <p className="text-sm text-muted-foreground">Connecting to the mesh...</p>
      <motion.div
        className="h-1 w-32 rounded-full bg-muted overflow-hidden mt-2"
      >
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        />
      </motion.div>
    </motion.div>
  </motion.div>
);

export default SplashScreen;
