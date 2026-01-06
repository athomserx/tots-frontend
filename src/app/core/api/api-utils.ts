/**
 * Builds a complete URL by appending query parameters to a base URL
 * @param baseUrl The base URL
 * @param queryParams Optional query string (with or without leading ?)
 * @returns The complete URL with properly formatted query parameters
 */
export function buildUrlWithParams(baseUrl: string, queryParams?: string): string {
  if (!queryParams) {
    return baseUrl;
  }

  // Ensure query params start with ? if not already present
  const separator = queryParams.startsWith('?') ? '' : '?';
  return `${baseUrl}${separator}${queryParams}`;
}
