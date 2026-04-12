type TrendValueProps = {
  value: string;
  change: number;
};

export function TrendValue({ value, change }: TrendValueProps): JSX.Element {
  const positive = change >= 0;

  return (
    <span className="inline-flex items-center gap-1">
      <span>{value}</span>
      <span className={positive ? "text-success" : "text-red-400"}>
        {positive ? "↑" : "↓"}
      </span>
    </span>
  );
}
