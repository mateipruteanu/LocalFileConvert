import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Conversion Not Found</h1>
        <p className="text-xl mb-8">
          {`The file conversion you're looking for is not supported or doesn't
          exist.`}
        </p>
        <Link href="/supported-conversions">
          <Button variant="outline" className="mr-4">
            View Supported Conversions
          </Button>
        </Link>
        <Link href="/">
          <Button>Go Home</Button>
        </Link>
      </div>
    </main>
  );
}
