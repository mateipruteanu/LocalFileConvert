"use client";
import * as pdfjs from "pdfjs-dist";

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.js";

/**
 * Render a PDF page to an image
 * @param pdfData The raw PDF data as ArrayBuffer
 * @param pageNumber The page number to render (1-indexed)
 * @param scale The scale to render at (1.0 = 100%)
 * @returns A data URL containing the rendered page image
 */
export async function renderPdfPageToImage(
  pdfData: ArrayBuffer,
  pageNumber: number,
  scale: number = 0.5
): Promise<string> {
  try {
    // Load the PDF document
    const loadingTask = pdfjs.getDocument({ data: pdfData });
    const pdf = await loadingTask.promise;

    // Get the page
    const page = await pdf.getPage(pageNumber + 1); // PDF.js uses 1-based page numbers

    // Determine the dimensions for the rendered page
    const viewport = page.getViewport({ scale });

    // Create a canvas and context
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Could not get canvas context");
    }

    // Render the PDF page to the canvas
    const renderContext = {
      canvasContext: ctx,
      viewport,
    };

    await page.render(renderContext).promise;

    // Convert the canvas to an image data URL
    return canvas.toDataURL("image/png");
  } catch (error) {
    console.error("Error rendering PDF page:", error);

    // Fallback to a blank canvas with error text
    const canvas = document.createElement("canvas");
    canvas.width = 120;
    canvas.height = 160;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#FF0000";
      ctx.font = "10px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Error loading page", canvas.width / 2, canvas.height / 2);
      ctx.fillText(
        `Page ${pageNumber + 1}`,
        canvas.width / 2,
        canvas.height / 2 + 20
      );
    }

    return canvas.toDataURL("image/png");
  }
}
