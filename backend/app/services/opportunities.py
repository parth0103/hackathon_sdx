from dataclasses import dataclass

from sqlmodel import Session, select

from app.models.entities import BrandDeal, Creator, CreatorPlatform


@dataclass(frozen=True)
class Opportunity:
    id: str
    creator_id: int
    creator_name: str
    creator_slug: str
    category: str
    creator_avatar_url: str
    instrument_type: str
    title: str
    summary: str
    funding_goal: float
    capital_raised: float
    min_investment: float
    payout_timeline: str
    expected_return_min: float
    expected_return_max: float
    expected_return_avg: float
    expected_return_wow: float
    capital_raised_wow: float
    engagement_rate: float
    engagement_wow: float
    revenue_streams: list[str]
    use_of_funds: list[str]
    payouts_to_date_ratio: float
    expected_total_multiple: float
    status: str


REVENUE_STREAMS_BY_CATEGORY: dict[str, list[str]] = {
    "fashion": ["Brand deals", "Merch drops", "Newsletter sponsorships"],
    "music": ["Brand deals", "Streaming revenue", "Digital packs"],
    "education": ["Courses", "Newsletter memberships", "Software sponsors"],
    "gaming": ["Brand deals", "Live community", "Merch"],
    "podcasts": ["Podcast sponsors", "Newsletter ads", "Memberships"],
    "fitness": ["Programs", "Brand deals", "Subscriptions"],
    "beauty": ["Brand deals", "Affiliate commerce", "Product drops"],
    "finance": ["Sponsors", "Newsletter subscriptions", "Courses"],
    "food": ["Brand deals", "Recipe products", "Events"],
    "sports": ["Brand deals", "Training plans", "Memberships"],
    "film": ["Brand deals", "Ticketed screenings", "Digital products"],
}

PROJECT_TITLES_BY_CATEGORY: dict[str, str] = {
    "fashion": "Capsule drop financing",
    "music": "Release rollout financing",
    "education": "Cohort launch financing",
    "gaming": "Tournament content sprint",
    "podcasts": "Season production round",
    "fitness": "Program launch financing",
    "beauty": "Product review series",
    "finance": "Premium research launch",
    "food": "Dinner club expansion",
    "sports": "Training camp content round",
    "film": "Short film financing",
}


def list_opportunities(
    session: Session,
    search: str | None,
    category: str | None,
    instrument_type: str | None,
    sort: str,
) -> list[Opportunity]:
    creators = session.exec(select(Creator)).all()
    opportunities: list[Opportunity] = []
    for creator in creators:
        if creator.id is None:
            continue
        platforms = session.exec(
            select(CreatorPlatform).where(CreatorPlatform.creator_id == creator.id)
        ).all()
        brand_deals = session.exec(select(BrandDeal).where(BrandDeal.creator_id == creator.id)).all()
        total_followers = sum(platform.followers for platform in platforms)
        revenue_signal = round(sum(platform.growth_30d for platform in platforms) / max(1, len(platforms)), 1)
        sponsor_count = len(brand_deals)
        engagement_rate = round(
            (
                sum(platform.avg_likes + platform.avg_comments + platform.avg_shares for platform in platforms)
                / max(1, total_followers)
            )
            * 100,
            2,
        )
        engagement_wow = round(max(-9.8, min(12.4, revenue_signal * 0.52 - 1.8)), 1)
        revenue_share_min = 12 + revenue_signal * 0.6
        revenue_share_max = 24 + revenue_signal * 1.1
        project_min = 18 + revenue_signal * 0.8
        project_max = 34 + revenue_signal * 1.25
        revenue_note = Opportunity(
            id=f"{creator.slug}-revshare",
            creator_id=creator.id,
            creator_name=creator.name,
            creator_slug=creator.slug,
            category=creator.category,
            creator_avatar_url=creator.avatar_url,
            instrument_type="revenue_share",
            title=f"{creator.name} revenue share note",
            summary="Back a slice of future creator monetization across defined revenue streams.",
            funding_goal=round(15000 + total_followers * 0.08, 2),
            capital_raised=round((6000 + sponsor_count * 1400) + total_followers * 0.03, 2),
            min_investment=25,
            payout_timeline="Quarterly for 12 months",
            expected_return_min=revenue_share_min,
            expected_return_max=revenue_share_max,
            expected_return_avg=round((revenue_share_min + revenue_share_max) / 2, 1),
            expected_return_wow=round(max(-8.2, min(11.7, revenue_signal * 0.44 - 1.1)), 1),
            capital_raised_wow=round(max(-6.8, min(14.4, sponsor_count * 1.3 + 2.2)), 1),
            engagement_rate=engagement_rate,
            engagement_wow=engagement_wow,
            revenue_streams=REVENUE_STREAMS_BY_CATEGORY[creator.category],
            use_of_funds=["Audience growth", "Editing and production", "Sales infrastructure"],
            payouts_to_date_ratio=0.08 + sponsor_count * 0.01,
            expected_total_multiple=1.28 + revenue_signal * 0.01,
            status="Active",
        )
        project_round = Opportunity(
            id=f"{creator.slug}-project",
            creator_id=creator.id,
            creator_name=creator.name,
            creator_slug=creator.slug,
            category=creator.category,
            creator_avatar_url=creator.avatar_url,
            instrument_type="project_finance",
            title=PROJECT_TITLES_BY_CATEGORY[creator.category],
            summary="Finance a specific creator project with milestone-based payout expectations.",
            funding_goal=round(9000 + total_followers * 0.05, 2),
            capital_raised=round((3500 + sponsor_count * 900) + total_followers * 0.02, 2),
            min_investment=50,
            payout_timeline="Completion payout in 4-6 months",
            expected_return_min=project_min,
            expected_return_max=project_max,
            expected_return_avg=round((project_min + project_max) / 2, 1),
            expected_return_wow=round(max(-7.4, min(13.6, revenue_signal * 0.57 - 0.8)), 1),
            capital_raised_wow=round(max(-5.9, min(15.7, sponsor_count * 1.5 + 1.6)), 1),
            engagement_rate=engagement_rate,
            engagement_wow=engagement_wow,
            revenue_streams=["Project revenue", "Launch partners", "Direct audience sales"],
            use_of_funds=["Production costs", "Launch budget", "Distribution and fulfilment"],
            payouts_to_date_ratio=0.02,
            expected_total_multiple=1.42 + revenue_signal * 0.012,
            status="Active",
        )
        for opportunity in [revenue_note, project_round]:
            if search and search.lower() not in f"{opportunity.creator_name} {opportunity.title}".lower():
                continue
            if category and opportunity.category != category:
                continue
            if instrument_type and opportunity.instrument_type != instrument_type:
                continue
            opportunities.append(opportunity)

    sort_key_map = {
        "expected_return": lambda item: item.expected_return_max,
        "funding_goal": lambda item: item.funding_goal,
        "capital_raised": lambda item: item.capital_raised,
    }
    key = sort_key_map.get(sort, sort_key_map["expected_return"])
    return sorted(opportunities, key=key, reverse=True)


def get_opportunity(session: Session, opportunity_id: str) -> Opportunity | None:
    all_items = list_opportunities(session, None, None, None, "expected_return")
    for item in all_items:
        if item.id == opportunity_id:
            return item
    return None
