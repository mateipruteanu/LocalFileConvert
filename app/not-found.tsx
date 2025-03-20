import Link from "next/link";
import { FileX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <FileX className="w-20 h-20 mb-6 text-gray-400" />
      <h1 className="text-4xl font-bold mb-2">Page Not Found</h1>
      <p className="text-gray-500 mb-6 max-w-md">
        {`The page you're looking for doesn't exist or has been moved.`}
      </p>
      <Button asChild variant="outline">
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  );
}
