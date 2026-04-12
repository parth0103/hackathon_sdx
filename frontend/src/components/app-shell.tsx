import { NavLink, Outlet, useLocation } from "react-router-dom";

import { useWatchlist } from "../contexts/watchlist-context";
import { cn } from "../lib/utils";

const links = [
  { to: "/", label: "Overview", end: true },
  { to: "/discover", label: "Discover" },
  { to: "/watchlist", label: "Watchlist" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/methodology", label: "Methodology" },
];

export function AppShell(): JSX.Element {
  const watchlist = useWatchlist();
  const location = useLocation();
  const isLandingPage = location.pathname === "/";

  return (
    <div className="min-h-screen">
      {isLandingPage ? null : (
        <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <NavLink to="/" className="text-sm font-semibold tracking-[0.24em] text-white">
              CREATOR MARKET
            </NavLink>
            <nav className="flex items-center gap-1">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  end={link.end}
                  to={link.to}
                  className={({ isActive }) =>
                    cn(
                      "rounded-md px-3 py-2 text-sm text-muted transition hover:text-white",
                      isActive && "bg-white/5 text-white",
                    )
                  }
                >
                  {link.label}
                  {link.to === "/watchlist" ? ` (${watchlist.items.length})` : ""}
                </NavLink>
              ))}
            </nav>
          </div>
        </header>
      )}
      <main className={cn("mx-auto max-w-7xl px-6 py-8", isLandingPage && "px-8 py-8")}>
        <Outlet />
      </main>
    </div>
  );
}
