"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  FileIcon,
  ImageIcon,
  FileTextIcon,
  ArrowRightIcon,
  DownloadIcon,
  XIcon,
} from "lucide-react";
import FileUtils from "@/utils/file-utils";
import { getAvailableConversions } from "@/utils/conversion-map";

interface ConvertTabProps {
  file: File;
  convertedFile: { url: string; name: string } | null;
  targetFormat: string;
  isConverting: boolean;
  progress: number;
  onDownload: () => void;
  onConvert: (file: File) => void;
  setTargetFormat: (format: string) => void;
}

export function ConvertTab({
  file,
  convertedFile,
  targetFormat,
  isConverting,
  progress,
  onDownload,
  onConvert,
  setTargetFormat,
}: ConvertTabProps) {
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
              {getFileIcon(targetFormat ? `file.${targetFormat}` : undefined)}
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
          <Button onClick={onDownload}>
            <DownloadIcon className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      ) : (
        <Button
          onClick={() => onConvert(file)}
          className="w-full"
          disabled={getAvailableConversions(file.name).length === 0}
        >
          Convert
        </Button>
      )}
    </div>
  );
}
