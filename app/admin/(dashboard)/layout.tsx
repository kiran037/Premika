"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
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
  MessageSquareQuote,
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
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Fetch session user
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

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Close dropdown and modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsDropdownOpen(false);
        setIsLogoutModalOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileDrawerOpen]);

  const confirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      toast.success("Logged out successfully");
      router.push("/admin/login");
      router.refresh();
    } catch {
      toast.error("Logout failed");
    } finally {
      setIsLoggingOut(false);
      setIsLogoutModalOpen(false);
    }
  };

  const navItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Marketing", href: "/admin/marketing", icon: Megaphone, disabled: false },
    { label: "Coupons", href: "/admin/coupons", icon: Tag, disabled: false },
    { label: "Products", href: "/admin/products", icon: ShoppingBag, disabled: false },
    { label: "Categories", href: "/admin/categories", icon: FolderTree, disabled: false },
    { label: "Orders", href: "/admin/orders", icon: ShoppingCart, disabled: false },
    { label: "Reviews", href: "/admin/reviews", icon: MessageSquareQuote, disabled: false },
    { label: "Customers", href: "/admin/customers", icon: Users, disabled: false },
    { label: "Store Settings", href: "/admin/settings", icon: Settings, disabled: false },
    { label: "System Info", href: "/admin/system", icon: Server, disabled: false },
  ];

  // Helper for clean breadcrumb titles
  const getBreadcrumbs = () => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length <= 1)
      return [{ label: "Dashboard", href: "/admin/dashboard" }];

    const mainRoute = `/admin/${segments[1]}`;
    const matchedNav = navItems.find((n) => n.href === mainRoute);
    const breadcrumbs = [];

    if (matchedNav) {
      breadcrumbs.push({ label: matchedNav.label, href: matchedNav.href });
    } else {
      const capitalized =
        segments[1].charAt(0).toUpperCase() + segments[1].slice(1);
      breadcrumbs.push({ label: capitalized, href: mainRoute });
    }

    if (segments.length > 2) {
      const sub = segments[2];
      if (sub === "new") {
        breadcrumbs.push({ label: "Create New", href: pathname });
      } else if (sub === "edit" || segments[3] === "edit") {
        breadcrumbs.push({ label: "Edit", href: pathname });
      } else {
        breadcrumbs.push({ label: "Details", href: pathname });
      }
    }

    return breadcrumbs;
  };

  const renderBrandLogo = () => (
    <div className="relative w-10 h-10 rounded-2xl bg-white p-1 flex items-center justify-center overflow-hidden shadow-xs border border-stone-800 shrink-0">
      <Image
        src="/logo.png"
        alt="Premika Logo"
        fill
        className="object-contain p-0.5"
        priority
      />
    </div>
  );

  const renderNavList = (isMobile = false) => (
    <nav className="space-y-1" aria-label="Admin Navigation">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        if (item.disabled) {
          return (
            <div
              key={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-stone-500 cursor-not-allowed opacity-60"
              title={`${item.label} (Coming Soon)`}
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
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm transition-all duration-200 font-medium ${
              isActive
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
          className={`hidden md:flex flex-col rounded-3xl bg-stone-900 text-stone-200 shadow-2xl transition-all duration-300 ease-in-out overflow-hidden ${
            isSidebarCollapsed ? "w-20" : "w-72"
          }`}
        >
          {/* Brand Header */}
          <div className="h-20 flex items-center justify-between px-5 border-b border-stone-800">
            {isSidebarCollapsed ? (
              <div className="mx-auto">{renderBrandLogo()}</div>
            ) : (
              <div className="font-bold text-lg text-white tracking-tight flex items-center gap-3">
                {renderBrandLogo()}
                <div>
                  <span className="block leading-tight">Premika</span>
                  <span className="text-xs text-[#E0BCA2] font-normal block">
                    Admin Panel
                  </span>
                </div>
              </div>
            )}
            <button
              type="button"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-1.5 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-white transition-colors"
              aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>

          {/* Desktop Nav Items */}
          <div className="flex-1 py-5 px-4 overflow-y-auto">{renderNavList(false)}</div>

          {/* Footer Admin User Badge */}
          <div className="p-5 border-t border-stone-800">
            <div className="flex items-center justify-between">
              {!isSidebarCollapsed && (
                <div className="text-xs truncate pr-2">
                  <p className="font-semibold text-white truncate">
                    {user?.name || "Super Admin"}
                  </p>
                  <p className="text-[#E0BCA2] capitalize truncate text-[11px]">
                    {user?.role || "super_admin"}
                  </p>
                </div>
              )}
              <button
                type="button"
                onClick={() => setIsLogoutModalOpen(true)}
                className="p-2 rounded-lg text-stone-400 hover:bg-red-500/20 hover:text-red-400 transition-colors shrink-0"
                title="Sign Out"
                aria-label="Sign Out"
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
              className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs transition-opacity duration-200"
              onClick={() => setIsMobileDrawerOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 w-64 bg-stone-900 text-stone-200 shadow-2xl flex flex-col p-4 z-10 transition-transform duration-300">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-800">
                <div className="flex items-center gap-2.5">
                  {renderBrandLogo()}
                  <span className="font-bold text-white tracking-tight">Premika</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-white"
                  aria-label="Close drawer"
                >
                  <ChevronLeft size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">{renderNavList(true)}</div>
              <div className="pt-4 border-t border-stone-800 flex items-center justify-between">
                <span className="text-xs text-stone-300 font-medium truncate max-w-[140px]">
                  {user?.name || "Admin"}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileDrawerOpen(false);
                    setIsLogoutModalOpen(true);
                  }}
                  className="text-red-400 hover:text-red-300 text-xs font-semibold flex items-center gap-1"
                >
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex min-w-0 flex-1 flex-col gap-5">
          {/* Sticky Header */}
          <header className="sticky top-0 z-10 h-16 rounded-2xl bg-white border border-stone-200 shadow-xs px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Mobile Menu Toggle */}
              <button
                type="button"
                onClick={() => setIsMobileDrawerOpen(true)}
                className="md:hidden p-2 rounded-lg text-stone-600 hover:bg-stone-100"
                aria-label="Open navigation menu"
              >
                <Menu size={20} />
              </button>

              {/* Clean Breadcrumb Navigation */}
              <nav className="flex items-center gap-1.5 text-xs sm:text-sm text-stone-500" aria-label="Breadcrumb">
                <span>Admin</span>
                {getBreadcrumbs().map((b, idx) => (
                  <span key={idx} className="flex items-center gap-1.5">
                    <span>/</span>
                    <span
                      className={
                        idx === getBreadcrumbs().length - 1
                          ? "font-bold text-stone-900"
                          : "font-medium text-stone-600"
                      }
                    >
                      {b.label}
                    </span>
                  </span>
                ))}
              </nav>
            </div>

            {/* Search Placeholder & User Dropdown */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 bg-stone-100 px-3 py-1.5 rounded-xl border border-stone-200 text-xs text-stone-400 w-64">
                <Search size={14} />
                <span>Search admin...</span>
              </div>

              {/* User Menu Dropdown Container */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 text-xs sm:text-sm text-stone-700 hover:text-stone-900 focus:outline-none rounded-2xl focus:ring-2 focus:ring-[#B67B5C]/30 p-0.5"
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="true"
                  aria-label="User account menu"
                >
                  <div className="w-10 h-10 rounded-2xl bg-[#B67B5C] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
                  </div>
                  <span className="font-semibold hidden sm:inline">{user?.name || "Admin"}</span>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-stone-200 rounded-2xl shadow-xl py-2 z-50 text-sm animate-in fade-in zoom-in-95 duration-150 transform origin-top-right">
                    <div className="px-4 py-2 border-b border-stone-100">
                      <p className="font-bold text-stone-900">{user?.name || "Admin User"}</p>
                      <p className="text-xs text-stone-500 truncate">{user?.email || "admin@premika.shop"}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        setIsLogoutModalOpen(true);
                      }}
                      className="w-full text-left px-4 py-2.5 text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium transition-colors"
                    >
                      <LogOut size={14} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Main Page Content */}
          <main className="flex-1 overflow-auto">
            <div className="rounded-[28px] bg-white border border-stone-200 shadow-xs p-6 lg:p-8 min-h-full">
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setIsLogoutModalOpen(false)}
          aria-modal="true"
          role="dialog"
        >
          <div
            className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-stone-200 space-y-4 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <LogOut className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">Sign Out</h3>
                <p className="text-xs text-stone-500 mt-0.5">Are you sure you want to sign out?</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setIsLogoutModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmLogout}
                disabled={isLoggingOut}
                className="px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white rounded-xl shadow-xs transition-colors disabled:opacity-50"
              >
                {isLoggingOut ? "Signing Out..." : "Sign Out"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
