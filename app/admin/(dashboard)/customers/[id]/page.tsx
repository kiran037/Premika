"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Copy,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  CreditCard,
  Crown,
  Sparkles,
  Eye,
  Calendar,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import {
  AdminCard,
  AdminButton,
  AdminBadge,
  AdminStatusBadge,
  AdminTable,
  Skeleton,
} from "@/components/admin";
import { toast } from "react-hot-toast";

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [data, setData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCustomer = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/admin/customers/${id}`);
        const json = await res.json();

        if (json.success && json.data) {
          setData(json.data);
        } else {
          toast.error("Customer record not found");
        }
      } catch {
        toast.error("Failed to load customer profile");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomer();
  }, [id]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  if (isLoading) {
    return (
      <div className="w-full p-6 space-y-6">
        <Skeleton className="h-16 w-full rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
        </div>
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full max-w-md mx-auto p-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-stone-900">Customer Profile Not Found</h2>
        <Link href="/admin/customers">
          <AdminButton variant="outline">Return to Customers</AdminButton>
        </Link>
      </div>
    );
  }

  const { customer, analytics, addresses, orders, payments } = data;
  const defaultAddress = addresses.find((a: any) => a.isDefault) || addresses[0];

  return (
    <div className="space-y-6 w-full pb-20">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-[28px] border border-stone-200 bg-white px-6 py-4 shadow-sm mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/customers">
            <button className="p-2 rounded-xl text-stone-600 hover:bg-stone-100">
              <ArrowLeft size={18} />
            </button>
          </Link>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-stone-900">{customer.name}</h1>
              {customer.tags.map((tag: string, idx: number) => (
                <span
                  key={idx}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${tag === "VIP Customer"
                    ? "bg-amber-100 text-amber-800 border border-amber-300"
                    : tag === "High Spender"
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : tag === "Returning Customer"
                        ? "bg-indigo-100 text-indigo-800 border border-indigo-300"
                        : tag === "New Customer"
                          ? "bg-blue-100 text-blue-800 border border-blue-300"
                          : "bg-stone-100 text-stone-700 border border-stone-200"
                    }`}
                >
                  {tag}
                </span>
              ))}
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Customer since{" "}
              {new Date(customer.createdAt).toLocaleDateString("en-IN", {
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Copy Contact Info Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <AdminButton
            size="sm"
            variant="outline"
            onClick={() => copyToClipboard(customer.email, "Customer Email")}
            className="flex items-center gap-1.5"
          >
            <Mail size={14} />
            <span>Copy Email</span>
          </AdminButton>

          <AdminButton
            size="sm"
            variant="outline"
            onClick={() => copyToClipboard(customer.phone, "Customer Phone")}
            className="flex items-center gap-1.5"
          >
            <Phone size={14} />
            <span>Copy Phone</span>
          </AdminButton>

          {defaultAddress && (
            <AdminButton
              size="sm"
              variant="outline"
              onClick={() =>
                copyToClipboard(
                  `${defaultAddress.fullName}, ${defaultAddress.addressLine1}, ${defaultAddress.city}, ${defaultAddress.state} - ${defaultAddress.postalCode}`,
                  "Delivery Address"
                )
              }
              className="flex items-center gap-1.5"
            >
              <MapPin size={14} />
              <span>Copy Address</span>
            </AdminButton>
          )}
        </div>
      </div>

      {/* Analytics Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center flex-shrink-0">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-stone-500 uppercase">Lifetime Spend (LTV)</p>
            <p className="text-xl font-bold text-stone-900 mt-0.5">
              ₹{analytics.lifetimeSpend.toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center flex-shrink-0">
            <ShoppingBag size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-stone-500 uppercase">Total Orders</p>
            <p className="text-xl font-bold text-stone-900 mt-0.5">{analytics.totalOrders} Orders</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center flex-shrink-0">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-stone-500 uppercase">Average Order Value (AOV)</p>
            <p className="text-xl font-bold text-stone-900 mt-0.5">
              ₹{analytics.aov.toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center flex-shrink-0">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-stone-500 uppercase">Latest Purchase</p>
            <p className="text-sm font-bold text-stone-900 mt-0.5">
              {analytics.lastOrderDate
                ? new Date(analytics.lastOrderDate).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
                : "No orders yet"}
            </p>
          </div>
        </div>
      </div>

      {/* 2-Column Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 2/3 Column */}
        <div className="lg:col-span-8 space-y-6">
          {/* Order History */}
          <AdminCard title="Customer Order History" description={`List of ${orders.length} order(s) placed by ${customer.name}`}>
            <AdminTable
              headers={["Order Number", "Order Date", "Status", "Items", "Total Amount", "Actions"]}
              isEmpty={orders.length === 0}
              emptyText="No orders recorded for this customer"
            >
              {orders.map((o: any) => (
                <tr key={o.id} className="hover:bg-stone-50 text-xs">
                  <td className="px-6 py-3 font-mono font-bold text-stone-900">{o.orderNumber}</td>
                  <td className="px-6 py-3 text-stone-600">
                    {new Date(o.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-3">
                    <AdminStatusBadge status={o.status} />
                  </td>
                  <td className="px-6 py-3 text-stone-700 font-medium">{o.itemCount} items</td>
                  <td className="px-6 py-3 font-bold text-stone-900">₹{o.total.toLocaleString("en-IN")}</td>
                  <td className="px-6 py-3">
                    <Link href={`/admin/orders/${o.id}`} title="View Order Details">
                      <button className="flex items-center gap-1 px-2.5 py-1 bg-stone-100 hover:bg-[#B67B5C] hover:text-white text-stone-700 rounded-lg transition font-medium text-[11px]">
                        <Eye size={13} />
                        <span>View Order</span>
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </AdminTable>
          </AdminCard>

          {/* Payment Transactions */}
          <AdminCard title="Payment & Gateway History" description="Gateway payment records linked to customer orders">
            <AdminTable
              headers={["Payment ID", "Gateway", "Status", "Amount", "Paid Date"]}
              isEmpty={payments.length === 0}
              emptyText="No payment records found"
            >
              {payments.map((p: any) => (
                <tr key={p.id} className="hover:bg-stone-50 text-xs">
                  <td className="px-6 py-3 font-mono font-bold text-stone-900">
                    {p.gatewayPaymentId || "Pending"}
                  </td>
                  <td className="px-6 py-3 font-semibold text-stone-800 uppercase">
                    {p.gateway || "Razorpay"}
                  </td>
                  <td className="px-6 py-3">
                    {p.status === "paid" ? (
                      <AdminBadge variant="green">Paid</AdminBadge>
                    ) : (
                      <AdminBadge variant="amber">{p.status}</AdminBadge>
                    )}
                  </td>
                  <td className="px-6 py-3 font-bold text-stone-900">
                    ₹{(p.amount / 100).toLocaleString("en-IN")}
                  </td>
                  <td className="px-6 py-3 text-stone-600">
                    {p.paidAt ? new Date(p.paidAt).toLocaleDateString("en-IN") : "N/A"}
                  </td>
                </tr>
              ))}
            </AdminTable>
          </AdminCard>
        </div>

        {/* Right 1/3 Sidebar Column */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24 self-start">
          {/* Profile Details */}
          <AdminCard title="Contact Profile" description="Basic customer information">
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-stone-400 block font-semibold uppercase">Full Name</span>
                <span className="font-bold text-stone-900 text-sm">{customer.name}</span>
              </div>
              <div>
                <span className="text-stone-400 block font-semibold uppercase">Email</span>
                <span className="text-stone-800 font-medium">{customer.email}</span>
              </div>
              <div>
                <span className="text-stone-400 block font-semibold uppercase">Phone</span>
                <span className="text-stone-800 font-medium">{customer.phone}</span>
              </div>
            </div>
          </AdminCard>

          {/* Delivery Address Book */}
          <AdminCard title="Saved Delivery Addresses" description="Addresses collected from checkout orders">
            <div className="space-y-4">
              {addresses.map((addr: any) => (
                <div key={addr.id} className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900">{addr.fullName}</span>
                    {addr.isDefault && <AdminBadge variant="indigo">Default</AdminBadge>}
                  </div>
                  <p className="text-stone-700">{addr.addressLine1}</p>
                  {addr.addressLine2 && <p className="text-stone-700">{addr.addressLine2}</p>}
                  <p className="text-stone-700">
                    {addr.city}, {addr.state} - {addr.postalCode}
                  </p>
                  <p className="text-stone-500 font-semibold mt-1">{addr.country}</p>
                  <p className="text-stone-500">Phone: {addr.phone}</p>
                </div>
              ))}
              {addresses.length === 0 && <p className="text-xs text-stone-500">No addresses saved</p>}
            </div>
          </AdminCard>

          {/* Customer Insights */}
          <AdminCard title="Purchase Insights" description="Derived analytics metrics">
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-stone-400 block font-semibold uppercase">First Purchase Date</span>
                <span className="font-bold text-stone-800">
                  {analytics.firstOrderDate
                    ? new Date(analytics.firstOrderDate).toLocaleDateString("en-IN")
                    : "N/A"}
                </span>
              </div>

              <div>
                <span className="text-stone-400 block font-semibold uppercase">Largest Single Order</span>
                <span className="font-bold text-stone-900 text-sm">
                  {analytics.largestOrder
                    ? `₹${analytics.largestOrder.total.toLocaleString("en-IN")} (${analytics.largestOrder.orderNumber})`
                    : "N/A"}
                </span>
              </div>

              {analytics.topProducts.length > 0 && (
                <div>
                  <span className="text-stone-400 block font-semibold uppercase mb-1">Most Purchased Products</span>
                  <div className="space-y-1">
                    {analytics.topProducts.map((p: any, idx: number) => (
                      <div key={idx} className="flex justify-between text-stone-700 font-medium">
                        <span className="truncate max-w-[180px]">{p.name}</span>
                        <span className="font-bold text-stone-900">{p.qty} pcs</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </AdminCard>
        </div>
      </div>
    </div>
  );
}
