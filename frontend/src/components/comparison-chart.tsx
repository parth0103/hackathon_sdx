import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card } from "./ui/card";

type ComparisonPoint = {
  label: string;
  primary: number;
  secondary?: number;
};

type ComparisonChartProps = {
  title: string;
  data: ComparisonPoint[];
  primaryLabel: string;
  secondaryLabel?: string;
  formatValue?: (value: number) => string;
};

export function ComparisonChart({
  title,
  data,
  primaryLabel,
  secondaryLabel,
  formatValue,
}: ComparisonChartProps): JSX.Element {
  return (
    <Card className="space-y-4">
      <p className="text-sm font-medium text-white">{title}</p>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid stroke="#1c2433" vertical={false} />
            <XAxis dataKey="label" stroke="#8b93a7" tickLine={false} axisLine={false} />
            <YAxis stroke="#8b93a7" tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#101624",
                border: "1px solid #232834",
                borderRadius: 12,
              }}
              formatter={(value: number, name: string) => [
                formatValue ? formatValue(value) : value.toFixed(1),
                name,
              ]}
            />
            <Legend />
            <Bar dataKey="primary" name={primaryLabel} fill="#ef4444" radius={[6, 6, 0, 0]} />
            {secondaryLabel ? (
              <Bar dataKey="secondary" name={secondaryLabel} fill="#7cc8ff" radius={[6, 6, 0, 0]} />
            ) : null}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
