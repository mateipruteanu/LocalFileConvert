"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChangeEvent, useCallback, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileIcon, UploadIcon, RefreshCcw } from "lucide-react";

interface UploadTabProps {
  file: File | null;
  onFileChange: (file: File) => void;
  onReset: () => void;
  acceptedFileTypes?: string;
  helpText?: string;
}

export function UploadTab({
  file,
  onFileChange,
  onReset,
  acceptedFileTypes,
  helpText,
}: UploadTabProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      onFileChange(event.target.files[0]);
    }
  };

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
        onFileChange(event.dataTransfer.files[0]);
      }
    },
    [onFileChange]
  );

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div className="space-y-6 my-4">
      {!file ? (
        <Card
          className="border-dashed border-2 cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <UploadIcon className="h-10 w-10 mb-4 text-muted-foreground" />
            <p className="text-lg font-medium">
              Drag & drop or click to upload
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {helpText || "Supported formats: JPG, PNG, PDF"}
            </p>
            <Input
              id="file"
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              accept={acceptedFileTypes}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
          <FileIcon className="h-10 w-10 mb-2 text-muted-foreground" />
          <p className="text-lg font-medium">{file.name}</p>
          <p className="text-sm text-muted-foreground">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={onReset}
          >
            <RefreshCcw className="mr-2 h-4 w-4" /> Choose a different file
          </Button>
        </div>
      )}
    </div>
  );
}
