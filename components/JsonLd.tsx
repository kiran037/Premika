import React from "react";

export interface OrganizationJsonLdProps {
  type: "Organization";
  name: string;
  url: string;
  logo?: string;
  sameAs?: string[];
}

export interface WebSiteJsonLdProps {
  type: "WebSite";
  name: string;
  url: string;
  searchUrl?: string;
}

export interface ProductJsonLdProps {
  type: "Product";
  name: string;
  description?: string;
  image?: string[];
  price: number;
  currency?: string;
  availability: boolean;
  sku?: string;
  brand?: string;
  category?: string;
  ratingValue?: number;
  reviewCount?: number;
  url?: string;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface BreadcrumbJsonLdProps {
  type: "BreadcrumbList";
  items: BreadcrumbItem[];
}

export type JsonLdProps =
  | OrganizationJsonLdProps
  | WebSiteJsonLdProps
  | ProductJsonLdProps
  | BreadcrumbJsonLdProps;

export default function JsonLd(props: JsonLdProps) {
  let schemaData: Record<string, any> = {};

  if (props.type === "Organization") {
    schemaData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: props.name,
      url: props.url,
      ...(props.logo && { logo: props.logo }),
      ...(props.sameAs && props.sameAs.length > 0 && { sameAs: props.sameAs }),
    };
  } else if (props.type === "WebSite") {
    schemaData = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: props.name,
      url: props.url,
      ...(props.searchUrl && {
        potentialAction: {
          "@type": "SearchAction",
          target: `${props.searchUrl}?search={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      }),
    };
  } else if (props.type === "Product") {
    schemaData = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: props.name,
      ...(props.description && { description: props.description }),
      ...(props.image && props.image.length > 0 && { image: props.image }),
      ...(props.sku && { sku: props.sku }),
      ...(props.brand && { brand: { "@type": "Brand", name: props.brand } }),
      ...(props.category && { category: props.category }),
      offers: {
        "@type": "Offer",
        price: props.price,
        priceCurrency: props.currency || "INR",
        availability: props.availability
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
        ...(props.url && { url: props.url }),
      },
      ...(props.ratingValue && props.reviewCount && props.reviewCount > 0 && {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: props.ratingValue,
          reviewCount: props.reviewCount,
        },
      }),
    };
  } else if (props.type === "BreadcrumbList") {
    schemaData = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: props.items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}
