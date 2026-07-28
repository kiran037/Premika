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

export default function MainNavbar() {
  const [isMounted, setIsMounted] = useState(false);
  const cart = useCart();
  const wishlist = useWishlist();
  const sizeChartModal = useSizeChartModal();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const navItems: NavItem[] = [
    {
      name: "Home",
      link: "/",
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

  const totalCartQty = isMounted ? cart.getTotalQuantity() : 0;
  const totalWishlistQty = isMounted ? wishlist.getTotalItems() : 0;

  return (
    <div
      className={`w-full sticky top-0 z-50 ${
        sizeChartModal.isOpen ? "pointer-events-none" : ""
      }`}
    >
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/wishlist">
              <NavbarButton className="text-foreground bg-background flex items-center gap-2 relative">
                <Heart size={20} className={totalWishlistQty > 0 ? "fill-red-500 text-red-500" : ""} />
                <span className="hidden font sm:inline">Wishlist</span>
                {totalWishlistQty > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalWishlistQty}
                  </span>
                )}
              </NavbarButton>
            </Link>
            <Link href="/cart">
              <NavbarButton className="text-foreground bg-background flex items-center gap-2 relative">
                <ShoppingCart size={20} />
                <span className="hidden font sm:inline">Cart</span>
                {totalCartQty > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#B67B5C] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalCartQty}
                  </span>
                )}
              </NavbarButton>
            </Link>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <Link
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-foreground dark:text-foreground hover:text-[#361D1B] dark:hover:text-neutral-100 transition-colors"
              >
                <span className="block font-bold">{item.name}</span>
              </Link>
            ))}
            <div className="flex w-full flex-col gap-3 mt-4">
              <Link href="/wishlist" onClick={() => setIsMobileMenuOpen(false)}>
                <NavbarButton className="w-full text-foreground bg-background border border-foreground/20 flex items-center justify-center gap-2 relative">
                  <Heart size={20} className={totalWishlistQty > 0 ? "fill-red-500 text-red-500" : ""} />
                  <span>Wishlist</span>
                  {totalWishlistQty > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {totalWishlistQty}
                    </span>
                  )}
                </NavbarButton>
              </Link>
              <Link href="/cart" onClick={() => setIsMobileMenuOpen(false)}>
                <NavbarButton className="w-full text-background bg-foreground flex items-center justify-center gap-2 relative">
                  <ShoppingCart size={20} />
                  <span>Cart</span>
                  {totalCartQty > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {totalCartQty}
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
