import Container from "@/components/ui/container";

export default function ProductLoading() {
  return (
    <Container>
      <div className="px-4 py-8 sm:px-6 lg:px-8 space-y-8 animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Gallery Skeleton */}
          <div className="space-y-4">
            <div className="w-full aspect-square bg-gray-200 rounded-xl" />
            <div className="flex gap-4">
              <div className="w-20 h-20 bg-gray-200 rounded-lg" />
              <div className="w-20 h-20 bg-gray-200 rounded-lg" />
            </div>
          </div>

          {/* Info Skeleton */}
          <div className="space-y-6">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-6 bg-gray-200 rounded w-1/4" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-12 bg-gray-200 rounded w-full mt-6" />
          </div>
        </div>
      </div>
    </Container>
  );
}
