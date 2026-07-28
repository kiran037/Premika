"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  FolderTree,
  ShoppingCart,
  Users,
  Tag,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  Search,
  Megaphone,
  Server,
} from "lucide-react";
import { toast } from "react-hot-toast";

interface AdminUser {
  adminId: string;
  email: string;
  name: string;
  role: string;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    fetch("/api/admin/auth/me")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setUser(json.data);
        }
      })
      .catch((err) => console.error("Session check error:", err));
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      toast.success("Logged out successfully");
      router.push("/admin/login");
      router.refresh();
    } catch {
      toast.error("Logout failed");
    }
  };

  const navItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Marketing", href: "/admin/marketing", icon: Megaphone, disabled: false },
    { label: "Coupons", href: "/admin/coupons", icon: Tag, disabled: false },
    { label: "Products", href: "/admin/products", icon: ShoppingBag, disabled: false },
    { label: "Categories", href: "/admin/categories", icon: FolderTree, disabled: false },
    { label: "Orders", href: "/admin/orders", icon: ShoppingCart, disabled: false },
    { label: "Customers", href: "/admin/customers", icon: Users, disabled: false },
    { label: "Store Settings", href: "/admin/settings", icon: Settings, disabled: false },
    { label: "System Info", href: "/admin/system", icon: Server, disabled: false },
  ];

  const renderNavList = (isMobile = false) => (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        if (item.disabled) {
          return (
            <div
              key={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-stone-500 cursor-not-allowed opacity-60"
              title={`${item.label} (Coming Soon in Phase 3)`}
            >
              <Icon size={18} className="flex-shrink-0" />
              {(!isSidebarCollapsed || isMobile) && (
                <span className="flex-1 flex items-center justify-between">
                  <span>{item.label}</span>
                  <span className="text-[10px] bg-stone-800 text-stone-400 px-1.5 py-0.5 rounded-full">
                    Soon
                  </span>
                </span>
              )}
            </div>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => isMobile && setIsMobileDrawerOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm transition-all font-medium ${isActive
              ? "bg-[#B67B5C] text-white shadow-md ring-1 ring-[#C88A67]"
              : "text-stone-300 hover:bg-white/10 hover:text-white"
              }`}
          >
            <Icon size={18} className="flex-shrink-0" />
            {(!isSidebarCollapsed || isMobile) && <span>{item.label}</span>}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-stone-100 p-4 lg:p-5">
      <div className="flex h-[calc(100vh-2.5rem)] gap-5 text-stone-800">
        {/* Desktop Sidebar */}
        <aside
          className={`hidden md:flex flex-col rounded-3xl bg-stone-900 text-stone-200 shadow-2xl transition-all duration-300 overflow-hidden ${isSidebarCollapsed ? "w-20" : "w-72"
            }`}
        >
          {/* Brand Header */}
          <div className="h-20 flex items-center justify-between px-5 border-b border-stone-800">
            {isSidebarCollapsed ? (
              <div className="mx-auto w-10 h-10 rounded-2xl bg-[#B67B5C] text-white flex items-center justify-center font-bold">
                P
              </div>
            ) : (
              <span className="font-bold text-lg text-white tracking-tight flex items-center gap-3">
                <span className="w-10 h-10 rounded-2xl bg-[#B67B5C] text-white flex items-center justify-center text-sm font-bold">
                  P
                </span>
                <span>
                  Premika
                  <div className="text-xs text-[#E0BCA2] font-normal">
                    Admin Panel
                  </div>
                </span>
              </span>
            )}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-1.5 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-white transition"
            >
              {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>

          {/* Desktop Nav Items */}
          <div className="flex-1 py-5 px-4">{renderNavList(false)}</div>

          {/* Footer Admin User Badge */}
          <div className="p-5 border-t border-stone-800">
            <div className="flex items-center justify-between">
              {!isSidebarCollapsed && (
                <div className="text-xs truncate">
                  <p className="font-semibold text-white truncate">{user?.name || "Super Admin"}</p>
                  <p className="text-[#E0BCA2] capitalize truncate text-[11px]">{user?.role || "super_admin"}</p>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-stone-400 hover:bg-red-500/20 hover:text-red-400 transition"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile Drawer Overlay */}
        {isMobileDrawerOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs"
              onClick={() => setIsMobileDrawerOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 w-64 bg-stone-900 text-stone-200 shadow-2xl flex flex-col p-4 z-10">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-800">
                <span className="font-bold text-white tracking-tight">Premika Admin</span>
                <button
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-white"
                >
                  <ChevronLeft size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">{renderNavList(true)}</div>
              <div className="pt-4 border-t border-stone-800 flex items-center justify-between">
                <span className="text-xs text-stone-300 font-medium">{user?.name || "Admin"}</span>
                <button onClick={handleLogout} className="text-red-400 text-xs font-semibold">
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex min-w-0 flex-1 flex-col gap-5">
          {/* Sticky Header */}
          <header className="sticky top-0 z-10 h-16 rounded-2xl bg-white border border-stone-200 shadow-sm px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileDrawerOpen(true)}
                className="md:hidden p-2 rounded-lg text-stone-600 hover:bg-stone-100"
              >
                <Menu size={20} />
              </button>

              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-xs sm:text-sm text-stone-500">
                <span>Admin</span>
                <span>/</span>
                <span className="font-semibold text-stone-900 capitalize">
                  {pathname.split("/").pop() || "Dashboard"}
                </span>
              </div>
            </div>

            {/* Search Placeholder & User Dropdown */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 bg-stone-100 px-3 py-1.5 rounded-xl border border-stone-200 text-xs text-stone-400 w-64">
                <Search size={14} />
                <span>Search admin...</span>
              </div>

              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 text-xs sm:text-sm text-stone-700 hover:text-stone-900 focus:outline-none"
                >
                  <div className="w-10 h-10 rounded-2xl bg-[#B67B5C] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                    {user?.name ? user.name.charAt(0) : "A"}
                  </div>
                  <span className="font-semibold hidden sm:inline">{user?.name || "Admin"}</span>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-stone-200 rounded-2xl shadow-xl py-2 z-50 text-sm">
                    <div className="px-4 py-2 border-b border-stone-100">
                      <p className="font-bold text-stone-900">{user?.name || "Admin User"}</p>
                      <p className="text-stone-500 truncate">{user?.email || "admin@premika.shop"}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium"
                    >
                      <LogOut size={14} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Content Container */}
          <main className=" flex-1 overflow-auto">
            <div className="rounded-[28px] bg-white border border-stone-200 shadow-sm p-6 lg:p-8 min-h-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
