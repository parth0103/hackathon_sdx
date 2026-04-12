from datetime import datetime, timedelta
from pathlib import Path

from sqlmodel import Session

from app.core.config import BASE_DIR
from app.db.session import create_db_and_tables, engine
from app.models.entities import BrandDeal, ContentItem, Creator, CreatorPlatform, Investment, User
from app.services.brand_deals import extract_brand_deals
from app.services.opportunities import get_opportunity


def _days_ago(days: int) -> datetime:
    return datetime.utcnow() - timedelta(days=days)


CREATOR_BLUEPRINTS = [
    ("maya-vale", "Maya Vale", "fashion", "New York, NY", "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80"),
    ("arjun-mix", "Arjun Mix", "music", "Los Angeles, CA", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80"),
    ("nina-frame", "Nina Frame", "education", "Austin, TX", "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80"),
    ("leo-rift", "Leo Rift", "gaming", "Seattle, WA", "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80"),
    ("talia-north", "Talia North", "podcasts", "Chicago, IL", "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=400&q=80"),
    ("owen-pace", "Owen Pace", "fitness", "Miami, FL", "owen.jpg"),
    ("zara-cut", "Zara Cut", "beauty", "New York, NY", "https://images.unsplash.com/photo-1491349174775-aaafddd81942?auto=format&fit=crop&w=400&q=80"),
    ("milo-bench", "Milo Bench", "finance", "San Francisco, CA", "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=400&q=80"),
    ("sofia-bloom", "Sofia Bloom", "food", "Portland, OR", "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=400&q=80"),
    ("kai-sport", "Kai Sport", "sports", "Phoenix, AZ", "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?auto=format&fit=crop&w=400&q=80"),
    ("iris-shot", "Iris Shot", "film", "Atlanta, GA", "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=400&q=80"),
    ("devin-goods", "Devin Goods", "food", "Houston, TX", "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80"),
    ("lena-grid", "Lena Grid", "fashion", "Paris, FR", "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80"),
    ("omar-stack", "Owen Botkin", "finance", "Boston, MA", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"),
    ("rhea-waves", "Rhea Waves", "music", "Nashville, TN", "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80"),
    ("jun-arc", "Jun Arc", "film", "Los Angeles, CA", "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=400&q=80"),
    ("clio-play", "Clio Play", "gaming", "Toronto, CA", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80"),
    ("nora-digest", "Nora Digest", "podcasts", "Brooklyn, NY", "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80"),
]

CREATOR_MARKET_PROFILES: dict[str, tuple[int, float, int, float, float]] = {
    "maya-vale": (182000, 8.2, 146000, 4.8, 1.18),
    "arjun-mix": (268000, 6.7, 171000, 3.6, 1.12),
    "nina-frame": (94000, 11.4, 68200, 2.9, 0.92),
    "leo-rift": (336000, 5.8, 223000, 5.4, 1.26),
    "talia-north": (118000, 7.1, 54400, 2.2, 1.08),
    "owen-pace": (204000, 9.6, 126000, 4.1, 1.14),
    "zara-cut": (412000, 6.1, 198000, 5.1, 1.28),
    "milo-bench": (136000, -4.6, 77400, 3.1, 0.98),
    "sofia-bloom": (224000, 8.9, 154000, 4.4, 1.19),
    "kai-sport": (172000, 6.3, 102000, 4.7, 1.07),
    "iris-shot": (86000, 10.1, 48200, 2.5, 0.9),
    "devin-goods": (129000, -3.9, 66400, 3.3, 0.95),
    "lena-grid": (458000, -2.8, 181000, 4.6, 1.21),
    "omar-stack": (76000, -5.1, 52300, 2.8, 0.87),
    "rhea-waves": (149000, 7.8, 118000, 3.5, 1.05),
    "jun-arc": (64000, 9.3, 36100, 2.1, 0.84),
    "clio-play": (287000, 5.5, 208000, 5.0, 1.17),
    "nora-digest": (93000, 6.9, 42800, 2.4, 1.01),
}


BIO_BY_CATEGORY = {
    "fashion": "Fashion creator translating trend signals into culturally sticky commerce moments.",
    "music": "Music creator blending releases, edits, and fan community demand into durable momentum.",
    "education": "Operator creator publishing workflow systems, templates, and business analysis.",
    "gaming": "Gaming host building audience loyalty across live streams and short-form clips.",
    "podcasts": "Podcast creator building owned audience around cultural and business commentary.",
    "fitness": "Fitness creator pairing training content with programs and sponsor-ready distribution.",
    "beauty": "Beauty creator turning product routines and taste leadership into repeat monetization.",
    "finance": "Finance creator translating complex markets into highly shareable, high-intent media.",
    "food": "Food creator driving demand through recipes, product taste, and repeat watch behavior.",
    "sports": "Sports creator packaging fandom, training, and creator-led analysis into sponsor demand.",
    "film": "Film creator blending storytelling, production breakdowns, and launch-ready projects.",
}


PLATFORM_TEMPLATES: dict[str, list[tuple[str, float, float]]] = {
    "fashion": [("TikTok", 1.0, 1.0), ("Instagram", 0.36, 0.32), ("Newsletter", 0.03, 0.0)],
    "music": [("YouTube", 0.55, 1.14), ("TikTok", 0.42, 0.8), ("Spotify", 1.34, 0.0)],
    "education": [("YouTube", 0.42, 0.76), ("X", 0.18, 0.11), ("Newsletter", 0.11, 0.0)],
    "gaming": [("YouTube", 0.61, 1.22), ("TikTok", 0.49, 0.88), ("Twitch", 0.16, 0.0)],
    "podcasts": [("Podcast", 0.24, 0.0), ("Newsletter", 0.13, 0.0), ("Instagram", 0.15, 0.18)],
    "fitness": [("Instagram", 0.54, 0.51), ("YouTube", 0.29, 0.46), ("TikTok", 0.44, 0.77)],
    "beauty": [("TikTok", 0.83, 0.93), ("Instagram", 0.47, 0.39), ("YouTube", 0.22, 0.32)],
    "finance": [("YouTube", 0.39, 0.58), ("X", 0.26, 0.09), ("Newsletter", 0.16, 0.0)],
    "food": [("TikTok", 0.62, 0.86), ("Instagram", 0.34, 0.29), ("YouTube", 0.19, 0.35)],
    "sports": [("TikTok", 0.57, 0.81), ("YouTube", 0.33, 0.54), ("Instagram", 0.18, 0.2)],
    "film": [("YouTube", 0.37, 0.52), ("Instagram", 0.21, 0.17), ("Newsletter", 0.05, 0.0)],
}


CONTENT_TEMPLATES: dict[str, list[tuple[str, str, str, int, int, int, int, int]]] = {
    "fashion": [
        ("TikTok", "drop preview", "paid partnership with Glossier for the look review #ad", 4, 122000, 11800, 410, 590),
        ("Instagram", "rail notes", "studio notes before the capsule drops next week", 9, 28400, 3810, 120, 72),
        ("Newsletter", "dispatch", "inventory pacing, community demand, and launch notes", 2, 3200, 0, 0, 0),
    ],
    "music": [
        ("YouTube", "release board", "sponsored by Spotify for Artists with the full rollout breakdown", 6, 154000, 12900, 382, 702),
        ("TikTok", "crowd reaction", "use code STAGE10 with Red Bull creator packs", 3, 96200, 6900, 241, 438),
        ("Spotify", "release week", "new track movement and fan saves", 12, 0, 0, 0, 0),
    ],
    "education": [
        ("YouTube", "operator workflow", "sponsored by Notion with the template linked below", 5, 71400, 5900, 320, 214),
        ("X", "pricing thread", "campaign tracking notes in Figma and ops stack changes", 8, 22800, 910, 114, 202),
        ("Newsletter", "signal note", "pricing systems, sponsor pipelines, and retention math", 2, 9100, 0, 0, 0),
    ],
    "gaming": [
        ("YouTube", "ranked recap", "best plays from stream and what changed in scrims", 3, 184000, 13900, 820, 1080),
        ("TikTok", "clutch cut", "paid partnership with Nike gaming #partner", 7, 149000, 10100, 401, 660),
        ("Twitch", "community push", "late-night stream notes and rotation recap", 1, 0, 0, 0, 0),
    ],
    "podcasts": [
        ("Podcast", "market culture week", "this episode is sponsored by Shopify and creator commerce tools", 5, 26100, 0, 0, 0),
        ("Newsletter", "briefing", "brand partner math and audience durability", 2, 10400, 0, 0, 0),
        ("Instagram", "studio clip", "cut from this week's recording session", 10, 10800, 1210, 82, 46),
    ],
    "fitness": [
        ("Instagram", "recovery block", "partnered with Nike Training on this mobility sequence", 4, 44600, 7220, 176, 126),
        ("TikTok", "hypertrophy setup", "three movements i keep in every cycle", 6, 112000, 7720, 260, 346),
        ("YouTube", "program prep", "sponsored by Shopify for the storefront setup", 9, 60100, 4320, 241, 98),
    ],
    "beauty": [
        ("TikTok", "routine update", "paid partnership with Sephora for this launch review #ad", 4, 137000, 12400, 470, 620),
        ("Instagram", "close-up set", "shade notes and creator shelf rotation", 7, 32200, 4110, 166, 120),
        ("YouTube", "drop test", "morning routine breakdown and product pacing", 13, 42100, 3260, 204, 143),
    ],
    "finance": [
        ("YouTube", "market memo", "sponsored by Ramp with the operator breakdown below", 6, 84200, 5400, 390, 228),
        ("X", "rate path thread", "what the market missed in today's print", 3, 28400, 1410, 210, 360),
        ("Newsletter", "opening bell", "portfolio logic and creator-led finance distribution", 1, 11900, 0, 0, 0),
    ],
    "food": [
        ("TikTok", "dinner test", "paid partnership with HexClad for the pan test #ad", 4, 129000, 10200, 320, 510),
        ("Instagram", "menu sketch", "recipe notes and dinner club planning", 8, 24700, 3010, 104, 90),
        ("YouTube", "service prep", "kitchen workflow and ingredient economics", 12, 38800, 2810, 168, 110),
    ],
    "sports": [
        ("TikTok", "training clip", "partnered with Nike Running on this speed block", 3, 103000, 7200, 251, 390),
        ("YouTube", "film room", "breakdown of why the game tilted late", 7, 60100, 4420, 280, 210),
        ("Instagram", "locker notes", "recovery routine and travel setup", 10, 18100, 2100, 81, 54),
    ],
    "film": [
        ("YouTube", "shot breakdown", "sponsored by Adobe for the grade and edit workflow", 5, 73400, 5200, 301, 190),
        ("Instagram", "location scout", "still frames and prep before the weekend shoot", 9, 19800, 2210, 92, 60),
        ("Newsletter", "production memo", "release cadence, funding notes, and story arcs", 2, 4200, 0, 0, 0),
    ],
}


INITIAL_INVESTMENTS = [
    {"creator_slug": "maya-vale", "amount": 25},
    {"creator_slug": "nina-frame", "amount": 50},
    {"creator_slug": "milo-bench", "amount": 80},
]


def initialize_database() -> None:
    database_path = BASE_DIR / "creator_investing.db"
    if database_path.exists():
        database_path.unlink()
    create_db_and_tables()
    with Session(engine) as session:
        user = User(email="demo@creator.market", display_name="Demo Investor")
        session.add(user)
        session.commit()
        session.refresh(user)

        creator_id_map: dict[str, int] = {}
        content_id_map: dict[str, int] = {}

        for index, blueprint in enumerate(CREATOR_BLUEPRINTS, start=1):
            slug, name, category, location, avatar_url = blueprint
            creator = Creator(
                name=name,
                slug=slug,
                bio=BIO_BY_CATEGORY[category],
                category=category,
                avatar_url=avatar_url,
                location=location,
            )
            session.add(creator)
            session.commit()
            session.refresh(creator)
            creator_id_map[slug] = creator.id or 0

            base_followers, base_growth, base_views, base_posts, engagement_bias = (
                CREATOR_MARKET_PROFILES[slug]
            )

            for platform_index, (platform, follower_multiplier, view_multiplier) in enumerate(
                PLATFORM_TEMPLATES[category],
                start=1,
            ):
                platform_variance = 0.92 + (((index + platform_index) % 5) * 0.06)
                followers = int(base_followers * follower_multiplier * platform_variance)
                avg_views = int(base_views * max(view_multiplier, 0.12) * (0.9 + platform_index * 0.05))
                avg_likes = int(avg_views * 0.067 * engagement_bias)
                avg_comments = int(avg_views * 0.0031 * engagement_bias)
                avg_shares = int(avg_views * 0.0044 * engagement_bias)
                session.add(
                    CreatorPlatform(
                        creator_id=creator.id or 0,
                        platform=platform,
                        username=f"{slug.replace('-', '')}{platform_index}",
                        profile_url=f"https://example.com/{slug}/{platform.lower()}",
                        followers=followers,
                        avg_views=avg_views if platform not in {"Podcast", "Spotify", "Twitch"} else max(avg_views, 0),
                        avg_likes=avg_likes if platform not in {"Podcast", "Spotify", "Twitch", "Newsletter"} else 0,
                        avg_comments=avg_comments if platform not in {"Podcast", "Spotify", "Twitch", "Newsletter"} else 0,
                        avg_shares=avg_shares if platform not in {"Podcast", "Spotify", "Twitch", "Newsletter"} else 0,
                        posts_per_week=round(base_posts + (platform_index * 0.35), 1),
                        growth_7d=round(base_growth * 0.29 + platform_index * 0.5, 1),
                        growth_30d=round(base_growth + platform_index * 0.95 + ((index % 4) * 0.4), 1),
                        growth_90d=round((base_growth * 2.25) + platform_index * 3.1 + ((index % 3) * 1.8), 1),
                    )
                )
            session.commit()

            for content_index in range(6):
                template = CONTENT_TEMPLATES[category][content_index % len(CONTENT_TEMPLATES[category])]
                (
                    platform,
                    title,
                    caption,
                    days_ago,
                    views,
                    likes,
                    comments,
                    shares,
                ) = template
                item = ContentItem(
                    creator_id=creator.id or 0,
                    platform=platform,
                    external_id=f"{slug}-{platform.lower()}-{content_index + 1}",
                    title=f"{title} {content_index + 1}",
                    caption=caption,
                    content_url=f"https://example.com/{slug}/content/{content_index + 1}",
                    thumbnail_url=f"https://picsum.photos/seed/{slug}-{content_index + 1}/800/600",
                    published_at=_days_ago(days_ago + (content_index * 3)),
                    views=int((views + (content_index * 3400)) * (0.86 + (index % 5) * 0.08)),
                    likes=int((likes + (content_index * 220)) * (0.88 + (index % 4) * 0.07)),
                    comments=int((comments + (content_index * 14)) * (0.9 + (index % 3) * 0.08)),
                    shares=int((shares + (content_index * 18)) * (0.89 + (index % 4) * 0.06)),
                )
                session.add(item)
                session.commit()
                session.refresh(item)
                content_id_map[f"{slug}:{content_index + 1}"] = item.id or 0

        extract_brand_deals(session)

        verified_brand_deals = [
            ("maya-vale", "Glossier", "TikTok", "paid partnership with Glossier for the look review #ad", "brand_partnership"),
            ("nina-frame", "Notion", "YouTube", "sponsored by Notion with the template linked below", "software_sponsorship"),
            ("milo-bench", "Ramp", "YouTube", "sponsored by Ramp with the operator breakdown below", "finance_sponsorship"),
            ("zara-cut", "Sephora", "TikTok", "paid partnership with Sephora for this launch review #ad", "beauty_partnership"),
        ]
        for slug, brand_name, platform, evidence_text, campaign_type in verified_brand_deals:
            session.add(
                BrandDeal(
                    creator_id=creator_id_map[slug],
                    content_item_id=content_id_map[f"{slug}:1"],
                    brand_name=brand_name,
                    platform=platform,
                    deal_date=_days_ago(4),
                    source_type="verified",
                    confidence=0.98,
                    evidence_text=evidence_text,
                    campaign_type=campaign_type,
                    source_url=f"https://example.com/{slug}/content/1",
                )
            )
        session.commit()

        for item in INITIAL_INVESTMENTS:
            creator_id = creator_id_map[item["creator_slug"]]
            opportunity_id = f"{item['creator_slug']}-revshare"
            opportunity = get_opportunity(session, opportunity_id)
            if opportunity is None:
                continue
            amount = float(item["amount"])
            session.add(
                Investment(
                    user_id=user.id or 1,
                    creator_id=creator_id,
                    opportunity_id=opportunity.id,
                    instrument_type=opportunity.instrument_type,
                    opportunity_name=opportunity.title,
                    amount=amount,
                    amount_returned=round(amount * opportunity.payouts_to_date_ratio, 2),
                    projected_remaining_payout=round(
                        (amount * opportunity.expected_total_multiple)
                        - (amount * opportunity.payouts_to_date_ratio),
                        2,
                    ),
                    expected_total_payout=round(amount * opportunity.expected_total_multiple, 2),
                    status=opportunity.status,
                )
            )
        session.commit()
