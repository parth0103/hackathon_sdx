import { createBrowserRouter } from "react-router-dom";

import { AppShell } from "../components/app-shell";
import { CreatorPage } from "../pages/creator-page";
import { DiscoveryPage } from "../pages/discovery-page";
import { LandingPage } from "../pages/landing-page";
import { MethodologyPage } from "../pages/methodology-page";
import { PortfolioPage } from "../pages/portfolio-page";
import { WatchlistPage } from "../pages/watchlist-page";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: "discover", element: <DiscoveryPage /> },
      { path: "creators/:slug", element: <CreatorPage /> },
      { path: "watchlist", element: <WatchlistPage /> },
      { path: "portfolio", element: <PortfolioPage /> },
      { path: "methodology", element: <MethodologyPage /> },
    ],
  },
]);
