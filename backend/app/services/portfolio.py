from collections import Counter

from sqlmodel import Session, select

from app.models.entities import Creator, Investment
from app.schemas.portfolio import (
    AllocationResponse,
    PerformanceSummaryResponse,
    PortfolioHistoryPointResponse,
    PortfolioPositionResponse,
    PortfolioResponse,
)


def get_portfolio(session: Session, user_id: int) -> PortfolioResponse:
    investments = session.exec(
        select(Investment).where(Investment.user_id == user_id).order_by(Investment.created_at.desc())
    ).all()
    creators = {
        creator.id: creator
        for creator in session.exec(select(Creator)).all()
        if creator.id is not None
    }
    allocations_counter = Counter()
    positions: list[PortfolioPositionResponse] = []
    total_invested = 0.0
    total_returned = 0.0
    outstanding_expected_payout = 0.0
    creators_backed = set()
    active_deals = 0
    completed_deals = 0

    for investment in investments:
        creator = creators.get(investment.creator_id)
        if creator is None or investment.id is None:
            continue
        total_invested += investment.amount
        total_returned += investment.amount_returned
        outstanding_expected_payout += investment.projected_remaining_payout
        creators_backed.add(investment.creator_id)
        allocations_counter[creator.category] += investment.amount
        if investment.status == "Completed":
            completed_deals += 1
        else:
            active_deals += 1
        realized_return = round(investment.amount_returned - investment.amount, 2)
        total_return_percent = round(
            ((investment.expected_total_payout - investment.amount) / investment.amount) * 100,
            2,
        )
        positions.append(
            PortfolioPositionResponse(
                investment_id=investment.id,
                creator_id=creator.id or 0,
                creator_name=creator.name,
                creator_slug=creator.slug,
                category=creator.category,
                opportunity_id=investment.opportunity_id,
                opportunity_name=investment.opportunity_name,
                instrument_type=investment.instrument_type,
                amount=investment.amount,
                amount_returned=investment.amount_returned,
                projected_remaining_payout=investment.projected_remaining_payout,
                expected_total_payout=investment.expected_total_payout,
                realized_return=realized_return,
                total_return_percent=total_return_percent,
                status=investment.status,
                created_at=investment.created_at,
            )
        )

    realized_return = round(total_returned - total_invested, 2)
    expected_total_return = round((total_returned + outstanding_expected_payout) - total_invested, 2)
    best_position = max(positions, key=lambda item: item.total_return_percent) if positions else None
    worst_position = min(positions, key=lambda item: item.total_return_percent) if positions else None

    return PortfolioResponse(
        total_invested=round(total_invested, 2),
        total_returned=round(total_returned, 2),
        outstanding_expected_payout=round(outstanding_expected_payout, 2),
        realized_return=realized_return,
        expected_total_return=expected_total_return,
        creators_backed=len(creators_backed),
        active_deals=active_deals,
        completed_deals=completed_deals,
        allocations=[
            AllocationResponse(label=label, value=value)
            for label, value in allocations_counter.items()
        ],
        positions=positions,
        best_performer=PerformanceSummaryResponse(
            opportunity_id=best_position.opportunity_id,
            opportunity_name=best_position.opportunity_name,
            total_return_percent=best_position.total_return_percent,
        )
        if best_position
        else None,
        worst_performer=PerformanceSummaryResponse(
            opportunity_id=worst_position.opportunity_id,
            opportunity_name=worst_position.opportunity_name,
            total_return_percent=worst_position.total_return_percent,
        )
        if worst_position
        else None,
        performance_history=[
            PortfolioHistoryPointResponse(label="Invested", value=round(total_invested, 2)),
            PortfolioHistoryPointResponse(label="Returned", value=round(total_returned, 2)),
            PortfolioHistoryPointResponse(label="Expected", value=round(total_returned + outstanding_expected_payout, 2)),
        ],
    )
