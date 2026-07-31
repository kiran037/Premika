import { Urbanist } from "next/font/google";
import Script from "next/script";
import { Metadata } from "next";

import "./globals.css";

import CustomerLayoutServer from "@/components/CustomerLayout.server";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { SeoService } from "@/services/seo.service";

const font = Urbanist({ subsets: ["latin"] });

// Google Analytics ID
const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await SeoService.getSeoSettings();

  const siteName = seo?.siteName || "Premika Store";
  const titleTemplate = seo?.titleTemplate || "%s | Premika";
  const defaultTitle = seo?.defaultMetaTitle || "Premika - Premium Designer Kurtis Online";
  const defaultDescription =
    seo?.defaultMetaDescription ||
    "Discover premium women's fashion at Premika. Shop designer kurtis, halter neck tops, cotton kurtas & ethnic wear. Free shipping on orders over ₹500. Easy returns. Quality guaranteed.";

  const defaultKeywords = seo?.defaultKeywords
    ? seo.defaultKeywords.split(",").map((k) => k.trim()).filter(Boolean)
    : [
        "women fashion",
        "designer kurtis",
        "ethnic wear",
        "cotton kurtas",
        "halter neck kurti",
        "indian fashion",
        "online shopping",
        "premika store",
        "women clothing",
        "fashion store india",
        "kurti online",
        "ethnic fashion",
        "designer wear",
        "cotton clothing",
        "women's apparel",
      ];

  const canonicalDomain = seo?.canonicalDomain || "https://premika.shop";
  const ogImage = seo?.defaultOgImage || "/logo.png";
  const twitterHandle = seo?.twitterHandle || "@premika_store";
  const robotsString = seo?.defaultRobots || "index, follow";

  const isNoIndex = robotsString.includes("noindex");
  const isNoFollow = robotsString.includes("nofollow");

  return {
    title: {
      template: titleTemplate,
      default: defaultTitle,
    },
    description: defaultDescription,
    keywords: defaultKeywords,
    authors: [{ name: siteName }],
    creator: siteName,
    publisher: siteName,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(canonicalDomain),
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title: defaultTitle,
      description: defaultDescription,
      url: canonicalDomain,
      siteName: siteName,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: siteName,
        },
      ],
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: defaultTitle,
      description: defaultDescription,
      images: [ogImage],
      creator: twitterHandle,
    },
    robots: {
      index: !isNoIndex,
      follow: !isNoFollow,
      nocache: true,
      googleBot: {
        index: !isNoIndex,
        follow: !isNoFollow,
        noimageindex: false,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon-16x16.png",
      apple: "/apple-touch-icon.png",
      other: {
        rel: "apple-touch-icon-precomposed",
        url: "/apple-touch-icon-precomposed.png",
      },
    },
    manifest: "/site.webmanifest",
    other: {
      ...(seo?.googleVerification ? { "google-site-verification": seo.googleVerification } : {}),
      ...(seo?.bingVerification ? { "msvalidate.01": seo.bingVerification } : {}),
      "msapplication-TileColor": "#da532c",
      "theme-color": "#ffffff",
    },
    category: "fashion",
  };
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${font.className} relative`}>
        {/* Google Analytics */}
        {GA_TRACKING_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_TRACKING_ID}', {
                  page_path: window.location.pathname,
                  anonymize_ip: true,
                });
              `}
            </Script>
            <GoogleAnalytics />
          </>
        )}

        <CustomerLayoutServer>{children}</CustomerLayoutServer>
      </body>
    </html>
  );
}
