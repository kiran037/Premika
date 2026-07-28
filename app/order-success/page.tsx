"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import {
  CheckCircle,
  Mail,
  MessageSquare,
  ArrowLeft,
  Package,
} from "lucide-react";
import Container from "@/components/ui/container";
import { Button } from "@/components/ui/button";

interface OrderDetails {
  orderId: string | null;
  amount: string | null;
  customerName: string | null;
}

const OrderSuccessContent = () => {
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  useEffect(() => {
    // Get order details from URL parameters
    const orderId = searchParams.get("orderId");
    const amount = searchParams.get("amount");
    const customerName = searchParams.get("customerName");

    if (orderId) {
      setOrderDetails({
        orderId: orderId,
        amount: amount,
        customerName: customerName,
      });
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-background">
      <Container>
        <div className="pt-12">
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              {/* Success Icon */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-foreground rounded-full mb-6">
                  <CheckCircle className="w-12 h-12 text-background" />
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-4">
                  Payment Successful!
                </h1>
                <p className="text-tertiary text-lg">
                  Thank you for your order. Your payment has been processed
                  successfully.
                </p>
              </div>

              {/* Order Details */}
              {orderDetails && (
                <div className="bg-muted rounded-lg p-6 mb-8">
                  <h2 className="text-xl font-semibold text-foreground mb-4">
                    Order Details
                  </h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-tertiary">Order ID:</span>
                      <span className="font-medium text-foreground">
                        {orderDetails.orderId}
                      </span>
                    </div>
                    {orderDetails.amount && (
                      <div className="flex justify-between">
                        <span className="text-tertiary">Amount Paid:</span>
                        <span className="font-medium text-foreground">
                          ₹{(Number(orderDetails.amount) / 100).toLocaleString()}
                        </span>
                      </div>
                    )}
                    {orderDetails.customerName && (
                      <div className="flex justify-between">
                        <span className="text-tertiary">Customer:</span>
                        <span className="font-medium text-foreground">
                          {orderDetails.customerName}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* What Next Section */}
        <div className="pb-12">
          <div className="space-y-6 mb-8 px-4">
            <h2 className="text-xl font-semibold text-foreground text-center">
              What&apos;s Next?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col items-center text-center space-y-3 p-4 bg-[#E0BCA2] rounded-lg">
                <Mail className="w-8 h-8 text-foreground flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground">
                    Confirmation Email
                  </h3>
                  <p className="text-foreground text-sm">
                    You&apos;ll receive an order confirmation email shortly with
                    all the details.
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center text-center space-y-3 p-4 bg-[#E0BCA2] rounded-lg">
                <MessageSquare className="w-8 h-8 text-foreground flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground">SMS Updates</h3>
                  <p className="text-foreground text-sm">
                    You&apos;ll receive SMS updates with tracking information
                    once your order is shipped.
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center text-center space-y-3 p-4 bg-[#E0BCA2] rounded-lg">
                <Package className="w-8 h-8 text-foreground flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground">
                    Order Processing
                  </h3>
                  <p className="text-foreground text-sm">
                    Your order will be processed within 1-2 business days and
                    shipped soon after.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center">
            <div className="w-full max-w-md space-y-4">
              {orderDetails?.orderId && (
                <Link
                  href={`/track-order?orderNumber=${orderDetails.orderId}`}
                  className="block"
                >
                  <Button
                    className="w-full bg-foreground hover:bg-secondary text-background"
                    size="lg"
                  >
                    Track Order Status
                  </Button>
                </Link>
              )}

              <Link href="/" className="block">
                <Button
                  variant="outline"
                  className="w-full border-foreground text-foreground hover:bg-secondary hover:text-background"
                  size="lg"
                >
                  Continue Shopping
                </Button>
              </Link>

              <Link href="/contact-us" className="block">
                <Button
                  variant="ghost"
                  className="w-full text-tertiary hover:bg-muted"
                  size="sm"
                >
                  Need Help? Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

const OrderSuccessPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-tertiary">Loading order details...</p>
          </div>
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
};

export default OrderSuccessPage;
