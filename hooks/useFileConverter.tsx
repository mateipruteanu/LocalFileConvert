import { useState, useCallback } from "react";
import { toast } from "sonner";
import { PDFDocument } from "pdf-lib";
import FileUtils from "@/utils/file-utils";
import { SupportedFileType } from "@/utils/conversion-map";

interface ConvertedFile {
  url: string;
  name: string;
}

interface UseFileConverterReturn {
  convertFile: (file: File | undefined) => Promise<void>;
  file: File | null;
  convertedFile: ConvertedFile | null;
  targetFormat: string;
  isConverting: boolean;
  progress: number;
  setFile: (file: File | null) => void;
  setConvertedFile: (file: ConvertedFile | null) => void;
  setTargetFormat: (format: string) => void;
  setIsConverting: (isConverting: boolean) => void;
  setProgress: (progress: number) => void;
}

export default function useFileConverter(): UseFileConverterReturn {
  const [file, setFile] = useState<File | null>(null);
  const [convertedFile, setConvertedFile] = useState<ConvertedFile | null>(
    null
  );
  const [targetFormat, setTargetFormat] = useState<string>("png");
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  const updateProgress = useCallback((prevProgress: number) => {
    if (prevProgress >= 90) {
      return 90;
    }
    return prevProgress + 10;
  }, []);

  const handleConversionError = useCallback((error: unknown) => {
    console.warn("Conversion error:", error);
    toast.error("Conversion failed", {
      description: "There was an error converting your file.",
    });
  }, []);

  const convertPdfToImage = useCallback(
    async (pdfFile: File, format: SupportedFileType, fileName: string) => {
      const canvas = document.createElement("canvas");
      canvas.width = 800;
      canvas.height = 1000;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Could not get canvas context");
      }

      // Mock PDF conversion logic
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#000000";
      ctx.font = "30px Arial";
      ctx.fillText("PDF Converted to Image", 50, 50);
      ctx.font = "20px Arial";
      ctx.fillText("This is a mock conversion for demo purposes", 50, 100);

      const imageUrl = canvas.toDataURL(`image/${format}`);
      setConvertedFile({
        url: imageUrl,
        name: `${fileName}.${format}`,
      });
    },
    []
  );

  const convertImageToPdf = useCallback(
    async (imageFile: File, fileName: string): Promise<boolean> => {
      try {
        // Validate image before conversion
        const isValidImage = await new Promise<boolean>((resolve) => {
          const img = new Image();
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false);
          img.src = URL.createObjectURL(imageFile);
        });

        if (!isValidImage) {
          throw new Error("Invalid or corrupted image file");
        }

        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage();

        let image;
        try {
          const imageArrayBuffer = await new Promise<ArrayBuffer>(
            (resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as ArrayBuffer);
              reader.onerror = () => reject(new Error("Failed to read file"));
              reader.readAsArrayBuffer(imageFile);
            }
          );

          if (imageFile.type === "image/jpeg") {
            image = await pdfDoc.embedJpg(imageArrayBuffer);
          } else if (imageFile.type === "image/png") {
            image = await pdfDoc.embedPng(imageArrayBuffer);
          } else {
            throw new Error("Unsupported image format");
          }
        } catch (embedError) {
          if (embedError instanceof Error) {
            throw new Error(`Failed to process image: ${embedError.message}`);
          } else {
            throw new Error("Failed to process image");
          }
        }

        // Calculate dimensions and draw image
        const { width, height } = page.getSize();
        const aspectRatio = image.width / image.height;
        let scaledWidth = width;
        let scaledHeight = width / aspectRatio;

        if (scaledHeight > height) {
          scaledHeight = height;
          scaledWidth = height * aspectRatio;
        }

        page.drawImage(image, {
          x: (width - scaledWidth) / 2,
          y: (height - scaledHeight) / 2,
          width: scaledWidth,
          height: scaledHeight,
        });

        const pdfBytes = await pdfDoc.save();
        const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
        const pdfUrl = URL.createObjectURL(pdfBlob);

        setConvertedFile({
          url: pdfUrl,
          name: `${fileName}.pdf`,
        });

        return true;
      } catch (error) {
        handleConversionError(error);
        return false;
      }
    },
    [handleConversionError]
  );

  const convertImageToImage = useCallback(
    async (imageFile: File, format: SupportedFileType, fileName: string) => {
      try {
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.onerror = () => reject(new Error("Failed to read file"));
          reader.readAsDataURL(imageFile);
        });

        const img = await new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error("Failed to load image"));
          img.src = dataUrl;
        });

        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          throw new Error("Could not get canvas context");
        }

        ctx.drawImage(img, 0, 0);
        const imageUrl = canvas.toDataURL(`image/${format}`);
        setConvertedFile({
          url: imageUrl,
          name: `${fileName}.${format}`,
        });
      } catch (error) {
        handleConversionError(error);
      }
    },
    [handleConversionError]
  );

  const convertFile = useCallback(
    async (file: File | undefined) => {
      if (!file) return;

      if (!FileUtils.isValidFileType(file)) {
        toast.error("Invalid file type", {
          description: "Please upload a JPG, PNG, or PDF file.",
        });
        return;
      }

      setIsConverting(true);
      setProgress(0);

      const progressInterval = setInterval(() => {
        setProgress(updateProgress);
      }, 200);

      try {
        const fileType = FileUtils.getFileType(file.name) as SupportedFileType;
        const fileName = file.name.split(".")[0];
        let conversionSuccess = false;

        switch (fileType) {
          case "pdf":
            if (targetFormat === "jpg" || targetFormat === "png") {
              await convertPdfToImage(file, targetFormat, fileName);
              conversionSuccess = true;
            }
            break;
          case "jpg":
          case "jpeg":
          case "png":
            if (targetFormat === "pdf") {
              conversionSuccess = await convertImageToPdf(file, fileName);
            } else if (targetFormat === "jpg" || targetFormat === "png") {
              await convertImageToImage(file, targetFormat, fileName);
              conversionSuccess = true;
            }
            break;
        }

        if (conversionSuccess) {
          setProgress(100);
          toast.success("Conversion complete", {
            description: "Your file has been converted successfully.",
          });
        }
      } catch (error) {
        handleConversionError(error);
      } finally {
        clearInterval(progressInterval);
        setIsConverting(false);
      }
    },
    [
      targetFormat,
      convertPdfToImage,
      convertImageToPdf,
      convertImageToImage,
      updateProgress,
      handleConversionError,
    ]
  );

  const handleTargetFormatChange = useCallback((newFormat: string) => {
    setTargetFormat(newFormat);
    setConvertedFile(null);
    setProgress(0);
    setIsConverting(false);
  }, []);

  return {
    convertFile,
    file,
    convertedFile,
    targetFormat,
    isConverting,
    progress,
    setFile,
    setConvertedFile,
    setTargetFormat: handleTargetFormatChange,
    setIsConverting,
    setProgress,
  };
}
