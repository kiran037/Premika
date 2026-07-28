import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Truck,
  Package,
  Clock,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Phone,
  Shield,
} from "lucide-react";

export default function ShippingPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-tertiary/10">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary via-tertiary to-primary text-primary-foreground py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <Truck className="h-14 w-12" />
            <h1 className="text-4xl md:text-6xl font-bold mb-1 tracking-tight text-background">
              Premika Store&apos;s
            </h1>
          </div>
          <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto leading-relaxed text-background">
            Shipping Policy
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
              At <span className="font-semibold text-primary">Premika</span>, we
              ensure safe and timely delivery of your orders. Please review our
              shipping policies to understand our delivery process, timelines,
              and terms.
            </p>
          </CardContent>
        </Card>

        {/* Policy Cards */}
        <div className="space-y-6">
          {/* Shipping Areas & Delivery Time */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-primary bg-[#E0BCA2]">
            <CardHeader className="bg-gradient-to-r from-tertiary/10 to-primary/5">
              <CardTitle className="flex items-center gap-3 text-2xl text-secondary">
                <div className="bg-primary/10 rounded-lg">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                Shipping Areas & Delivery Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-muted/30 border border-primary rounded-lg p-4">
                  <h4 className="font-semibold text-lg mb-3 text-foreground">
                    Delivery Coverage
                  </h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-foreground mt-1 flex-shrink-0" />
                      <span className="text-foreground">
                        All major cities across India
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-foreground mt-1 flex-shrink-0" />
                      <span className="text-foreground">
                        Tier 2 and Tier 3 cities
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-foreground mt-1 flex-shrink-0" />
                      <span className="text-foreground">
                        Most PIN codes serviceable
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-foreground mt-1 flex-shrink-0" />
                      <span className="text-foreground">
                        Remote areas may take additional time
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="bg-muted/30 border border-primary rounded-lg p-4">
                  <h4 className="font-semibold text-lg mb-3 text-foreground">
                    Delivery Timeline
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">
                          Standard Delivery
                        </p>
                        <p className="text-sm text-foreground">
                          8-9 business days
                        </p>
                      </div>
                    </div>
                    <div className="bg-muted/30 p-3 rounded-md">
                      <p className="text-sm text-foreground">
                        <strong>Note:</strong> Delivery time starts counting
                        from the day your order is shipped, not from the day it
                        was placed.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Process */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-primary bg-[#E0BCA2]">
            <CardHeader className="bg-gradient-to-r from-tertiary/10 to-primary/5">
              <CardTitle className="flex items-center gap-3 text-2xl text-secondary">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                Shipping Process
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted/30 rounded-lg border border-primary">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-primary font-bold text-lg">1</span>
                    </div>
                    <h4 className="font-semibold text-foreground mb-2">
                      Order Confirmation
                    </h4>
                    <p className="text-sm text-foreground">
                      Your order is confirmed and payment is processed
                    </p>
                  </div>

                  <div className="text-center p-4 bg-muted/30 rounded-lg border border-primary">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-primary font-bold text-lg">2</span>
                    </div>
                    <h4 className="font-semibold text-foreground mb-2">
                      Processing
                    </h4>
                    <p className="text-sm text-foreground">
                      Your order is packed and prepared for shipping
                    </p>
                  </div>

                  <div className="text-center p-4 bg-muted/30 rounded-lg border border-primary">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-primary font-bold text-lg">3</span>
                    </div>
                    <h4 className="font-semibold text-foreground mb-2">
                      Shipped
                    </h4>
                    <p className="text-sm text-foreground">
                      Your order is dispatched with tracking details
                    </p>
                  </div>
                </div>

                <div className="bg-muted/30 rounded-lg p-4">
                  <h4 className="font-semibold mb-2 text-foreground flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    Order Tracking
                  </h4>
                  <p className="text-sm text-foreground">
                    Once your order is shipped, you will receive a tracking
                    number via SMS and email. You can track your package in
                    real-time using this tracking ID.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Charges & Packaging in 2 columns */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Shipping Charges */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-primary bg-[#E0BCA2]">
              <CardHeader className="bg-gradient-to-r from-tertiary/10 to-primary/5">
                <CardTitle className="flex items-center gap-3 text-2xl text-secondary">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  Shipping Charges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-muted/30 border border-primary rounded-lg p-4">
                    <h4 className="font-semibold text-lg mb-2 text-foreground flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Free Shipping
                    </h4>
                    <p className="text-foreground text-sm mb-2">
                      We offer free shipping on all orders across India!
                    </p>
                    <ul className="space-y-1 text-sm text-foreground">
                      <li>• No minimum order value required</li>
                      <li>• No hidden charges</li>
                      <li>• Applicable to all PIN codes we serve</li>
                    </ul>
                  </div>

                  <div className="bg-muted/30 border border-primary rounded-lg p-3">
                    <p className="text-foreground text-sm">
                      <strong>Note:</strong> Remote locations might have slight
                      delays but no additional charges.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Packaging */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-primary bg-[#E0BCA2]">
              <CardHeader className="bg-gradient-to-r from-tertiary/10 to-primary/5">
                <CardTitle className="flex items-center gap-3 text-2xl text-secondary">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  Packaging
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-muted/30 border border-primary rounded-lg p-4">
                    <h4 className="font-semibold text-lg mb-3 text-foreground">
                      Safe & Secure Packaging
                    </h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-foreground">
                          High-quality packaging materials
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-foreground">
                          Bubble wrap protection for delicate items
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-foreground">
                          Branded packaging with care instructions
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-foreground">
                          Tamper-proof sealing
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Delivery Issues & Important Notes */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-primary bg-[#E0BCA2]">
            <CardHeader className="bg-gradient-to-r from-tertiary/10 to-primary/5">
              <CardTitle className="flex items-center gap-3 text-2xl text-secondary">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-primary" />
                </div>
                Delivery Guidelines & Important Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-muted/30 border border-primary rounded-lg p-4">
                    <h4 className="font-semibold text-lg mb-3 text-foreground">
                      Delivery Attempts
                    </h4>
                    <ul className="space-y-2 text-sm text-foreground">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>
                          Our delivery partner will make 3 delivery attempts
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>
                          Please ensure someone is available to receive the
                          package
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>
                          If all attempts fail, the package will be returned
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-muted/30 border border-primary rounded-lg p-4">
                    <h4 className="font-semibold text-lg mb-2 text-foreground">
                      Address Requirements
                    </h4>
                    <p className="text-sm text-foreground">
                      Please provide complete and accurate address details
                      including landmarks, PIN code, and a working phone number
                      for smooth delivery.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-muted/30 border border-primary rounded-lg p-4">
                    <h4 className="font-semibold text-lg mb-3 text-foreground">
                      Undeliverable Orders
                    </h4>
                    <ul className="space-y-2 text-sm text-foreground">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>Incorrect/incomplete address</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>
                          Customer not available after multiple attempts
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>Refused to accept delivery</span>
                      </li>
                    </ul>
                    <p className="text-xs text-foreground mt-2">
                      *Return shipping charges may apply for undeliverable
                      orders
                    </p>
                  </div>

                  <div className="bg-muted/30 border border-primary rounded-lg p-4">
                    <h4 className="font-semibold text-lg mb-2 text-foreground">
                      Delivery Confirmation
                    </h4>
                    <p className="text-sm text-foreground">
                      Please inspect your package upon delivery and report any
                      damage or discrepancies immediately to our customer
                      support.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-primary bg-[#E0BCA2]">
            <CardHeader className="bg-gradient-to-r from-tertiary/10 to-primary/5">
              <CardTitle className="flex items-center gap-3 text-2xl text-secondary">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                Shipping Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 bg-muted/30 border border-primary rounded-lg">
                  <h4 className="font-semibold mb-2 text-foreground">
                    Delivery Issues
                  </h4>
                  <p className="text-sm text-foreground mb-2">
                    If you face any issues with delivery, tracking, or package
                    condition, please contact our support team immediately.
                  </p>
                  <p className="text-sm text-primary font-medium">
                    We will resolve your concern within 24 hours.
                  </p>
                </div>
                <div className="p-4 bg-muted/30 border border-primary rounded-lg">
                  <h4 className="font-semibold mb-2 text-foreground">
                    Track Your Order
                  </h4>
                  <p className="text-sm text-foreground">
                    Use the tracking number provided in your shipping
                    confirmation email to track your package in real-time on our
                    website or the courier partner&apos;s website.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <Card className="bg-gradient-to-r from-primary/5 via-tertiary/5 to-primary/5 border-primary">
          <CardContent className="pt-6 text-center text-secondary">
            <p className="text-lg font-medium mb-2">
              We are committed to delivering your orders safely and on time.
            </p>
            <p className="text-foreground/70 mb-4">
              For any shipping-related queries, our customer support team is
              here to help.
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-2 text-primary font-semibold text-lg sm:text-xl">
              <span>Thank you for choosing</span>
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
