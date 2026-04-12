import * as Dialog from "@radix-ui/react-dialog";
import { useNavigate } from "react-router-dom";

import type { Opportunity } from "../types/api";
import { formatNumber, formatPercent } from "../lib/utils";
import { Button } from "./ui/button";

type OpportunitySheetProps = {
  opportunity: Opportunity | null;
  onClose: () => void;
};

export function OpportunitySheet({
  opportunity,
  onClose,
}: OpportunitySheetProps): JSX.Element {
  const navigate = useNavigate();

  return (
    <Dialog.Root open={opportunity !== null} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-x-0 bottom-0 top-[72px] bg-black/60" />
        <Dialog.Content className="fixed right-0 top-[72px] h-[calc(100vh-72px)] w-full max-w-xl overflow-y-auto overscroll-contain border-l border-border bg-panel p-6 pb-8">
          {opportunity ? (
            <div className="space-y-6">
              <div>
                <Dialog.Title className="text-2xl font-semibold text-white">
                  {opportunity.title}
                </Dialog.Title>
                <Dialog.Description className="mt-2 text-sm text-muted">
                  {opportunity.creator_name} · {opportunity.instrument_type === "revenue_share" ? "Revenue share note" : "Project finance round"}
                </Dialog.Description>
              </div>
              <p className="text-sm text-slate-200">{opportunity.summary}</p>
              <div className="grid grid-cols-2 gap-4 rounded-2xl border border-border bg-black/10 p-4 text-sm">
                <div>
                  <p className="text-muted">Funding goal</p>
                  <p className="font-semibold text-white">${formatNumber(opportunity.funding_goal)}</p>
                </div>
                <div>
                  <p className="text-muted">Capital raised</p>
                  <p className="font-semibold text-white">${formatNumber(opportunity.capital_raised)}</p>
                </div>
                <div>
                  <p className="text-muted">Expected return</p>
                  <p className="font-semibold text-success">
                    {formatPercent(opportunity.expected_return_min)} - {formatPercent(opportunity.expected_return_max)}
                  </p>
                </div>
                <div>
                  <p className="text-muted">Payout timeline</p>
                  <p className="font-semibold text-white">{opportunity.payout_timeline}</p>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white">What the investor is funding</h3>
                <ul className="space-y-2 text-sm text-slate-200">
                  {opportunity.use_of_funds.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white">What the investor gets back</h3>
                <ul className="space-y-2 text-sm text-slate-200">
                  {opportunity.revenue_streams.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-border bg-black/10 p-4 text-sm text-slate-200">
                <p><span className="text-muted">Return model:</span> {opportunity.instrument_type === "revenue_share" ? "Share of creator revenue" : "Project-based return"}</p>
                <p><span className="text-muted">Average expected return:</span> {formatPercent(opportunity.expected_return_avg)}</p>
                <p><span className="text-muted">Return range:</span> {formatPercent(opportunity.expected_return_min)} - {formatPercent(opportunity.expected_return_max)}</p>
              </div>
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => {
                  onClose();
                  navigate(`/creators/${opportunity.creator_slug}`);
                }}
              >
                Know more
              </Button>
              <Button variant="ghost" className="w-full" onClick={onClose}>
                Close
              </Button>
            </div>
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
