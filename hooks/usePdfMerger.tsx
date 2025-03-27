"use client";

import { useState, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import { toast } from "sonner";
import { loadPdfDocument, renderPdfPageToImage } from "@/utils/pdf-renderer";

interface PdfPage {
  pdfIndex: number;
  pageIndex: number;
  previewUrl: string;
}

interface PdfFile {
  file: File;
  name: string;
  pageCount: number;
}

interface MergedPdfResult {
  url: string;
  name: string;
}

export default function usePdfMerger() {
  const [pdfFiles, setPdfFiles] = useState<PdfFile[]>([]);
  const [pages, setPages] = useState<PdfPage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mergedPdf, setMergedPdf] = useState<MergedPdfResult | null>(null);
  const [progress, setProgress] = useState(0);

  const loadPdfFiles = useCallback(async (files: File[]) => {
    if (!files.length) return;

    setIsLoading(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 1, 90)); // Slower progress increment since rendering takes time
    }, 200);

    try {
      const pdfFilesData: PdfFile[] = [];
      const pdfPagesData: PdfPage[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Skip non-PDF files
        if (file.type !== "application/pdf") {
          toast.error(`${file.name} is not a PDF file`);
          continue;
        }

        // Load PDF document
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const pageCount = pdfDoc.getPageCount();

        pdfFilesData.push({
          file,
          name: file.name,
          pageCount,
        });

        // Load the PDF document once using pdf.js for rendering
        const pdfJsDoc = await loadPdfDocument(arrayBuffer);

        // Generate actual PDF page previews using PDF.js
        for (let pageIndex = 0; pageIndex < pageCount; pageIndex++) {
          try {
            // Render the actual PDF page to an image using the loaded document
            const imageUrl = await renderPdfPageToImage(pdfJsDoc, pageIndex);

            pdfPagesData.push({
              pdfIndex: i,
              pageIndex,
              previewUrl: imageUrl,
            });

            // Update progress incrementally
            const totalPages = files.reduce((total, f, idx) => {
              if (idx < i) return total + pdfFilesData[idx].pageCount;
              if (idx === i) return total + pageIndex + 1;
              return total;
            }, 0);

            const totalEstimatedPages = files.reduce((acc, _, idx) => {
              if (idx === i) return acc + pageCount;
              if (idx < i) return acc + pdfFilesData[idx].pageCount;
              return acc; // We don't know page counts for files we haven't loaded yet
            }, 0);

            // Set progress based on how many pages we've processed
            setProgress(Math.min(90 * (totalPages / totalEstimatedPages), 90));
          } catch (error) {
            console.error(
              `Error rendering preview for page ${pageIndex + 1}:`,
              error
            );
            // Continue to next page if there's an error with this one
          }
        }
      }

      setPdfFiles(pdfFilesData);
      setPages(pdfPagesData);
      setProgress(100);

      if (pdfFilesData.length === 0) {
        toast.error("No valid PDF files were uploaded");
      } else {
        toast.success(
          `Loaded ${pdfFilesData.length} PDF files with ${pdfPagesData.length} pages`
        );
      }
    } catch (error) {
      console.error("Error loading PDF files:", error);
      toast.error("Failed to load PDF files", {
        description:
          "There was an error loading your PDF files. Please try again.",
      });
    } finally {
      clearInterval(interval);
      setIsLoading(false);
    }
  }, []);

  const reorderPages = useCallback(
    (sourceIndex: number, destinationIndex: number) => {
      setPages((prevPages) => {
        const result = Array.from(prevPages);
        const [removed] = result.splice(sourceIndex, 1);
        result.splice(destinationIndex, 0, removed);
        return result;
      });
    },
    []
  );

  const removeFile = useCallback((pdfIndex: number) => {
    setPdfFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== pdfIndex)
    );
    setPages((prevPages) =>
      prevPages.filter((page) => page.pdfIndex !== pdfIndex)
    );
  }, []);

  const removePage = useCallback((pageIndex: number) => {
    setPages((prevPages) =>
      prevPages.filter((_, index) => index !== pageIndex)
    );
  }, []);

  const mergePdfs = useCallback(async () => {
    if (pages.length === 0) {
      toast.error("No pages to merge");
      return;
    }

    setIsLoading(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 10, 90));
    }, 300);

    try {
      // Create a new document for the merged PDF
      const mergedPdfDoc = await PDFDocument.create();

      // For each page in order, add it to the merged document
      for (const page of pages) {
        const { pdfIndex, pageIndex } = page;
        const file = pdfFiles[pdfIndex].file;

        // Load the source PDF
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);

        // Copy the page to the merged document
        const [copiedPage] = await mergedPdfDoc.copyPages(pdfDoc, [pageIndex]);
        mergedPdfDoc.addPage(copiedPage);
      }

      // Save the merged document
      const mergedPdfBytes = await mergedPdfDoc.save();
      const mergedPdfBlob = new Blob([mergedPdfBytes], {
        type: "application/pdf",
      });
      const mergedPdfUrl = URL.createObjectURL(mergedPdfBlob);

      setMergedPdf({
        url: mergedPdfUrl,
        name: `merged_${new Date().toISOString().slice(0, 10)}.pdf`,
      });

      setProgress(100);
      toast.success("PDF files merged successfully");
    } catch (error) {
      console.error("Error merging PDFs:", error);
      toast.error("Failed to merge PDFs", {
        description:
          "There was an error merging your PDF files. Please try again.",
      });
    } finally {
      clearInterval(interval);
      setIsLoading(false);
    }
  }, [pages, pdfFiles]);

  const downloadMergedPdf = useCallback(() => {
    if (!mergedPdf) return;

    const link = document.createElement("a");
    link.href = mergedPdf.url;
    link.download = mergedPdf.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [mergedPdf]);

  const reset = useCallback(() => {
    setPdfFiles([]);
    setPages([]);
    setMergedPdf(null);
    setProgress(0);
  }, []);

  return {
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
  };
}
