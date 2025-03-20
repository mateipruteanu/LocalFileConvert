"use client";

import { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import useFileConverter from "@/hooks/useFileConverter";
import { UploadTab } from "./tabs/upload-tab";
import { ConvertTab } from "./tabs/convert-tab";
import { toast } from "sonner";
import Link from "next/link";
import { ConversionRoute } from "@/lib/conversion-routes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileIcon, ArrowRightIcon } from "lucide-react";
import { Button } from "./ui/button";
import ConversionStructuredData from "./seo/conversion-structured-data";

interface ConversionPageProps {
  conversion: ConversionRoute;
}

export default function ConversionPage({ conversion }: ConversionPageProps) {
  const {
    convertFile,
    file,
    convertedFile,
    targetFormat,
    isConverting,
    progress,
    setFile,
    setConvertedFile,
    setTargetFormat,
    setProgress,
  } = useFileConverter();
  const [activeTab, setActiveTab] = useState<string>("upload");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Set the target format based on the conversion route
  useEffect(() => {
    setTargetFormat(conversion.targetFormat);
  }, [conversion.targetFormat, setTargetFormat]);

  const handleFileChange = (selectedFile: File) => {
    // Verify file type matches the expected source format
    const fileExtension = selectedFile.name.split(".").pop()?.toLowerCase();
    if (fileExtension !== conversion.sourceFormat) {
      toast.error("Invalid file format", {
        description: `Please upload a ${conversion.sourceFormatName} file for this conversion.`,
      });
      return;
    }

    setFile(selectedFile);
    setConvertedFile(null);
    setActiveTab("convert");
  };

  const resetConverter = () => {
    setFile(null);
    setConvertedFile(null);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const downloadFile = () => {
    if (convertedFile) {
      const link = document.createElement("a");
      link.href = convertedFile.url;
      link.download = convertedFile.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const copyToClipboard = async () => {
    if (convertedFile && convertedFile.name.endsWith(".txt")) {
      try {
        const response = await fetch(convertedFile.url);
        const text = await response.text();
        await navigator.clipboard.writeText(text);
        toast.success("Text copied to clipboard");
      } catch (error) {
        console.error("Failed to copy text:", error);
        toast.error("Failed to copy text");
      }
    }
  };

  return (
    <>
      <ConversionStructuredData conversion={conversion} />
      <Card className="w-full max-w-3xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl">
              Convert {conversion.sourceFormatName} to{" "}
              {conversion.targetFormatName}
            </CardTitle>
            <CardDescription>
              Securely convert files in your browser - no uploads needed
            </CardDescription>
          </div>
          <ThemeToggle />
        </CardHeader>

        <CardContent>
          <div className="flex items-center justify-center mb-4 p-2 bg-muted/30 rounded-md">
            <div className="flex items-center justify-center gap-4">
              <div className="flex flex-col items-center">
                <FileIcon className="h-8 w-8" />
                <p className="text-sm font-medium mt-2">
                  {conversion.sourceFormatName}
                </p>
              </div>
              <ArrowRightIcon className="h-6 w-6 text-muted-foreground" />
              <div className="flex flex-col items-center">
                <FileIcon className="h-8 w-8" />
                <p className="text-sm font-medium mt-2">
                  {conversion.targetFormatName}
                </p>
              </div>
            </div>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload</TabsTrigger>
              <TabsTrigger value="convert" disabled={!file}>
                Convert
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload">
              <UploadTab
                file={file}
                onFileChange={handleFileChange}
                onReset={resetConverter}
                acceptedFileTypes={`.${conversion.sourceFormat}`}
                helpText={`Upload a ${conversion.sourceFormatName} file to convert to ${conversion.targetFormatName}`}
              />
            </TabsContent>

            <TabsContent value="convert">
              {file && (
                <ConvertTab
                  file={file}
                  convertedFile={convertedFile}
                  targetFormat={targetFormat}
                  isConverting={isConverting}
                  progress={progress}
                  onDownload={downloadFile}
                  onCopy={copyToClipboard}
                  onConvert={convertFile}
                  setTargetFormat={setTargetFormat}
                  hideFormatSelection={true} // Hide the format selection since it's pre-selected
                />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="flex justify-between text-xs text-muted-foreground">
          <p>All conversions happen locally in your browser</p>
          <Link
            href="/supported-conversions"
            className="hover:text-primary hover:underline"
          >
            View all supported conversions
          </Link>
        </CardFooter>
      </Card>
      <div className="mt-6">
        <Link href="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>
    </>
  );
}
