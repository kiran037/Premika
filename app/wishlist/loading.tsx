import Container from "@/components/ui/container";

export default function WishlistLoading() {
  return (
    <Container>
      <div className="px-4 py-8 sm:px-6 lg:px-8 space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48" />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-4 border border-gray-100 p-4 rounded-xl">
              <div className="w-full aspect-square bg-gray-200 rounded-lg" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/4" />
              <div className="h-10 bg-gray-200 rounded w-full" />
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
