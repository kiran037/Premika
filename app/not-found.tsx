import Link from "next/link";
import { Search, Home, Package } from "lucide-react";
import Container from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "404 - Page Not Found | Premika Store",
  description: "The requested page could not be found. Return to Premika Store.",
};

export default function NotFound() {
  return (
    <div className="min-h-[75vh] bg-background flex items-center justify-center py-16">
      <Container>
        <div className="max-w-md mx-auto text-center space-y-6 px-4">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-primary/20 text-secondary rounded-full mb-2">
            <span className="text-4xl font-bold font-serif">404</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Page Not Found</h1>
            <p className="text-sm sm:text-base text-tertiary">
              Sorry, we couldn&apos;t find the page you were looking for. It might have been moved or doesn&apos;t exist.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-foreground hover:bg-secondary text-background flex items-center justify-center gap-2">
                <Home size={16} />
                <span>Go to Homepage</span>
              </Button>
            </Link>

            <Link href="/track-order" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full sm:w-auto border-secondary text-secondary hover:bg-secondary hover:text-background flex items-center justify-center gap-2"
              >
                <Package size={16} />
                <span>Track Your Order</span>
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
