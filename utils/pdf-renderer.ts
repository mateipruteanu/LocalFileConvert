import * as pdfjsLib from "pdfjs-dist";

// Initialize the PDF.js worker
let initialized = false;

export async function initPdfRenderer() {
  if (!initialized) {
    const pdfjsWorker = "/pdf.worker.mjs";

    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
    initialized = true;
  }
}

/**
 * Loads a PDF document for rendering multiple pages
 * @param pdfData ArrayBuffer containing the PDF data
 * @returns The loaded PDF document
 */
export async function loadPdfDocument(pdfData: ArrayBuffer) {
  await initPdfRenderer();
  // Create a copy of the buffer to prevent detachment issues
  const copy = new Uint8Array(pdfData.slice(0));
  const loadingTask = pdfjsLib.getDocument({ data: copy });
  return loadingTask.promise;
}

/**
 * Renders a PDF page to an image
 * @param pdfDocument The loaded PDF document
 * @param pageIndex 0-based index of the page to render
 * @returns A data URL of the rendered page
 */
export async function renderPdfPageToImage(
  pdfDocument: pdfjsLib.PDFDocumentProxy,
  pageIndex: number
): Promise<string> {
  try {
    // Get the requested page (PDF.js uses 1-based page numbers)
    const page = await pdfDocument.getPage(pageIndex + 1);

    // Set desired scale for the preview (smaller for thumbnails)
    const scale = 0.5;
    const viewport = page.getViewport({ scale });

    // Set up canvas
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    if (!context) {
      throw new Error("Failed to get canvas context");
    }

    // Render the PDF page to the canvas
    const renderContext = {
      canvasContext: context,
      viewport,
    };

    await page.render(renderContext).promise;

    // Return the canvas as an image data URL
    return canvas.toDataURL("image/png");
  } catch (error) {
    console.error("Error rendering PDF page:", error);

    // Create a fallback image on error
    const canvas = document.createElement("canvas");
    canvas.width = 150;
    canvas.height = 200;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      // Fill with white background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add error message
      ctx.fillStyle = "#ff0000";
      ctx.font = "12px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Error rendering", canvas.width / 2, canvas.height / 2 - 10);
      ctx.fillText(
        `Page ${pageIndex + 1}`,
        canvas.width / 2,
        canvas.height / 2 + 10
      );
    }

    return canvas.toDataURL("image/png");
  }
}
