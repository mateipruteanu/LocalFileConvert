"use client";

import { Button } from "@/components/ui/button";
import { FileIcon, ImageIcon, FileTextIcon, Trash2Icon } from "lucide-react";
import { useRef } from "react";
import FileUtils from "@/utils/file-utils";

interface UploadTabProps {
  file: File | null;
  onFileChange: (file: File) => void;
  onReset: () => void;
}

export function UploadTab({ file, onFileChange, onReset }: UploadTabProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("in the upload tab", event.target.files);
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      onFileChange(selectedFile);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
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
              onReset();
            }}
          >
            <Trash2Icon className="h-4 w-4 mr-2" />
            Remove
          </Button>
        </div>
      ) : (
        <>
          <FileIcon className="h-10 w-10 mb-4 text-muted-foreground" />
          <p className="text-lg font-medium mb-1">Drag & drop your file here</p>
          <p className="text-sm text-muted-foreground mb-4">
            or click to browse
          </p>
          <p className="text-xs text-muted-foreground">
            Supports JPG, PNG, and PDF
          </p>
        </>
      )}
    </div>
  );
}
