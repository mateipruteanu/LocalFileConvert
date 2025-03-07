import FileUtils from "./file-utils";

export type SupportedFileType = "pdf" | "jpg" | "jpeg" | "png";

export const conversionMap: Record<SupportedFileType, SupportedFileType[]> = {
  pdf: [],
  jpg: ["pdf", "png"],
  jpeg: ["pdf", "png"],
  png: ["pdf", "jpg"],
};

/**
 * Returns the available conversions for a given source type
 * @param sourceType The source file type
 * @returns An array of supported file types that can be converted from the source type
 * @example
 *  getAvailableConversions("jpg") // returns ["pdf", "png"]
 */
export function getAvailableConversionsForType(
  sourceType: SupportedFileType
): SupportedFileType[] {
  return conversionMap[sourceType] || [];
}

/**
 * Checks if a conversion is supported between two file types
 * @param sourceType The source file type
 * @param targetType The target file type
 * @returns A boolean indicating if the conversion is supported
 * @example
 * isConversionSupported("jpg", "pdf") // returns true
 * isConversionSupported("pdf", "jpg") // returns false
 */
export function isConversionSupported(
  sourceType: SupportedFileType,
  targetType: SupportedFileType
): boolean {
  return conversionMap[sourceType]?.includes(targetType) || false;
}

/**
 * Returns the available conversions for a given filename
 * @param filename The name of the file
 * @returns An array of supported file types that can be converted from the file type
 */
export function getAvailableConversions(filename: string): SupportedFileType[] {
  const fileType = FileUtils.getFileType(filename);
  if (!fileType) return [];
  return getAvailableConversionsForType(fileType as SupportedFileType);
}
