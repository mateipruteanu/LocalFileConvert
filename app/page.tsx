import FileConverter from "@/components/file-converter";
import { conversionRoutes } from "@/lib/conversion-routes";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <div className="w-full max-w-3xl">
        <FileConverter />

        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4 text-center">
            Popular Conversions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {conversionRoutes.map((conv) => (
              <Link
                key={conv.id}
                href={conv.path}
                className="block p-4 border rounded-lg hover:bg-muted transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{conv.sourceFormatName}</span>
                  <span>→</span>
                  <span className="font-medium">{conv.targetFormatName}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {conv.description.slice(0, 80)}...
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
