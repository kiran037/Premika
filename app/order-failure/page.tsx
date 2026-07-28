"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { XCircle, RefreshCw, ArrowLeft, AlertCircle, Phone, Mail } from "lucide-react";
import Container from "@/components/ui/container";
import { Button } from "@/components/ui/button";

interface FailureDetails {
  reason: string;
  description: string;
  orderId?: string | null;
}

const OrderFailureContent = () => {
  const searchParams = useSearchParams();
  const [failureDetails, setFailureDetails] = useState<FailureDetails>({
    reason: "Payment processing failed",
    description: "There was an issue processing your payment. Please try again.",
  });

  useEffect(() => {
    // Get failure details from URL parameters
    const reason = searchParams.get("reason");
    const code = searchParams.get("code");
    const orderId = searchParams.get("orderId");

    // Map common failure reasons
    const getFailureMessage = (reason: string | null, code: string | null) => {
      switch (reason?.toLowerCase()) {
        case "payment_failed":
          return {
            reason: "Payment Failed",
            description:
              "Your payment could not be processed. This might be due to insufficient funds, network issues, or bank restrictions.",
          };
        case "payment_cancelled":
          return {
            reason: "Payment Cancelled",
            description:
              "You cancelled the payment process. Your order has not been placed.",
          };
        case "gateway_error":
          return {
            reason: "Gateway Error",
            description:
              "There was a technical issue with our payment gateway. Please try again in a few minutes.",
          };
        case "bank_error":
          return {
            reason: "Bank Error",
            description:
              "Your bank declined the transaction. Please contact your bank or try a different payment method.",
          };
        case "card_error":
          return {
            reason: "Card Error",
            description:
              "There was an issue with your card details. Please check your information and try again.",
          };
        case "network_error":
          return {
            reason: "Network Error",
            description:
              "Poor network connectivity caused the payment to fail. Please check your internet connection and retry.",
          };
        case "verification_failed":
          return {
            reason: "Payment Verification Failed",
            description:
              "We couldn't verify your payment. If money was deducted, it will be refunded within 3-7 business days.",
          };
        default:
          return {
            reason: reason || "Payment Processing Failed",
            description:
              "There was an unexpected issue processing your payment. Please try again or contact support.",
          };
      }
    };

    const details = getFailureMessage(reason, code);
    setFailureDetails({
      ...details,
      orderId: orderId,
    });
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-background">
      <Container>
        <div className="pt-12">
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              {/* Failure Icon */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-foreground rounded-full mb-6">
                  <XCircle className="w-12 h-12 text-background" />
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-4">
                  {failureDetails.reason}
                </h1>
                <p className="text-tertiary text-lg text-center">
                  {failureDetails.description}
                </p>
              </div>

              {/* Failure Details */}
              {failureDetails.orderId && (
                <div className="bg-red-50 rounded-lg p-6 mb-8 border border-red-200">
                  <h2 className="text-lg font-semibold text-red-800 mb-3">
                    Transaction Details
                  </h2>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-red-600">Order ID:</span>
                      <span className="font-medium text-red-800">
                        {failureDetails.orderId}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-red-600">Status:</span>
                      <span className="font-medium text-red-800">Failed</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Refund Information */}
              <div className="bg-[#E0BCA2] border border-primary rounded-lg p-4 mb-8">
                <h3 className="font-semibold text-foreground mb-2">
                  💳 About Refunds
                </h3>
                <p className="text-foreground text-sm">
                  If money was deducted from your account, it will be
                  automatically refunded within 3-7 business days. No action is
                  required from your side.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* What to do next Section */}
        <div className="pb-12">
          <div className="space-y-6 mb-8 px-4">
            <h2 className="text-xl font-semibold text-foreground text-center">
              What should you do?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col items-center text-center space-y-3 p-4 bg-[#E0BCA2] rounded-lg">
                <RefreshCw className="w-8 h-8 text-foreground flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground">Try Again</h3>
                  <p className="text-foreground text-sm">
                    Most payment issues are temporary. Wait a few minutes and
                    try placing your order again.
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center text-center space-y-3 p-4 bg-[#E0BCA2] rounded-lg">
                <AlertCircle className="w-8 h-8 text-foreground flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground">
                    Check Your Details
                  </h3>
                  <p className="text-foreground text-sm">
                    Verify your card details, billing address, and ensure you
                    have sufficient funds.
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center text-center space-y-3 p-4 bg-[#E0BCA2] rounded-lg">
                <Phone className="w-8 h-8 text-foreground flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground">
                    Contact Your Bank
                  </h3>
                  <p className="text-foreground text-sm">
                    If the issue persists, your bank might have blocked the
                    transaction for security reasons.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center">
            <div className="w-full max-w-md space-y-4">
              <Link href="/checkout" className="block">
                <Button
                  className="w-full bg-primary hover:bg-secondary text-background"
                  size="lg"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              </Link>

              <Link href="/cart" className="block">
                <Button
                  variant="outline"
                  className="w-full border-tertiary text-tertiary hover:bg-secondary hover:text-background"
                  size="lg"
                >
                  Return to Cart
                </Button>
              </Link>

              <Link href="/contact-us" className="block">
                <Button
                  variant="outline"
                  className="w-full border-tertiary text-tertiary hover:bg-secondary hover:text-background"
                  size="lg"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Support
                </Button>
              </Link>

              <Link href="/" className="block">
                <Button
                  variant="ghost"
                  className="w-full text-tertiary hover:text-background hover:bg-primary"
                  size="sm"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

const OrderFailurePage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-tertiary">Loading...</p>
          </div>
        </div>
      }
    >
      <OrderFailureContent />
    </Suspense>
  );
};

export default OrderFailurePage;
