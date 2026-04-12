import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import { DataTable } from "../components/data-table";
import { GrowthChart } from "../components/growth-chart";
import { MetricCard } from "../components/metric-card";
import { SectionHeader } from "../components/section-header";
import { Card } from "../components/ui/card";
import { getPortfolio } from "../lib/api";
import { formatDate, formatNumber, formatPercent } from "../lib/utils";

export function PortfolioPage(): JSX.Element {
  const query = useQuery({
    queryKey: ["portfolio"],
    queryFn: getPortfolio,
  });

  const portfolio = query.data;
  if (!portfolio) {
    return <div className="text-sm text-muted">Loading portfolio...</div>;
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Portfolio"
        title="Active funding positions"
        description="Track capital returned so far, projected remaining payout, and expected return by instrument."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total invested" value={`$${formatNumber(portfolio.total_invested)}`} />
        <MetricCard label="Returned so far" value={`$${formatNumber(portfolio.total_returned)}`} />
        <MetricCard label="Outstanding payout" value={`$${formatNumber(portfolio.outstanding_expected_payout)}`} />
        <MetricCard label="Expected total return" value={`$${formatNumber(portfolio.expected_total_return)}`} />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Creators backed" value={String(portfolio.creators_backed)} />
        <MetricCard label="Active deals" value={String(portfolio.active_deals)} />
        <MetricCard label="Completed deals" value={String(portfolio.completed_deals)} />
        <MetricCard
          label="Best performer"
          value={portfolio.best_performer ? portfolio.best_performer.opportunity_name : "N/A"}
          detail={portfolio.best_performer ? formatPercent(portfolio.best_performer.total_return_percent) : undefined}
        />
      </div>
      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <Card className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Category allocation</h2>
          <div className="space-y-3">
            {portfolio.allocations.map((allocation) => (
              <div key={allocation.label} className="flex items-center justify-between text-sm">
                <span className="capitalize text-muted">{allocation.label}</span>
                <span className="tabular-nums text-white">${formatNumber(allocation.value)}</span>
              </div>
            ))}
          </div>
        </Card>
        <GrowthChart
          title="Payout trajectory"
          data={portfolio.performance_history}
          area
          strokeColor="#22c55e"
          formatValue={(value) => `$${formatNumber(value)}`}
        />
      </div>
      <div className="grid gap-4">
        <DataTable
          rows={portfolio.positions}
          columns={[
            {
              key: "creator",
              header: "Creator",
              render: (row) => <Link to={`/creators/${row.creator_slug}`}>{row.creator_name}</Link>,
            },
            { key: "return_model", header: "Return model", render: (row) => row.instrument_type === "revenue_share" ? "Share of creator revenue" : "Project-based return" },
            { key: "description", header: "Description", render: (row) => row.opportunity_name },
            { key: "amount", header: "Amount", render: (row) => `$${formatNumber(row.amount)}` },
            { key: "returned", header: "Returned", render: (row) => `$${formatNumber(row.amount_returned)}` },
            { key: "remaining", header: "Remaining", render: (row) => `$${formatNumber(row.projected_remaining_payout)}` },
            { key: "expected_payout", header: "Expected payout", render: (row) => `$${formatNumber(row.expected_total_payout)}` },
            {
              key: "return",
              header: "Return",
              render: (row) => (
                <span className={row.total_return_percent >= 0 ? "text-success" : "text-red-400"}>
                  {formatPercent(row.total_return_percent)}
                </span>
              ),
            },
            { key: "status", header: "Status", render: (row) => row.status },
            { key: "date", header: "Date", render: (row) => formatDate(row.created_at) },
          ]}
        />
      </div>
    </div>
  );
}
