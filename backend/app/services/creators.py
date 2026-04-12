from sqlmodel import Session, select

from app.models.entities import BrandDeal, ContentItem, Creator, CreatorPlatform
from app.services.market import build_chart_series, build_market_snapshot
from app.schemas.creator import (
    BrandDealResponse,
    ChartSeriesPointResponse,
    ContentItemResponse,
    CreatorCardResponse,
    CreatorDetailResponse,
    CreatorQueryResponse,
    GrowthPointResponse,
    MonetizationItemResponse,
    OpportunitySummaryResponse,
    PlatformMetricsResponse,
)
from app.services.opportunities import list_opportunities

MONETIZATION_HISTORY: dict[str, list[MonetizationItemResponse]] = {
    "maya-vale": [
        MonetizationItemResponse(
            channel="Merchandise",
            status="Active",
            detail="Seasonal capsule drops with repeat sell-through.",
        ),
        MonetizationItemResponse(
            channel="Brand partnerships",
            status="Active",
            detail="Beauty and fashion sponsor mix with repeat campaigns.",
        ),
    ],
    "arjun-mix": [
        MonetizationItemResponse(
            channel="Brand partnerships",
            status="Active",
            detail="Music tooling and beverage sponsorships tied to releases.",
        ),
        MonetizationItemResponse(
            channel="Digital products",
            status="Testing",
            detail="Sample packs and edit bundles with promo-code campaigns.",
        ),
    ],
    "nina-frame": [
        MonetizationItemResponse(
            channel="Newsletter",
            status="Active",
            detail="Paid education content and premium operator notes.",
        ),
        MonetizationItemResponse(
            channel="Software sponsors",
            status="Active",
            detail="Repeat workflow tooling sponsors across video and newsletter.",
        ),
    ],
    "leo-rift": [
        MonetizationItemResponse(
            channel="Sponsorships",
            status="Active",
            detail="Gaming apparel and launch tie-ins around stream highlights.",
        ),
        MonetizationItemResponse(
            channel="Community",
            status="Growing",
            detail="Live audience and community events driving retention.",
        ),
    ],
    "talia-north": [
        MonetizationItemResponse(
            channel="Podcast sponsors",
            status="Active",
            detail="Consumer finance and commerce tooling sponsors.",
        ),
        MonetizationItemResponse(
            channel="Newsletter",
            status="Active",
            detail="Owned audience driving durable distribution.",
        ),
    ],
    "owen-pace": [
        MonetizationItemResponse(
            channel="Programs",
            status="Active",
            detail="Fitness program sales supported by content cadence.",
        ),
        MonetizationItemResponse(
            channel="Brand partnerships",
            status="Active",
            detail="Apparel and storefront sponsors supporting content cycles.",
        ),
    ],
}


def _engagement_rate(platforms: list[CreatorPlatform]) -> float:
    followers = sum(platform.followers for platform in platforms)
    engagements = sum(
        platform.avg_likes + platform.avg_comments + platform.avg_shares for platform in platforms
    )
    if followers == 0:
        return 0.0
    return round((engagements / followers) * 100, 2)


def _growth_30d(platforms: list[CreatorPlatform]) -> float:
    if not platforms:
        return 0.0
    return round(sum(platform.growth_30d for platform in platforms) / len(platforms), 2)


def _total_audience(platforms: list[CreatorPlatform]) -> int:
    return sum(platform.followers for platform in platforms)


def _creator_card(
    creator: Creator,
    platforms: list[CreatorPlatform],
    brand_deals: list[BrandDeal],
) -> CreatorCardResponse:
    return CreatorCardResponse(
        id=creator.id or 0,
        name=creator.name,
        slug=creator.slug,
        category=creator.category,
        avatar_url=creator.avatar_url,
        primary_platforms=[platform.platform for platform in platforms],
        total_audience=_total_audience(platforms),
        growth_30d=_growth_30d(platforms),
        engagement_rate=_engagement_rate(platforms),
        detected_sponsored_posts=sum(1 for deal in brand_deals if deal.source_type == "detected"),
        unique_brand_partners=len({deal.brand_name for deal in brand_deals}),
    )


def list_creators(
    session: Session,
    search: str | None,
    category: str | None,
    platform: str | None,
    sort: str,
) -> CreatorQueryResponse:
    creators = session.exec(select(Creator)).all()
    cards: list[CreatorCardResponse] = []
    for creator in creators:
        if creator.id is None:
            continue
        platforms = session.exec(
            select(CreatorPlatform).where(CreatorPlatform.creator_id == creator.id)
        ).all()
        brand_deals = session.exec(select(BrandDeal).where(BrandDeal.creator_id == creator.id)).all()
        card = _creator_card(creator, platforms, brand_deals)
        if search and search.lower() not in f"{creator.name} {creator.slug}".lower():
            continue
        if category and creator.category.lower() != category.lower():
            continue
        if platform and platform.lower() not in [item.platform.lower() for item in platforms]:
            continue
        cards.append(card)

    sort_key_map = {
        "growth_30d": lambda item: item.growth_30d,
        "engagement_rate": lambda item: item.engagement_rate,
        "sponsored_activity": lambda item: item.detected_sponsored_posts,
        "audience": lambda item: item.total_audience,
    }
    key = sort_key_map.get(sort, sort_key_map["growth_30d"])
    return CreatorQueryResponse(items=sorted(cards, key=key, reverse=True))


def get_creator_detail(session: Session, slug: str) -> CreatorDetailResponse | None:
    creator = session.exec(select(Creator).where(Creator.slug == slug)).first()
    if creator is None or creator.id is None:
        return None

    platforms = session.exec(
        select(CreatorPlatform).where(CreatorPlatform.creator_id == creator.id)
    ).all()
    content = session.exec(
        select(ContentItem).where(ContentItem.creator_id == creator.id).order_by(ContentItem.published_at.desc())
    ).all()
    brand_deals = session.exec(
        select(BrandDeal).where(BrandDeal.creator_id == creator.id).order_by(BrandDeal.deal_date.desc())
    ).all()

    total_audience = _total_audience(platforms)
    growth_30d = _growth_30d(platforms)
    engagement_rate = _engagement_rate(platforms)
    snapshot = build_market_snapshot(platforms, brand_deals)
    chart_series = build_chart_series(
        snapshot.current_index,
        snapshot.current_price,
        snapshot.current_funding,
    )
    opportunity_items = [
        OpportunitySummaryResponse(**item.__dict__)
        for item in list_opportunities(session, None, creator.category, None, "expected_return")
        if item.creator_slug == creator.slug
    ]

    audience_growth = [
        GrowthPointResponse(label="90d", value=round(growth_30d * 0.48, 2)),
        GrowthPointResponse(label="30d", value=growth_30d),
        GrowthPointResponse(label="7d", value=round(growth_30d * 0.36, 2)),
    ]
    engagement_trend = [
        GrowthPointResponse(label="8w", value=round(engagement_rate * 0.74, 2)),
        GrowthPointResponse(label="4w", value=round(engagement_rate * 0.91, 2)),
        GrowthPointResponse(label="Now", value=engagement_rate),
    ]

    return CreatorDetailResponse(
        id=creator.id,
        name=creator.name,
        slug=creator.slug,
        bio=creator.bio,
        category=creator.category,
        avatar_url=creator.avatar_url,
        location=creator.location,
        total_audience=total_audience,
        growth_30d=growth_30d,
        engagement_rate=engagement_rate,
        detected_sponsored_posts=sum(1 for deal in brand_deals if deal.source_type == "detected"),
        unique_brand_partners=len({deal.brand_name for deal in brand_deals}),
        platforms=[
            PlatformMetricsResponse(
                platform=item.platform,
                username=item.username,
                profile_url=item.profile_url,
                followers=item.followers,
                avg_views=item.avg_views,
                avg_likes=item.avg_likes,
                avg_comments=item.avg_comments,
                avg_shares=item.avg_shares,
                posts_per_week=item.posts_per_week,
                growth_7d=item.growth_7d,
                growth_30d=item.growth_30d,
                growth_90d=item.growth_90d,
            )
            for item in platforms
        ],
        content=[
            ContentItemResponse(
                id=item.id or 0,
                platform=item.platform,
                title=item.title,
                caption=item.caption,
                content_url=item.content_url,
                thumbnail_url=item.thumbnail_url,
                published_at=item.published_at,
                views=item.views,
                likes=item.likes,
                comments=item.comments,
                shares=item.shares,
            )
            for item in content
        ],
        brand_deals=[
            BrandDealResponse(
                id=item.id or 0,
                brand_name=item.brand_name,
                platform=item.platform,
                deal_date=item.deal_date,
                source_type=item.source_type,
                confidence=item.confidence,
                evidence_text=item.evidence_text,
                campaign_type=item.campaign_type,
                source_url=item.source_url,
            )
            for item in brand_deals
        ],
        audience_growth=audience_growth,
        engagement_trend=engagement_trend,
        monetization_history=MONETIZATION_HISTORY.get(creator.slug, []),
        current_index=snapshot.current_index,
        current_price=snapshot.current_price,
        current_funding=snapshot.current_funding,
        chart_series={
            mode: {
                timeframe: [
                    ChartSeriesPointResponse(label=point.label, value=point.value)
                    for point in points
                ]
                for timeframe, points in series.items()
            }
            for mode, series in chart_series.items()
        },
        source_contributions=snapshot.source_contributions,
        investor_return_model=[
            "Revenue-share notes return payouts from eligible creator revenue over the note term.",
            "Project-finance rounds return capital as the funded launch or production generates revenue.",
            "Brand deals and owned audience improve confidence in payout durability and follow-on monetization.",
        ],
        active_opportunities=opportunity_items,
    )
