// Matches a route pattern like "/collections/:handle" against a pathname,
// capturing ":name" segments. Returns null on no match, or a (possibly
// empty) params object on match. "*" as the final segment matches anything.
// Plain TS (no JSX) so it can be unit-tested directly via `node --test`
// without pulling in a JSX-containing module.
export function matchPath(pattern: string, pathname: string): Record<string, string> | null {
  const patternParts = pattern.split("/").filter(Boolean);
  const pathParts = pathname.split("/").filter(Boolean);

  if (patternParts[patternParts.length - 1] === "*") {
    return {};
  }

  if (patternParts.length !== pathParts.length) return null;

  const params: Record<string, string> = {};
  for (let i = 0; i < patternParts.length; i++) {
    const pp = patternParts[i];
    if (pp.startsWith(":")) {
      params[pp.slice(1)] = decodeURIComponent(pathParts[i]);
    } else if (pp !== pathParts[i]) {
      return null;
    }
  }
  return params;
}
