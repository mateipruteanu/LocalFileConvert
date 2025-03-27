import { File, Download, X, RotateCw } from "lucide-react";
import { PdfDropzone } from "@/components/pdf-dropzone";
import { PdfPagePreview } from "@/components/pdf-page-preview";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import usePdfMerger from "@/hooks/usePdfMerger";

export function PdfMergerTab() {
  const {
    pdfFiles,
    pages,
    isLoading,
    mergedPdf,
    progress,
    loadPdfFiles,
    reorderPages,
    removeFile,
    removePage,
    mergePdfs,
    downloadMergedPdf,
    reset,
  } = usePdfMerger();

  const handleReset = () => {
    reset();
  };

  return (
    <div className="space-y-6 mt-6">
      {!pdfFiles.length && (
        <PdfDropzone onFilesDrop={loadPdfFiles} isLoading={isLoading} />
      )}

      {pdfFiles.length > 0 && !mergedPdf && (
        <>
          <div className="flex items-center justify-between">
            <h3 className="font-medium">
              Selected PDF Files ({pdfFiles.length})
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              disabled={isLoading}
            >
              <X className="h-4 w-4 mr-1" /> Clear All
            </Button>
          </div>

          <div className="border rounded-lg p-4 space-y-2">
            {pdfFiles.map((pdf, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <File className="h-5 w-5 mr-2 text-blue-500" />
                  <span className="truncate max-w-xs">{pdf.name}</span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    ({pdf.pageCount} pages)
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => removeFile(index)}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <PdfPagePreview
            pages={pages}
            onReorder={reorderPages}
            onRemovePage={removePage}
            isLoading={isLoading}
          />

          <div className="flex justify-center mt-4">
            <Button
              onClick={mergePdfs}
              disabled={isLoading || pages.length === 0}
              className="min-w-[200px]"
            >
              {isLoading ? (
                <>
                  <RotateCw className="h-4 w-4 mr-2 animate-spin" />
                  Merging PDFs...
                </>
              ) : (
                "Merge PDFs"
              )}
            </Button>
            <Button
              variant="outline"
              className="ml-2"
              onClick={() => loadPdfFiles([])}
              disabled={isLoading}
            >
              Add More PDFs
            </Button>
          </div>

          {isLoading && (
            <div className="mt-4">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-center mt-1 text-muted-foreground">
                {progress}% complete
              </p>
            </div>
          )}
        </>
      )}

      {mergedPdf && (
        <div className="flex flex-col items-center space-y-4">
          <p className="text-center text-green-600 font-medium">
            PDF files successfully merged!
          </p>

          <div className="flex space-x-2">
            <Button onClick={downloadMergedPdf}>
              <Download className="h-4 w-4 mr-2" />
              Download Merged PDF
            </Button>
            <Button variant="outline" onClick={handleReset}>
              Merge Different PDFs
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
