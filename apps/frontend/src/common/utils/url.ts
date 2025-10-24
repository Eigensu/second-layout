// Utility to build API URLs consistently across the app
// - Ensures single slashes between segments
// - Optional trailing slash to avoid FastAPI 307 redirects on list endpoints
// - Accepts query params as a plain object
export function buildApiUrl(
  base: string,
  path: string,
  params?: Record<string, string | number | boolean | undefined | null>,
  options?: { trailingSlash?: boolean }
): string {
  const cleanBase = base.replace(/\/$/, "");
  let cleanPath = path.startsWith("/") ? path : `/${path}`;
  if (options?.trailingSlash && !cleanPath.endsWith("/")) {
    cleanPath = `${cleanPath}/`;
  }

  const url = `${cleanBase}${cleanPath}`;

  if (!params) return url;

  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    query.append(key, String(value));
  }

  const qs = query.toString();
  return qs ? `${url}?${qs}` : url;
}
