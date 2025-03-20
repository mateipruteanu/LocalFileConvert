import { conversionRoutes } from "@/lib/conversion-routes";
import { Metadata } from "next";
import ConversionPage from "@/components/conversion-page";
import { notFound } from "next/navigation";

// Generate static params for all conversion routes
export async function generateStaticParams() {
  return conversionRoutes.map((route) => ({
    conversion: route.id,
  }));
}

// Dynamic metadata based on the conversion route
export async function generateMetadata({
  params,
}: {
  params: { conversion: string };
}): Promise<Metadata> {
  const conversion = conversionRoutes.find(
    (route) => route.id === params.conversion
  );

  if (!conversion) {
    return {
      title: "Conversion Not Found | LocalFileConvert",
      description: "The requested file conversion is not supported.",
    };
  }

  return {
    title: conversion.title,
    description: conversion.description,
    openGraph: {
      title: conversion.title,
      description: conversion.description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: conversion.title,
      description: conversion.description,
    },
  };
}

export default async function ConversionRoute({
  params,
}: {
  params: { conversion: string };
}) {
  const conversion = conversionRoutes.find(
    (route) => route.id === params.conversion
  );

  if (!conversion) {
    notFound();
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <ConversionPage conversion={conversion} />
    </main>
  );
}
