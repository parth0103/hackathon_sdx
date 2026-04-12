from datetime import datetime

from pydantic import BaseModel


class CreatorCardResponse(BaseModel):
    id: int
    name: str
    slug: str
    category: str
    avatar_url: str
    primary_platforms: list[str]
    total_audience: int
    growth_30d: float
    engagement_rate: float
    detected_sponsored_posts: int
    unique_brand_partners: int


class PlatformMetricsResponse(BaseModel):
    platform: str
    username: str
    profile_url: str
    followers: int
    avg_views: int
    avg_likes: int
    avg_comments: int
    avg_shares: int
    posts_per_week: float
    growth_7d: float
    growth_30d: float
    growth_90d: float


class ContentItemResponse(BaseModel):
    id: int
    platform: str
    title: str
    caption: str
    content_url: str
    thumbnail_url: str
    published_at: datetime
    views: int
    likes: int
    comments: int
    shares: int


class BrandDealResponse(BaseModel):
    id: int
    brand_name: str
    platform: str
    deal_date: datetime
    source_type: str
    confidence: float
    evidence_text: str
    campaign_type: str
    source_url: str


class GrowthPointResponse(BaseModel):
    label: str
    value: float


class ChartSeriesPointResponse(BaseModel):
    label: str
    value: float


class SourceContributionResponse(BaseModel):
    source: str
    metrics: str
    transformation: str
    weighting: float
    total_change: float


class MonetizationItemResponse(BaseModel):
    channel: str
    status: str
    detail: str


class OpportunitySummaryResponse(BaseModel):
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


class CreatorDetailResponse(BaseModel):
    id: int
    name: str
    slug: str
    bio: str
    category: str
    avatar_url: str
    location: str
    total_audience: int
    growth_30d: float
    engagement_rate: float
    detected_sponsored_posts: int
    unique_brand_partners: int
    platforms: list[PlatformMetricsResponse]
    content: list[ContentItemResponse]
    brand_deals: list[BrandDealResponse]
    audience_growth: list[GrowthPointResponse]
    engagement_trend: list[GrowthPointResponse]
    monetization_history: list[MonetizationItemResponse]
    current_index: float
    current_price: float
    current_funding: float
    chart_series: dict[str, dict[str, list[ChartSeriesPointResponse]]]
    source_contributions: list[SourceContributionResponse]
    investor_return_model: list[str]
    active_opportunities: list[OpportunitySummaryResponse]


class CreatorQueryResponse(BaseModel):
    items: list[CreatorCardResponse]


class OpportunityQueryResponse(BaseModel):
    items: list[OpportunitySummaryResponse]
