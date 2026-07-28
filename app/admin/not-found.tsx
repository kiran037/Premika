import Link from "next/link";
import { LayoutDashboard, AlertCircle } from "lucide-react";
import { AdminButton } from "@/components/admin";

export default function AdminNotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-sm space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-50 text-amber-600 rounded-full">
          <AlertCircle size={32} />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-gray-900">Admin Page Not Found</h2>
          <p className="text-xs text-gray-500">
            The requested administrative resource could not be found or is not yet available.
          </p>
        </div>

        <Link href="/admin/dashboard" className="block">
          <AdminButton className="w-full flex items-center justify-center gap-2">
            <LayoutDashboard size={16} />
            <span>Return to Admin Dashboard</span>
          </AdminButton>
        </Link>
      </div>
    </div>
  );
}
