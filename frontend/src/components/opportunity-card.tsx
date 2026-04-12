import type { Opportunity } from "../types/api";
import { formatNumber, formatPercent } from "../lib/utils";
import { Card } from "./ui/card";

type OpportunityCardProps = {
  opportunity: Opportunity;
  onSelect: (opportunity: Opportunity) => void;
};

export function OpportunityCard({
  opportunity,
  onSelect,
}: OpportunityCardProps): JSX.Element {
  return (
    <button className="w-full text-left" onClick={() => onSelect(opportunity)}>
      <Card className="h-full space-y-4 transition hover:border-accent/60">
        <div className="flex items-center gap-3">
          <img
            src={opportunity.creator_avatar_url}
            alt={opportunity.creator_name}
            className="h-12 w-12 rounded-full object-cover"
          />
          <div>
            <p className="text-base font-semibold text-white">{opportunity.title}</p>
            <p className="text-sm text-muted">
              {opportunity.creator_name} · {opportunity.instrument_type === "revenue_share" ? "Revenue share" : "Project finance"}
            </p>
          </div>
        </div>
        <p className="text-sm text-slate-200">{opportunity.summary}</p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted">Funding goal</p>
            <p className="tabular-nums font-semibold text-white">
              ${formatNumber(opportunity.funding_goal)}
            </p>
          </div>
          <div>
            <p className="text-muted">Raised</p>
            <p className="tabular-nums font-semibold text-white">
              ${formatNumber(opportunity.capital_raised)}
            </p>
          </div>
          <div>
            <p className="text-muted">Expected return</p>
            <p className="tabular-nums font-semibold text-success">
              {formatPercent(opportunity.expected_return_min)} - {formatPercent(opportunity.expected_return_max)}
            </p>
          </div>
          <div>
            <p className="text-muted">Minimum</p>
            <p className="tabular-nums font-semibold text-white">
              ${formatNumber(opportunity.min_investment)}
            </p>
          </div>
        </div>
      </Card>
    </button>
  );
}
