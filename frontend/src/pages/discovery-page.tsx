import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import { DataTable } from "../components/data-table";
import { InfoTooltip } from "../components/info-tooltip";
import { OpportunityCard } from "../components/opportunity-card";
import { OpportunitySheet } from "../components/opportunity-sheet";
import { SectionHeader } from "../components/section-header";
import { TrendValue } from "../components/trend-value";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select } from "../components/ui/select";
import { getOpportunities } from "../lib/api";
import { cn, formatNumber, formatPercent } from "../lib/utils";
import type { Opportunity } from "../types/api";

const categories = ["all", "fashion", "music", "education", "gaming", "podcasts", "fitness", "beauty", "finance", "food", "sports", "film"];
const instrumentTypes = ["all", "revenue_share", "project_finance"];
const ITEMS_PER_PAGE = 10;

function formatInstrumentType(value: string): string {
  if (value === "all") {
    return "All return models";
  }
  if (value === "revenue_share") {
    return "Revenue share";
  }
  if (value === "project_finance") {
    return "Project finance";
  }
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function DiscoveryPage(): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const search = searchParams.get("search") ?? "";
  const category = searchParams.get("category") ?? "all";
  const instrumentType = searchParams.get("instrument_type") ?? "all";
  const sort = searchParams.get("sort") ?? "capital_raised";
  const view = searchParams.get("view") ?? "table";
  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);

  const params = useMemo(() => {
    const query = new URLSearchParams({ sort });
    if (search) {
      query.set("search", search);
    }
    if (category !== "all") {
      query.set("category", category);
    }
    if (instrumentType !== "all") {
      query.set("instrument_type", instrumentType);
    }
    return query;
  }, [category, instrumentType, search, sort]);

  const query = useQuery({
    queryKey: ["opportunities", params.toString()],
    queryFn: () => getOpportunities(params),
  });

  const totalItems = query.data?.items.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginatedItems = useMemo(() => {
    const items = query.data?.items ?? [];
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return items.slice(start, start + ITEMS_PER_PAGE);
  }, [currentPage, query.data?.items]);

  function updateParam(key: string, value: string, resetPage = true): void {
    const next = new URLSearchParams(searchParams);
    if (value === "" || value === "all") {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    if (resetPage && key !== "page") {
      next.delete("page");
    }
    setSearchParams(next);
  }

  function changePage(nextPage: number): void {
    const boundedPage = Math.max(1, Math.min(nextPage, totalPages));
    updateParam("page", String(boundedPage), false);
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Discovery"
        title="Browse revenue-share notes and project finance rounds"
        description="Scan exactly what you are funding, how payouts work, and what return range each opportunity targets."
      />
      <div className="rounded-2xl border border-border bg-panel/80 p-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((option) => (
            <button
              key={option}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium capitalize transition",
                category === option
                  ? "border-accent bg-accent text-black"
                  : "border-border bg-black/10 text-muted hover:border-accent/40 hover:text-white",
              )}
              onClick={() => updateParam("category", option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-3 rounded-2xl border border-border bg-panel/80 p-4 md:grid-cols-3">
        <Input value={search} onChange={(event) => updateParam("search", event.target.value)} placeholder="Search creators" />
        <Select value={instrumentType} onChange={(event) => updateParam("instrument_type", event.target.value)}>
          {instrumentTypes.map((option) => (
            <option key={option} value={option}>
              {formatInstrumentType(option)}
            </option>
          ))}
        </Select>
        <Select value={sort} onChange={(event) => updateParam("sort", event.target.value)}>
          <option value="expected_return">Sort by expected return</option>
          <option value="funding_goal">Sort by funding goal</option>
          <option value="capital_raised">Sort by capital raised</option>
        </Select>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button variant={view === "table" ? "primary" : "secondary"} onClick={() => updateParam("view", "table")}>
            Table view
          </Button>
          <Button variant={view === "cards" ? "primary" : "secondary"} onClick={() => updateParam("view", "cards")}>
            Card view
          </Button>
        </div>
        <Button variant="secondary" onClick={() => updateParam("sort", "expected_return")}>
          How returns work
        </Button>
      </div>
      {query.data?.items.length === 0 ? (
        <div className="rounded-2xl border border-border bg-panel p-6 text-sm text-muted">
          No opportunities match the current filters.
        </div>
      ) : view === "table" ? (
        <DataTable
          rows={paginatedItems}
          columns={[
            {
              key: "creator",
              header: "Creator",
              render: (row) => (
                <button className="text-left text-white hover:text-accent" onClick={() => setSelectedOpportunity(row)}>
                  {row.creator_name}
                </button>
              ),
            },
            {
              key: "expected_return",
              header: (
                <InfoTooltip
                  label="Expected return"
                  content="Expected return is the midpoint of the modeled return range. For revenue-share notes it reflects projected creator revenue and investor participation. For project-based return it reflects projected project revenue after cost recovery."
                />
              ),
              render: (row) => <TrendValue value={formatPercent(row.expected_return_avg)} change={row.expected_return_wow} />,
            },
            { key: "description", header: "Description", render: (row) => row.title },
            {
              key: "return_model",
              header: "Return model",
              render: (row) => row.instrument_type === "revenue_share" ? "Share of creator revenue" : "Project-based return",
            },
            {
              key: "engagement",
              header: (
                <InfoTooltip
                  label="Engagement"
                  content="Engagement is calculated from likes, comments, and shares relative to total audience across supported creator platforms. It helps show how responsive and monetizable the audience is."
                />
              ),
              render: (row) => (
                <TrendValue
                  value={formatPercent(row.engagement_rate)}
                  change={row.engagement_wow}
                />
              ),
            },
            {
              key: "capital_raised",
              header: "Capital raised",
              render: (row) => `$${formatNumber(row.capital_raised)}`,
            },
          ]}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {paginatedItems.map((opportunity) => (
            <OpportunityCard
              key={opportunity.id}
              opportunity={opportunity}
              onSelect={(item) => setSelectedOpportunity(item)}
            />
          ))}
        </div>
      )}
      {totalItems > ITEMS_PER_PAGE ? (
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-panel/80 p-4 text-sm md:flex-row md:items-center md:justify-between">
          <p className="text-muted">
            Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, totalItems)} of {totalItems} opportunities
          </p>
          <div className="flex items-center gap-2">
            <Button variant="secondary" disabled={currentPage === 1} onClick={() => changePage(currentPage - 1)}>
              Previous
            </Button>
            <div className="rounded-xl border border-border px-4 py-2 text-white">
              Page {currentPage} of {totalPages}
            </div>
            <Button variant="secondary" disabled={currentPage === totalPages} onClick={() => changePage(currentPage + 1)}>
              Next
            </Button>
          </div>
        </div>
      ) : null}
      <OpportunitySheet
        opportunity={selectedOpportunity}
        onClose={() => setSelectedOpportunity(null)}
      />
    </div>
  );
}
