import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Eye,
  Lock,
  UserCheck,
  Database,
  Globe,
  Mail,
  Cookie,
} from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-tertiary/10">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary via-tertiary to-primary text-primary-foreground py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <Shield className="h-14 w-12" />
            <h1 className="text-4xl md:text-6xl font-bold mb-1 tracking-tight text-background">
              Premika Store&apos;s
            </h1>
          </div>
          <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto leading-relaxed text-background">
            Privacy Policy
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
              value your privacy and are committed to protecting your personal
              information. This Privacy Policy explains how we collect, use, and
              safeguard your data when you visit our website and make purchases.
            </p>
          </CardContent>
        </Card>

        {/* Policy Cards */}
        <div className="space-y-6">
          {/* Information We Collect */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-primary bg-[#E0BCA2]">
            <CardHeader className="bg-gradient-to-r from-tertiary/10 to-primary/5">
              <CardTitle className="flex items-center gap-3 text-2xl text-secondary">
                <div className="bg-primary/10 rounded-lg">
                  <Database className="h-6 w-6 text-primary" />
                </div>
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-primary/5 border border-secondary rounded-lg p-4">
                  <h4 className="font-semibold text-lg mb-3 text-primary">
                    Personal Information
                  </h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-secondary">
                        Name and contact details
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-secondary">
                        Email address and phone number
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-secondary">
                        Shipping and billing addresses
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-secondary">
                        Payment information (processed securely)
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="bg-tertiary/10 border border-[#B67B5C] rounded-lg p-4">
                  <h4 className="font-semibold text-lg mb-3 text-secondary">
                    Automatic Information
                  </h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-secondary">
                        Browser type and device information
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-secondary">
                        IP address and location data
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-secondary">
                        Website usage patterns
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-secondary">
                        Cookies and tracking technologies
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Your Information */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-primary bg-[#E0BCA2]">
            <CardHeader className="bg-gradient-to-r from-tertiary/10 to-primary/5">
              <CardTitle className="flex items-center gap-3 text-2xl text-secondary">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <UserCheck className="h-6 w-6 text-primary" />
                </div>
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-semibold mb-2 text-secondary">
                      Order Processing
                    </h4>
                    <p className="text-sm text-secondary">
                      To process and fulfill your orders, including payment
                      processing and shipping.
                    </p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-semibold mb-2 text-secondary">
                      Customer Support
                    </h4>
                    <p className="text-sm text-secondary">
                      To provide customer service and respond to your inquiries.
                    </p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-semibold mb-2 text-secondary">
                      Marketing Communications
                    </h4>
                    <p className="text-sm text-secondary">
                      To send promotional offers and updates (with your
                      consent).
                    </p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-semibold mb-2 text-secondary">
                      Website Improvement
                    </h4>
                    <p className="text-sm text-secondary">
                      To analyze website usage and improve our services.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Protection & Security in 2 columns */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Data Protection */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-primary bg-[#E0BCA2]">
              <CardHeader className="bg-gradient-to-r from-tertiary/10 to-primary/5">
                <CardTitle className="flex items-center gap-3 text-2xl text-secondary">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Lock className="h-6 w-6 text-primary" />
                  </div>
                  Data Security
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-primary/5 border border-secondary rounded-lg p-4">
                    <h4 className="font-semibold text-lg mb-3 text-primary">
                      Security Measures
                    </h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-secondary">
                          SSL encryption for all data transmission
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-secondary">
                          Secure payment processing through trusted gateways
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-secondary">
                          Regular security audits and updates
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-secondary">
                          Limited access to personal data
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Information Sharing */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-primary bg-[#E0BCA2]">
              <CardHeader className="bg-gradient-to-r from-tertiary/10 to-primary/5">
                <CardTitle className="flex items-center gap-3 text-2xl text-secondary">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Globe className="h-6 w-6 text-primary" />
                  </div>
                  Information Sharing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
                    <h4 className="font-semibold text-lg mb-2 text-foreground">
                      We Do Not Sell Your Data
                    </h4>
                    <p className="text-secondary leading-relaxed mb-3">
                      We do not sell, trade, or rent your personal information
                      to third parties.
                    </p>
                    <h5 className="font-medium text-secondary mb-2">
                      Limited Sharing Only With:
                    </h5>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-1.5 flex-shrink-0"></div>
                        <span className="text-secondary">
                          Shipping partners for delivery
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-1.5 flex-shrink-0"></div>
                        <span className="text-secondary">
                          Payment processors for transactions
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-1.5 flex-shrink-0"></div>
                        <span className="text-secondary">
                          Legal authorities when required by law
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cookies & Your Rights */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-primary bg-[#E0BCA2]">
            <CardHeader className="bg-gradient-to-r from-tertiary/10 to-primary/5">
              <CardTitle className="flex items-center gap-3 text-2xl text-secondary">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Cookie className="h-6 w-6 text-primary" />
                </div>
                Cookies & Your Rights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-tertiary/10 border border-[#B67B5C] rounded-lg p-4">
                  <h4 className="font-semibold text-lg mb-3 text-secondary">
                    Cookie Usage
                  </h4>
                  <p className="text-secondary mb-3">
                    We use cookies to enhance your browsing experience and
                    provide personalized content.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-tertiary rounded-full mt-1.5 flex-shrink-0"></div>
                      <span className="text-secondary">
                        Essential cookies for website functionality
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-tertiary rounded-full mt-1.5 flex-shrink-0"></div>
                      <span className="text-secondary">
                        Analytics cookies to improve our services
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-tertiary rounded-full mt-1.5 flex-shrink-0"></div>
                      <span className="text-secondary">
                        Marketing cookies for personalized ads
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="bg-primary/5 border border-secondary rounded-lg p-4">
                  <h4 className="font-semibold text-lg mb-3 text-primary">
                    Your Rights
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                      <span className="text-secondary">
                        Access your personal data
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                      <span className="text-secondary">
                        Correct inaccurate information
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                      <span className="text-secondary">
                        Request data deletion
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                      <span className="text-secondary">
                        Opt-out of marketing communications
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                      <span className="text-secondary">
                        Disable cookies in your browser
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact & Updates */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-primary bg-[#E0BCA2]">
            <CardHeader className="bg-gradient-to-r from-tertiary/10 to-primary/5">
              <CardTitle className="flex items-center gap-3 text-2xl text-secondary">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                Contact & Policy Updates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold mb-2 text-secondary">
                    Privacy Concerns
                  </h4>
                  <p className="text-sm text-secondary mb-2">
                    If you have any questions about this Privacy Policy or how
                    we handle your data, please contact our support team.
                  </p>
                  <p className="text-sm text-primary font-medium">
                    We will respond within 48 hours.
                  </p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold mb-2 text-secondary">
                    Policy Updates
                  </h4>
                  <p className="text-sm text-secondary">
                    This Privacy Policy may be updated periodically. We will
                    notify you of any significant changes via email or website
                    notification.
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
              Your privacy is important to us.
            </p>
            <p className="text-foreground/70 mb-4">
              We are committed to protecting your personal information and being
              transparent about our data practices.
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-2 text-primary font-semibold text-lg sm:text-xl">
              <span>Thank you for trusting</span>
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
