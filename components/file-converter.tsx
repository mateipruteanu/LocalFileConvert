"use client";

import { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/theme-toggle";
import useFileConverter from "@/hooks/useFileConverter";
import { UploadTab } from "./tabs/upload-tab";
import { ConvertTab } from "./tabs/convert-tab";
import { getAvailableConversions } from "@/utils/conversion-map";

export default function FileConverter() {
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

  const handleFileChange = (selectedFile: File) => {
    console.log("Selected file:", selectedFile);
    setFile(selectedFile);
    setConvertedFile(null);
    setActiveTab("convert");

    const availableFormats = getAvailableConversions(selectedFile.name);
    if (availableFormats.length > 0) {
      console.log("set to target format: ", availableFormats[0]);
      setTargetFormat(availableFormats[0]);
    }
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

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-2xl">LocalFileConvert</CardTitle>
          <CardDescription>
            Convert files locally in your browser
          </CardDescription>
        </div>
        <ThemeToggle />
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
                onConvert={convertFile}
                setTargetFormat={setTargetFormat}
              />
            )}
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="flex justify-between text-xs text-muted-foreground">
        <p>All conversions happen locally in your browser</p>
        <p>No files are uploaded to any server</p>
      </CardFooter>
    </Card>
  );
}
