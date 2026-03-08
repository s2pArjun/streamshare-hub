const LoadingSkeleton = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-6">
    {Array.from({ length: 10 }).map((_, i) => (
      <div key={i} className="glass-card overflow-hidden animate-pulse">
        <div className="aspect-video bg-muted" />
        <div className="p-3 space-y-2">
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-3 bg-muted rounded w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

export default LoadingSkeleton;
