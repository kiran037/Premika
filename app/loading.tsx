import Container from "@/components/ui/container";

export default function Loading() {
  return (
    <Container>
      <div className="w-full h-full p-8 space-y-8 animate-pulse">
        {/* Banner Skeleton */}
        <div className="w-full h-[300px] sm:h-[400px] bg-gray-200 rounded-xl" />

        {/* Section Heading Skeleton */}
        <div className="space-y-2 text-center max-w-md mx-auto">
          <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto" />
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
        </div>

        {/* Products Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-4 border border-gray-100 p-4 rounded-xl">
              <div className="w-full aspect-square bg-gray-200 rounded-lg" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/4" />
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
