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
  CopyIcon,
} from "lucide-react";
import FileUtils from "@/utils/file-utils";
import { getAvailableConversions } from "@/utils/conversion-map";
import { useEffect } from "react";
import { fireConfetti } from "@/utils/confetti-utils";

interface ConvertTabProps {
  file: File;
  convertedFile: { url: string; name: string } | null;
  targetFormat: string;
  isConverting: boolean;
  progress: number;
  onDownload: () => void;
  onConvert: (file: File) => void;
  setTargetFormat: (format: string) => void;
  onCopy: () => void;
  hideFormatSelection?: boolean;
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
  onCopy,
  hideFormatSelection = false,
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

  useEffect(() => {
    if (convertedFile && !isConverting) {
      fireConfetti();
    }
  }, [convertedFile, isConverting]);

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

      {!hideFormatSelection && getAvailableConversions(file.name).length > 0 ? (
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
        !hideFormatSelection && (
          <div className="text-center text-sm">
            This file type cannot be converted to any other format yet.
          </div>
        )
      )}

      {isConverting ? (
        <div className="space-y-2">
          <Label>Converting...</Label>
          <Progress value={progress} className="h-2" />
        </div>
      ) : convertedFile ? (
        <div className="flex flex-col items-center space-y-4">
          <p className="text-center text-green-600 font-medium">
            File successfully converted!
          </p>

          <div className="flex space-x-2">
            <Button onClick={onDownload}>
              <DownloadIcon className="mr-2 h-4 w-4" />
              Download
            </Button>
            {targetFormat === "txt" && (
              <Button variant="outline" onClick={onCopy}>
                <CopyIcon className="mr-2 h-4 w-4" />
                Copy Text
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="flex justify-center">
          <Button onClick={() => onConvert(file)}>
            Convert to {targetFormat.toUpperCase()}
          </Button>
        </div>
      )}
    </div>
  );
}
