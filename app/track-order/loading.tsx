import Container from "@/components/ui/container";

export default function TrackOrderLoading() {
  return (
    <Container>
      <div className="px-4 py-8 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48 mx-auto" />
        <div className="h-4 bg-gray-200 rounded w-64 mx-auto" />

        <div className="p-6 border border-gray-200 rounded-lg space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="h-10 bg-gray-200 rounded w-full" />
            <div className="h-10 bg-gray-200 rounded w-full" />
          </div>
          <div className="h-10 bg-gray-200 rounded w-full sm:w-36" />
        </div>
      </div>
    </Container>
  );
}
