export type CreatorCard = {
  id: number;
  name: string;
  slug: string;
  category: string;
  avatar_url: string;
  primary_platforms: string[];
  total_audience: number;
  growth_30d: number;
  engagement_rate: number;
  detected_sponsored_posts: number;
  unique_brand_partners: number;
};

export type GrowthPoint = {
  label: string;
  value: number;
};

export type PlatformMetrics = {
  platform: string;
  username: string;
  profile_url: string;
  followers: number;
  avg_views: number;
  avg_likes: number;
  avg_comments: number;
  avg_shares: number;
  posts_per_week: number;
  growth_7d: number;
  growth_30d: number;
  growth_90d: number;
};

export type ContentItem = {
  id: number;
  platform: string;
  title: string;
  caption: string;
  content_url: string;
  thumbnail_url: string;
  published_at: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
};

export type BrandDeal = {
  id: number;
  brand_name: string;
  platform: string;
  deal_date: string;
  source_type: string;
  confidence: number;
  evidence_text: string;
  campaign_type: string;
  source_url: string;
};

export type CreatorDetail = {
  id: number;
  name: string;
  slug: string;
  bio: string;
  category: string;
  avatar_url: string;
  location: string;
  total_audience: number;
  growth_30d: number;
  engagement_rate: number;
  detected_sponsored_posts: number;
  unique_brand_partners: number;
  platforms: PlatformMetrics[];
  content: ContentItem[];
  brand_deals: BrandDeal[];
  audience_growth: GrowthPoint[];
  engagement_trend: GrowthPoint[];
  monetization_history: {
    channel: string;
    status: string;
    detail: string;
  }[];
  current_index: number;
  current_price: number;
  current_funding: number;
  chart_series: Record<string, Record<string, GrowthPoint[]>>;
  source_contributions: {
    source: string;
    metrics: string;
    transformation: string;
    weighting: number;
    total_change: number;
  }[];
  investor_return_model: string[];
  active_opportunities: Opportunity[];
};

export type CreatorsResponse = {
  items: CreatorCard[];
};

export type Opportunity = {
  id: string;
  creator_id: number;
  creator_name: string;
  creator_slug: string;
  category: string;
  creator_avatar_url: string;
  instrument_type: string;
  title: string;
  summary: string;
  funding_goal: number;
  capital_raised: number;
  min_investment: number;
  payout_timeline: string;
  expected_return_min: number;
  expected_return_max: number;
  expected_return_avg: number;
  expected_return_wow: number;
  capital_raised_wow: number;
  engagement_rate: number;
  engagement_wow: number;
  revenue_streams: string[];
  use_of_funds: string[];
  payouts_to_date_ratio: number;
  expected_total_multiple: number;
  status: string;
};

export type OpportunitiesResponse = {
  items: Opportunity[];
};

export type Allocation = {
  label: string;
  value: number;
};

export type PortfolioPosition = {
  investment_id: number;
  creator_id: number;
  creator_name: string;
  creator_slug: string;
  category: string;
  opportunity_id: string;
  opportunity_name: string;
  instrument_type: string;
  amount: number;
  amount_returned: number;
  projected_remaining_payout: number;
  expected_total_payout: number;
  realized_return: number;
  total_return_percent: number;
  status: string;
  created_at: string;
};

export type Portfolio = {
  total_invested: number;
  total_returned: number;
  outstanding_expected_payout: number;
  realized_return: number;
  expected_total_return: number;
  creators_backed: number;
  active_deals: number;
  completed_deals: number;
  allocations: Allocation[];
  positions: PortfolioPosition[];
  best_performer: {
    opportunity_id: string;
    opportunity_name: string;
    total_return_percent: number;
  } | null;
  worst_performer: {
    opportunity_id: string;
    opportunity_name: string;
    total_return_percent: number;
  } | null;
  performance_history: GrowthPoint[];
};

export type MethodologyMetric = {
  name: string;
  definition: string;
  formula: string;
};

export type MethodologySection = {
  title: string;
  items: string[];
};

export type Methodology = {
  philosophy: string;
  sections: MethodologySection[];
  metrics: MethodologyMetric[];
};
