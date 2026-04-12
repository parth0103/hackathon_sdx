import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";

import { BrandDealList } from "../components/brand-deal-list";
import { ComparisonChart } from "../components/comparison-chart";
import { DataTable } from "../components/data-table";
import { GrowthChart } from "../components/growth-chart";
import { InvestDialog } from "../components/invest-dialog";
import { MethodologyTooltip } from "../components/methodology-tooltip";
import { MetricCard } from "../components/metric-card";
import { PlatformBadge } from "../components/platform-badge";
import { SectionHeader } from "../components/section-header";
import { SponsorTimeline } from "../components/sponsor-timeline";
import { VerificationDialog } from "../components/verification-dialog";
import { WatchlistButton } from "../components/watchlist-button";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { useWatchlist } from "../contexts/watchlist-context";
import { getCreator } from "../lib/api";
import { formatDate, formatNumber, formatPercent } from "../lib/utils";

export function CreatorPage(): JSX.Element {
  const params = useParams();
  const slug = params.slug ?? "";
  const query = useQuery({
    queryKey: ["creator", slug],
    queryFn: () => getCreator(slug),
    enabled: slug.length > 0,
  });
  const watchlist = useWatchlist();

  const creator = query.data;
  if (!creator) {
    return <div className="text-sm text-muted">Loading creator profile...</div>;
  }
  const methodologyRows = useMemo(
    () =>
      creator.source_contributions.map((row) => ({
        ...row,
        weightingLabel: `${Math.round(row.weighting * 100)}%`,
        totalChangeLabel: `${row.total_change > 0 ? "+" : ""}${row.total_change.toFixed(1)}%`,
      })),
    [creator.source_contributions],
  );
  const platformAudienceData = useMemo(
    () =>
      creator.platforms.map((platform) => ({
        label: platform.platform,
        primary: platform.followers,
      })),
    [creator.platforms],
  );
  const fundingProgressData = useMemo(
    () =>
      creator.active_opportunities.map((opportunity) => ({
        label: opportunity.instrument_type === "revenue_share" ? "Revenue note" : "Project round",
        primary: opportunity.capital_raised,
        secondary: opportunity.funding_goal,
      })),
    [creator.active_opportunities],
  );
  const payoutModelData = useMemo(
    () =>
      creator.active_opportunities.map((opportunity) => ({
        label: opportunity.instrument_type === "revenue_share" ? "Revenue note" : "Project round",
        primary: 100 * opportunity.payouts_to_date_ratio,
        secondary: 100 * opportunity.expected_total_multiple,
      })),
    [creator.active_opportunities],
  );

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <img src={creator.avatar_url} alt={creator.name} className="h-20 w-20 rounded-full object-cover" />
            <div className="space-y-3">
              <div>
                <h1 className="text-3xl font-semibold text-white">{creator.name}</h1>
                <p className="mt-1 text-sm capitalize text-muted">
                  {creator.category} · {creator.location}
                </p>
              </div>
              <p className="max-w-3xl text-sm text-slate-200">{creator.bio}</p>
              <div className="flex flex-wrap gap-2">
                {creator.platforms.map((platform) => (
                  <PlatformBadge key={platform.platform} label={platform.platform} />
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <WatchlistButton
                  active={watchlist.has(creator.slug)}
                  onToggle={() => watchlist.toggle(creator.slug)}
                />
              </div>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Total audience" value={formatNumber(creator.total_audience)} />
            <MetricCard label="30d growth" value={formatPercent(creator.growth_30d)} />
            <MetricCard label="Engagement rate" value={formatPercent(creator.engagement_rate)} />
            <MetricCard
              label="Brand partners"
              value={String(creator.unique_brand_partners)}
              detail={`${creator.detected_sponsored_posts} detected sponsor posts`}
            />
          </div>
          <SectionHeader
            eyebrow="Investment view"
            title="Underwriting graphs"
            description="These charts focus on audience quality, funding progress, and modeled payouts rather than a synthetic creator asset tile."
          />
          <div className="grid gap-4 xl:grid-cols-2">
            <GrowthChart title="Engagement trend" data={creator.engagement_trend} area strokeColor="#ef4444" />
            <ComparisonChart
              title="Audience by platform"
              data={platformAudienceData}
              primaryLabel="Audience"
              formatValue={(value) => formatNumber(value)}
            />
            <ComparisonChart
              title="Capital raised versus funding goal"
              data={fundingProgressData}
              primaryLabel="Capital raised"
              secondaryLabel="Funding goal"
              formatValue={(value) => `$${formatNumber(value)}`}
            />
            <ComparisonChart
              title="Modeled payouts on a $100 commitment"
              data={payoutModelData}
              primaryLabel="Returned so far"
              secondaryLabel="Expected total payout"
              formatValue={(value) => `$${formatNumber(value)}`}
            />
          </div>
          <Card className="space-y-6">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.18em] text-muted">Methodology breakdown</p>
              <p className="text-sm text-muted">
                Source-level contributions that explain how creator momentum and monetization quality roll into the diligence view.
              </p>
            </div>
            <DataTable
              rows={methodologyRows}
              columns={[
                { key: "source", header: "Source", render: (row) => row.source },
                { key: "metrics", header: "Metrics", render: (row) => row.metrics },
                { key: "transformation", header: "Transformation", render: (row) => row.transformation },
                { key: "weighting", header: "Weighting", render: (row) => row.weightingLabel },
                {
                  key: "total_change",
                  header: "Total Change",
                  render: (row) => (
                    <span className={row.total_change >= 0 ? "text-success" : "text-red-400"}>
                      {row.totalChangeLabel}
                    </span>
                  ),
                },
              ]}
            />
          </Card>
          <SectionHeader
            eyebrow="Platform metrics"
            title="Cross-platform performance"
            description="Transparent platform-by-platform inputs for audience and engagement."
          />
          <DataTable
            rows={creator.platforms}
            columns={[
              { key: "platform", header: "Platform", render: (row) => row.platform },
              { key: "followers", header: "Followers", render: (row) => formatNumber(row.followers) },
              { key: "avg_views", header: "Avg views", render: (row) => formatNumber(row.avg_views) },
              { key: "posts_per_week", header: "Posts / week", render: (row) => row.posts_per_week.toFixed(1) },
              { key: "growth_30d", header: "30d growth", render: (row) => formatPercent(row.growth_30d) },
            ]}
          />
          <SectionHeader
            eyebrow="Content"
            title="Recent creator output"
            description="Recent posts and releases used to contextualize growth and sponsor activity."
          />
          <DataTable
            rows={creator.content}
            columns={[
              { key: "date", header: "Date", render: (row) => formatDate(row.published_at) },
              { key: "platform", header: "Platform", render: (row) => row.platform },
              { key: "title", header: "Title", render: (row) => row.title },
              { key: "views", header: "Views", render: (row) => formatNumber(row.views) },
              { key: "engagement", header: "Engagement", render: (row) => formatNumber(row.likes + row.comments + row.shares) },
            ]}
          />
          <div className="grid gap-4 xl:grid-cols-2">
            <BrandDealList deals={creator.brand_deals} />
            <SponsorTimeline deals={creator.brand_deals} />
          </div>
          <Card className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Monetization history</h3>
            <div className="space-y-3">
              {creator.monetization_history.map((item) => (
                <div key={item.channel} className="rounded-xl border border-border bg-black/10 p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-white">{item.channel}</p>
                    <span className="text-sm text-muted">{item.status}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-200">{item.detail}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <div className="space-y-4">
          <Card className="space-y-4">
            <h2 className="text-lg font-semibold text-white">Active opportunities</h2>
            <p className="text-sm text-muted">
              Choose exactly what you want to fund and see how payouts are expected to flow back.
            </p>
            <div className="space-y-4">
              {creator.active_opportunities.map((opportunity) => (
                <div key={opportunity.id} className="rounded-xl border border-border bg-black/10 p-4">
                  <p className="font-semibold text-white">{opportunity.title}</p>
                  <p className="mt-1 text-sm text-muted">
                    {opportunity.instrument_type === "revenue_share" ? "Return model: Share of creator revenue" : "Return model: Project-based return"}
                  </p>
                  <p className="mt-2 text-sm text-slate-200">{opportunity.summary}</p>
                  <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                    <p className="text-muted">Goal: <span className="text-white">${formatNumber(opportunity.funding_goal)}</span></p>
                    <p className="text-muted">Raised: <span className="text-white">${formatNumber(opportunity.capital_raised)}</span></p>
                    <p className="text-muted">Timeline: <span className="text-white">{opportunity.payout_timeline}</span></p>
                    <p className="text-muted">
                      Expected return: <span className="text-success">{formatPercent(opportunity.expected_return_avg)}</span>
                    </p>
                  </div>
                  <div className="mt-4">
                    <InvestDialog
                      opportunityId={opportunity.id}
                      creatorName={creator.name}
                      opportunityName={opportunity.title}
                      instrumentType={opportunity.instrument_type}
                      payoutTimeline={opportunity.payout_timeline}
                    />
                  </div>
                </div>
              ))}
            </div>
            <VerificationDialog slug={creator.slug} />
          </Card>
          <Card className="space-y-4">
            <h2 className="text-lg font-semibold text-white">What investors get</h2>
            <div className="space-y-3 text-sm text-slate-200">
              {creator.investor_return_model.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            <Link to="/portfolio">
              <Button variant="secondary" className="w-full">
                View portfolio returns
              </Button>
            </Link>
          </Card>
          <Card className="space-y-4">
            <h2 className="text-lg font-semibold text-white">Methodology snapshot</h2>
            <div className="space-y-3">
              <MethodologyTooltip
                label="Total audience"
                value="Sum of followers and subscribers across the creator's supported channels."
              />
              <MethodologyTooltip
                label="30d growth"
                value="Average 30-day growth across supported platforms."
              />
              <MethodologyTooltip
                label="Brand deals"
                value="Detected from captions and titles with sponsor-language heuristics, plus creator-verified records."
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
