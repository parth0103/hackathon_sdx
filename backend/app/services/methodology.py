from app.schemas.methodology import (
    MethodologyMetricResponse,
    MethodologyResponse,
    MethodologySectionResponse,
)


def get_methodology() -> MethodologyResponse:
    return MethodologyResponse(
        philosophy="We surface creator growth, engagement, and monetization signals with transparent formulas so users can evaluate revenue-share notes and project-finance rounds with confidence.",
        sections=[
            MethodologySectionResponse(
                title="Sources",
                items=[
                    "Seeded creator platform metrics across YouTube, Instagram, TikTok, newsletters, and podcasts.",
                    "Seeded content history for recent posts and releases.",
                    "Detected sponsor activity from public-facing captions and descriptions.",
                ],
            ),
            MethodologySectionResponse(
                title="Update frequency",
                items=[
                    "Creator and content metrics refresh on app startup for the MVP.",
                    "Brand-deal detection runs when the backend boots or when the detection endpoint is triggered.",
                ],
            ),
            MethodologySectionResponse(
                title="Brand deals",
                items=[
                    "Detected deals come from sponsorship heuristics across captions and titles.",
                    "Verified deals are reserved for creator-supplied records.",
                ],
            ),
            MethodologySectionResponse(
                title="Opportunity model",
                items=[
                    "Revenue-share notes map creator performance and monetization history into payout expectations.",
                    "Project-finance rounds map a specific creator launch or campaign into milestone-based return expectations.",
                    "Funding reflects how much capital is already committed to an opportunity.",
                ],
            ),
            MethodologySectionResponse(
                title="Limitations",
                items=[
                    "The MVP uses seeded data with transparent formulas.",
                    "Not all sponsor activity is detectable from public metadata alone.",
                ],
            ),
        ],
        metrics=[
            MethodologyMetricResponse(
                name="Total audience",
                definition="Sum of followers or subscribers across supported creator platforms.",
                formula="sum(platform followers)",
            ),
            MethodologyMetricResponse(
                name="30d growth",
                definition="Average 30-day follower growth across the creator's supported platforms.",
                formula="avg(platform growth_30d)",
            ),
            MethodologyMetricResponse(
                name="Engagement rate",
                definition="Aggregate engagement divided by aggregate followers across supported platforms.",
                formula="((likes + comments + shares) / followers) * 100",
            ),
            MethodologyMetricResponse(
                name="Detected sponsored posts",
                definition="Number of recent content items flagged as likely sponsored through phrase and brand matching.",
                formula="count(detected sponsor content)",
            ),
            MethodologyMetricResponse(
                name="Expected payout",
                definition="Projected total amount returned from a revenue-share note or project-finance round over its modeled lifecycle.",
                formula="invested amount * expected payout multiple",
            ),
        ],
    )
