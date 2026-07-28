import { Urbanist } from "next/font/google";
import Script from "next/script";

import "./globals.css";

import { Footer } from "@/components/footer";
import ModalProvider from "@/providers/modal-provider";
import ToastProvider from "@/providers/toast-provider";
import CustomerLayoutWrapper from "@/components/CustomerLayoutWrapper";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const font = Urbanist({ subsets: ["latin"] });

// Google Analytics ID
const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

export const metadata = {
  title: {
    template: "%s | Premika - Premium Fashion Store",
    default: "Premika - Premium Designer Kurtis Online",
  },
  description:
    "Discover premium women's fashion at Premika. Shop designer kurtis, halter neck tops, cotton kurtas & ethnic wear. Free shipping on orders over ₹500. Easy returns. Quality guaranteed.",
  keywords: [
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
  ],
  authors: [{ name: "Premika Store" }],
  creator: "Premika Store",
  publisher: "Premika Store",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://premika.shop"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Premika - Premium Designer Kurtis Online",
    description:
      "Discover premium women's fashion at Premika. Shop designer kurtis, halter neck tops, cotton kurtas & ethnic wear. Free shipping on orders over ₹500.",
    url: "https://premika.shop",
    siteName: "Premika Store",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Premika Fashion Store",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Premika - Premium Designer Kurtis Online",
    description:
      "Shop designer kurtis, ethnic wear & premium women's fashion. Free shipping over ₹500. Quality guaranteed.",
    images: ["/logo.png"],
    creator: "@premika_store",
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
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
    "google-site-verification": "your-google-verification-code",
    "msapplication-TileColor": "#da532c",
    "theme-color": "#ffffff",
  },
  category: "fashion",
};

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

        <CustomerLayoutWrapper>{children}</CustomerLayoutWrapper>
      </body>
    </html>
  );
}
