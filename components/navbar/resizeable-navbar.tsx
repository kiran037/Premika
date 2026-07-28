"use client";

import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { NavItem } from "@/types";

interface NavbarProps {
  children: React.ReactNode;
  className?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ children, className }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={cn("sticky inset-x-0 top-1 z-40 w-full", className)}>
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
        minWidth: "800px",
        backdropFilter: visible ? "blur(10px)" : "none",
        boxShadow: visible
          ? "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset"
          : "none",
        width: visible ? "40%" : "100%",
        transform: visible ? "translateY(20px)" : "translateY(0px)",
        transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      }}
      className={cn(
        "relative z-[60] mx-auto hidden w-full max-w-7xl flex-row items-center justify-between self-start rounded-full bg-foreground px-4 py-2 lg:flex dark:bg-transparent transition-all duration-400 ease-out",
        visible && "bg-foreground dark:bg-neutral-950/80",
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
  const [, setHovered] = useState<number | null>(null);

  return (
    <div
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "absolute inset-0 hidden flex-1 flex-row items-center justify-center space-x-2 text-sm font-medium text-zinc-600 transition duration-200 hover:text-zinc-800 lg:flex lg:space-x-2",
        className
      )}
    >
      {items.map((item, idx) => (
        <Link
          key={`link-${idx}`}
          href={item.link}
          onMouseEnter={() => setHovered(idx)}
          onClick={onItemClick}
          className="relative px-4 py-2 text-background pr-6"
        >
          <div className="py-2 px-4 inset-0 h-full w-full rounded-md hover:bg-background hover:text-foreground dark:bg-neutral-800 transition-all duration-200 animate-in fade-in-0">
            <span className="relative z-20 font-bold">{item.name}</span>
          </div>
        </Link>
      ))}
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
        backdropFilter: visible ? "blur(10px)" : "none",
        boxShadow: visible
          ? "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset"
          : "none",
        width: visible ? "90%" : "100%",
        paddingRight: visible ? "12px" : "0px",
        paddingLeft: visible ? "12px" : "0px",
        borderRadius: "20px",
        transform: visible ? "translateY(20px)" : "translateY(0px)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
      className={cn(
        "relative z-50 mx-auto flex w-full flex-col items-center justify-between bg-foreground px-0 py-2 lg:hidden",
        visible && "bg-foreground dark:bg-neutral-950/80",
        className
      )}
    >
      {children}
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
        "flex w-full flex-row items-center justify-between",
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
}

export const MobileNavMenu: React.FC<MobileNavMenuProps> = ({ children, className, isOpen }) => {
  return (
    <div
      className={cn(
        "absolute inset-x-0 top-16 z-50 flex w-full flex-col items-start justify-start gap-4 rounded-lg bg-background px-4 py-8 shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] dark:bg-neutral-950 transition-all duration-300",
        isOpen ? "opacity-100 visible" : "opacity-0 invisible",
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
    <button onClick={onClick} className="p-1 mr-3">
      {isOpen ? (
        <X className="h-6 w-6 text-background dark:text-white" />
      ) : (
        <Menu className="h-6 w-6 text-background dark:text-white" />
      )}
    </button>
  );
};

export const NavbarLogo: React.FC = () => {
  return (
    <Link
      href="/"
      className="relative z-20 mr-4 flex items-center space-x-2 px-2 py-1 text-sm font-normal text-black"
    >
      <Image
        src="/logo.png"
        alt="logo"
        width={30}
        height={30}
        className="rounded"
      />
      <span className="font-bold text-background text-md md:text-lg dark:text-white">Premika</span>
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
