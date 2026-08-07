import Link from "next/link";
import Container from "@/components/ui/container";
import InfoPageHeader from "@/components/ui/info-page-header";
import InfoCard from "@/components/ui/info-card";
import InfoPageFooter from "@/components/ui/info-page-footer";
import {
  Mail,
  Phone,
  Clock,
  MessageCircle,
  MapPin,
  HeadphonesIcon,
  FileText,
  Truck,
  ShieldCheck,
  HelpCircle,
  CheckCircle2,
  Info,
  RotateCcw,
  Ban,
} from "lucide-react";
import { getStoreInformation } from "@/lib/store/get-store-information";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const storeInfo = await getStoreInformation();

  return {
    title: `Contact Us - ${storeInfo.storeName}`,
    description: `Get in touch with ${storeInfo.storeName} for any questions about our products, orders, or policies. Email support available with 24-48 hour response time. We're here to help!`,
    keywords: `${storeInfo.storeName.toLowerCase()} contact, customer support, email support, contact ${storeInfo.storeName.toLowerCase()}, fashion store contact, women clothing support, order queries, product questions`,
    authors: [{ name: storeInfo.storeName }],
    creator: storeInfo.storeName,
    publisher: storeInfo.storeName,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL("https://premika.shop"),
    applicationName: storeInfo.storeName,
    referrer: "origin-when-cross-origin",
    verification: {
      google: "google-site-verification-code",
      yandex: "yandex-verification-code",
      yahoo: "yahoo-site-verification-code",
    },
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
      url: "https://premika.shop/contact-us",
      siteName: storeInfo.storeName,
      title: `Contact Us - ${storeInfo.storeName}`,
      description: `Get in touch with ${storeInfo.storeName} for any questions about our products, orders, or policies. Email support available with 24-48 hour response time. We're here to help!`,
      images: [
        {
          url: "https://premika.shop/logo.png",
          width: 1200,
          height: 630,
          alt: `${storeInfo.storeName} Contact Us`,
          type: "image/png",
        },
      ],
      emails: [storeInfo.supportEmail],
      phoneNumbers: [storeInfo.supportPhone],
      countryName: storeInfo.country || "India",
    },
    twitter: {
      card: "summary_large_image",
      site: "@premika_store",
      creator: "@premika_store",
      title: `Contact Us - ${storeInfo.storeName}`,
      description: `Get in touch with ${storeInfo.storeName} for any questions about our products, orders, or policies. Email support available with 24-48 hour response time. We're here to help!`,
      images: [
        {
          url: "https://premika.shop/logo.png",
          alt: `${storeInfo.storeName} Contact Us`,
        },
      ],
    },
    alternates: {
      canonical: "https://premika.shop/contact-us",
      languages: {
        "en-IN": "https://premika.shop/contact-us",
        "x-default": "https://premika.shop/contact-us",
      },
    },
    category: "E-commerce",
    classification: "Customer Support",
    other: {
      "contact:email": storeInfo.supportEmail,
      "contact:phone": storeInfo.supportPhone,
      "business:hours": storeInfo.businessHours,
      "support:response_time": "24-48 hours",
    },
  };
}

export function generateViewport() {
  return {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    themeColor: [
      { media: "(prefers-color-scheme: light)", color: "#B67B5C" },
      { media: "(prefers-color-scheme: dark)", color: "#B67B5C" },
    ],
  };
}

export default async function ContactUs() {
  const storeInfo = await getStoreInformation();

  return (
    <div className="min-h-screen bg-background">
      {/* 1. Shared Header Banner */}
      <InfoPageHeader
        badge="Customer Support"
        icon={HeadphonesIcon}
        title="Contact Us"
        subtitle="We're here to help you with any questions about our designer collections, orders, or store policies."
      />

      {/* 2. Main Content inside Storefront Container */}
      <Container>
        <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6 sm:space-y-8 max-w-5xl mx-auto">
          {/* Welcome Intro Banner Card */}
          <InfoCard borderAccent className="bg-popover/20">
            <p className="text-sm sm:text-base md:text-lg leading-relaxed text-foreground">
              At <span className="font-semibold text-primary">{storeInfo.storeName}</span>, we value your questions and feedback. Learn more about our story on our{" "}
              <Link href="/about-us" className="text-primary underline font-semibold hover:text-secondary">
                About Us
              </Link>{" "}
              page or review our complete{" "}
              <Link href="/terms-and-conditions" className="text-primary underline font-semibold hover:text-secondary">
                Terms & Conditions
              </Link>.
            </p>
          </InfoCard>

          {/* Primary Contact Channels Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email Support Card */}
            <InfoCard title="Email Support" icon={Mail}>
              <div className="space-y-4">
                <div className="bg-popover/30 border border-primary/20 rounded-lg p-4 sm:p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="p-2 rounded-md bg-primary/10 text-primary mt-0.5">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                        Email Address
                      </p>
                      <a
                        href={`mailto:${storeInfo.supportEmail}`}
                        className="text-base sm:text-lg font-bold text-primary hover:underline break-all"
                      >
                        {storeInfo.supportEmail}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 pt-3 border-t border-primary/10">
                    <div className="p-2 rounded-md bg-primary/10 text-primary mt-0.5">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                        Response Time
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        24-48 hours (Mon-Sat)
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Best for order inquiries, sizing assistance, and custom requests.
                </p>
              </div>
            </InfoCard>

            {/* Phone Support Card */}
            <InfoCard title="Phone Support" icon={Phone}>
              <div className="space-y-4">
                <div className="bg-popover/30 border border-primary/20 rounded-lg p-4 sm:p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="p-2 rounded-md bg-primary/10 text-primary mt-0.5">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                        Phone Number
                      </p>
                      <a
                        href={`tel:${storeInfo.supportPhone.replace(/\s+/g, "")}`}
                        className="text-base sm:text-lg font-bold text-primary hover:underline"
                      >
                        {storeInfo.supportPhone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 pt-3 border-t border-primary/10">
                    <div className="p-2 rounded-md bg-primary/10 text-primary mt-0.5">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                        Available Hours
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {storeInfo.businessHours}
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Direct hotline during operating hours for urgent queries.
                </p>
              </div>
            </InfoCard>
          </div>

          {/* Contact Guidelines & Preferred Methods */}
          <InfoCard title="Support Guidelines" icon={MessageCircle}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-popover/20 border border-primary/20 rounded-lg p-4 sm:p-5">
                <h4 className="font-bold text-base sm:text-lg text-foreground mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  What to Include in Your Message
                </h4>
                <ul className="space-y-2.5 text-xs sm:text-sm text-foreground">
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span>Your Order ID (e.g. #PREMIKA-1024)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span>Registered email address or mobile number</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span>Clear description of your query or issue</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span>Photos/uncut unboxing video for defective item reports</span>
                  </li>
                </ul>
              </div>

              <div className="bg-popover/20 border border-primary/20 rounded-lg p-4 sm:p-5 space-y-3">
                <h4 className="font-bold text-base sm:text-lg text-foreground mb-3 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-primary" />
                  Support Communication Tips
                </h4>
                <div className="space-y-2 text-xs sm:text-sm text-foreground">
                  <p className="flex items-start gap-2">
                    <Mail className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span><strong>Email</strong> for order modifications, returns & custom fitting requests.</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <Phone className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span><strong>Phone</strong> for urgent address edits prior to dispatch.</span>
                  </p>
                </div>
                <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-md">
                  <p className="text-xs text-foreground leading-relaxed">
                    <strong>Tip:</strong> Including your order number in email subjects ensures faster ticket routing.
                  </p>
                </div>
              </div>
            </div>
          </InfoCard>

          {/* Operating Hours & Store Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoCard title="Business Hours" icon={Clock}>
              <div className="space-y-3">
                <div className="bg-popover/30 border border-primary/20 rounded-lg p-4 space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between items-center py-1 border-b border-primary/10">
                    <span className="text-muted-foreground">Monday - Friday</span>
                    <span className="font-semibold text-foreground">9:00 AM - 6:00 PM IST</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-primary/10">
                    <span className="text-muted-foreground">Saturday</span>
                    <span className="font-semibold text-foreground">10:00 AM - 4:00 PM IST</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-muted-foreground">Sunday & Holidays</span>
                    <span className="font-semibold text-primary">Support via Email Only</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Emails sent on Sunday are queued and prioritized first thing Monday morning.
                </p>
              </div>
            </InfoCard>

            <InfoCard title="Store Location" icon={MapPin}>
              <div className="space-y-3">
                <div className="bg-popover/30 border border-primary/20 rounded-lg p-4 space-y-2 text-xs sm:text-sm text-foreground">
                  <p className="font-bold text-primary text-base">{storeInfo.storeName}</p>
                  <p className="flex items-center gap-2">🌐 {storeInfo.formattedAddress}</p>
                  <p className="flex items-center gap-2">📧 {storeInfo.supportEmail}</p>
                  <p className="flex items-center gap-2">📞 {storeInfo.supportPhone}</p>
                  <p className="flex items-center gap-2">🛍️ Handcrafted Women&apos;s Ethnic Wear</p>
                </div>
              </div>
            </InfoCard>
          </div>

          {/* FAQ & Policy Links Section */}
          <InfoCard title="Before You Contact Us" icon={HelpCircle}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-popover/20 border border-primary/20 rounded-lg p-4 sm:p-5">
                <h4 className="font-bold text-base text-foreground mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  Quick Store Facts
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-foreground">
                  <li><strong>Delivery:</strong> 8-9 business days across India</li>
                  <li><strong>Payment:</strong> Prepaid only (UPI, Netbanking, Cards)</li>
                  <li><strong>Shipping:</strong> Free delivery on all orders</li>
                  <li><strong>Returns:</strong> Store errors only (with unboxing video)</li>
                </ul>
              </div>

              <div className="bg-popover/20 border border-primary/20 rounded-lg p-4 sm:p-5">
                <h4 className="font-bold text-base text-foreground mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Store Policy Pages & Sections
                </h4>
                <div className="grid grid-cols-1 gap-2 text-xs sm:text-sm">
                  <Link
                    href="/about-us"
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-primary/10 text-primary font-medium transition-colors border border-transparent hover:border-primary/20"
                  >
                    <Info size={16} />
                    <span>About Us</span>
                  </Link>

                  <Link
                    href="/terms-and-conditions"
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-primary/10 text-primary font-medium transition-colors border border-transparent hover:border-primary/20"
                  >
                    <FileText size={16} />
                    <span>Terms & Conditions</span>
                  </Link>

                  <Link
                    href="/terms-and-conditions#privacy-policy"
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-primary/10 text-primary font-medium transition-colors border border-transparent hover:border-primary/20"
                  >
                    <ShieldCheck size={16} />
                    <span>Privacy Policy Section</span>
                  </Link>

                  <Link
                    href="/terms-and-conditions#shipping-policy"
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-primary/10 text-primary font-medium transition-colors border border-transparent hover:border-primary/20"
                  >
                    <Truck size={16} />
                    <span>Shipping Policy Section</span>
                  </Link>

                  <Link
                    href="/terms-and-conditions#refund-policy"
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-primary/10 text-primary font-medium transition-colors border border-transparent hover:border-primary/20"
                  >
                    <RotateCcw size={16} />
                    <span>Refund Policy Section</span>
                  </Link>

                  <Link
                    href="/terms-and-conditions#cancellation-policy"
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-primary/10 text-primary font-medium transition-colors border border-transparent hover:border-primary/20"
                  >
                    <Ban size={16} />
                    <span>Cancellation Policy Section</span>
                  </Link>
                </div>
              </div>
            </div>
          </InfoCard>

          {/* 3. Reusable Ending Footer Card */}
          <InfoPageFooter
            storeName={storeInfo.storeName}
            message="Your satisfaction is our priority. Reach out anytime with questions about our handcrafted ethnic kurtis and dresses."
            ctaText="Explore Collection"
            ctaHref="/shop"
          />
        </div>
      </Container>
    </div>
  );
}
