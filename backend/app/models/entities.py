from datetime import datetime
from typing import Optional

from sqlmodel import Field, SQLModel


class Creator(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    slug: str = Field(index=True, unique=True)
    bio: str
    category: str
    avatar_url: str
    location: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class CreatorPlatform(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    creator_id: int = Field(index=True, foreign_key="creator.id")
    platform: str = Field(index=True)
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
    last_updated_at: datetime = Field(default_factory=datetime.utcnow)


class ContentItem(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    creator_id: int = Field(index=True, foreign_key="creator.id")
    platform: str = Field(index=True)
    external_id: str
    title: str
    caption: str
    content_url: str
    thumbnail_url: str
    published_at: datetime
    views: int
    likes: int
    comments: int
    shares: int


class BrandDeal(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    creator_id: int = Field(index=True, foreign_key="creator.id")
    content_item_id: int = Field(index=True, foreign_key="contentitem.id")
    brand_name: str = Field(index=True)
    platform: str
    deal_date: datetime
    source_type: str
    confidence: float
    evidence_text: str
    campaign_type: str
    source_url: str
    created_at: datetime = Field(default_factory=datetime.utcnow)


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True)
    display_name: str


class Investment(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(index=True, foreign_key="user.id")
    creator_id: int = Field(index=True, foreign_key="creator.id")
    opportunity_id: str = Field(index=True)
    instrument_type: str
    opportunity_name: str
    amount: float
    amount_returned: float
    projected_remaining_payout: float
    expected_total_payout: float
    status: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
