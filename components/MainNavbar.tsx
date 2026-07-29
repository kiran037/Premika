"use client";

import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/navbar/resizeable-navbar";
import { useState, useEffect } from "react";
import { ShoppingCart, Heart } from "lucide-react";
import Link from "next/link";
import useCart from "@/hooks/use-cart";
import useWishlist from "@/hooks/use-wishlist";
import useSizeChartModal from "@/hooks/use-size-chart-modal";
import { NavItem } from "@/types";
import { usePathname } from "next/navigation";

export interface MainNavbarProps {
  storeName?: string;
  logo?: string | null;
}

export default function MainNavbar({ storeName, logo }: MainNavbarProps) {
  const [isMounted, setIsMounted] = useState(false);
  const cart = useCart();
  const wishlist = useWishlist();
  const sizeChartModal = useSizeChartModal();
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const navItems: NavItem[] = [
    {
      name: "Home",
      link: "/",
    },
    {
      name: "Shop",
      link: "/shop",
    },
    {
      name: "Track Order",
      link: "/track-order",
    },
    {
      name: "Terms & Conditions",
      link: "/terms-and-conditions",
    },
    {
      name: "Contact Us",
      link: "/contact-us",
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  // Handle Escape key to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen]);

  const totalCartQty = isMounted ? cart.getTotalQuantity() : 0;
  const totalWishlistQty = isMounted ? wishlist.getTotalItems() : 0;

  const formatBadge = (count: number) => {
    if (count <= 0) return null;
    return count > 99 ? "99+" : String(count);
  };

  return (
    <div
      className={`w-full sticky top-0 z-50 ${
        sizeChartModal.isOpen ? "pointer-events-none" : ""
      }`}
    >
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo storeName={storeName} logo={logo} />
          <NavItems items={navItems} />
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            <Link href="/wishlist" aria-label="Wishlist">
              <NavbarButton className="text-foreground bg-background flex items-center gap-2 relative">
                <Heart
                  size={20}
                  className={totalWishlistQty > 0 ? "fill-red-500 text-red-500" : ""}
                />
                <span className="hidden font-bold sm:inline">Wishlist</span>
                {totalWishlistQty > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {formatBadge(totalWishlistQty)}
                  </span>
                )}
              </NavbarButton>
            </Link>
            <Link href="/cart" aria-label="Shopping Cart">
              <NavbarButton className="text-foreground bg-background flex items-center gap-2 relative">
                <ShoppingCart size={20} />
                <span className="hidden font-bold sm:inline">Cart</span>
                {totalCartQty > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#B67B5C] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {formatBadge(totalCartQty)}
                  </span>
                )}
              </NavbarButton>
            </Link>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo storeName={storeName} logo={logo} />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => {
              const isActive =
                item.link === "/"
                  ? pathname === "/"
                  : pathname?.startsWith(item.link);

              return (
                <Link
                  key={`mobile-link-${idx}`}
                  href={item.link}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`relative w-full py-2 px-3 rounded-lg transition-colors flex items-center justify-between ${
                    isActive
                      ? "text-white font-extrabold"
                      : "text-white/80 hover:text-white font-bold"
                  }`}
                >
                  <span className="block text-base">{item.name}</span>
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-[#E0BCA2]" />
                  )}
                </Link>
              );
            })}
            <div className="flex w-full flex-col gap-3 mt-4 pt-4 border-t border-white/10">
              <Link href="/wishlist" onClick={() => setIsMobileMenuOpen(false)} aria-label="Wishlist">
                <NavbarButton className="w-full text-foreground bg-background border border-white/20 flex items-center justify-center gap-2 relative">
                  <Heart size={20} className={totalWishlistQty > 0 ? "fill-red-500 text-red-500" : ""} />
                  <span>Wishlist</span>
                  {totalWishlistQty > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      {formatBadge(totalWishlistQty)}
                    </span>
                  )}
                </NavbarButton>
              </Link>
              <Link href="/cart" onClick={() => setIsMobileMenuOpen(false)} aria-label="Shopping Cart">
                <NavbarButton className="w-full text-foreground bg-background flex items-center justify-center gap-2 relative">
                  <ShoppingCart size={20} />
                  <span>Cart</span>
                  {totalCartQty > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#B67B5C] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      {formatBadge(totalCartQty)}
                    </span>
                  )}
                </NavbarButton>
              </Link>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}
