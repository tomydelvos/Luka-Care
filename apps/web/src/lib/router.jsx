import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

// Router kecil tanpa dependency: mendukung mode "history" (URL bersih),
// "hash" (#/rute) untuk hosting tanpa SPA fallback, dan "memory" (URL tidak
// berubah) untuk pratinjau di dalam iframe/sandbox.
// Bisa diganti react-router kapan saja; API-nya sengaja dibuat mirip.

const RouterContext = createContext(null);

function readLocation(mode) {
  if (mode === "memory") return "/";
  if (mode === "hash") {
    const raw = window.location.hash.replace(/^#/, "");
    return raw.startsWith("/") ? raw : "/";
  }
  return window.location.pathname + window.location.search;
}

export function RouterProvider({ mode = "history", children }) {
  const [location, setLocation] = useState(() => readLocation(mode));
  const memoryStack = useRef(["/"]);

  useEffect(() => {
    if (mode === "memory") return undefined;
    const sync = () => setLocation(readLocation(mode));
    const event = mode === "hash" ? "hashchange" : "popstate";
    window.addEventListener(event, sync);
    return () => window.removeEventListener(event, sync);
  }, [mode]);

  const navigate = useCallback(
    (to, { replace = false } = {}) => {
      if (mode === "memory") {
        const stack = memoryStack.current;
        if (typeof to === "number") {
          if (stack.length > 1) stack.splice(Math.max(1, stack.length + to));
        } else if (replace) {
          stack[stack.length - 1] = to;
        } else {
          stack.push(to);
        }
        setLocation(stack[stack.length - 1]);
        window.scrollTo({ top: 0 });
        return;
      }
      if (typeof to === "number") {
        window.history.go(to);
        return;
      }
      if (mode === "hash") {
        const url = `${window.location.pathname}${window.location.search}#${to}`;
        if (replace) window.history.replaceState(null, "", url);
        else window.history.pushState(null, "", url);
      } else if (replace) {
        window.history.replaceState(null, "", to);
      } else {
        window.history.pushState(null, "", to);
      }
      setLocation(readLocation(mode));
      window.scrollTo({ top: 0 });
    },
    [mode]
  );

  const value = useMemo(() => {
    const [pathname, search = ""] = location.split("?");
    return {
      mode,
      pathname: pathname || "/",
      query: new URLSearchParams(search),
      navigate,
      href: (to) => (mode === "hash" ? `#${to}` : mode === "memory" ? "#" : to),
    };
  }, [location, mode, navigate]);

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error("useRouter harus dipakai di dalam <RouterProvider>");
  return ctx;
}

export function matchPath(pattern, pathname) {
  const p = pattern.split("/").filter(Boolean);
  const s = pathname.split("/").filter(Boolean);
  if (pattern.endsWith("/*")) {
    if (s.length < p.length - 1) return null;
  } else if (p.length !== s.length) {
    return null;
  }
  const params = {};
  for (let i = 0; i < p.length; i += 1) {
    if (p[i] === "*") break;
    if (p[i].startsWith(":")) params[p[i].slice(1)] = decodeURIComponent(s[i]);
    else if (p[i] !== s[i]) return null;
  }
  return params;
}

export function Routes({ routes, fallback }) {
  const { pathname } = useRouter();
  for (const route of routes) {
    const params = matchPath(route.path, pathname);
    if (params) return route.render(params);
  }
  return fallback ?? null;
}

export function Link({ to, replace, onClick, children, ...props }) {
  const { navigate, href } = useRouter();
  const handleClick = (event) => {
    onClick?.(event);
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      props.target === "_blank"
    ) {
      return;
    }
    event.preventDefault();
    navigate(to, { replace });
  };
  return (
    <a href={href(to)} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}

export function isActivePath(pathname, to) {
  if (to === "/") return pathname === "/";
  return pathname === to || pathname.startsWith(`${to}/`);
}
