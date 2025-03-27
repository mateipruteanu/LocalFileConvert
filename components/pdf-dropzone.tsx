import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { File, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PdfDropzoneProps {
  onFilesDrop: (files: File[]) => void;
  isLoading: boolean;
}

export function PdfDropzone({ onFilesDrop, isLoading }: PdfDropzoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const pdfFiles = acceptedFiles.filter(
        (file) => file.type === "application/pdf"
      );
      onFilesDrop(pdfFiles);
    },
    [onFilesDrop]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    multiple: true,
    disabled: isLoading,
  });

  return (
    <div
      {...getRootProps()}
      className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg ${
        isDragActive ? "border-primary bg-secondary/20" : "border-border"
      } ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 p-3 rounded-full bg-primary/10">
          {isDragActive ? (
            <Upload className="h-8 w-8 text-primary" />
          ) : (
            <File className="h-8 w-8 text-primary" />
          )}
        </div>
        <h3 className="font-medium mb-1">
          {isDragActive ? "Drop PDFs here" : "Select PDF files"}
        </h3>
        <p className="text-sm text-muted-foreground mb-3">
          {isDragActive
            ? "Release to upload files"
            : "Drag & drop PDF files or click to browse"}
        </p>
        <Button
          disabled={isLoading}
          type="button"
          variant="outline"
          size="sm"
          onClick={(e) => e.stopPropagation()}
        >
          {isLoading ? "Loading..." : "Select Files"}
        </Button>
      </div>
    </div>
  );
}
