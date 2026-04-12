import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { GrowthPoint } from "../types/api";
import { Card } from "./ui/card";

type GrowthChartProps = {
  title: string;
  data: GrowthPoint[];
  suffix?: string;
  area?: boolean;
  strokeColor?: string;
  formatValue?: (value: number) => string;
};

export function GrowthChart({
  title,
  data,
  suffix = "%",
  area = false,
  strokeColor = "#7cc8ff",
  formatValue,
}: GrowthChartProps): JSX.Element {
  const ChartComponent = area ? AreaChart : LineChart;
  return (
    <Card className="space-y-4">
      <p className="text-sm font-medium text-white">{title}</p>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ChartComponent data={data}>
            <CartesianGrid stroke="#1c2433" vertical={false} />
            <XAxis dataKey="label" stroke="#8b93a7" />
            <YAxis stroke="#8b93a7" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#101624",
                border: "1px solid #232834",
                borderRadius: 12,
              }}
              formatter={(value: number) => [formatValue ? formatValue(value) : `${value}${suffix}`, title]}
            />
            {area ? (
              <>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={strokeColor}
                  fill={strokeColor}
                  fillOpacity={0.08}
                  strokeWidth={2}
                />
                <Line type="monotone" dataKey="value" stroke={strokeColor} strokeWidth={2} dot={false} />
              </>
            ) : (
              <Line
                type="monotone"
                dataKey="value"
                stroke={strokeColor}
                strokeWidth={2}
                dot={{ fill: strokeColor }}
              />
            )}
          </ChartComponent>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
