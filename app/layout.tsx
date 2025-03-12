import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { StructuredData } from "@/components/seo/structured-data";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LocalFileConvert - Convert Files Locally in Browser",
  description:
    "Free browser-based tool to convert files between PDF, JPG, PNG, and more formats securely and locally without uploading to servers. No data leaves your device.",
  keywords:
    "local file conversion, convert png to jpg locally, pdf to image conversion, browser file converter, offline file conversion, secure file converter, no upload file conversion",
  authors: [{ name: "LocalFileConvert" }],
  openGraph: {
    title: "LocalFileConvert - Convert Files Locally in Your Browser",
    description:
      "Convert files between PDF, JPG, PNG and other formats locally in your browser without uploading to servers",
    type: "website",
    locale: "en_US",
    url: "https://localfileconvert.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "LocalFileConvert - Convert Files Locally in Your Browser",
    description:
      "Convert files between PDF, JPG, PNG and other formats locally in your browser without uploading to servers",
  },
  alternates: {
    canonical: "https://localfileconvert.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="fe31450d-ae9e-4cca-9122-5e8ec28a64a4"
        ></script>
        <StructuredData />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
