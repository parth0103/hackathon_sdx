import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import App from "./App";
import { ToastProvider } from "./contexts/toast-context";
import { WatchlistProvider } from "./contexts/watchlist-context";
import "./index.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <WatchlistProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </WatchlistProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
