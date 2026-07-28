import Container from "@/components/ui/container";

export default function CheckoutLoading() {
  return (
    <Container>
      <div className="px-4 py-8 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-4">
            <div className="h-6 bg-gray-200 rounded w-36" />
            <div className="h-10 bg-gray-200 rounded w-full" />
            <div className="h-10 bg-gray-200 rounded w-full" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-10 bg-gray-200 rounded w-full" />
              <div className="h-10 bg-gray-200 rounded w-full" />
            </div>
          </div>

          <div className="lg:col-span-5 p-6 border border-gray-200 rounded-lg space-y-4 h-fit">
            <div className="h-6 bg-gray-200 rounded w-36" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-12 bg-gray-200 rounded w-full mt-4" />
          </div>
        </div>
      </div>
    </Container>
  );
}
