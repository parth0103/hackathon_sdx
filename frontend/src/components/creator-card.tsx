import { Link } from "react-router-dom";

import { useWatchlist } from "../contexts/watchlist-context";
import { formatNumber, formatPercent } from "../lib/utils";
import type { CreatorCard as CreatorCardType } from "../types/api";
import { PlatformBadge } from "./platform-badge";
import { WatchlistButton } from "./watchlist-button";
import { Card } from "./ui/card";

type CreatorCardProps = {
  creator: CreatorCardType;
};

export function CreatorCard({ creator }: CreatorCardProps): JSX.Element {
  const watchlist = useWatchlist();
  return (
    <Card className="h-full space-y-4 transition hover:border-accent/60">
      <Link to={`/creators/${creator.slug}`} className="block">
        <div className="flex items-center gap-3">
          <img
            src={creator.avatar_url}
            alt={creator.name}
            className="h-12 w-12 rounded-full object-cover"
          />
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-white">{creator.name}</p>
            <p className="text-sm capitalize text-muted">{creator.category}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {creator.primary_platforms.map((platform) => (
            <PlatformBadge key={platform} label={platform} />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted">Total audience</p>
            <p className="tabular-nums font-semibold text-white">
              {formatNumber(creator.total_audience)}
            </p>
          </div>
          <div>
            <p className="text-muted">30d growth</p>
            <p className="tabular-nums font-semibold text-success">
              {formatPercent(creator.growth_30d)}
            </p>
          </div>
          <div>
            <p className="text-muted">Engagement</p>
            <p className="tabular-nums font-semibold text-white">
              {formatPercent(creator.engagement_rate)}
            </p>
          </div>
          <div>
            <p className="text-muted">Brand partners</p>
            <p className="tabular-nums font-semibold text-white">
              {creator.unique_brand_partners}
            </p>
          </div>
        </div>
      </Link>
      <WatchlistButton
        active={watchlist.has(creator.slug)}
        onToggle={() => watchlist.toggle(creator.slug)}
      />
    </Card>
  );
}
