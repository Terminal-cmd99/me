export function assetPath(fileName: string) {
  const base = import.meta.env.BASE_URL || '/';
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  const normalizedFile = fileName.startsWith('/') ? fileName.slice(1) : fileName;

  return `${normalizedBase}${normalizedFile}`;
}
