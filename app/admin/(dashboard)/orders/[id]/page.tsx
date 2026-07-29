"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Download,
  Mail,
  Copy,
  Truck,
  CreditCard,
  User,
  MapPin,
  Clock,
  CheckCircle,
  Package,
  Save,
} from "lucide-react";
import {
  AdminCard,
  AdminButton,
  AdminBadge,
  AdminStatusBadge,
  AdminTable,
  Skeleton,
} from "@/components/admin";
import { ShipmentCreateModal } from "@/components/admin/ShipmentCreateModal";
import { toast } from "react-hot-toast";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [data, setData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Status & Fulfillment form fields
  const [status, setStatus] = useState<string>("pending");
  const [courierName, setCourierName] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isResendingEmail, setIsResendingEmail] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/admin/orders/${id}`);
        const json = await res.json();

        if (json.success && json.data) {
          setData(json.data);
          setStatus(json.data.order.status);
          if (json.data.shipment) {
            setCourierName(json.data.shipment.courierName || "");
            setTrackingNumber(json.data.shipment.trackingNumber || "");
            setTrackingUrl(json.data.shipment.trackingUrl || "");
          }
        } else {
          toast.error("Order not found");
        }
      } catch {
        toast.error("Failed to load order details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  const [isShipmentModalOpen, setIsShipmentModalOpen] = useState(false);
  const [isSyncingShipment, setIsSyncingShipment] = useState(false);

  const handleShipmentSuccess = async () => {
    const refreshed = await fetch(`/api/admin/orders/${id}`).then((r) => r.json());
    if (refreshed.success) setData(refreshed.data);
  };

  const handleSyncDelhiveryStatus = async () => {
    setIsSyncingShipment(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}/shipment/sync`, { method: "POST" });
      const json = await res.json();
      if (json.success) {
        toast.success("Shipment status synced successfully!");
        const refreshed = await fetch(`/api/admin/orders/${id}`).then((r) => r.json());
        if (refreshed.success) setData(refreshed.data);
      } else {
        toast.error(json.message || "Failed to sync shipment status");
      }
    } catch {
      toast.error("Error syncing status from Delhivery");
    } finally {
      setIsSyncingShipment(false);
    }
  };

  const handleDownloadLabel = async () => {
    try {
      const res = await fetch(`/api/admin/orders/${id}/shipment/label`);
      const json = await res.json();
      if (json.success && json.data?.labelUrl) {
        window.open(json.data.labelUrl, "_blank");
      } else {
        toast.error(json.message || "Failed to fetch shipping label");
      }
    } catch {
      toast.error("Error retrieving shipping label");
    }
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingStatus(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          courierName: courierName || undefined,
          trackingNumber: trackingNumber || undefined,
          trackingUrl: trackingUrl || undefined,
        }),
      });

      const json = await res.json();

      if (json.success) {
        toast.success("Order status & fulfillment updated!");
        const refreshed = await fetch(`/api/admin/orders/${id}`).then((r) => r.json());
        if (refreshed.success) setData(refreshed.data);
      } else {
        toast.error(json.message || "Failed to update order status");
      }
    } catch (err: any) {
      toast.error(err.message || "Error updating order status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleResendEmail = async () => {
    setIsResendingEmail(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}/resend-email`, { method: "POST" });
      const json = await res.json();

      if (json.success) {
        toast.success("Confirmation email resent successfully!");
      } else {
        toast.error(json.message || "Failed to resend email");
      }
    } catch {
      toast.error("Error resending email");
    } finally {
      setIsResendingEmail(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  if (isLoading) {
    return (
      <div className="w-full p-6 space-y-6">
        <Skeleton className="h-16 w-full rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 w-full rounded-2xl" />
            <Skeleton className="h-48 w-full rounded-2xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full max-w-md mx-auto p-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-stone-900">Order Not Found</h2>
        <Link href="/admin/orders">
          <AdminButton variant="outline">Return to Orders</AdminButton>
        </Link>
      </div>
    );
  }

  const { order, customer, address, items, payment, shipment, trackingHistory } = data;

  return (
    <div className="space-y-6 w-full pb-20">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-[28px] border border-stone-200 bg-white px-6 py-4 shadow-sm mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/orders">
            <button className="p-2 rounded-xl text-stone-600 hover:bg-stone-100">
              <ArrowLeft size={18} />
            </button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-stone-900">{order.orderNumber}</h1>
              <button
                onClick={() => copyToClipboard(order.orderNumber, "Order Number")}
                className="p-1 text-stone-400 hover:text-stone-700 rounded"
                title="Copy Order Number"
              >
                <Copy size={14} />
              </button>
              <AdminStatusBadge status={order.status} />
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Placed on{" "}
              {new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <a
            href={`/api/admin/orders/${order.id}/invoice`}
            download
            className="flex items-center gap-1.5 px-3 py-1.5 border border-stone-200 hover:bg-stone-50 text-stone-700 rounded-xl text-xs font-semibold"
          >
            <Download size={14} />
            <span>Download Invoice PDF</span>
          </a>

          <AdminButton
            size="sm"
            variant="outline"
            onClick={handleResendEmail}
            isLoading={isResendingEmail}
            className="flex items-center gap-1.5"
          >
            <Mail size={14} />
            <span>Resend Confirmation Email</span>
          </AdminButton>
        </div>
      </div>

      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 2/3 Column */}
        <div className="lg:col-span-8 space-y-6">
          {/* Purchased Items */}
          <AdminCard title="Ordered Items" description={`${items.length} product(s) in this order`}>
            <div className="divide-y divide-stone-100">
              {items.map((item: any) => (
                <div key={item.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-stone-100 rounded-xl overflow-hidden border border-stone-200 relative flex-shrink-0">
                      <Image src={item.image} alt={item.productName} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="font-bold text-stone-900">{item.productName}</p>
                      <div className="flex items-center gap-2 text-[11px] text-stone-600 mt-0.5 flex-wrap">
                        {item.size && (
                          <span className="bg-stone-100 border border-stone-200 px-2 py-0.5 rounded-md font-bold text-stone-800">
                            Size: {item.size}
                          </span>
                        )}
                        {item.height && (
                          <span className="bg-stone-100 border border-stone-200 px-2 py-0.5 rounded-md font-bold text-stone-800">
                            Height: {item.height}
                          </span>
                        )}
                        <span className="bg-stone-100 px-1.5 py-0.5 rounded font-semibold text-stone-700">
                          Qty: {item.quantity}
                        </span>
                        {item.productSku && (
                          <span className="font-mono text-stone-400">SKU: {item.productSku}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-stone-900">
                      ₹{(item.unitPrice).toLocaleString("en-IN")} × {item.quantity}
                    </p>
                    <p className="text-stone-500 font-semibold mt-0.5">
                      = ₹{(item.totalPrice).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="mt-4 pt-4 border-t border-stone-200 space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span>₹{(order.subtotal).toLocaleString("en-IN")}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount</span>
                  <span>- ₹{(order.discount).toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between text-stone-600">
                <span>Shipping Charge</span>
                <span>{order.shippingCharge === 0 ? "FREE" : `₹${order.shippingCharge}`}</span>
              </div>
              <div className="flex justify-between text-stone-900 font-bold text-sm pt-2 border-t border-stone-200">
                <span>Grand Total</span>
                <span>₹{(order.total).toLocaleString("en-IN")}</span>
              </div>
            </div>
          </AdminCard>

          {/* Fulfillment & Courier Management */}
          <AdminCard title="Fulfillment & Dispatch Details" description="Courier service provider and shipment tracking number">
            {/* Automated Delhivery Integration Operations */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#B67B5C]/10 text-[#B67B5C] flex items-center justify-center font-bold">
                    <Truck size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">Delhivery Courier Integration</h4>
                    <p className="text-[11px] text-stone-500">Automated dispatch, waybill tracking, and label generation</p>
                  </div>
                </div>
                {shipment?.trackingNumber && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    AWB: {shipment.trackingNumber}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 flex-wrap pt-1">
                {/* <AdminButton
                  type="button"
                  size="sm"
                  variant="primary"
                  onClick={() => setIsShipmentModalOpen(true)}
                  disabled={Boolean(shipment?.trackingNumber)}
                  className="text-xs flex items-center gap-1.5"
                >
                  <Package size={14} />
                  <span>{shipment?.trackingNumber ? "Shipment Created" : "Create Delhivery Shipment"}</span>
                </AdminButton> */}

                <AdminButton
                  type="button"
                  size="sm"
                  variant="primary"
                  disabled
                  className="text-xs flex items-center gap-1.5 cursor-not-allowed opacity-60"
                >
                  <Package size={14} />
                  <span>Create Delhivery Shipment (Temporarily Disabled)</span>
                </AdminButton>

                {shipment?.trackingNumber && (
                  <>
                    <AdminButton
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={handleSyncDelhiveryStatus}
                      isLoading={isSyncingShipment}
                      className="text-xs flex items-center gap-1.5"
                    >
                      <Clock size={14} />
                      <span>Sync Latest Status</span>
                    </AdminButton>

                    <AdminButton
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={handleDownloadLabel}
                      className="text-xs flex items-center gap-1.5"
                    >
                      <Download size={14} />
                      <span>Download Shipping Label</span>
                    </AdminButton>
                  </>
                )}
              </div>
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Update Order Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 font-semibold focus:outline-none focus:border-[#B67B5C]"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="packed">Packed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Courier Service</label>
                  <input
                    type="text"
                    placeholder="e.g. BlueDart / Delhivery / DTDC"
                    value={courierName}
                    onChange={(e) => setCourierName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#B67B5C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Tracking Number / AWB</label>
                  <input
                    type="text"
                    placeholder="e.g. BD123456789IN"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#B67B5C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Tracking Web Link URL</label>
                <input
                  type="url"
                  placeholder="https://track.bluedart.com/..."
                  value={trackingUrl}
                  onChange={(e) => setTrackingUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#B67B5C]"
                />
              </div>

              <AdminButton
                type="submit"
                size="sm"
                className="bg-[#B67B5C] hover:bg-[#8B5A3C] text-white flex items-center gap-2"
                isLoading={isUpdatingStatus}
              >
                <Save size={14} />
                <span>Save Fulfillment Details</span>
              </AdminButton>
            </form>
          </AdminCard>

          {/* Timeline History */}
          {trackingHistory.length > 0 && (
            <AdminCard title="Shipment History Log" description="Chronological log of tracking events">
              <div className="space-y-3 text-xs">
                {trackingHistory.map((t: any) => (
                  <div key={t.id} className="flex items-start gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <Clock size={16} className="text-[#B67B5C] mt-0.5" />
                    <div>
                      <p className="font-bold text-stone-900 capitalize">{t.status}</p>
                      <p className="text-stone-600">{t.description}</p>
                      <p className="text-[10px] text-stone-400 mt-1">
                        {new Date(t.createdAt).toLocaleString("en-IN")} • {t.location}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </AdminCard>
          )}
        </div>

        {/* Right 1/3 Sidebar Column */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24 self-start">
          {/* Customer Profile */}
          <AdminCard title="Customer Information" description="Buyer contact information">
            {customer ? (
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-stone-400 block font-semibold uppercase">Full Name</span>
                  <span className="font-bold text-stone-900 text-sm">
                    {customer.firstName} {customer.lastName || ""}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block font-semibold uppercase">Email</span>
                  <span className="text-stone-800 font-medium">{customer.email}</span>
                </div>
                <div>
                  <span className="text-stone-400 block font-semibold uppercase">Phone</span>
                  <span className="text-stone-800 font-medium">{customer.phone || "N/A"}</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-stone-500">Guest customer record</p>
            )}
          </AdminCard>

          {/* Delivery Address */}
          <AdminCard title="Shipping Address" description="Destination for delivery">
            {address ? (
              <div className="text-xs text-stone-700 space-y-1">
                <p className="font-bold text-stone-900">{address.fullName}</p>
                <p>{address.addressLine1}</p>
                {address.addressLine2 && <p>{address.addressLine2}</p>}
                <p>
                  {address.city}, {address.state} - {address.postalCode}
                </p>
                <p className="font-semibold text-stone-900 mt-2">{address.country}</p>
                <p className="text-stone-500 mt-1">Phone: {address.phone}</p>
              </div>
            ) : (
              <p className="text-xs text-stone-500">No address recorded</p>
            )}
          </AdminCard>

          {/* Payment Information */}
          <AdminCard title="Payment Details" description="Gateway transaction verification">
            {payment ? (
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-stone-500 font-semibold">Payment Status</span>
                  {payment.status === "paid" ? (
                    <AdminBadge variant="green">Paid</AdminBadge>
                  ) : (
                    <AdminBadge variant="amber">{payment.status}</AdminBadge>
                  )}
                </div>

                <div>
                  <span className="text-stone-400 block font-semibold uppercase">Payment Gateway</span>
                  <span className="font-bold text-stone-900 uppercase">{payment.gateway || "Razorpay"}</span>
                </div>

                {payment.gatewayPaymentId && (
                  <div>
                    <span className="text-stone-400 block font-semibold uppercase">Payment ID</span>
                    <div className="flex items-center justify-between bg-stone-50 p-2 rounded-lg border border-stone-200 mt-0.5">
                      <span className="font-mono font-semibold text-stone-900 text-[11px] truncate">
                        {payment.gatewayPaymentId}
                      </span>
                      <button
                        onClick={() => copyToClipboard(payment.gatewayPaymentId, "Payment ID")}
                        className="p-1 text-stone-400 hover:text-stone-800"
                        title="Copy Payment ID"
                      >
                        <Copy size={12} />
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <span className="text-stone-400 block font-semibold uppercase">Paid Amount</span>
                  <span className="font-bold text-stone-900 text-sm">
                    ₹{(payment.amount / 100).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-stone-500">No payment transaction found</p>
            )}
          </AdminCard>
        </div>
      </div>

      {/* Shipment Creation Modal */}
      <ShipmentCreateModal
        isOpen={isShipmentModalOpen}
        onClose={() => setIsShipmentModalOpen(false)}
        orderData={data}
        onSuccess={handleShipmentSuccess}
      />
    </div>
  );
}
