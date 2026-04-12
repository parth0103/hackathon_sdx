import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";

type ToastItem = {
  id: number;
  title: string;
  description: string;
};

type ToastContextValue = {
  showToast: (title: string, description: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: PropsWithChildren): JSX.Element {
  const [items, setItems] = useState<ToastItem[]>([]);

  const showToast = useCallback((title: string, description: string) => {
    const id = Date.now();
    setItems((current) => [...current, { id, title, description }]);
    window.setTimeout(() => {
      setItems((current) => current.filter((item) => item.id !== id));
    }, 3500);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-80 flex-col gap-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-2xl border border-border bg-panel p-4 shadow-xl">
            <p className="text-sm font-semibold text-white">{item.title}</p>
            <p className="mt-1 text-sm text-muted">{item.description}</p>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (context === null) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
