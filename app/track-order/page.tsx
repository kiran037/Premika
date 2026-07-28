"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Download,
  ArrowLeft,
  MapPin,
  CreditCard,
  AlertCircle,
} from "lucide-react";
import Container from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import Currency from "@/components/ui/currency";
import { toast } from "react-hot-toast";

const TrackOrderContent = () => {
  const searchParams = useSearchParams();
  const [orderNumberInput, setOrderNumberInput] = useState("");
  const [identifierInput, setIdentifierInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [orderData, setOrderData] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const queryOrder = searchParams.get("orderNumber") || searchParams.get("orderId");
    const queryEmail = searchParams.get("email") || searchParams.get("phone");

    if (queryOrder) setOrderNumberInput(queryOrder);
    if (queryEmail) setIdentifierInput(queryEmail);

    if (queryOrder && queryEmail) {
      fetchOrderTracking(queryOrder, queryEmail);
    }
  }, [searchParams]);

  const fetchOrderTracking = async (orderNum: string, ident: string) => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/orders/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderNumber: orderNum,
          identifier: ident,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || "No order found matching these details.");
      }

      setOrderData(json.data);
    } catch (err: any) {
      setOrderData(null);
      setErrorMsg(err.message || "Failed to locate order.");
      toast.error(err.message || "Failed to locate order.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLookupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumberInput.trim()) {
      toast.error("Please enter your Order Number");
      return;
    }
    if (!identifierInput.trim()) {
      toast.error("Please enter your Email or Phone Number");
      return;
    }

    fetchOrderTracking(orderNumberInput, identifierInput);
  };

  return (
    <div className="min-h-screen bg-background">
      <Container>
        <div className="px-3 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-12 lg:py-16 max-w-5xl mx-auto">
          {/* Header & Back Button */}
          <div className="flex items-center justify-between mb-6">
            <Link href="/">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 border-secondary text-secondary hover:bg-secondary hover:text-background"
              >
                <ArrowLeft size={16} />
                <span>Back to Home</span>
              </Button>
            </Link>
          </div>

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-3 text-secondary">
              <Package size={32} />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-secondary">
              Track Your Order
            </h1>
            <p className="text-sm sm:text-base text-tertiary mt-1">
              Enter your Order Number and Email or Phone Number to view your shipment status
            </p>
          </div>

          {/* Lookup Form Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 md:p-8 shadow-sm mb-8">
            <form onSubmit={handleLookupSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">
                    Order Number *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ORD-1725000000-1234"
                    value={orderNumberInput}
                    onChange={(e) => setOrderNumberInput(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">
                    Email or Phone Number *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. customer@example.com or 9876543210"
                    value={identifierInput}
                    onChange={(e) => setIdentifierInput(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto bg-foreground hover:bg-secondary text-background px-8 py-2.5 flex items-center justify-center gap-2"
              >
                <Search size={16} />
                <span>{isLoading ? "Searching..." : "Track Order"}</span>
              </Button>
            </form>
          </div>

          {/* Error Display */}
          {errorMsg && !orderData && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 flex items-center gap-3 text-red-700">
              <AlertCircle size={20} className="flex-shrink-0" />
              <p className="text-sm font-medium">{errorMsg}</p>
            </div>
          )}

          {/* Order Data Display */}
          {orderData && (
            <div className="space-y-6">
              {/* Order Header Summary */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-100">
                  <div>
                    <span className="text-xs text-tertiary">Order Reference</span>
                    <h2 className="text-xl sm:text-2xl font-bold text-secondary">
                      {orderData.orderNumber}
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Placed on {new Date(orderData.orderDate).toLocaleDateString("en-IN", {
                        weekday: "short",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full capitalize">
                      Order: {orderData.orderStatus}
                    </span>
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${
                        orderData.paymentStatus === "paid"
                          ? "bg-green-50 text-green-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      Payment: {orderData.paymentStatus}
                    </span>

                    <a
                      href={`/api/orders/${orderData.orderNumber}/invoice?identifier=${encodeURIComponent(identifierInput)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1.5 text-xs border-foreground text-foreground hover:bg-foreground hover:text-background"
                      >
                        <Download size={14} />
                        <span>Download Invoice</span>
                      </Button>
                    </a>
                  </div>
                </div>

                {/* Shipment Status & Timeline */}
                <div className="pt-6">
                  <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Truck size={18} className="text-secondary" />
                    <span>Shipment Status</span>
                  </h3>

                  {orderData.shipment ? (
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-tertiary">Courier Partner:</span>
                        <span className="font-medium text-foreground">{orderData.shipment.courierName || "Standard Shipping"}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-tertiary">Tracking Number:</span>
                        <span className="font-medium text-foreground">{orderData.shipment.trackingNumber || "N/A"}</span>
                      </div>
                      {orderData.shipment.estimatedDeliveryAt && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-tertiary">Estimated Delivery:</span>
                          <span className="font-medium text-green-600">
                            {new Date(orderData.shipment.estimatedDeliveryAt).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-xs sm:text-sm text-orange-800 flex items-center gap-2">
                      <Clock size={16} />
                      <span>Your order is being prepared and packed for shipment dispatch.</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Products Breakdown & Address */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Items List */}
                <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm">
                  <h3 className="text-base font-semibold text-foreground mb-4">
                    Items in Order ({orderData.items.length})
                  </h3>
                  <div className="divide-y divide-gray-100">
                    {orderData.items.map((item: any) => (
                      <div key={item.id} className="py-3 flex justify-between items-center text-sm">
                        <div>
                          <p className="font-semibold text-foreground">{item.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-foreground">
                            <Currency value={item.totalPrice} />
                          </p>
                          <p className="text-xs text-gray-500">
                            <Currency value={item.unitPrice} /> each
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary Totals */}
                  <div className="border-t border-gray-200 pt-4 mt-4 space-y-2 text-sm">
                    <div className="flex justify-between text-tertiary">
                      <span>Subtotal</span>
                      <Currency value={orderData.subtotal} />
                    </div>
                    {orderData.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>- <Currency value={orderData.discount} /></span>
                      </div>
                    )}
                    <div className="flex justify-between text-tertiary">
                      <span>Shipping</span>
                      <span className="text-green-600 font-medium">FREE</span>
                    </div>
                    <div className="flex justify-between text-base font-bold text-foreground pt-2 border-t border-gray-100">
                      <span>Grand Total</span>
                      <Currency value={orderData.total} />
                    </div>
                  </div>
                </div>

                {/* Shipping & Customer Details */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                      <MapPin size={16} className="text-secondary" />
                      <span>Delivery Address</span>
                    </h3>
                    {orderData.address ? (
                      <div className="text-xs sm:text-sm text-tertiary space-y-1">
                        <p className="font-semibold text-foreground">{orderData.customer.name}</p>
                        <p>{orderData.address.line1}</p>
                        {orderData.address.line2 && <p>{orderData.address.line2}</p>}
                        <p>
                          {orderData.address.city}, {orderData.address.state} {orderData.address.postalCode}
                        </p>
                        <p>{orderData.address.country}</p>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500">Address information unavailable.</p>
                    )}
                  </div>

                  <div className="border-t border-gray-100 pt-3">
                    <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                      <CreditCard size={16} className="text-secondary" />
                      <span>Contact Details</span>
                    </h3>
                    <div className="text-xs sm:text-sm text-tertiary space-y-1">
                      <p>Email: {orderData.customer.email}</p>
                      <p>Phone: {orderData.customer.phone || "N/A"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}
