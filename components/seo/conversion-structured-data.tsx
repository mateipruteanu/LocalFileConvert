import React from "react";
import { ConversionRoute } from "@/lib/conversion-routes";

interface ConversionStructuredDataProps {
  conversion: ConversionRoute;
}

export default function ConversionStructuredData({
  conversion,
}: ConversionStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `LocalFileConvert - ${conversion.sourceFormatName} to ${conversion.targetFormatName} Converter`,
    description: conversion.description,
    applicationCategory: "Utility",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      `${conversion.sourceFormatName} to ${conversion.targetFormatName} conversion`,
      "Local file processing",
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
