import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type AnchorHTMLAttributes,
  type ComponentType,
  type MouseEvent,
  type ReactNode,
} from "react";
import { matchPath } from "./matchPath";

export { matchPath };

export type RouteParams = Record<string, string>;

export interface RouteDefinition {
  path: string;
  component: ComponentType<{ params: RouteParams }>;
}

interface NavigateOptions {
  replace?: boolean;
}

interface RouterContextValue {
  pathname: string;
  search: string;
  navigate: (to: string, options?: NavigateOptions) => void;
}

interface Location {
  pathname: string;
  search: string;
}

const RouterContext = createContext<RouterContextValue>({
  pathname: "/",
  search: "",
  navigate: () => {},
});

function getLocation(): Location {
  if (typeof window === "undefined") return { pathname: "/", search: "" };
  return { pathname: window.location.pathname || "/", search: window.location.search || "" };
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState(getLocation);

  useEffect(() => {
    const onPopState = () => setLocation(getLocation());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigate = useCallback((to: string, { replace = false }: NavigateOptions = {}) => {
    const url = to.startsWith("/") ? to : `/${to}`;
    if (replace) window.history.replaceState({}, "", url);
    else window.history.pushState({}, "", url);
    setLocation(getLocation());
  }, []);

  const value = useMemo(
    () => ({ pathname: location.pathname, search: location.search, navigate }),
    [location, navigate]
  );

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRouter(): RouterContextValue {
  return useContext(RouterContext);
}

type SearchParamsUpdater = URLSearchParams | ((params: URLSearchParams) => URLSearchParams | void);

export function useSearchParams(): [URLSearchParams, (updater: SearchParamsUpdater, opts?: NavigateOptions) => void] {
  const { search, pathname, navigate } = useRouter();
  const params = useMemo(() => new URLSearchParams(search), [search]);

  const setSearchParams = useCallback(
    (updater: SearchParamsUpdater, opts?: NavigateOptions) => {
      const next = new URLSearchParams(search);
      const patch = typeof updater === "function" ? updater(next) || next : updater;
      const merged = patch instanceof URLSearchParams ? patch : new URLSearchParams(patch);
      const query = merged.toString();
      navigate(query ? `${pathname}?${query}` : pathname, opts);
    },
    [search, pathname, navigate]
  );

  return [params, setSearchParams];
}

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
}

export function Link({ to, children, onClick, ...rest }: LinkProps) {
  const { navigate } = useRouter();

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    if (onClick) onClick(e);
    if (e.defaultPrevented) return;
    const isModified = e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button === 1;
    if (isModified) return; // let ctrl/cmd/shift/middle-click open in a new tab natively
    e.preventDefault();
    navigate(to);
  }

  return (
    <a href={to} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}

export function Routes({ routes }: { routes: RouteDefinition[] }) {
  const { pathname } = useRouter();

  for (const route of routes) {
    const params = matchPath(route.path, pathname);
    if (params) {
      const Page = route.component;
      // key={pathname} remounts the page on every path change, which is what
      // resets PLP/blog pagination state cleanly when navigating to a new
      // collection/blog rather than leaking stale cursor caches across pages.
      return <Page key={pathname} params={params} />;
    }
  }
  return null;
}
