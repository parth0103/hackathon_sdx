import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";

const STORAGE_KEY = "creator-market-watchlist";

type WatchlistContextValue = {
  items: string[];
  has: (slug: string) => boolean;
  toggle: (slug: string) => void;
};

const WatchlistContext = createContext<WatchlistContextValue | null>(null);

export function WatchlistProvider({ children }: PropsWithChildren): JSX.Element {
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setItems(JSON.parse(stored) as string[]);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo<WatchlistContextValue>(
    () => ({
      items,
      has: (slug: string) => items.includes(slug),
      toggle: (slug: string) => {
        setItems((current) =>
          current.includes(slug)
            ? current.filter((item) => item !== slug)
            : [...current, slug],
        );
      },
    }),
    [items],
  );

  return <WatchlistContext.Provider value={value}>{children}</WatchlistContext.Provider>;
}

export function useWatchlist(): WatchlistContextValue {
  const context = useContext(WatchlistContext);
  if (context === null) {
    throw new Error("useWatchlist must be used within WatchlistProvider");
  }
  return context;
}
