"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Container from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled Route Error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] bg-background flex items-center justify-center py-12">
      <Container>
        <div className="max-w-md mx-auto text-center space-y-6 px-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-50 text-red-600 rounded-full">
            <AlertTriangle size={36} />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">Something went wrong</h1>
            <p className="text-sm text-tertiary">
              We encountered an unexpected error while processing your request. Please try again or return to the homepage.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              onClick={() => reset()}
              className="w-full sm:w-auto bg-foreground hover:bg-secondary text-background flex items-center justify-center gap-2"
            >
              <RefreshCw size={16} />
              <span>Try Again</span>
            </Button>

            <Link href="/" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full sm:w-auto border-secondary text-secondary hover:bg-secondary hover:text-background flex items-center justify-center gap-2"
              >
                <Home size={16} />
                <span>Go to Homepage</span>
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
