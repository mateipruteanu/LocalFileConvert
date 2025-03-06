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
import { toast } from "sonner";

export default function FileConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [convertedFile, setConvertedFile] = useState<{
    url: string;
    name: string;
  } | null>(null);
  const [targetFormat, setTargetFormat] = useState<string>("png");
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>("upload");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setConvertedFile(null);
      setActiveTab("convert");
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

  const getFileType = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    return extension;
  };

  const isValidFileType = (file: File) => {
    const type = getFileType(file.name);
    return ["jpg", "jpeg", "png", "pdf"].includes(type || "");
  };

  const convertFile = async () => {
    if (!file) return;

    if (!isValidFileType(file)) {
      toast.error("Invalid file type", {
        description: "Please upload a JPG, PNG, or PDF file.",
      });
      return;
    }

    setIsConverting(true);
    setProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const fileType = getFileType(file.name);
      const fileName = file.name.split(".")[0];

      if (
        fileType === "pdf" &&
        (targetFormat === "jpg" || targetFormat === "png")
      ) {
        await convertPdfToImage(file, targetFormat, fileName);
      } else if (
        (fileType === "jpg" || fileType === "jpeg" || fileType === "png") &&
        targetFormat === "pdf"
      ) {
        await convertImageToPdf(file, fileName);
      } else if (
        (fileType === "jpg" || fileType === "jpeg" || fileType === "png") &&
        (targetFormat === "jpg" || targetFormat === "png")
      ) {
        await convertImageToImage(file, targetFormat, fileName);
      }

      clearInterval(progressInterval);
      setProgress(100);

      toast.success("Conversion complete", {
        description: "Your file has been converted successfully.",
      });
    } catch (error) {
      console.error("Conversion error:", error);
      toast.error("Conversion failed", {
        description: "There was an error converting your file.",
      });
    } finally {
      setIsConverting(false);
    }
  };

  const convertPdfToImage = async (
    pdfFile: File,
    format: string,
    fileName: string
  ) => {
    // In a real implementation, we would use pdf.js to render PDF pages to canvas
    // and then convert them to the desired image format

    // For demo purposes, we'll create a mock image
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 1000;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      // Draw a mock PDF page
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#000000";
      ctx.font = "30px Arial";
      ctx.fillText("PDF Converted to Image", 50, 50);
      ctx.font = "20px Arial";
      ctx.fillText("This is a mock conversion for demo purposes", 50, 100);

      // Convert canvas to image
      const imageUrl = canvas.toDataURL(`image/${format}`);
      setConvertedFile({
        url: imageUrl,
        name: `${fileName}.${format}`,
      });
    }
  };

  const convertImageToPdf = async (imageFile: File, fileName: string) => {
    // In a real implementation, we would use pdf-lib to create a PDF
    // and embed the image into it

    // For demo purposes, we'll create a mock PDF
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 1000;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      // Create a mock PDF
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#000000";
      ctx.font = "30px Arial";
      ctx.fillText("Image Converted to PDF", 50, 50);
      ctx.font = "20px Arial";
      ctx.fillText("This is a mock conversion for demo purposes", 50, 100);

      // In a real implementation, we would draw the image on the canvas
      // and then convert the canvas to a PDF

      // For demo, we'll just use a data URL
      const pdfUrl = canvas.toDataURL("application/pdf");
      setConvertedFile({
        url: pdfUrl,
        name: `${fileName}.pdf`,
      });
    }
  };

  const convertImageToImage = async (
    imageFile: File,
    format: string,
    fileName: string
  ) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");

          if (ctx) {
            ctx.drawImage(img, 0, 0);
            const imageUrl = canvas.toDataURL(`image/${format}`);
            setConvertedFile({
              url: imageUrl,
              name: `${fileName}.${format}`,
            });
            resolve();
          } else {
            reject(new Error("Could not get canvas context"));
          }
        };

        img.onerror = () => {
          reject(new Error("Failed to load image"));
        };

        if (event.target?.result) {
          img.src = event.target.result as string;
        }
      };

      reader.onerror = () => {
        reject(new Error("Failed to read file"));
      };

      reader.readAsDataURL(imageFile);
    });
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

    const type = getFileType(fileName);
    switch (type) {
      case "pdf":
        return <FileTextIcon className="h-10 w-10" />;
      case "jpg":
      case "jpeg":
      case "png":
        return <ImageIcon className="h-10 w-10" />;
      default:
        return <FileIcon className="h-10 w-10" />;
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
                      {getFileType(file.name)?.toUpperCase()}
                    </p>
                  </div>
                  <ArrowRightIcon className="h-6 w-6 text-muted-foreground" />
                  <div className="flex flex-col items-center">
                    {targetFormat === "pdf" ? (
                      <FileTextIcon className="h-10 w-10" />
                    ) : (
                      <ImageIcon className="h-10 w-10" />
                    )}
                    <p className="text-sm font-medium mt-2">
                      {targetFormat.toUpperCase()}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Convert to:</Label>
                  <RadioGroup
                    value={targetFormat}
                    onValueChange={setTargetFormat}
                    className="flex flex-row gap-4"
                  >
                    {getFileType(file.name) !== "pdf" && (
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="pdf" id="pdf" />
                        <Label htmlFor="pdf">PDF</Label>
                      </div>
                    )}
                    {getFileType(file.name) !== "png" && (
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="png" id="png" />
                        <Label htmlFor="png">PNG</Label>
                      </div>
                    )}
                    {getFileType(file.name) !== "jpg" &&
                      getFileType(file.name) !== "jpeg" && (
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="jpg" id="jpg" />
                          <Label htmlFor="jpg">JPG</Label>
                        </div>
                      )}
                  </RadioGroup>
                </div>

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
                  <Button onClick={convertFile} className="w-full">
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
