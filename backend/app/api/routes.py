import logging

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session

from app.db.session import get_session
from app.schemas.creator import (
    BrandDealResponse,
    ContentItemResponse,
    CreatorDetailResponse,
    CreatorQueryResponse,
    OpportunityQueryResponse,
    OpportunitySummaryResponse,
)
from app.schemas.methodology import MethodologyResponse
from app.schemas.portfolio import BrandDealVerificationRequest, InvestmentCreateRequest, PortfolioResponse
from app.services.brand_deals import extract_brand_deals
from app.services.creators import get_creator_detail, list_creators
from app.services.methodology import get_methodology
from app.services.opportunities import get_opportunity, list_opportunities
from app.services.portfolio import get_portfolio
from app.models.entities import BrandDeal, ContentItem, Creator, Investment
from sqlmodel import select

router = APIRouter()
DEMO_USER_ID = 1
logger = logging.getLogger(__name__)


@router.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@router.get("/creators", response_model=CreatorQueryResponse)
def creators(
    search: str | None = Query(default=None),
    category: str | None = Query(default=None),
    platform: str | None = Query(default=None),
    sort: str = Query(default="growth_30d"),
    session: Session = Depends(get_session),
) -> CreatorQueryResponse:
    return list_creators(session, search, category, platform, sort)


@router.get("/opportunities", response_model=OpportunityQueryResponse)
def opportunities(
    search: str | None = Query(default=None),
    category: str | None = Query(default=None),
    instrument_type: str | None = Query(default=None),
    sort: str = Query(default="capital_raised"),
    session: Session = Depends(get_session),
) -> OpportunityQueryResponse:
    items = [
        OpportunitySummaryResponse(**item.__dict__)
        for item in list_opportunities(session, search, category, instrument_type, sort)
    ]
    return OpportunityQueryResponse(items=items)


@router.get("/opportunities/{opportunity_id}", response_model=OpportunitySummaryResponse)
def opportunity_detail(
    opportunity_id: str,
    session: Session = Depends(get_session),
) -> OpportunitySummaryResponse:
    opportunity = get_opportunity(session, opportunity_id)
    if opportunity is None:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    return OpportunitySummaryResponse(**opportunity.__dict__)


@router.get("/creators/{slug}", response_model=CreatorDetailResponse)
def creator_detail(slug: str, session: Session = Depends(get_session)) -> CreatorDetailResponse:
    creator = get_creator_detail(session, slug)
    if creator is None:
        raise HTTPException(status_code=404, detail="Creator not found")
    return creator


@router.get("/creators/{slug}/content", response_model=list[ContentItemResponse])
def creator_content(slug: str, session: Session = Depends(get_session)) -> list[ContentItemResponse]:
    creator = session.exec(select(Creator).where(Creator.slug == slug)).first()
    if creator is None or creator.id is None:
        raise HTTPException(status_code=404, detail="Creator not found")
    items = session.exec(
        select(ContentItem).where(ContentItem.creator_id == creator.id).order_by(ContentItem.published_at.desc())
    ).all()
    return [
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
        for item in items
    ]


@router.get("/creators/{slug}/brand-deals", response_model=list[BrandDealResponse])
def creator_brand_deals(slug: str, session: Session = Depends(get_session)) -> list[BrandDealResponse]:
    creator = session.exec(select(Creator).where(Creator.slug == slug)).first()
    if creator is None or creator.id is None:
        raise HTTPException(status_code=404, detail="Creator not found")
    items = session.exec(
        select(BrandDeal).where(BrandDeal.creator_id == creator.id).order_by(BrandDeal.deal_date.desc())
    ).all()
    return [
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
        for item in items
    ]


@router.get("/portfolio", response_model=PortfolioResponse)
def portfolio(session: Session = Depends(get_session)) -> PortfolioResponse:
    return get_portfolio(session, DEMO_USER_ID)


@router.post("/investments", response_model=PortfolioResponse)
def create_investment(
    payload: InvestmentCreateRequest,
    session: Session = Depends(get_session),
) -> PortfolioResponse:
    if payload.amount < 5 or payload.amount > 10000:
        raise HTTPException(status_code=400, detail="Invalid investment amount")
    opportunity = get_opportunity(session, payload.opportunity_id)
    if opportunity is None:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    amount = round(payload.amount, 2)
    amount_returned = round(amount * opportunity.payouts_to_date_ratio, 2)
    expected_total_payout = round(amount * opportunity.expected_total_multiple, 2)
    projected_remaining_payout = round(expected_total_payout - amount_returned, 2)
    session.add(
        Investment(
            user_id=DEMO_USER_ID,
            creator_id=opportunity.creator_id,
            opportunity_id=opportunity.id,
            instrument_type=opportunity.instrument_type,
            opportunity_name=opportunity.title,
            amount=amount,
            amount_returned=amount_returned,
            projected_remaining_payout=projected_remaining_payout,
            expected_total_payout=expected_total_payout,
            status=opportunity.status,
        )
    )
    session.commit()
    logger.info("created investment opportunity_id=%s amount=%s", payload.opportunity_id, payload.amount)
    return get_portfolio(session, DEMO_USER_ID)


@router.post("/brand-deals/detect")
def detect_brand_deals(session: Session = Depends(get_session)) -> dict[str, str]:
    extract_brand_deals(session)
    logger.info("brand deal detection completed")
    return {"status": "completed"}


@router.post("/creators/{slug}/brand-deals/verify", response_model=list[BrandDealResponse])
def verify_brand_deal(
    slug: str,
    payload: BrandDealVerificationRequest,
    session: Session = Depends(get_session),
) -> list[BrandDealResponse]:
    creator = session.exec(select(Creator).where(Creator.slug == slug)).first()
    if creator is None or creator.id is None:
        raise HTTPException(status_code=404, detail="Creator not found")
    content_item = session.exec(
        select(ContentItem).where(ContentItem.creator_id == creator.id).order_by(ContentItem.published_at.desc())
    ).first()
    if content_item is None or content_item.id is None:
        raise HTTPException(status_code=400, detail="Creator has no content to attach verification to")
    session.add(
        BrandDeal(
            creator_id=creator.id,
            content_item_id=content_item.id,
            brand_name=payload.brand_name,
            platform=payload.platform,
            deal_date=content_item.published_at,
            source_type="manual",
            confidence=0.99,
            evidence_text=payload.evidence_text,
            campaign_type=payload.campaign_type,
            source_url=content_item.content_url,
        )
    )
    session.commit()
    logger.info("manual brand deal added creator_slug=%s brand=%s", slug, payload.brand_name)
    items = session.exec(
        select(BrandDeal).where(BrandDeal.creator_id == creator.id).order_by(BrandDeal.deal_date.desc())
    ).all()
    return [
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
        for item in items
    ]


@router.get("/methodology", response_model=MethodologyResponse)
def methodology() -> MethodologyResponse:
    return get_methodology()
