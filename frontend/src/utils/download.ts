export function getFilenameFromDisposition(disposition: string | undefined, fallbackFilename: string) {
  if (!disposition) {
    return fallbackFilename;
  }

  const utf8Match = disposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1]);
  }

  const filenameMatch = disposition.match(/filename="?([^"]+)"?/i);
  if (filenameMatch?.[1]) {
    return filenameMatch[1];
  }

  return fallbackFilename;
}

export function downloadBlob(blobData: BlobPart, filename: string) {
  const blob = blobData instanceof Blob ? blobData : new Blob([blobData], { type: 'application/pdf' });
  const objectUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = objectUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();

  window.setTimeout(() => window.URL.revokeObjectURL(objectUrl), 1000);
}
