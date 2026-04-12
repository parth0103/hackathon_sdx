import { useState } from "react";

type InfoTooltipProps = {
  label: string;
  content: string;
};

export function InfoTooltip({ label, content }: InfoTooltipProps): JSX.Element {
  const [open, setOpen] = useState(false);

  return (
    <span
      className="relative inline-flex items-center gap-1"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <span>{label}</span>
      <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-border text-[10px] text-muted">
        i
      </span>
      {open ? (
        <span className="absolute left-0 top-6 z-20 w-64 rounded-xl border border-border bg-panel p-3 text-xs font-normal leading-5 text-slate-200 shadow-xl">
          {content}
        </span>
      ) : null}
    </span>
  );
}
