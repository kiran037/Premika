"use client";

import Link from "next/link";
import { Instagram, Facebook, Twitter, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Carattere } from "next/font/google";
import type { StoreInformation } from "@/lib/store/get-store-information";

const carattere = Carattere({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--font-carattere",
});

interface FooterProps {
  storeInfo?: StoreInformation;
}

export function Footer({ storeInfo }: FooterProps) {
  const [isQuickLinksOpen, setIsQuickLinksOpen] = useState(false);
  const [isContactUsOpen, setIsContactUsOpen] = useState(false);

  const storeName = storeInfo?.storeName || "Premika";
  const supportEmail = storeInfo?.supportEmail || "premika.shop@gmail.com";
  const supportPhone = storeInfo?.supportPhone || "(+91) 9599215195";
  const facebookUrl = storeInfo?.facebookUrl || "https://www.facebook.com/";
  const instagramUrl = storeInfo?.instagramUrl || "https://www.instagram.com/premika.store";
  const twitterUrl = storeInfo?.twitterUrl || null;

  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Mobile Layout */}
        <div className="md:hidden">
          {/* Premika Section */}
          <div className="space-y-4 mb-6">
            <h3 className="text-2xl font-bold mb-4">{storeName}</h3>
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
                className="flex items-center justify-between w-full font-bold mb-2 text-left pr-2"
              >
                <span>Quick Links</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    isQuickLinksOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isQuickLinksOpen && (
                <div className="flex flex-col space-y-2 text-sm text-[#E0BCA2]">
                  <Link href="/about-us" className="hover:text-white transition-colors">
                    About Us
                  </Link>
                  <Link href="/shop" className="hover:text-white transition-colors">
                    Products
                  </Link>
                  <Link href="/cart" className="hover:text-white transition-colors">
                    Cart
                  </Link>
                  <Link href="/contact-us" className="hover:text-white transition-colors">
                    Contact Us
                  </Link>
                  <Link
                    href="/terms-and-conditions"
                    className="hover:text-white transition-colors"
                  >
                    Terms & Conditions
                  </Link>
                </div>
              )}
            </div>

            {/* Contact Us - Right Aligned */}
            <div className="flex-1 text-right pl-2">
              <button
                onClick={() => setIsContactUsOpen(!isContactUsOpen)}
                className="flex items-center justify-between w-full font-bold mb-2 text-right"
              >
                <span className="w-full text-right">Customer Care</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    isContactUsOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isContactUsOpen && (
                <div className="space-y-2 text-sm text-[#E0BCA2]">
                  <p>📧 {supportEmail}</p>
                  <p>📞 {supportPhone}</p>
                  <div className="flex justify-end space-x-4 pt-2">
                    {facebookUrl && (
                      <a
                        href={facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Facebook className="w-5 h-5 text-[#E0BCA2] hover:text-white transition-colors" />
                      </a>
                    )}
                    {twitterUrl && (
                      <a
                        href={twitterUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Twitter className="w-5 h-5 text-[#E0BCA2] hover:text-white transition-colors" />
                      </a>
                    )}
                    {instagramUrl && (
                      <a
                        href={instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Instagram className="w-5 h-5 text-[#E0BCA2] hover:text-white transition-colors" />
                      </a>
                    )}
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
              <h3 className="text-2xl font-bold">{storeName}</h3>
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
                <Link href="/about-us" className="hover:text-white transition-colors">
                  About Us
                </Link>
                <Link href="/shop" className="hover:text-white transition-colors">
                  Products
                </Link>
                <Link
                  href="/cart"
                  className="hover:text-white transition-colors"
                >
                  Cart
                </Link>
                <Link
                  href="/contact-us"
                  className="hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
                <Link
                  href="/terms-and-conditions"
                  className="hover:text-white transition-colors"
                >
                  Terms & Conditions
                </Link>
              </div>
            </div>

            {/* Contact Us */}
            <div>
              <h4 className="font-bold mb-4">Contact Us</h4>
              <div className="space-y-2 text-sm text-[#E0BCA2]">
                <p>📧 {supportEmail}</p>
                <p>📞 {supportPhone}</p>

                <div className="flex space-x-4 pt-2">
                  {facebookUrl && (
                    <a
                      href={facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Facebook className="w-5 h-5 text-[#E0BCA2] hover:text-white transition-colors" />
                    </a>
                  )}
                  {twitterUrl && (
                    <a
                      href={twitterUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Twitter className="w-5 h-5 text-[#E0BCA2] hover:text-white transition-colors" />
                    </a>
                  )}
                  {instagramUrl && (
                    <a
                      href={instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Instagram className="w-5 h-5 text-[#E0BCA2] hover:text-white transition-colors" />
                    </a>
                  )}
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

export default Footer;
