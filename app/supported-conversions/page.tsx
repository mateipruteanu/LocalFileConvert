import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { conversionMap, SupportedFileType } from "@/utils/conversion-map";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  FileIcon,
  ImageIcon,
  FileTextIcon,
  FileType,
} from "lucide-react";

export default function CapabilitiesPage() {
  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileTextIcon className="h-6 w-6" />;
      case "txt":
        return <FileType className="h-6 w-6" />;
      case "jpg":
      case "jpeg":
      case "png":
        return <ImageIcon className="h-6 w-6" />;
      default:
        return <FileIcon className="h-6 w-6" />;
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 to-muted/20">
      <div className="w-full max-w-3xl">
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="group flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition-colors hover:border-primary hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to converter
          </Link>
        </div>

        <Card className="backdrop-blur-sm border-2 max-h-[600px] flex flex-col">
          <CardHeader className="space-y-4 pb-4 border-b">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Supported Conversions
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Transform your files between these formats instantly and securely
              in your browser
            </p>
          </CardHeader>
          <CardContent className="grid gap-8 overflow-y-auto">
            {Object.entries(conversionMap)
              .filter(([sourceType]) => sourceType !== "jpeg")
              .map(([sourceType, targetTypes]) => {
                if (targetTypes.length === 0) return null;

                return (
                  <div key={sourceType} className="space-y-3">
                    <div className="flex items-center gap-3">
                      {getFileIcon(sourceType)}
                      <h3 className="font-semibold text-lg capitalize">
                        {sourceType.toUpperCase()}
                      </h3>
                    </div>
                    <div className="pl-9 grid gap-2">
                      {targetTypes.map((targetType: SupportedFileType) => (
                        <div
                          key={targetType}
                          className="group flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors p-2 rounded-lg hover:bg-muted/50"
                        >
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          <div className="flex items-center gap-2">
                            {getFileIcon(targetType)}
                            <span className="uppercase font-medium">
                              {targetType}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
          </CardContent>
        </Card>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          All conversions happen locally in your browser. Your files never leave
          your device.
        </p>
      </div>
    </div>
  );
}
