import type { Worker, createWorker } from "tesseract.js";

interface TesseractModule {
  createWorker: typeof createWorker;
}

let worker: Worker | null = null;
let Tesseract: TesseractModule | null = null;

const SUPPORTED_LANGUAGES: string[] = ["eng", "ron"];
type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export async function initializeOCR(): Promise<Worker | null> {
  // Early return for server-side
  if (typeof window === "undefined") return null;

  try {
    if (!Tesseract) {
      // Dynamic import for client-side only
      Tesseract = (await import("tesseract.js")) as TesseractModule;
    }

    if (!worker) {
      worker = await Tesseract.createWorker(SUPPORTED_LANGUAGES);
    }

    return worker;
  } catch (error) {
    console.error("Failed to initialize OCR:", error);
    await terminateOCR();
    throw new Error("OCR initialization failed");
  }
}

export async function performOCR(
  imageFile: File,
  language: SupportedLanguage = "eng"
): Promise<string> {
  if (typeof window === "undefined") {
    throw new Error("OCR can only be performed in browser environment");
  }

  if (!imageFile.type.startsWith("image/")) {
    throw new Error("Invalid file type. Please provide an image file.");
  }

  try {
    const currentWorker = await initializeOCR();
    if (!currentWorker) {
      throw new Error("Failed to initialize OCR worker");
    }

    // Convert file to base64 using a more robust method
    const base64Image = await fileToBase64(imageFile);

    // Set language if different from current
    if (language !== SUPPORTED_LANGUAGES[0]) {
      await currentWorker.setParameters({
        lang: language,
      });
    }

    const {
      data: { text },
    } = await currentWorker.recognize(base64Image);
    return text.trim();
  } catch (error) {
    console.error("OCR Error:", error);
    throw new Error("Failed to extract text from image");
  }
}

export async function terminateOCR(): Promise<void> {
  if (worker) {
    try {
      await worker.terminate();
    } catch (error) {
      console.error("Error terminating OCR worker:", error);
    } finally {
      worker = null;
      Tesseract = null;
    }
  }
}

// Helper function for more reliable file to base64 conversion
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to convert file to base64"));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

// Cleanup function for component unmount
export function useOCRCleanup(): () => Promise<void> {
  return async () => {
    await terminateOCR();
  };
}
