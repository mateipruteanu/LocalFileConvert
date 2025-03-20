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
  params: Promise<{ conversion: string }>;
}): Promise<Metadata> {
  const { conversion } = await params;

  const conversionData = conversionRoutes.find(
    (route) => route.id === conversion
  );

  if (!conversionData) {
    return {
      title: "Conversion Not Found | LocalFileConvert",
      description: "The requested file conversion is not supported.",
    };
  }

  return {
    title: conversionData.title,
    description: conversionData.description,
    openGraph: {
      title: conversionData.title,
      description: conversionData.description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: conversionData.title,
      description: conversionData.description,
    },
  };
}

export default async function ConversionRoute({
  params,
}: {
  params: Promise<{ conversion: string }>;
}) {
  const { conversion } = await params;

  const conversionData = conversionRoutes.find(
    (route) => route.id === conversion
  );

  if (!conversionData) {
    notFound();
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <ConversionPage conversion={conversionData} />
    </main>
  );
}
