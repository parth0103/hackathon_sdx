from datetime import datetime

from pydantic import BaseModel


class PortfolioPositionResponse(BaseModel):
    investment_id: int
    creator_id: int
    creator_name: str
    creator_slug: str
    category: str
    opportunity_id: str
    opportunity_name: str
    instrument_type: str
    amount: float
    amount_returned: float
    projected_remaining_payout: float
    expected_total_payout: float
    realized_return: float
    total_return_percent: float
    status: str
    created_at: datetime


class AllocationResponse(BaseModel):
    label: str
    value: float


class PerformanceSummaryResponse(BaseModel):
    opportunity_id: str
    opportunity_name: str
    total_return_percent: float


class PortfolioHistoryPointResponse(BaseModel):
    label: str
    value: float


class PortfolioResponse(BaseModel):
    total_invested: float
    total_returned: float
    outstanding_expected_payout: float
    realized_return: float
    expected_total_return: float
    creators_backed: int
    active_deals: int
    completed_deals: int
    allocations: list[AllocationResponse]
    positions: list[PortfolioPositionResponse]
    best_performer: PerformanceSummaryResponse | None
    worst_performer: PerformanceSummaryResponse | None
    performance_history: list[PortfolioHistoryPointResponse]


class InvestmentCreateRequest(BaseModel):
    opportunity_id: str
    amount: float


class BrandDealVerificationRequest(BaseModel):
    brand_name: str
    platform: str
    evidence_text: str
    campaign_type: str
