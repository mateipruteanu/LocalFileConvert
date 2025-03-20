import { SupportedFileType } from "@/utils/conversion-map";

export interface ConversionRoute {
  id: string;
  sourceFormat: SupportedFileType;
  targetFormat: SupportedFileType;
  path: string;
  title: string;
  description: string;
  sourceFormatName: string;
  targetFormatName: string;
}

export const conversionRoutes: ConversionRoute[] = [
  {
    id: "jpg-to-pdf",
    sourceFormat: "jpg",
    targetFormat: "pdf",
    path: "/convert/jpg-to-pdf",
    title: "Convert JPG to PDF Online | LocalFileConvert",
    description:
      "Convert JPG images to PDF files securely in your browser. No uploads required - all processing happens locally for complete privacy.",
    sourceFormatName: "JPG",
    targetFormatName: "PDF",
  },
  {
    id: "png-to-pdf",
    sourceFormat: "png",
    targetFormat: "pdf",
    path: "/convert/png-to-pdf",
    title: "Convert PNG to PDF Online | LocalFileConvert",
    description:
      "Convert PNG images to PDF documents locally in your browser. Private, secure, and no server uploads required.",
    sourceFormatName: "PNG",
    targetFormatName: "PDF",
  },
  {
    id: "jpg-to-png",
    sourceFormat: "jpg",
    targetFormat: "png",
    path: "/convert/jpg-to-png",
    title: "Convert JPG to PNG Online | LocalFileConvert",
    description:
      "Convert JPG images to PNG format with transparency support. All processing happens in your browser for complete privacy.",
    sourceFormatName: "JPG",
    targetFormatName: "PNG",
  },
  {
    id: "png-to-jpg",
    sourceFormat: "png",
    targetFormat: "jpg",
    path: "/convert/png-to-jpg",
    title: "Convert PNG to JPG Online | LocalFileConvert",
    description:
      "Convert PNG images to JPG format with adjustable quality. Secure, private conversion happens right in your browser.",
    sourceFormatName: "PNG",
    targetFormatName: "JPG",
  },
  {
    id: "jpg-to-txt",
    sourceFormat: "jpg",
    targetFormat: "txt",
    path: "/convert/jpg-to-txt",
    title: "Extract Text from JPG Images Online | LocalFileConvert",
    description:
      "Extract text from JPG images with OCR technology. All processing happens in your browser for complete privacy.",
    sourceFormatName: "JPG",
    targetFormatName: "Text",
  },
  {
    id: "png-to-txt",
    sourceFormat: "png",
    targetFormat: "txt",
    path: "/convert/png-to-txt",
    title: "Extract Text from PNG Images Online | LocalFileConvert",
    description:
      "Extract text from PNG images with OCR technology. All processing happens in your browser for complete privacy.",
    sourceFormatName: "PNG",
    targetFormatName: "Text",
  },
  // {
  //   id: "pdf-to-jpg",
  //   sourceFormat: "pdf",
  //   targetFormat: "jpg",
  //   path: "/convert/pdf-to-jpg",
  //   title: "Convert PDF to JPG Online | LocalFileConvert",
  //   description:
  //     "Convert PDF pages to JPG images securely in your browser. No uploads required - all processing happens locally for complete privacy.",
  //   sourceFormatName: "PDF",
  //   targetFormatName: "JPG",
  // },
  // {
  //   id: "pdf-to-png",
  //   sourceFormat: "pdf",
  //   targetFormat: "png",
  //   path: "/convert/pdf-to-png",
  //   title: "Convert PDF to PNG Online | LocalFileConvert",
  //   description:
  //     "Convert PDF documents to PNG images locally in your browser. Private, secure, and no server uploads required.",
  //   sourceFormatName: "PDF",
  //   targetFormatName: "PNG",
  // },
];

export function getConversionFromPath(
  path: string
): ConversionRoute | undefined {
  const conversionId = path.split("/").pop();
  return conversionRoutes.find((route) => route.id === conversionId);
}

export function getAllConversionPaths(): string[] {
  return conversionRoutes.map((route) => route.path);
}
