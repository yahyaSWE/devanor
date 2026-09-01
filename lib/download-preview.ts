const WORD_MIME_TYPES = new Set([
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export function isWordDownload(mimeType: string, fileName: string): boolean {
  return (
    WORD_MIME_TYPES.has(mimeType.toLowerCase()) ||
    fileName.toLowerCase().endsWith(".docx")
  );
}

export function isImageDownload(mimeType: string): boolean {
  return mimeType.toLowerCase().startsWith("image/");
}

export function isPreviewableDownload(
  mimeType: string,
  fileName: string,
): boolean {
  return (
    isImageDownload(mimeType) ||
    mimeType.toLowerCase() === "application/pdf" ||
    isWordDownload(mimeType, fileName)
  );
}
