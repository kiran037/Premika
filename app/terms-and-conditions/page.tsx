import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  Clock,
  Package,
  Shield,
  Truck,
  CreditCard,
  RotateCcw,
  Ruler,
} from "lucide-react";

export function generateMetadata() {
  return {
    title: "Terms and Conditions - Premika Store",
    description:
      "Read Premika Store&apos;s terms and conditions including our payment policy, return policy, delivery information, and size guidelines. No COD, prepaid only. 8-9 days delivery.",
    keywords:
      "premika store terms conditions, payment policy, return policy, delivery information, size guidelines, no cod, prepaid only, women clothing terms, fashion store policy",
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
      title: "Terms and Conditions - Premika Store",
      description:
        "Read Premika Store&apos;s terms and conditions including our payment policy, return policy, delivery information, and size guidelines. No COD, prepaid only. 8-9 days delivery.",
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
      title: "Terms and Conditions - Premika Store",
      description:
        "Read Premika Store&apos;s terms and conditions including our payment policy, return policy, delivery information, and size guidelines. No COD, prepaid only. 8-9 days delivery.",
      images: ["https://premika.shop/logo.png"],
    },
    alternates: {
      canonical: "https://premika.shop/terms-and-conditions",
    },
    category: "E-commerce",
  };
}

export default function Component() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-tertiary/10">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary via-tertiary to-primary text-primary-foreground py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <Shield className="h-14 w-12 " />
            <h1 className="text-4xl md:text-6xl font-bold mb-1 tracking-tight text-background">
              Premika Store&apos;s
            </h1>
          </div>
          <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto leading-relaxed text-background">
            Terms & Conditions
          </p>
          <div className="mt-8 h-1 w-24 bg-primary-foreground/30 mx-auto rounded-full"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        {/* Introduction */}
        <Card className="border-l-4 border-l-primary  border-primary shadow-lg bg-[#E0BCA2]">
          <CardContent className="pt-6">
            <p className="text-lg leading-relaxed text-secondary">
              At <span className="font-semibold text-primary">Premika</span>, we
              are committed to providing a transparent and satisfying shopping
              experience. Please review our store policies carefully before
              placing an order. By making a purchase, you agree to these terms
              and conditions.
            </p>
          </CardContent>
        </Card>

        {/* Policy Cards */}
        <div className="space-y-6">
          {/* Row 1: Payment Policy and Size Information in 2 columns */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Payment Policy */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-primary bg-[#E0BCA2]">
              <CardHeader className="bg-gradient-to-r from-tertiary/10 to-primary/5">
                <CardTitle className="flex items-center gap-3 text-2xl text-secondary">
                  <div className=" bg-primary/10 rounded-lg">
                    <CreditCard className="h-6 w-6 text-primary" />
                  </div>
                  Payment Policy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 mt-1 flex-shrink-0 text-foreground" />
                    <div>
                      <h4 className="font-semibold text-lg mb-2 text-secondary">
                        No Cash on Delivery (COD)
                      </h4>
                      <p className="text-secondary leading-relaxed">
                        We do not offer Cash on Delivery services. All orders
                        must be prepaid through the available payment options at
                        checkout including credit/debit cards, UPI, net banking,
                        and digital wallets.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Size Information */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-primary bg-[#E0BCA2]">
              <CardHeader className="bg-gradient-to-r from-tertiary/10 to-primary/5">
                <CardTitle className="flex items-center gap-3 text-2xl text-secondary">
                  <div className=" bg-primary/10 rounded-lg">
                    <Ruler className="h-6 w-6 text-primary" />
                  </div>
                  Size Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-tertiary/10 border border-[#B67B5C] rounded-lg p-4">
                    <h4 className="font-semibold text-lg mb-3 text-secondary">
                      Important Size Guidelines
                    </h4>
                    <ul className="space-y-2 ml-4">
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-secondary">
                          Please refer to our size chart before placing your
                          order
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-secondary">
                          All sizes mentioned are in inches
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-secondary">
                          Accurate measurements help ensure a perfect fit and
                          avoid sizing issues
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Row 2: Return & Exchange Policy with 2 columns */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-primary bg-[#E0BCA2]">
            <CardHeader className="bg-gradient-to-r from-tertiary/10 to-primary/5">
              <CardTitle className="flex items-center gap-3 text-2xl text-secondary">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <RotateCcw className="h-6 w-6 text-primary" />
                </div>
                Return & Exchange Policy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
                  <h4 className="font-semibold text-lg mb-2 text-foreground">
                    General Policy
                  </h4>
                  <p className="text-secondary leading-relaxed">
                    We do not accept returns, refunds, or exchanges unless the
                    error is from our side. Kindly double-check your order
                    details, size, and color before confirming your purchase.
                  </p>
                </div>

                <div className="bg-primary/5 border border-secondary rounded-lg p-4">
                  <h4 className="font-semibold text-lg mb-3 text-primary">
                    Returns Accepted Only For Store Errors
                  </h4>
                  <div className="space-y-3">
                    <p className="text-secondary">
                      Returns will be accepted only if:
                    </p>
                    <ul className="space-y-2 ml-4">
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-secondary">
                          We sent the wrong item, wrong size, or a defective
                          product
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-secondary">
                          A full unboxing video is provided as proof — the video
                          must be uncut and continuous from the moment the
                          package is opened
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-secondary">
                          The return process is initiated within 2–3 days of
                          receiving the order
                        </span>
                      </li>
                    </ul>
                    <p className="text-sm text-secondary mt-3">
                      Returns requested after this window will not be accepted.
                      Refunds (if applicable) will be processed after we receive
                      and inspect the returned item.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Row 3: Additional Terms */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-primary  bg-[#E0BCA2]">
            <CardHeader className="bg-gradient-to-r from-tertiary/10 to-primary/5">
              <CardTitle className="flex items-center gap-3 text-2xl text-secondary">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                Additional Terms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-semibold mb-2 text-secondary">
                      Order Confirmation
                    </h4>
                    <p className="text-sm text-secondary">
                      All orders are subject to availability and confirmation of
                      the order price.
                    </p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-semibold mb-2 text-secondary">
                      Product Images
                    </h4>
                    <p className="text-sm text-secondary">
                      Colors may vary slightly due to screen settings and
                      lighting conditions.
                    </p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-semibold mb-2 text-secondary">
                      Customer Support
                    </h4>
                    <p className="text-sm text-secondary">
                      Contact our support team for any queries before placing
                      your order.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cancellation and Refunds */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-primary bg-[#E0BCA2]">
            <CardHeader className="bg-gradient-to-r from-tertiary/10 to-primary/5">
              <CardTitle className="flex items-center gap-3 text-2xl text-secondary">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <RotateCcw className="h-6 w-6 text-primary" />
                </div>
                Cancellation and Refunds
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
                  <h4 className="font-semibold text-lg mb-3 text-foreground">
                    Order Cancellation
                  </h4>
                  <ul className="space-y-2 ml-4">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-secondary">
                        Orders cannot be cancelled once payment is confirmed
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-secondary">
                        Please double-check your order before making payment
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="bg-primary/5 border border-secondary rounded-lg p-4">
                  <h4 className="font-semibold text-lg mb-3 text-primary">
                    Refund Policy
                  </h4>
                  <ul className="space-y-2 ml-4">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-secondary">
                        Refunds are processed only for store errors
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-secondary">
                        Refund processing time: 5-7 business days after item
                        return
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-secondary">
                        Refunds will be credited to the original payment method
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <Card className="bg-gradient-to-r from-primary/5 via-tertiary/5 to-primary/5 border-primary ">
          <CardContent className="pt-6 text-center text-secondary">
            <p className="text-lg font-medium mb-2">
              We appreciate your understanding and cooperation.
            </p>
            <p className="text-foreground/70 mb-4">
              For any queries, feel free to contact our support team before
              placing your order.
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-2 text-primary font-semibold text-lg sm:text-xl">
              <span>Thank you for shopping with</span>
              <span className="bg-primary text-primary-foreground px-3 py-1 rounded-lg inline-block">
                Premika!
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
