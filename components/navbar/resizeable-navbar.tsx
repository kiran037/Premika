"use client";

import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { NavItem } from "@/types";
import { usePathname } from "next/navigation";

interface NavbarProps {
  children: React.ReactNode;
  className?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ children, className }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={cn("sticky inset-x-0 top-1 z-40 w-full px-2 sm:px-4", className)}>
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement<any>, { visible })
          : child
      )}
    </div>
  );
};

interface NavBodyProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}

export const NavBody: React.FC<NavBodyProps> = ({ children, className, visible }) => {
  return (
    <div
      style={{
        backdropFilter: visible ? "blur(20px) saturate(180%)" : "none",
        boxShadow: visible
          ? "0 0 24px rgba(34, 42, 53, 0.08), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(255, 255, 255, 0.1), 0 16px 48px rgba(0, 0, 0, 0.15)"
          : "none",
        transform: visible ? "translateY(12px)" : "translateY(0px)",
        transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      }}
      className={cn(
        "relative z-[60] mx-auto hidden w-full flex-row items-center justify-between self-start rounded-full bg-foreground px-6 py-2.5 lg:flex transition-all duration-400 ease-out border border-transparent",
        visible
          ? "max-w-5xl bg-[#792520]/70 border-white/10"
          : "max-w-7xl bg-foreground",
        className
      )}
    >
      {children}
    </div>
  );
};

interface NavItemsProps {
  items: NavItem[];
  className?: string;
  onItemClick?: () => void;
}

export const NavItems: React.FC<NavItemsProps> = ({ items, className, onItemClick }) => {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "hidden flex-1 flex-row items-center justify-center space-x-1 sm:space-x-2 text-sm font-bold text-background lg:flex mx-4 min-w-0",
        className
      )}
    >
      {items.map((item, idx) => {
        const isActive =
          item.link === "/"
            ? pathname === "/"
            : pathname?.startsWith(item.link);

        return (
          <Link
            key={`link-${idx}`}
            href={item.link}
            onClick={onItemClick}
            className="relative px-3 py-1.5 transition-colors group"
          >
            <span
              className={cn(
                "relative z-20 font-bold transition-all duration-200",
                isActive
                  ? "text-white font-extrabold"
                  : "text-background/85 hover:text-white"
              )}
            >
              {item.name}
            </span>
            {isActive && (
              <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#E0BCA2] rounded-full transition-all duration-300" />
            )}
          </Link>
        );
      })}
    </div>
  );
};

interface MobileNavProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}

export const MobileNav: React.FC<MobileNavProps> = ({ children, className, visible }) => {
  return (
    <div
      style={{
        boxShadow: visible
          ? "0 10px 25px -5px rgba(0, 0, 0, 0.15)"
          : "none",
        transform: visible ? "translateY(8px)" : "translateY(0px)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
      className={cn(
        "relative z-50 mx-auto flex w-full flex-row items-center justify-between rounded-full bg-foreground px-4 py-2 lg:hidden transition-all duration-300 border border-transparent",
        className
      )}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement<any>, { visible })
          : child
      )}
    </div>
  );
};

interface MobileNavHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const MobileNavHeader: React.FC<MobileNavHeaderProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        "relative z-20 flex w-full flex-row items-center justify-between px-1",
        className
      )}
    >
      {children}
    </div>
  );
};

interface MobileNavMenuProps {
  children: React.ReactNode;
  className?: string;
  isOpen: boolean;
  onClose?: () => void;
  visible?: boolean;
}

export const MobileNavMenu: React.FC<MobileNavMenuProps> = ({ children, className, isOpen }) => {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Menu"
      className={cn(
        "absolute inset-x-0 top-[calc(100%+6px)] z-10 flex w-full flex-col items-start justify-start gap-3 rounded-3xl bg-foreground p-6 text-background shadow-2xl transition-all duration-300 ease-in-out origin-top border border-transparent",
        isOpen
          ? "opacity-100 translate-y-0 visible pointer-events-auto scale-100"
          : "opacity-0 -translate-y-2 invisible pointer-events-none scale-95",
        className
      )}
    >
      {children}
    </div>
  );
};

interface MobileNavToggleProps {
  isOpen: boolean;
  onClick: () => void;
}

export const MobileNavToggle: React.FC<MobileNavToggleProps> = ({ isOpen, onClick }) => {
  return (
    <button
      onClick={onClick}
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
      className="p-1 mr-1 text-background hover:opacity-80 transition-opacity"
    >
      {isOpen ? (
        <X className="h-6 w-6 text-background dark:text-white" />
      ) : (
        <Menu className="h-6 w-6 text-background dark:text-white" />
      )}
    </button>
  );
};

export interface NavbarLogoProps {
  storeName?: string;
  logo?: string | null;
  className?: string;
}

export const NavbarLogo: React.FC<NavbarLogoProps> = ({
  storeName = "Premika",
  logo = null,
  className,
}) => {
  const displayName = storeName && storeName.trim() ? storeName : "Premika";
  const logoSrc = logo && logo.trim() ? logo : "/logo.png";

  return (
    <Link
      href="/"
      className={cn(
        "relative z-20 flex-shrink-0 flex items-center space-x-2 px-2 py-1 text-sm font-normal text-background hover:opacity-90 transition-opacity",
        className
      )}
    >
      <Image
        src={logoSrc}
        alt={`${displayName} Storefront`}
        width={32}
        height={32}
        className="rounded object-contain"
        priority
      />
      <span className="font-bold text-background text-md md:text-lg dark:text-white truncate max-w-[180px]">
        {displayName}
      </span>
    </Link>
  );
};

interface NavbarButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "dark" | "gradient";
}

export const NavbarButton: React.FC<NavbarButtonProps> = ({
  href,
  as: Tag = "button",
  children,
  className,
  variant = "primary",
  ...props
}) => {
  const baseStyles =
    "px-4 py-2 rounded-md bg-white text-black text-sm font-bold relative cursor-pointer hover:-translate-y-0.5 transition duration-200 inline-block text-center";

  const variantStyles = {
    primary:
      "shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]",
    secondary: "bg-transparent shadow-none dark:text-white",
    dark: "bg-black text-white shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]",
    gradient:
      "bg-gradient-to-b from-blue-500 to-blue-700 text-white shadow-[0px_2px_0px_0px_rgba(255,255,255,0.3)_inset]",
  };

  if (href && Tag === "button") {
    return (
      <Link
        href={href}
        className={cn(baseStyles, variantStyles[variant], className)}
      >
        {children}
      </Link>
    );
  }

  return (
    <Tag
      href={Tag === "a" ? href : undefined}
      className={cn(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      {children}
    </Tag>
  );
};
