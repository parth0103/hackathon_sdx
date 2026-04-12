import * as Dialog from "@radix-ui/react-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";

import { createInvestment } from "../lib/api";
import { useToast } from "../contexts/toast-context";
import { cn, formatNumber } from "../lib/utils";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

type InvestDialogProps = {
  opportunityId: string;
  creatorName: string;
  opportunityName: string;
  instrumentType: string;
  payoutTimeline: string;
  triggerLabel?: string;
  triggerClassName?: string;
};

const amounts = [10, 25, 50, 100];

export function InvestDialog({
  opportunityId,
  creatorName,
  opportunityName,
  instrumentType,
  payoutTimeline,
  triggerLabel = "Invest",
  triggerClassName,
}: InvestDialogProps): JSX.Element {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const [confirmingAmount, setConfirmingAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("250");
  const parsedAmount = Number(customAmount);
  const mutation = useMutation({
    mutationFn: (amount: number) => createInvestment(opportunityId, amount),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["portfolio"] });
      showToast("Investment confirmed", `${opportunityName} was added to your portfolio. Open Portfolio to track payouts.`);
      setConfirmingAmount(null);
      setOpen(false);
    },
  });

  function requestConfirm(amount: number): void {
    setConfirmingAmount(amount);
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button className={cn("w-full", triggerClassName)}>{triggerLabel}</Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 flex max-h-[calc(100vh-2rem)] w-[min(92vw,28rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-border bg-panel p-6">
          <Dialog.Title className="text-lg font-semibold text-white">
            Confirm investment
          </Dialog.Title>
          <Dialog.Description className="mt-2 text-sm text-muted">
            Review the instrument details before committing capital.
          </Dialog.Description>
          <div className="mt-4 flex-1 space-y-4 overflow-y-auto pr-1">
            <div className="rounded-xl border border-border bg-black/10 p-4 text-sm text-slate-200">
              <p><span className="text-muted">Instrument:</span> {instrumentType === "revenue_share" ? "Revenue share note" : "Project finance round"}</p>
              <p><span className="text-muted">Creator:</span> {creatorName}</p>
              <p><span className="text-muted">Opportunity:</span> {opportunityName}</p>
              <p><span className="text-muted">Payout timeline:</span> {payoutTimeline}</p>
              <p><span className="text-muted">Amount selected:</span> ${formatNumber(confirmingAmount ?? 0)}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {amounts.map((amount) => (
                <Button
                  key={amount}
                  variant="secondary"
                  onClick={() => requestConfirm(amount)}
                  disabled={mutation.isPending}
                >
                  ${amount}
                </Button>
              ))}
            </div>
            <div className="space-y-3">
              <Input
                type="number"
                min="5"
                max="10000"
                step="1"
                value={customAmount}
                onChange={(event) => setCustomAmount(event.target.value)}
                placeholder="Custom amount"
              />
              <div className="rounded-xl border border-border bg-black/10 p-3 text-sm text-muted">
                <p>Amount: ${formatNumber(Number.isNaN(parsedAmount) ? 0 : parsedAmount)}</p>
                <p>Minimum: $5 · Maximum: $10,000</p>
                <p>Commitment: your capital is allocated into the selected revenue-share note or project-finance round when confirmed.</p>
              </div>
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => requestConfirm(parsedAmount)}
                disabled={mutation.isPending || Number.isNaN(parsedAmount) || parsedAmount < 5 || parsedAmount > 10000}
              >
                Continue with custom amount
              </Button>
            </div>
            {confirmingAmount !== null ? (
              <div className="space-y-3 rounded-xl border border-border bg-black/10 p-4">
                <p className="text-sm text-slate-200">
                  You are committing ${formatNumber(confirmingAmount)} to {opportunityName}.
                </p>
                <Button
                  className="w-full"
                  onClick={() => mutation.mutate(confirmingAmount)}
                  disabled={mutation.isPending}
                >
                  Confirm investment
                </Button>
              </div>
            ) : null}
            <div className="text-sm text-muted">
              {!Number.isNaN(parsedAmount) && parsedAmount > 10000 ? " Enter an amount below $10,000." : null}
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <Link
              to="/portfolio"
              className="inline-flex w-full items-center justify-center rounded-xl border border-transparent px-4 py-3 text-sm font-medium text-muted transition hover:bg-white/[0.04] hover:text-white"
            >
              Go to portfolio
            </Link>
            <Dialog.Close asChild>
              <Button variant="ghost" className="w-full">
                Close
              </Button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
