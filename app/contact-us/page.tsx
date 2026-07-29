import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Mail,
  Phone,
  Clock,
  MessageCircle,
  MapPin,
  HeadphonesIcon,
} from "lucide-react";
import { getStoreInformation } from "@/lib/store/get-store-information";

export async function generateMetadata() {
  const storeInfo = await getStoreInformation();

  return {
    title: `Contact Us - ${storeInfo.storeName}`,
    description:
      `Get in touch with ${storeInfo.storeName} for any questions about our products, orders, or policies. Email support available with 24-48 hour response time. We're here to help!`,
    keywords:
      `${storeInfo.storeName.toLowerCase()} contact, customer support, email support, contact ${storeInfo.storeName.toLowerCase()}, fashion store contact, women clothing support, order queries, product questions`,
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
      description:
        `Get in touch with ${storeInfo.storeName} for any questions about our products, orders, or policies. Email support available with 24-48 hour response time. We're here to help!`,
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
      description:
        `Get in touch with ${storeInfo.storeName} for any questions about our products, orders, or policies. Email support available with 24-48 hour response time. We're here to help!`,
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-tertiary/10">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary via-tertiary to-primary text-primary-foreground py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <HeadphonesIcon className="h-14 w-12" />
            <h1 className="text-4xl md:text-6xl font-bold mb-1 tracking-tight text-background">
              Contact Us
            </h1>
          </div>
          <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto leading-relaxed text-background">
            We&apos;re here to help you with any questions or concerns
          </p>
          <div className="mt-8 h-1 w-24 bg-primary-foreground/30 mx-auto rounded-full"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        {/* Introduction */}
        <Card className="border-l-4 border-l-primary border-primary shadow-lg bg-[#E0BCA2]">
          <CardContent className="pt-6">
            <p className="text-lg leading-relaxed text-secondary">
              At <span className="font-semibold text-primary">{storeInfo.storeName}</span>, we
              value your questions and feedback. Whether you need help with your
              order, have product inquiries, or need assistance with our
              policies, our dedicated support team is ready to assist you.
            </p>
          </CardContent>
        </Card>

        {/* Contact Methods */}
        <div className="space-y-6">
          {/* Primary Contact Methods */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Email Support */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-primary bg-[#E0BCA2]">
              <CardHeader className="bg-gradient-to-r from-tertiary/10 to-primary/5">
                <CardTitle className="flex items-center gap-3 text-2xl text-secondary">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  Email Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-primary/5 border border-secondary rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Mail className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-secondary">
                          Email Address
                        </p>
                        <p className="text-lg font-semibold text-primary">
                          {storeInfo.supportEmail}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-secondary">
                          Response Time
                        </p>
                        <p className="text-secondary">24-48 hours</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Phone Support */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-primary bg-[#E0BCA2]">
              <CardHeader className="bg-gradient-to-r from-tertiary/10 to-primary/5">
                <CardTitle className="flex items-center gap-3 text-2xl text-secondary">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  Phone Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-primary/5 border border-secondary rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Phone className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-secondary">
                          Phone Number
                        </p>
                        <p className="text-lg font-semibold text-primary">
                          <a
                            href={`tel:${storeInfo.supportPhone.replace(/\s+/g, "")}`}
                            className="hover:text-secondary transition-colors"
                          >
                            {storeInfo.supportPhone}
                          </a>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-secondary">
                          Available Hours
                        </p>
                        <p className="text-secondary">
                          {storeInfo.businessHours}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information Details */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-primary bg-[#E0BCA2]">
            <CardHeader className="bg-gradient-to-r from-tertiary/10 to-primary/5">
              <CardTitle className="flex items-center gap-3 text-2xl text-secondary">
                <div className="bg-primary/10 rounded-lg">
                  <MessageCircle className="h-6 w-6 text-primary" />
                </div>
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-tertiary/10 border border-secondary rounded-lg p-6">
                  <h4 className="font-semibold text-lg mb-3 text-secondary">
                    What to Include in Your Message
                  </h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-secondary">
                        Your order number (if applicable)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-secondary">
                        Registered email address
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-secondary">
                        Detailed description of your query
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-secondary">
                        Any relevant photos or screenshots
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="bg-primary/5 border border-secondary rounded-lg p-6">
                  <h4 className="font-semibold text-lg mb-3 text-primary">
                    Preferred Contact Methods
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-primary" />
                      <span className="text-secondary">
                        Email for detailed queries and order support
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-primary" />
                      <span className="text-secondary">
                        Phone for urgent inquiries during business hours
                      </span>
                    </div>
                    <div className="bg-muted/30 border border-primary rounded-lg p-3 mt-4">
                      <p className="text-foreground text-sm">
                        <strong>Tip:</strong> For faster resolution, email us
                        with all relevant details first.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business Hours & Response Times */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="group hover:shadow-xl transition-all duration-300 border-primary bg-[#E0BCA2]">
              <CardHeader className="bg-gradient-to-r from-tertiary/10 to-primary/5">
                <CardTitle className="flex items-center gap-3 text-2xl text-secondary">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  Response Times
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-primary/5 border border-secondary rounded-lg p-4">
                    <h4 className="font-semibold text-lg mb-3 text-primary">
                      Email Support Hours
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-secondary">Monday - Friday</span>
                        <span className="font-medium text-secondary">
                          9 AM - 6 PM IST
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-secondary">Saturday</span>
                        <span className="font-medium text-secondary">
                          10 AM - 4 PM IST
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-secondary">Sunday</span>
                        <span className="font-medium text-secondary">
                          Closed
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-muted/30 border border-primary rounded-lg p-3">
                    <p className="text-amber-800 text-sm">
                      <strong>Note:</strong> We respond to all emails within
                      24-48 hours, even on weekends.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-primary bg-[#E0BCA2]">
              <CardHeader className="bg-gradient-to-r from-tertiary/10 to-primary/5">
                <CardTitle className="flex items-center gap-3 text-2xl text-secondary">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  Store Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-tertiary/10 border border-[#B67B5C] rounded-lg p-4">
                    <h4 className="font-semibold text-lg mb-3 text-secondary">
                      {storeInfo.storeName}
                    </h4>
                    <div className="space-y-2 text-secondary">
                      <p>🌐 {storeInfo.formattedAddress}</p>
                      <p>📧 {storeInfo.supportEmail}</p>
                      <p>📞 {storeInfo.supportPhone}</p>
                      <p>🛍️ Handpicked Women&apos;s Fashion</p>
                    </div>
                  </div>
                  <div className="bg-muted/30 border border-primary rounded-lg p-3">
                    <p className="text-foreground text-sm">
                      <strong>Quality Promise:</strong> We&apos;re committed to
                      providing excellent customer service and high-quality
                      products.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Quick Links */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-primary bg-[#E0BCA2]">
            <CardHeader className="bg-gradient-to-r from-tertiary/10 to-primary/5">
              <CardTitle className="flex items-center gap-3 text-2xl text-secondary">
                <div className=" bg-primary/10 rounded-lg">
                  <MessageCircle className="h-6 w-6 text-primary" />
                </div>
                Before You Contact Us
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-muted/30 border border-primary rounded-lg p-4">
                  <h4 className="font-semibold text-lg mb-3 text-foreground">
                    Quick Answers
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p className="text-foreground">
                      <strong>Delivery Time:</strong> 8-9 business days across
                      India
                    </p>
                    <p className="text-foreground">
                      <strong>Payment:</strong> No COD - Prepaid orders only
                    </p>
                    <p className="text-foreground">
                      <strong>Returns:</strong> Only for store errors with
                      unboxing video
                    </p>
                    <p className="text-foreground">
                      <strong>Shipping:</strong> Free shipping on all orders
                    </p>
                  </div>
                </div>

                <div className="bg-muted/30 border border-primary rounded-lg p-4">
                  <h4 className="font-semibold text-lg mb-3 text-orange-800">
                    Policy Pages
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p className="text-foreground">
                      📋 Check our <strong>Terms & Conditions</strong> for order
                      policies
                    </p>
                    <p className="text-foreground   ">
                      🚚 Review our <strong>Shipping Policy</strong> for
                      delivery details
                    </p>
                    <p className="text-foreground">
                      🔒 Read our <strong>Privacy Policy</strong> for data
                      protection
                    </p>
                    <p className="text-foreground">
                      📏 Use our <strong>Size Chart</strong> for accurate
                      fitting
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <Card className="bg-gradient-to-r from-primary/5 via-tertiary/5 to-primary/5 border-primary">
          <CardContent className="pt-6 text-center text-secondary">
            <p className="text-lg font-medium mb-2">
              We&apos;re here to make your shopping experience exceptional.
            </p>
            <p className="text-foreground/70 mb-4">
              Don&apos;t hesitate to reach out with any questions or concerns.
              Your satisfaction is our priority.
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-2 text-primary font-semibold text-lg sm:text-xl">
              <span>Thank you for choosing</span>
              <span className="bg-primary text-primary-foreground px-3 py-1 rounded-lg inline-block">
                {storeInfo.storeName}!
              </span>
            </div>
            <p className="text-sm text-foreground/50 mt-4">
              Last updated:{" "}
              {new Date().toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
