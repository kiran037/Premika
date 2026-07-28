"use client";

import Link from "next/link";
import { Instagram, Facebook, Twitter, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Carattere } from "next/font/google";

const carattere = Carattere({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--font-carattere",
});

export function Footer() {
  const [isQuickLinksOpen, setIsQuickLinksOpen] = useState(false);
  const [isContactUsOpen, setIsContactUsOpen] = useState(false);

  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Mobile Layout */}
        <div className="md:hidden">
          {/* Premika Section */}
          <div className="space-y-4 mb-6">
            <h3 className="text-2xl font-bold mb-4">Premika</h3>
            <p
              className={`text-[#E0BCA2] text-base italic mb-4 ${carattere.className}`}
            >
              &ldquo;Prem se bana, Premika ke liye&rdquo;
            </p>
            <p className="text-[#E0BCA2] text-sm mb-6 leading-relaxed text-justify">
              Born from love and friendship, Premika reimagines Indian wear with
              care and intention. We create clothing that feels personal,
              rooted, and quietly beautiful - designed with love, crafted for
              you.
            </p>
          </div>

          {/* Mobile Two Column Layout for Quick Links and Contact */}
          <div className="flex justify-between">
            {/* Quick Links - Left Aligned */}
            <div className="flex-1">
              <button
                onClick={() => setIsQuickLinksOpen(!isQuickLinksOpen)}
                className="flex items-center justify-evenly w-full font-bold mb-2 text-left"
              >
                Quick Links
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    isQuickLinksOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isQuickLinksOpen && (
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-[#E0BCA2]">
                  <Link href="/" className="hover:text-white transition-colors">
                    Products
                  </Link>
                  <Link
                    href="/cart"
                    className="hover:text-white transition-colors"
                  >
                    Cart
                  </Link>
                  <Link
                    href="/terms-and-conditions"
                    className="hover:text-white transition-colors"
                  >
                    Terms & Conditions
                  </Link>
                  <Link
                    href="/privacy-policy"
                    className="hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    href="/shipping-policy"
                    className="hover:text-white transition-colors col-span-1"
                  >
                    Shipping Policy
                  </Link>
                  <Link
                    href="/terms-and-conditions"
                    className="hover:text-white transition-colors col-span-1"
                  >
                    Returns and Exchange
                  </Link>
                </div>
              )}
            </div>

            {/* Contact Us - Right Aligned */}
            <div className="flex-1 text-right">
              <button
                onClick={() => setIsContactUsOpen(!isContactUsOpen)}
                className="flex items-center justify-evenly w-full font-bold mb-2 text-right"
              >
                Contact Us
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    isContactUsOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isContactUsOpen && (
                <div className="space-y-2 text-sm text-[#E0BCA2]">
                  <p>📧 premika.shop@gmail.com</p>
                  <p>📞 (+91) 9599215195</p>
                  <div className="flex justify-end space-x-4 pt-2">
                    <a
                      href="https://www.facebook.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Facebook className="w-5 h-5 text-[#E0BCA2] hover:text-white transition-colors" />
                    </a>
                    <a
                      href="https://twitter.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Twitter className="w-5 h-5 text-[#E0BCA2] hover:text-white transition-colors" />
                    </a>
                    <a
                      href="https://www.instagram.com/premika.store"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Instagram className="w-5 h-5 text-[#E0BCA2] hover:text-white transition-colors" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-secondary mt-8 pt-8 text-center text-sm text-[#E0BCA2]">
            <p>
              Premika © 2025. All Rights Reserved. Crafted with love for you.
            </p>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:block">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Premika Section */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="text-2xl font-bold">Premika</h3>
              <p
                className={`text-[#E0BCA2] text-lg italic ${carattere.className}`}
              >
                &ldquo;Prem se bana, Premika ke liye&rdquo;
              </p>
              <p className="text-[#E0BCA2] text-sm leading-relaxed max-w-[#28rem]">
                Born from love and friendship, Premika reimagines Indian wear
                with care and intention. We create clothing that feels personal,
                rooted, and quietly beautiful - designed with love, crafted for
                you.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <div className="space-y-2 text-sm text-[#E0BCA2] flex flex-col">
                <Link href="/" className="hover:text-white transition-colors">
                  Products
                </Link>
                <Link
                  href="/cart"
                  className="hover:text-white transition-colors"
                >
                  Cart
                </Link>

                <Link
                  href="/terms-and-conditions"
                  className="hover:text-white transition-colors"
                >
                  Terms & Conditions
                </Link>
                <Link
                  href="/privacy-policy"
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/shipping-policy"
                  className="hover:text-white transition-colors"
                >
                  Shipping Policy
                </Link>
                <Link
                  href="/terms-and-conditions"
                  className="hover:text-white transition-colors"
                >
                  Returns and Exchange
                </Link>
              </div>
            </div>

            {/* Contact Us */}
            <div>
              <h4 className="font-bold mb-4">Contact Us</h4>
              <div className="space-y-2 text-sm text-[#E0BCA2]">
                <p>📧 premika.shop@gmail.com</p>
                <p>📞 (+91) 9599215195</p>

                <div className="flex space-x-4 pt-2">
                  <a
                    href="https://www.facebook.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Facebook className="w-5 h-5 text-[#E0BCA2] hover:text-white transition-colors" />
                  </a>
                  <a
                    href="https://twitter.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Twitter className="w-5 h-5 text-[#E0BCA2] hover:text-white transition-colors" />
                  </a>
                  <a
                    href="https://www.instagram.com/premika.store"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Instagram className="w-5 h-5 text-[#E0BCA2] hover:text-white transition-colors" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-secondary mt-8 pt-8 text-center text-sm text-[#E0BCA2]">
            <p>
              Premika © 2025. All Rights Reserved. Crafted with love for you.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
