"use client";

import React, { useState, useEffect } from "react";
import { StoreSettingsForm } from "@/components/admin/StoreSettingsForm";
import { StoreContactForm } from "@/components/admin/StoreContactForm";
import { SocialLinksManager, SocialLink } from "@/components/admin/SocialLinksManager";
import { DelhiverySettingsForm } from "@/components/admin/DelhiverySettingsForm";
import { SeoSettingsForm } from "@/components/admin/SeoSettingsForm";
import { Skeleton } from "@/components/admin/Skeleton";
import { AdminCard } from "@/components/admin/AdminCard";
import { StoreSettingsInput, StoreContactsInput, SocialLinkInput } from "@/lib/validations/admin-store.schema";
import { DelhiverySettingsInput } from "@/lib/validations/admin-delhivery.schema";
import { GlobalSeoInput } from "@/lib/validations/seo";
import {
  Settings,
  Building,
  MapPin,
  Share2,
  Cpu,
  CreditCard,
  Mail,
  DollarSign,
  Truck,
  Globe,
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<
    "general" | "contact" | "social" | "delhivery" | "seo" | "integrations"
  >("general");

  const [settings, setSettings] = useState<StoreSettingsInput | null>(null);
  const [contacts, setContacts] = useState<StoreContactsInput | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [delhiverySettings, setDelhiverySettings] = useState<DelhiverySettingsInput | null>(null);
  const [seoSettings, setSeoSettings] = useState<GlobalSeoInput | null>(null);
  const [systemInfo, setSystemInfo] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [savingContacts, setSavingContacts] = useState(false);
  const [savingDelhivery, setSavingDelhivery] = useState(false);
  const [savingSeo, setSavingSeo] = useState(false);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [settingsRes, contactsRes, socialRes, delhiveryRes, seoRes, sysRes] = await Promise.all([
        fetch("/api/admin/settings/store"),
        fetch("/api/admin/settings/contact"),
        fetch("/api/admin/settings/social"),
        fetch("/api/admin/settings/delhivery"),
        fetch("/api/admin/settings/seo"),
        fetch("/api/admin/system"),
      ]);

      const [sJson, cJson, socJson, dJson, seoJson, sysJson] = await Promise.all([
        settingsRes.json(),
        contactsRes.json(),
        socialRes.json(),
        delhiveryRes.json(),
        seoRes.json(),
        sysRes.json(),
      ]);

      if (sJson.success) setSettings(sJson.data);
      if (cJson.success) setContacts(cJson.data);
      if (socJson.success) setSocialLinks(socJson.data || []);
      if (dJson.success) setDelhiverySettings(dJson.data);
      if (seoJson.success) setSeoSettings(seoJson.data);
      if (sysJson.success) setSystemInfo(sysJson.data);
    } catch {
      toast.error("Failed to load store settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleSaveSettings = async (data: StoreSettingsInput) => {
    setSavingSettings(true);
    try {
      const res = await fetch("/api/admin/settings/store", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(json.message || "Store settings updated successfully");
        setSettings(json.data);
      } else {
        toast.error(json.message || "Failed to update store settings");
      }
    } catch {
      toast.error("Error saving store settings");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleSaveContacts = async (data: StoreContactsInput) => {
    setSavingContacts(true);
    try {
      const res = await fetch("/api/admin/settings/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(json.message || "Store contacts updated successfully");
        setContacts(json.data);
      } else {
        toast.error(json.message || "Failed to update store contacts");
      }
    } catch {
      toast.error("Error saving store contacts");
    } finally {
      setSavingContacts(false);
    }
  };

  const handleSaveDelhivery = async (data: DelhiverySettingsInput) => {
    setSavingDelhivery(true);
    try {
      const res = await fetch("/api/admin/settings/delhivery", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(json.message || "Delhivery settings updated successfully");
        setDelhiverySettings(json.data);
      } else {
        toast.error(json.message || "Failed to update Delhivery settings");
      }
    } catch {
      toast.error("Error saving Delhivery settings");
    } finally {
      setSavingDelhivery(false);
    }
  };

  const handleSaveSeo = async (data: GlobalSeoInput) => {
    setSavingSeo(true);
    try {
      const res = await fetch("/api/admin/settings/seo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(json.message || "Global SEO settings updated successfully");
        setSeoSettings(json.data);
      } else {
        toast.error(json.message || "Failed to update SEO settings");
      }
    } catch {
      toast.error("Error saving SEO settings");
    } finally {
      setSavingSeo(false);
    }
  };

  const handleAddSocial = async (data: SocialLinkInput) => {
    const res = await fetch("/api/admin/settings/social", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (json.success) {
      loadAllData();
    } else {
      throw new Error(json.message);
    }
  };

  const handleUpdateSocial = async (id: string, data: SocialLinkInput) => {
    const res = await fetch(`/api/admin/settings/social/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (json.success) {
      loadAllData();
    } else {
      throw new Error(json.message);
    }
  };

  const handleDeleteSocial = async (id: string) => {
    const res = await fetch(`/api/admin/settings/social/${id}`, {
      method: "DELETE",
    });
    const json = await res.json();
    if (json.success) {
      loadAllData();
    } else {
      throw new Error(json.message);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64 rounded-xl" />
        <Skeleton className="h-12 w-full rounded-2xl" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-stone-900 flex items-center gap-2">
          <Settings size={22} className="text-[#B67B5C]" />
          <span>Store Configuration & Business Settings</span>
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Manage store identity, branding assets, contact information, social links, Delhivery shipping, global SEO, and integration statuses.
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-stone-200 gap-2 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab("general")}
          className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition whitespace-nowrap ${
            activeTab === "general"
              ? "border-[#B67B5C] text-[#B67B5C]"
              : "border-transparent text-stone-500 hover:text-stone-900"
          }`}
        >
          <Building size={16} />
          <span>Store & Branding</span>
        </button>

        <button
          onClick={() => setActiveTab("contact")}
          className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition whitespace-nowrap ${
            activeTab === "contact"
              ? "border-[#B67B5C] text-[#B67B5C]"
              : "border-transparent text-stone-500 hover:text-stone-900"
          }`}
        >
          <MapPin size={16} />
          <span>Contact & Address</span>
        </button>

        <button
          onClick={() => setActiveTab("social")}
          className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition whitespace-nowrap ${
            activeTab === "social"
              ? "border-[#B67B5C] text-[#B67B5C]"
              : "border-transparent text-stone-500 hover:text-stone-900"
          }`}
        >
          <Share2 size={16} />
          <span>Social Media Links</span>
        </button>

        <button
          onClick={() => setActiveTab("delhivery")}
          className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition whitespace-nowrap ${
            activeTab === "delhivery"
              ? "border-[#B67B5C] text-[#B67B5C]"
              : "border-transparent text-stone-500 hover:text-stone-900"
          }`}
        >
          <Truck size={16} />
          <span>Delhivery Logistics</span>
        </button>

        <button
          onClick={() => setActiveTab("seo")}
          className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition whitespace-nowrap ${
            activeTab === "seo"
              ? "border-[#B67B5C] text-[#B67B5C]"
              : "border-transparent text-stone-500 hover:text-stone-900"
          }`}
        >
          <Globe size={16} />
          <span>Global SEO Settings</span>
        </button>

        <button
          onClick={() => setActiveTab("integrations")}
          className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition whitespace-nowrap ${
            activeTab === "integrations"
              ? "border-[#B67B5C] text-[#B67B5C]"
              : "border-transparent text-stone-500 hover:text-stone-900"
          }`}
        >
          <Cpu size={16} />
          <span>Integrations & Statuses</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === "general" && (
        <StoreSettingsForm
          initialData={settings}
          onSave={handleSaveSettings}
          isLoading={savingSettings}
        />
      )}

      {activeTab === "contact" && (
        <StoreContactForm
          initialData={contacts}
          onSave={handleSaveContacts}
          isLoading={savingContacts}
        />
      )}

      {activeTab === "social" && (
        <SocialLinksManager
          links={socialLinks}
          onAdd={handleAddSocial}
          onUpdate={handleUpdateSocial}
          onDelete={handleDeleteSocial}
        />
      )}

      {activeTab === "delhivery" && (
        <DelhiverySettingsForm
          initialData={delhiverySettings}
          onSave={handleSaveDelhivery}
          isLoading={savingDelhivery}
        />
      )}

      {activeTab === "seo" && (
        <SeoSettingsForm
          initialData={seoSettings}
          onSave={handleSaveSeo}
          isLoading={savingSeo}
        />
      )}

      {activeTab === "integrations" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Payment Gateway Status */}
            <AdminCard className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                  <CreditCard size={20} />
                </div>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    systemInfo?.paymentGatewayStatus === "configured"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {systemInfo?.paymentGatewayStatus === "configured" ? "Configured" : "Not Configured"}
                </span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900">Razorpay Payment Gateway</h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  Handles customer checkout payments securely via Razorpay API.
                </p>
              </div>
            </AdminCard>

            {/* Email Service Status */}
            <AdminCard className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Mail size={20} />
                </div>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    systemInfo?.emailStatus === "configured"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {systemInfo?.emailStatus === "configured" ? "Configured" : "Not Configured"}
                </span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900">Email Notification Service</h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  Sends order confirmations and password resets via SMTP/Resend.
                </p>
              </div>
            </AdminCard>

            {/* Currency & Tax */}
            <AdminCard className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <DollarSign size={20} />
                </div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Fixed (INR)
                </span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900">Currency & Tax Rules</h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  Indian Rupee (₹) standard currency with integrated GST calculations.
                </p>
              </div>
            </AdminCard>
          </div>
        </div>
      )}
    </div>
  );
}
