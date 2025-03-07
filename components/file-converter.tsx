"use client";

import type React from "react";

import { useState, useRef } from "react";
import {
  FileIcon,
  ImageIcon,
  FileTextIcon,
  ArrowRightIcon,
  DownloadIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ThemeToggle } from "@/components/theme-toggle";
import { Progress } from "@/components/ui/progress";

import FileUtils from "@/utils/file-utils";
import useFileConverter from "@/hooks/useFileConverter";
import {
  getAvailableConversions,
  SupportedFileType,
} from "@/utils/conversion-map";

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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setConvertedFile(null);
      setActiveTab("convert");

      const sourceFormat = FileUtils.getFileType(
        selectedFile.name
      ) as SupportedFileType;
      const availableFormats = getAvailableConversions(sourceFormat);
      if (availableFormats.length > 0) {
        setTargetFormat(availableFormats[0]);
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      setConvertedFile(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
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

  const resetConverter = () => {
    setFile(null);
    setConvertedFile(null);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getFileIcon = (fileName: string | undefined) => {
    if (!fileName) return <FileIcon className="h-10 w-10" />;

    const type = FileUtils.getFileType(fileName);
    switch (type) {
      case "pdf":
        return <FileTextIcon className="h-10 w-10" />;
      case "jpg":
      case "jpeg":
      case "png":
        return <ImageIcon className="h-10 w-10" />;
      default:
        return (
          <FileIcon className="h-10 w-10" aria-label="Unsupported file type" />
        );
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
            <div
              className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 mt-6 cursor-pointer hover:bg-muted/50 transition-colors"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".jpg,.jpeg,.png,.pdf"
              />
              {file ? (
                <div className="flex flex-col items-center gap-2">
                  {getFileIcon(file.name)}
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      resetConverter();
                    }}
                  >
                    <Trash2Icon className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                </div>
              ) : (
                <>
                  <FileIcon className="h-10 w-10 mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium mb-1">
                    Drag & drop your file here
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supports JPG, PNG, and PDF
                  </p>
                </>
              )}
            </div>
          </TabsContent>
          <TabsContent value="convert">
            {file && (
              <div className="space-y-6 mt-6">
                <div className="flex items-center justify-center gap-4">
                  <div className="flex flex-col items-center">
                    {getFileIcon(file.name)}
                    <p className="text-sm font-medium mt-2">
                      {FileUtils.getFileType(file.name)?.toUpperCase()}
                    </p>
                  </div>
                  <ArrowRightIcon className="h-6 w-6 text-muted-foreground" />
                  <div className="flex flex-col items-center">
                    {getAvailableConversions(file.name).length > 0 ? (
                      <>
                        {getFileIcon(
                          targetFormat ? `file.${targetFormat}` : undefined
                        )}
                        <p className="text-sm font-medium mt-2">
                          {targetFormat.toUpperCase()}
                        </p>
                      </>
                    ) : (
                      <XIcon className="h-10 w-10 text-destructive" />
                    )}
                  </div>
                </div>

                {getAvailableConversions(file.name).length > 0 ? (
                  <div className="space-y-2">
                    <Label>Convert to:</Label>
                    <RadioGroup
                      value={targetFormat}
                      onValueChange={setTargetFormat}
                      className="flex flex-row gap-4"
                    >
                      {getAvailableConversions(file.name).map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <RadioGroupItem value={type} id={type} />
                          <Label htmlFor={type}>{type.toUpperCase()}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                ) : (
                  <div className="text-center text-sm">
                    This file type cannot be converted to any other format yet.
                  </div>
                )}

                {isConverting ? (
                  <div className="space-y-2">
                    <Label>Converting...</Label>
                    <Progress value={progress} className="h-2" />
                  </div>
                ) : convertedFile ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center gap-2">
                      {getFileIcon(convertedFile.name)}
                      <p className="font-medium">{convertedFile.name}</p>
                    </div>
                    <Button onClick={downloadFile}>
                      <DownloadIcon className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={convertFile}
                    className="w-full"
                    disabled={getAvailableConversions(file.name).length === 0}
                  >
                    Convert
                  </Button>
                )}
              </div>
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
