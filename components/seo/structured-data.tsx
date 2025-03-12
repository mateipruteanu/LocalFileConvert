import React from "react";

export function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "LocalFileConvert",
    description:
      "Free browser-based tool to convert files between PDF, JPG, PNG, and more formats securely and locally without uploading to servers.",
    applicationCategory: "Utility",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Local file conversion",
      "PDF to image conversion",
      "PNG to JPG conversion",
      "JPG to PNG conversion",
      "No data leaves your device",
      "Privacy focused",
      "No registration required",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
