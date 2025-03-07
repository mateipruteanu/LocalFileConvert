export type SupportedFileType = "jpg" | "jpeg" | "png" | "pdf";

export default class FileUtils {
  private static readonly SUPPORTED_EXTENSIONS: readonly SupportedFileType[] = [
    "jpg",
    "jpeg",
    "png",
    "pdf",
  ] as const;

  /**
   * Extracts the file extension from a filename
   * @param fileName The name of the file
   * @returns The lowercase extension or null if no extension found
   */
  public static getFileType(fileName: string): string | null {
    if (!fileName.includes(".")) {
      return null;
    }
    return fileName.split(".").pop()?.toLowerCase() || null;
  }

  /**
   * Checks if the given file has a supported extension
   * @param file The file to check
   * @returns boolean indicating if the file type is supported
   */
  public static isValidFileType(file: File): boolean {
    const type = this.getFileType(file.name);
    return (
      type !== null &&
      this.SUPPORTED_EXTENSIONS.includes(type as SupportedFileType)
    );
  }
}
