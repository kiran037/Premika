import React from "react";
import Container from "@/components/ui/container";
import InfoPageHeader from "@/components/ui/info-page-header";
import InfoCard from "@/components/ui/info-card";
import InfoPageFooter from "@/components/ui/info-page-footer";
import {
  Shield,
  CreditCard,
  Ruler,
  RotateCcw,
  Package,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Lock,
  Globe,
  Cookie,
  Mail,
  Truck,
  Clock,
  MapPin,
  Video,
  Ban,
  ListOrdered,
} from "lucide-react";

export function generateMetadata() {
  return {
    title: "Terms and Conditions & Store Policies - Premika Store",
    description:
      "Read Premika Store's terms and conditions, privacy policy, shipping terms, refund policy, and cancellation policy. No COD, prepaid only. 8-9 days delivery.",
    keywords:
      "premika store terms conditions, privacy policy, shipping policy, refund policy, cancellation policy, payment policy, return policy, delivery information, size guidelines, no cod, prepaid only",
    authors: [{ name: "Premika Store" }],
    creator: "Premika Store",
    publisher: "Premika Store",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: "https://premika.shop/terms-and-conditions",
      siteName: "Premika Store",
      title: "Terms and Conditions & Store Policies - Premika Store",
      description:
        "Read Premika Store's complete store policies including payment terms, privacy, shipping, returns, and cancellation policy.",
      images: [
        {
          url: "https://premika.shop/logo.png",
          width: 1200,
          height: 630,
          alt: "Premika Store Terms and Conditions",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@premika_store",
      creator: "@premika_store",
      title: "Terms and Conditions & Store Policies - Premika Store",
      description:
        "Read Premika Store's complete store policies including payment terms, privacy, shipping, returns, and cancellation policy.",
      images: ["https://premika.shop/logo.png"],
    },
    alternates: {
      canonical: "https://premika.shop/terms-and-conditions",
    },
    category: "E-commerce",
  };
}

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* 1. Header Banner */}
      <InfoPageHeader
        badge="Store Guidelines & Legal"
        icon={Shield}
        title="Terms & Store Policies"
        subtitle="Complete guidelines governing your purchases, privacy, shipping, refunds, and order cancellations at Premika."
      />

      {/* 2. Main Content Container */}
      <Container>
        <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6 sm:space-y-8 max-w-5xl mx-auto">
          {/* Table of Contents Section */}
          <InfoCard title="Contents" icon={ListOrdered} borderAccent className="bg-popover/20">
            <p className="text-xs sm:text-sm text-muted-foreground mb-3">
              Click any policy topic below to navigate directly to its detailed terms:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs sm:text-sm">
              <a
                href="#terms-and-conditions"
                className="flex items-center gap-2 p-2.5 rounded-lg bg-card border border-primary/20 hover:border-primary text-primary font-bold transition-all shadow-2xs hover:shadow-xs"
              >
                <Shield size={16} />
                <span>1. Terms & Conditions</span>
              </a>

              <a
                href="#privacy-policy"
                className="flex items-center gap-2 p-2.5 rounded-lg bg-card border border-primary/20 hover:border-primary text-primary font-bold transition-all shadow-2xs hover:shadow-xs"
              >
                <Lock size={16} />
                <span>2. Privacy Policy</span>
              </a>

              <a
                href="#shipping-policy"
                className="flex items-center gap-2 p-2.5 rounded-lg bg-card border border-primary/20 hover:border-primary text-primary font-bold transition-all shadow-2xs hover:shadow-xs"
              >
                <Truck size={16} />
                <span>3. Shipping Policy</span>
              </a>

              <a
                href="#refund-policy"
                className="flex items-center gap-2 p-2.5 rounded-lg bg-card border border-primary/20 hover:border-primary text-primary font-bold transition-all shadow-2xs hover:shadow-xs"
              >
                <RotateCcw size={16} />
                <span>4. Refund Policy</span>
              </a>

              <a
                href="#cancellation-policy"
                className="flex items-center gap-2 p-2.5 rounded-lg bg-card border border-primary/20 hover:border-primary text-primary font-bold transition-all shadow-2xs hover:shadow-xs"
              >
                <Ban size={16} />
                <span>5. Cancellation Policy</span>
              </a>
            </div>
          </InfoCard>

          {/* SECTION 1: TERMS & CONDITIONS */}
          <InfoCard id="terms-and-conditions" title="1. Terms & Conditions" icon={Shield}>
            <div className="space-y-6">
              <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                At <span className="font-semibold text-primary">Premika</span>, we are committed to providing a transparent, fair, and satisfying shopping experience. Please review our store policies carefully before placing an order. By making a purchase, you agree to these terms and conditions.
              </p>

              {/* Payment & Size Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Payment Policy */}
                <div className="p-4 rounded-lg bg-popover/30 border border-primary/20 space-y-2">
                  <div className="flex items-center gap-2 text-primary font-bold text-base">
                    <CreditCard size={18} />
                    <h4>Payment Policy (No COD)</h4>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    We do not offer Cash on Delivery services. All orders must be prepaid through available online payment options at checkout including Credit/Debit cards, UPI, Net Banking, and digital wallets.
                  </p>
                </div>

                {/* Size Guidelines */}
                <div className="p-4 rounded-lg bg-popover/30 border border-primary/20 space-y-2">
                  <div className="flex items-center gap-2 text-primary font-bold text-base">
                    <Ruler size={18} />
                    <h4>Size Guidelines</h4>
                  </div>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-foreground">
                    <li>• Please refer to our size chart before placing your order.</li>
                    <li>• All sizes mentioned on the store are in inches.</li>
                    <li>• Accurate measurements help ensure a perfect fit and prevent sizing issues.</li>
                  </ul>
                </div>
              </div>

              {/* Additional Terms Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-lg bg-popover/20 border border-primary/10 space-y-1">
                  <h5 className="font-bold text-xs sm:text-sm text-foreground">Order Confirmation</h5>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    All orders are subject to product availability and confirmation of the order price.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-popover/20 border border-primary/10 space-y-1">
                  <h5 className="font-bold text-xs sm:text-sm text-foreground">Product Images</h5>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Colors may vary slightly due to studio lighting and screen display settings.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-popover/20 border border-primary/10 space-y-1">
                  <h5 className="font-bold text-xs sm:text-sm text-foreground">Customer Support</h5>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Contact our support team for any product queries before placing your order.
                  </p>
                </div>
              </div>
            </div>
          </InfoCard>

          {/* SECTION 2: PRIVACY POLICY */}
          <InfoCard id="privacy-policy" title="2. Privacy Policy" icon={Lock}>
            <div className="space-y-6">
              <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                We value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you visit our website and make purchases.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 rounded-lg bg-popover/30 border border-primary/20 space-y-2">
                  <h4 className="font-bold text-sm sm:text-base text-foreground flex items-center gap-2">
                    <Lock className="w-4 h-4 text-primary" />
                    Personal & Auto Information We Collect
                  </h4>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-foreground">
                    <li>• Name, email address, phone number, and delivery address.</li>
                    <li>• Payment information (processed securely through encrypted gateways).</li>
                    <li>• Browser type, device details, IP address, and location data.</li>
                    <li>• Cookies and website browsing analytics.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg bg-popover/30 border border-primary/20 space-y-2">
                  <h4 className="font-bold text-sm sm:text-base text-foreground flex items-center gap-2">
                    <Globe className="w-4 h-4 text-primary" />
                    Data Usage & Security
                  </h4>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-foreground">
                    <li>• <strong>Order Processing:</strong> To fulfill purchases and manage logistics.</li>
                    <li>• <strong>Data Security:</strong> SSL encryption applied across all transactions.</li>
                    <li>• <strong>No Data Selling:</strong> We do not sell or rent customer data to third parties.</li>
                    <li>• <strong>Trusted Partners:</strong> Limited sharing only with shipping couriers.</li>
                  </ul>
                </div>
              </div>
            </div>
          </InfoCard>

          {/* SECTION 3: SHIPPING POLICY */}
          <InfoCard id="shipping-policy" title="3. Shipping Policy" icon={Truck}>
            <div className="space-y-6">
              <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                We ensure safe and timely delivery of your orders across India with reliable courier partners.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 rounded-lg bg-popover/30 border border-primary/20 space-y-2">
                  <h4 className="font-bold text-sm sm:text-base text-foreground flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    Coverage & Timelines
                  </h4>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-foreground">
                    <li>• <strong>Delivery Coverage:</strong> Serving 19,000+ PIN codes across India.</li>
                    <li>• <strong>Standard Timeline:</strong> 8 to 9 business days across India.</li>
                    <li>• <strong>Dispatch Note:</strong> Delivery time starts from the parcel dispatch date.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg bg-popover/30 border border-primary/20 space-y-2">
                  <h4 className="font-bold text-sm sm:text-base text-foreground flex items-center gap-2">
                    <Package className="w-4 h-4 text-primary" />
                    Shipping Fees & Packaging
                  </h4>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-foreground">
                    <li>• <strong>Free Shipping:</strong> 100% free delivery on all orders nationwide.</li>
                    <li>• <strong>Packaging:</strong> Tamper-proof outer wrap with protective inner lining.</li>
                    <li>• <strong>Tracking:</strong> Real-time tracking link sent via SMS and Email upon dispatch.</li>
                  </ul>
                </div>
              </div>
            </div>
          </InfoCard>

          {/* SECTION 4: REFUND POLICY */}
          <InfoCard id="refund-policy" title="4. Refund Policy" icon={RotateCcw}>
            <div className="space-y-6">
              <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                Refunds are handled carefully and processed exclusively for store errors as outlined below.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 rounded-lg bg-popover/30 border border-primary/20 space-y-2">
                  <h4 className="font-bold text-sm sm:text-base text-foreground flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-primary" />
                    Returns Accepted Only For Store Errors
                  </h4>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-foreground">
                    <li>• Accepted only if wrong item, wrong size, or defective item is sent.</li>
                    <li>• Full unboxing video proof is mandatory (uncut and continuous from package opening).</li>
                    <li>• Return process must be initiated within 2–3 days of order delivery.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg bg-popover/30 border border-primary/20 space-y-2">
                  <h4 className="font-bold text-sm sm:text-base text-foreground flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    Refund Processing
                  </h4>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-foreground">
                    <li>• <strong>Processing Time:</strong> 5 to 7 business days after item receipt & inspection.</li>
                    <li>• <strong>Credit Method:</strong> Refunded directly to the original payment source.</li>
                    <li>• <strong>Notice:</strong> Returns requested after the 3-day window cannot be accepted.</li>
                  </ul>
                </div>
              </div>
            </div>
          </InfoCard>

          {/* SECTION 5: CANCELLATION POLICY */}
          <InfoCard id="cancellation-policy" title="5. Cancellation Policy" icon={Ban}>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-popover/30 border border-primary/20 space-y-2">
                <h4 className="font-bold text-sm sm:text-base text-foreground flex items-center gap-2">
                  <Ban className="w-4 h-4 text-primary" />
                  Order Cancellation Guidelines
                </h4>
                <ul className="space-y-1.5 text-xs sm:text-sm text-foreground">
                  <li>• Orders cannot be cancelled once payment is confirmed.</li>
                  <li>• Please double-check your order details, size, and address before making payment.</li>
                  <li>• For urgent address corrections before dispatch, email <strong className="text-primary">premika.shop@gmail.com</strong> immediately.</li>
                </ul>
              </div>
            </div>
          </InfoCard>

          {/* 3. Reusable Ending Footer Card */}
          <InfoPageFooter
            storeName="Premika"
            message="We appreciate your understanding and cooperation. For any queries, feel free to contact our customer care team."
            ctaText="Contact Support"
            ctaHref="/contact-us"
          />
        </div>
      </Container>
    </div>
  );
}
