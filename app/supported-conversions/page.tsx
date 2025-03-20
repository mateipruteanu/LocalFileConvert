import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  FileIcon,
  ImageIcon,
  FileTextIcon,
  FileType,
} from "lucide-react";
import { conversionRoutes } from "@/lib/conversion-routes";

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
        <Link
          href="/"
          className="flex items-center text-sm text-muted-foreground hover:text-primary mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Supported Conversions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {conversionRoutes.map((conversion) => (
                <Link
                  key={conversion.id}
                  href={conversion.path}
                  className="flex items-center p-3 border rounded-md hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center flex-1">
                    {getFileIcon(conversion.sourceFormat)}
                    <span className="mx-2">{conversion.sourceFormatName}</span>
                    <ArrowRight className="h-4 w-4 mx-2" />
                    {getFileIcon(conversion.targetFormat)}
                    <span className="ml-2">{conversion.targetFormatName}</span>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
