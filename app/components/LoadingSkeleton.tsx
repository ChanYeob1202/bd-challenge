export function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Desktop: Two columns, Mobile: Stacked */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8 p-0 md:p-8">
        {/* Image Skeleton */}
        <div className="aspect-square bg-gray-200 rounded-none md:rounded-xl" />

        {/* Content Skeleton */}
        <div className="p-6 md:p-0 flex flex-col gap-6">
          {/* Title */}
          <div className="space-y-3">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-8 bg-gray-200 rounded w-1/2" />
          </div>

          {/* Price */}
          <div className="h-10 bg-gray-200 rounded w-1/4" />

          {/* Description */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
          </div>

          {/* Options */}
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/4" />
            <div className="flex gap-2">
              <div className="h-12 bg-gray-200 rounded w-20" />
              <div className="h-12 bg-gray-200 rounded w-20" />
              <div className="h-12 bg-gray-200 rounded w-20" />
            </div>
          </div>

          {/* Add to Cart Button */}
          <div className="h-14 bg-gray-200 rounded-lg w-full mt-auto" />
        </div>
      </div>
    </div>
  );
}
