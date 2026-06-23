export default function ProductGridSkeleton() {
  return (
    <div className="w-[90%] mx-auto px-4 py-10">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border bg-white overflow-hidden shadow-sm"
          >
            <div className="h-48 bg-gray-100 animate-pulse" />
            <div className="p-4 space-y-3">
              <div className="h-4 w-3/4 bg-gray-100 animate-pulse rounded" />
              <div className="h-3 w-full bg-gray-100 animate-pulse rounded" />
              <div className="h-3 w-1/2 bg-gray-100 animate-pulse rounded" />
              <div className="h-10 w-full bg-gray-100 animate-pulse rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
