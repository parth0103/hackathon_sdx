from dataclasses import dataclass

from app.models.entities import BrandDeal, CreatorPlatform
from app.schemas.creator import ChartSeriesPointResponse, SourceContributionResponse


TIMEFRAME_MULTIPLIERS: dict[str, float] = {
    "1D": 0.24,
    "1W": 0.58,
    "1M": 0.82,
    "1Y": 1.12,
    "ALL": 1.3,
}

MODE_OFFSETS: dict[str, float] = {
    "index": 0.0,
    "price": -1.6,
    "funding": -4.2,
}


@dataclass(frozen=True)
class CreatorMarketSnapshot:
    current_index: float
    current_price: float
    current_funding: float
    source_contributions: list[SourceContributionResponse]


def _normalized_growth(platforms: list[CreatorPlatform]) -> float:
    if not platforms:
        return 0.0
    return sum(platform.growth_30d for platform in platforms) / len(platforms)


def _engagement_rate(platforms: list[CreatorPlatform]) -> float:
    followers = sum(platform.followers for platform in platforms)
    engagements = sum(
        platform.avg_likes + platform.avg_comments + platform.avg_shares for platform in platforms
    )
    if followers == 0:
        return 0.0
    return (engagements / followers) * 100


def build_source_contributions(
    platforms: list[CreatorPlatform],
    brand_deals: list[BrandDeal],
) -> list[SourceContributionResponse]:
    contributions: list[SourceContributionResponse] = []
    weights: dict[str, float] = {}
    for platform in platforms:
        platform_weight = round(
            min(0.34, 0.09 + (platform.followers / max(1, sum(item.followers for item in platforms))) * 0.28),
            2,
        )
        weights[platform.platform] = platform_weight
        total_change = round((platform.growth_30d * 0.42) + (platform.growth_7d * 0.18), 1)
        contributions.append(
            SourceContributionResponse(
                source=platform.platform,
                metrics=_platform_metrics_label(platform.platform),
                transformation="ln(metric + 1)",
                weighting=platform_weight,
                total_change=total_change,
            )
        )

    sponsor_weight = round(max(0.06, 1 - sum(weights.values())), 2)
    sponsor_change = round(
        (len(brand_deals) * 4.1)
        + (sum(1 for deal in brand_deals if deal.source_type == "verified") * 3.6),
        1,
    )
    contributions.append(
        SourceContributionResponse(
            source="Brand deals",
            metrics="Detected sponsors, verified deals, repeat partners",
            transformation="recency-weighted frequency",
            weighting=sponsor_weight,
            total_change=sponsor_change,
        )
    )
    return contributions


def build_market_snapshot(
    platforms: list[CreatorPlatform],
    brand_deals: list[BrandDeal],
) -> CreatorMarketSnapshot:
    growth = _normalized_growth(platforms)
    engagement = _engagement_rate(platforms)
    sponsors = len(brand_deals)
    verified = sum(1 for deal in brand_deals if deal.source_type == "verified")
    total_followers = sum(platform.followers for platform in platforms)
    owned_audience_bonus = 3.5 if any(
        platform.platform in {"Newsletter", "Podcast"} for platform in platforms
    ) else 0.0
    current_index = round(
        38
        + (growth * 0.9)
        + (engagement * 1.8)
        + (sponsors * 1.3)
        + (verified * 1.6)
        + min(9.0, total_followers / 150000),
        2,
    )
    current_price = round((current_index * 1.06) + owned_audience_bonus, 2)
    current_funding = round((current_price * 860) + (sponsors * 1800), 2)
    return CreatorMarketSnapshot(
        current_index=current_index,
        current_price=current_price,
        current_funding=current_funding,
        source_contributions=build_source_contributions(platforms, brand_deals),
    )


def build_chart_series(
    current_index: float,
    current_price: float,
    current_funding: float,
) -> dict[str, dict[str, list[ChartSeriesPointResponse]]]:
    base_values = {
        "index": current_index,
        "price": current_price,
        "funding": current_funding,
    }
    labels: dict[str, list[str]] = {
        "1D": ["3 PM", "6 PM", "10 PM", "4 AM", "11 AM", "2 PM"],
        "1W": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        "1M": ["W1", "W2", "W3", "W4"],
        "1Y": ["Q1", "Q2", "Q3", "Q4"],
        "ALL": ["2022", "2023", "2024", "2025", "Now"],
    }
    series: dict[str, dict[str, list[ChartSeriesPointResponse]]] = {}
    for mode, current_value in base_values.items():
        series[mode] = {}
        for timeframe, points in labels.items():
            multiplier = TIMEFRAME_MULTIPLIERS[timeframe]
            start_value = current_value * (1 - (0.02 * multiplier)) + MODE_OFFSETS[mode]
            delta = current_value - start_value
            series[mode][timeframe] = [
                ChartSeriesPointResponse(
                    label=label,
                    value=round(start_value + delta * (index / max(1, len(points) - 1)), 2),
                )
                for index, label in enumerate(points)
            ]
    return series


def _platform_metrics_label(platform: str) -> str:
    mapping = {
        "YouTube": "Videos, views, likes, comments",
        "Instagram": "Posts, likes, comments, saves",
        "TikTok": "Posts, views, likes, comments, shares",
        "Newsletter": "Sends, opens, clicks, subscriber change",
        "Podcast": "Episodes, listens, follows, retention",
        "Spotify": "Listeners, saves, follows, release activity",
        "X": "Posts, likes, replies, reposts",
        "Twitch": "Streams, peak viewers, chat activity",
    }
    return mapping.get(platform, "Reach, engagement, consistency")
