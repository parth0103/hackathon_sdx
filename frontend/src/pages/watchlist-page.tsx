import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import { CreatorCard } from "../components/creator-card";
import { SectionHeader } from "../components/section-header";
import { useWatchlist } from "../contexts/watchlist-context";
import { getCreators } from "../lib/api";
import { Button } from "../components/ui/button";
import { Select } from "../components/ui/select";

export function WatchlistPage(): JSX.Element {
  const watchlist = useWatchlist();
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("growth_30d");
  const query = useQuery({
    queryKey: ["creators", "watchlist", sort],
    queryFn: () => getCreators(new URLSearchParams({ sort })),
  });

  const creators = useMemo(
    () =>
      (query.data?.items ?? []).filter(
        (item) => watchlist.has(item.slug) && (category === "all" || item.category === category),
      ),
    [category, query.data?.items, watchlist],
  );

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Watchlist"
        title="Saved creator profiles"
        description="Track creators you want to revisit before committing capital."
      />
      {creators.length === 0 ? (
        <div className="space-y-4 rounded-2xl border border-border bg-panel p-6 text-sm text-muted">
          <p>No watched creators yet. Add creators from discovery or a creator profile to see them here.</p>
          <Link to="/discover">
            <Button variant="secondary">Go to discovery</Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="grid gap-3 rounded-2xl border border-border bg-panel/80 p-4 md:grid-cols-2">
            <Select value={category} onChange={(event) => setCategory(event.target.value)}>
              {["all", "fashion", "music", "education", "gaming", "podcasts", "fitness", "beauty", "finance", "food", "sports", "film"].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
            <Select value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="growth_30d">Sort by 30d growth</option>
              <option value="engagement_rate">Sort by engagement rate</option>
              <option value="sponsored_activity">Sort by sponsor activity</option>
              <option value="audience">Sort by audience</option>
            </Select>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {creators.map((creator) => (
              <CreatorCard key={creator.id} creator={creator} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
