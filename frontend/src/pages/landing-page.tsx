import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import { OpportunityCard } from "../components/opportunity-card";
import { SectionHeader } from "../components/section-header";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { getOpportunities } from "../lib/api";
import { formatNumber, formatPercent } from "../lib/utils";
import type { Opportunity } from "../types/api";
import { OpportunitySheet } from "../components/opportunity-sheet";

export function LandingPage(): JSX.Element {
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const query = useQuery({
    queryKey: ["opportunities", "landing"],
    queryFn: () => getOpportunities(new URLSearchParams({ sort: "expected_return" })),
  });
  const items = query.data?.items.slice(0, 2) ?? [];
  const summary = useMemo(() => {
    if (!query.data?.items.length) {
      return {
        liveDeals: 0,
        capitalRaised: 0,
        avgReturn: 0,
      };
    }

    const liveDeals = query.data.items.length;
    const capitalRaised = query.data.items.reduce((total, item) => total + item.capital_raised, 0);
    const avgReturn =
      query.data.items.reduce((total, item) => total + item.expected_return_avg, 0) / liveDeals;

    return {
      liveDeals,
      capitalRaised,
      avgReturn,
    };
  }, [query.data]);

  return (
    <div className="space-y-16">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#060813] px-6 py-5 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] md:px-8 md:py-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(118,93,255,0.28),transparent_28%),radial-gradient(circle_at_top_right,rgba(97,120,255,0.2),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(67,232,181,0.16),transparent_22%)]" />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-[#5f58d4]/25 to-transparent blur-2xl" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-[#5f58d4]/20 to-transparent blur-2xl" />
        <div className="relative z-10 space-y-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#3b82f6,#6d5efc)] text-sm font-semibold text-white shadow-[0_0_30px_rgba(93,103,255,0.35)]">
                CM
              </div>
              <div>
                <p className="text-2xl font-semibold text-white">Creator Market</p>
              </div>
            </div>
            <Link to="/discover" className="hidden md:block">
              <Button className="rounded-full border-white/15 bg-[linear-gradient(135deg,#4f46e5,#6d5efc)] px-6 py-3 text-white shadow-[0_0_30px_rgba(109,94,252,0.35)]">
                Get started
              </Button>
            </Link>
          </div>

          {/* <div className="flex justify-center">
            <div className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur">
              <span className="rounded-full bg-white/8 px-5 py-2 text-sm text-white">Use cases</span>
              <span className="px-5 py-2 text-sm text-muted">Pricing</span>
              <span className="px-5 py-2 text-sm text-muted">Endpoints</span>
            </div>
          </div> */}

          <div className="grid items-center gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:gap-12">
            <div className="space-y-6 py-2 md:py-4">
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.24em] text-accent">Invest in creators</p>
                <h1 className="max-w-3xl text-[3rem] font-semibold leading-[0.94] tracking-[-0.06em] text-white md:text-[4rem] xl:text-[4.8rem]">
                  Back the next cultural winners
                </h1>
                <p className="max-w-xl text-sm leading-6 text-[#b6b9cc] md:text-base">
                  Fund creator revenue streams and project launches with clear terms, transparent metrics, and a portfolio built around real payout mechanics.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link to="/discover">
                  <Button className="rounded-[1.2rem] border-white/10 bg-[linear-gradient(135deg,#62b8ff,#6d5efc_55%,#b8bfff)] px-7 py-5 text-base text-white shadow-[0_0_50px_rgba(105,121,255,0.35)]">
                    Start investing
                  </Button>
                </Link>
              </div>
              <div className="grid max-w-2xl gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted">Live deals</p>
                  <p className="mt-2 text-xl font-semibold text-white">{summary.liveDeals}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted">Capital raised</p>
                  <p className="mt-2 text-xl font-semibold text-white">${formatNumber(summary.capitalRaised)}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted">Avg. return</p>
                  <p className="mt-2 text-xl font-semibold text-white">{formatPercent(summary.avgReturn)}</p>
                </div>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[30rem]">
              <div className="pointer-events-none absolute left-1/2 top-0 h-32 w-32 -translate-x-1/2 rounded-full bg-white/70 blur-[60px]" />
              <div className="pointer-events-none absolute bottom-0 left-1/2 h-36 w-36 -translate-x-1/2 rounded-full bg-emerald-400/45 blur-[80px]" />
              <div className="relative rounded-[1.8rem] border border-[#655dff]/30 bg-[linear-gradient(180deg,rgba(17,19,34,0.98),rgba(11,13,25,0.98))] p-4 shadow-[0_0_0_10px_rgba(92,87,255,0.08),0_0_80px_rgba(116,98,255,0.22)]">
                <div className="rounded-[1.5rem] border border-white/6 bg-[#121322] p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <p className="text-3xl font-medium tracking-[-0.04em] text-white">
                        {items[0]?.creator_name ?? "Maya Vale"}
                      </p>
                      <p className="text-sm text-muted">
                        {items[0]?.title ?? "Revenue share note"}
                      </p>
                      <div className="flex flex-wrap gap-3 text-xs text-[#afb4cb]">
                        <span>{summary.liveDeals} live deals</span>
                        <span>${formatNumber(items[0]?.capital_raised ?? 0)} raised</span>
                        <span>{formatPercent(items[0]?.expected_return_avg ?? 0)} avg. return</span>
                      </div>
                    </div>
                    <div className="h-16 w-16 rounded-[1.2rem] bg-[linear-gradient(135deg,#2032ff,#1ec8ff)] p-[1px] shadow-[0_0_40px_rgba(60,120,255,0.35)]">
                      <img
                        src={items[0]?.creator_avatar_url ?? "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80"}
                        alt={items[0]?.creator_name ?? "Creator"}
                        className="h-full w-full rounded-[1.1rem] object-cover"
                      />
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="grid grid-cols-6 gap-2">
                      {[44, 30, 58, 36, 74, 66].map((height) => (
                        <div key={height} className="flex items-end">
                          <div
                            className="w-full rounded-full bg-[linear-gradient(180deg,rgba(86,129,255,0.95),rgba(86,129,255,0.18))]"
                            style={{ height }}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="relative h-36 overflow-hidden rounded-[1.25rem] border border-white/6 bg-[linear-gradient(180deg,rgba(22,24,41,0.92),rgba(12,14,25,0.92))]">
                      <div className="absolute inset-x-0 top-8 border-t border-white/5" />
                      <div className="absolute inset-x-0 top-20 border-t border-white/5" />
                      <div className="absolute inset-x-0 bottom-8 border-t border-white/5" />
                      <svg viewBox="0 0 420 180" className="absolute inset-0 h-full w-full">
                        <defs>
                          <linearGradient id="heroLine" x1="0%" x2="100%" y1="0%" y2="0%">
                            <stop offset="0%" stopColor="#5da8ff" />
                            <stop offset="100%" stopColor="#4976ff" />
                          </linearGradient>
                          <linearGradient id="heroArea" x1="0%" x2="0%" y1="0%" y2="100%">
                            <stop offset="0%" stopColor="rgba(81,120,255,0.22)" />
                            <stop offset="100%" stopColor="rgba(81,120,255,0.02)" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M14 118 C42 166, 74 154, 103 110 S168 78, 214 130 S274 36, 320 62 S370 82, 406 40"
                          fill="none"
                          stroke="url(#heroLine)"
                          strokeWidth="4"
                          strokeLinecap="round"
                        />
                        <path
                          d="M14 118 C42 166, 74 154, 103 110 S168 78, 214 130 S274 36, 320 62 S370 82, 406 40 L406 180 L14 180 Z"
                          fill="url(#heroArea)"
                        />
                        <circle cx="72" cy="154" r="10" fill="#ffffff" />
                        <circle cx="356" cy="48" r="10" fill="#3b82f6" />
                      </svg>
                      <div className="absolute left-8 top-12 rounded-2xl bg-white px-3 py-2 text-base font-medium text-black shadow-xl">
                        Fund
                      </div>
                      <div className="absolute right-6 top-8 rounded-2xl bg-[#4374ff] px-3 py-2 text-base font-medium text-white shadow-[0_0_20px_rgba(67,116,255,0.35)]">
                        Return
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 rounded-[1.25rem] bg-white px-4 py-4 text-black shadow-[0_18px_50px_rgba(255,255,255,0.12)]">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#23253f,#4b4df8)] text-sm font-semibold text-white">
                          CM
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Projected upside</p>
                          <p className="text-base font-medium text-slate-900">Revenue-share distribution</p>
                        </div>
                      </div>
                      <p className="text-3xl font-semibold tracking-[-0.05em] text-slate-950">
                        +{formatPercent(items[0]?.expected_return_avg ?? 0)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="space-y-3 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-accent">01</p>
          <h2 className="text-lg font-semibold text-white">Review the opportunity</h2>
          <p className="text-sm leading-6 text-muted">
            Start with the creator, the funding need, and the exact return model being offered.
          </p>
        </Card>
        <Card className="space-y-3 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-accent">02</p>
          <h2 className="text-lg font-semibold text-white">Understand payout mechanics</h2>
          <p className="text-sm leading-6 text-muted">
            Each note shows what revenue or project outcomes drive distributions back to investors.
          </p>
        </Card>
        <Card className="space-y-3 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-accent">03</p>
          <h2 className="text-lg font-semibold text-white">Track returns in one portfolio</h2>
          <p className="text-sm leading-6 text-muted">
            Monitor invested capital, payouts returned so far, and what is still expected.
          </p>
        </Card>
      </section>

      <section className="space-y-5">
        <SectionHeader
          eyebrow="Preview"
          title="A tighter underwriting view"
          description="A small sample of live opportunities. Open one to inspect the funding story before going deeper."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((opportunity) => (
            <OpportunityCard key={opportunity.id} opportunity={opportunity} onSelect={setSelectedOpportunity} />
          ))}
        </div>
      </section>
      <OpportunitySheet
        opportunity={selectedOpportunity}
        onClose={() => setSelectedOpportunity(null)}
      />
    </div>
  );
}
