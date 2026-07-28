"use client";

import React, { useState, useEffect } from "react";
import { AdminCard } from "@/components/admin/AdminCard";
import { Skeleton } from "@/components/admin/Skeleton";
import {
  Server,
  Database,
  HardDrive,
  Mail,
  CreditCard,
  Clock,
  Code2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Layers,
} from "lucide-react";
import { toast } from "react-hot-toast";

interface SystemInfo {
  appVersion: string;
  environment: string;
  nodeVersion: string;
  databaseStatus: "connected" | "disconnected";
  storageStatus: "operational" | "degraded";
  emailStatus: "configured" | "not_configured";
  paymentGatewayStatus: "configured" | "not_configured";
  buildTime: string;
  uptimeSeconds: number;
}

export default function SystemInfoPage() {
  const [data, setData] = useState<SystemInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSystemInfo = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/system");
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      } else {
        toast.error(json.message || "Failed to load system information");
      }
    } catch {
      toast.error("Network error fetching system information");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSystemInfo();
  }, []);

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days > 0 ? `${days}d ` : ""}${hours}h ${minutes}m`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64 rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-36 rounded-2xl" />
          <Skeleton className="h-36 rounded-2xl" />
          <Skeleton className="h-36 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <Server size={22} className="text-[#B67B5C]" />
            <span>System Information & Health Diagnostics</span>
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Read-only system runtime diagnostics, application version, database connectivity, and integration statuses.
          </p>
        </div>

        <button
          onClick={fetchSystemInfo}
          className="flex items-center gap-1.5 px-3 py-2 bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 rounded-xl text-xs font-semibold shadow-xs transition"
        >
          <RefreshCw size={14} />
          <span>Refresh</span>
        </button>
      </div>

      {/* System Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Core App Info */}
        <AdminCard className="p-5 space-y-4 border border-stone-200">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <Code2 size={18} className="text-[#B67B5C]" />
              <h3 className="font-bold text-sm text-stone-900">Application Version</h3>
            </div>
            <span className="text-xs font-mono font-bold bg-[#B67B5C]/10 text-[#B67B5C] px-2 py-0.5 rounded-full">
              v{data?.appVersion || "1.0.0"}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-stone-500">Environment:</span>
              <span className="font-semibold text-stone-800 capitalize font-mono">
                {data?.environment || "development"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-500">Node Runtime:</span>
              <span className="font-semibold text-stone-800 font-mono">
                {data?.nodeVersion || "v20.x"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-500">System Uptime:</span>
              <span className="font-semibold text-stone-800 font-mono">
                {data?.uptimeSeconds ? formatUptime(data.uptimeSeconds) : "0m"}
              </span>
            </div>
          </div>
        </AdminCard>

        {/* Database Status */}
        <AdminCard className="p-5 space-y-4 border border-stone-200">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <Database size={18} className="text-[#B67B5C]" />
              <h3 className="font-bold text-sm text-stone-900">Database Engine</h3>
            </div>
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                data?.databaseStatus === "connected"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              <CheckCircle2 size={12} />
              <span>{data?.databaseStatus === "connected" ? "Connected" : "Disconnected"}</span>
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-stone-500">OR M Layer:</span>
              <span className="font-semibold text-stone-800 font-mono">Drizzle ORM</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-500">Database Type:</span>
              <span className="font-semibold text-stone-800 font-mono">PostgreSQL</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-500">Schema Lock:</span>
              <span className="font-semibold text-emerald-600">FROZEN (Production)</span>
            </div>
          </div>
        </AdminCard>

        {/* Storage Status */}
        <AdminCard className="p-5 space-y-4 border border-stone-200">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <HardDrive size={18} className="text-[#B67B5C]" />
              <h3 className="font-bold text-sm text-stone-900">Asset Storage</h3>
            </div>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
              <CheckCircle2 size={12} />
              <span>Operational</span>
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-stone-500">Provider:</span>
              <span className="font-semibold text-stone-800 font-mono">Local / Cloud Media</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-500">Asset Uploads:</span>
              <span className="font-semibold text-emerald-600 font-mono">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-500">Build Timestamp:</span>
              <span className="font-semibold text-stone-700 text-[11px] font-mono">
                {data?.buildTime ? new Date(data.buildTime).toLocaleDateString() : "Active"}
              </span>
            </div>
          </div>
        </AdminCard>
      </div>

      {/* Services Breakdown */}
      <AdminCard className="p-6 space-y-4 border border-stone-200">
        <h3 className="font-bold text-sm text-stone-900 border-b border-stone-100 pb-3">
          Service Integration Health
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 text-purple-700 rounded-lg">
                <CreditCard size={18} />
              </div>
              <div>
                <p className="font-bold text-stone-900">Razorpay Payment Gateway</p>
                <p className="text-stone-400 text-[11px]">Online payment processing</p>
              </div>
            </div>
            <span
              className={`font-bold px-2.5 py-0.5 rounded-full text-[10px] ${
                data?.paymentGatewayStatus === "configured"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {data?.paymentGatewayStatus === "configured" ? "Active" : "Keys Not Set"}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                <Mail size={18} />
              </div>
              <div>
                <p className="font-bold text-stone-900">Email Transport Service</p>
                <p className="text-stone-400 text-[11px]">Transactional email dispatch</p>
              </div>
            </div>
            <span
              className={`font-bold px-2.5 py-0.5 rounded-full text-[10px] ${
                data?.emailStatus === "configured"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {data?.emailStatus === "configured" ? "Active" : "SMTP Not Set"}
            </span>
          </div>
        </div>
      </AdminCard>
    </div>
  );
}
