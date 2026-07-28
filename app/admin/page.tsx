// TODO: Admin Panel - Future Integration (Dashboard, Products CRUD, Orders Management, Coupons, Analytics)
import Link from "next/link";
import { Lock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-8 max-w-md w-full text-center shadow-sm">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-50 text-amber-600 rounded-full mb-4">
        <Lock size={32} />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Panel</h1>
      <p className="text-gray-500 text-sm mb-6">
        The Admin Dashboard is currently coming soon. Admin management, order management, inventory control, and analytics will be available in future releases.
      </p>

      {/* TODO: Implement Admin Authentication & Product/Order Management Forms */}

      <Link href="/">
        <Button variant="outline" className="w-full flex items-center justify-center gap-2">
          <ArrowLeft size={16} />
          <span>Return to Store Front</span>
        </Button>
      </Link>
    </div>
  );
}
