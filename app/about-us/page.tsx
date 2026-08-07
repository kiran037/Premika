import React from "react";
import Container from "@/components/ui/container";
import InfoPageHeader from "@/components/ui/info-page-header";
import InfoCard from "@/components/ui/info-card";
import InfoPageFooter from "@/components/ui/info-page-footer";
import {
  Heart,
  Sparkles,
  Award,
  ShieldCheck,
  Package,
  Users,
  Compass,
  CheckCircle2,
} from "lucide-react";

export function generateMetadata() {
  return {
    title: "About Us - Premika Store",
    description:
      "Learn about Premika's story, vision, and craftsmanship. Designed with love, crafted for you. Premium designer kurtis, ethnic wear, and luxury attire.",
    keywords:
      "about premika, premika story, ethnic wear brand, designer kurtis, handmade indian clothing, prem se bana premika ke liye",
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: "https://premika.shop/about-us",
      siteName: "Premika Store",
      title: "About Us - Premika Store",
      description:
        "Born from love and intention, Premika reimagines Indian wear with care and elegance.",
      images: [
        {
          url: "https://premika.shop/logo.png",
          width: 1200,
          height: 630,
          alt: "Premika Store About Us",
        },
      ],
    },
    alternates: {
      canonical: "https://premika.shop/about-us",
    },
  };
}

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* 1. Header Banner */}
      <InfoPageHeader
        badge="Our Brand Story"
        icon={Heart}
        title="About Premika"
        subtitle="Prem se bana, Premika ke liye — Reimagining ethnic fashion with love, care, and quiet beauty."
      />

      {/* 2. Main Content Container */}
      <Container>
        <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6 sm:space-y-8 max-w-5xl mx-auto">
          {/* Brand Philosophy Intro */}
          <InfoCard borderAccent className="bg-popover/20">
            <p className="text-sm sm:text-base md:text-lg leading-relaxed text-foreground text-center sm:text-left">
              Born from love and friendship, <span className="font-bold text-primary">Premika</span> reimagines Indian ethnic wear with care and intention. We create clothing that feels personal, deeply rooted, and quietly beautiful — designed with love, crafted for you.
            </p>
          </InfoCard>

          {/* Story & Vision Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Our Story */}
            <InfoCard title="Our Story" icon={Sparkles}>
              <div className="space-y-3 text-xs sm:text-sm text-foreground leading-relaxed">
                <p>
                  Premika was created to bridge the gap between timeless Indian heritage garments and modern everyday comfort. We began with a simple belief: ethnic clothing should celebrate individuality without compromising on comfort or elegance.
                </p>
                <p className="text-muted-foreground">
                  Every kurti, set, and dress in our collection is curated to reflect grace, understated luxury, and authentic craftsmanship.
                </p>
              </div>
            </InfoCard>

            {/* Our Vision */}
            <InfoCard title="Our Vision" icon={Compass}>
              <div className="space-y-3 text-xs sm:text-sm text-foreground leading-relaxed">
                <p>
                  Our vision is to craft elevated designer wear that empowers women to feel confident, comfortable, and beautiful in every occasion.
                </p>
                <p className="text-muted-foreground">
                  From fabric selection to silhouette tailoring and final packaging, we prioritize intentional craftsmanship over fast fashion trends.
                </p>
              </div>
            </InfoCard>
          </div>

          {/* Why Premika - Core Values */}
          <InfoCard title="Why Premika" icon={Award}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-popover/30 border border-primary/20 space-y-2 text-center sm:text-left">
                <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center mx-auto sm:mx-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm sm:text-base text-foreground">Handcrafted Quality</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Soft cottons, breathable fabrics, and meticulous embroidery tailored for longevity.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-popover/30 border border-primary/20 space-y-2 text-center sm:text-left">
                <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center mx-auto sm:mx-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm sm:text-base text-foreground">Thoughtful Sizing</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Real measurements and size charts designed specifically for Indian silhouettes.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-popover/30 border border-primary/20 space-y-2 text-center sm:text-left">
                <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center mx-auto sm:mx-0">
                  <Package className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm sm:text-base text-foreground">Pan-India Free Delivery</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Tamper-proof packaging and free delivery across 19,000+ PIN codes in India.
                </p>
              </div>
            </div>
          </InfoCard>

          {/* Quality Promise & Customer First */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoCard title="Quality Promise" icon={ShieldCheck}>
              <div className="p-4 rounded-lg bg-popover/30 border border-primary/20 space-y-2 text-xs sm:text-sm text-foreground">
                <p className="leading-relaxed">
                  We double-check every seam, dye lot, and stitch before an item is packed. Our promise is simple: authentic designs that bring joy to your wardrobe.
                </p>
              </div>
            </InfoCard>

            <InfoCard title="Customer First" icon={Users}>
              <div className="p-4 rounded-lg bg-popover/30 border border-primary/20 space-y-2 text-xs sm:text-sm text-foreground">
                <p className="leading-relaxed">
                  When you choose Premika, you support thoughtful design, transparent customer service, and dedicated artisan craftsmanship.
                </p>
              </div>
            </InfoCard>
          </div>

          {/* 3. Reusable Ending Footer Card */}
          <InfoPageFooter
            storeName="Premika"
            message="Discover our full collection of handcrafted kurtis, ethnic dresses, and sets designed with love."
            ctaText="Explore Collection"
            ctaHref="/shop"
          />
        </div>
      </Container>
    </div>
  );
}
