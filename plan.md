# Creator Investing Platform Implementation Plan

## Objective

Build a creator investing platform inspired by the product philosophy and UI clarity of Forum, adapted for creators instead of topic-based engagement-backed assets.

The MVP should let users:

- discover creators through transparent engagement and monetization metrics
- inspect creator profiles across multiple platforms
- view detected and verified brand deal history
- simulate investing small amounts into creators
- track positions in a portfolio dashboard

The product should feel close to Forum in these ways:

- clean, data-first UI
- transparent methodology
- market-style navigation and layout
- emphasis on interpretable metrics over black-box scoring
- fast scanning and comparison across profiles

## Product Principles

- No black-box `investability score` or `risk score` in the MVP.
- Prefer raw metrics, trends, and methodology explanations.
- Prioritize active engagement over vanity metrics.
- Treat brand deals and monetization history as first-class investor signals.
- Keep investing simulated for the hackathon MVP.
- Mirror Forum's clean and serious interface style without copying branding.

## MVP Scope

### Core flows

1. User lands on the app and browses creators.
2. User filters or searches for a creator.
3. User opens a creator profile.
4. User reviews growth, engagement, and brand deal history.
5. User simulates investing a small amount.
6. User sees the position appear in their portfolio.

### MVP pages

1. Landing page
2. Discovery page
3. Creator profile page
4. Portfolio page
5. Methodology page

### MVP features

- creator discovery feed
- creator detail pages
- cross-platform metrics
- growth and engagement charts
- sponsored content / brand deal detection
- simulated investing flow
- portfolio tracking
- methodology and source transparency

## Tech Stack

### Frontend

- React.js
- shadcn/ui
- Tailwind CSS
- React Router or Next.js-style routing if the React setup supports it
- Recharts for charts
- TanStack Query for API state management

### Backend

- FastAPI
- Pydantic
- SQLAlchemy or SQLModel
- PostgreSQL preferred, SQLite acceptable for hackathon speed
- Alembic for migrations if time permits

### AI / enrichment

- LLM for brand-deal extraction from captions, descriptions, and transcripts
- Rule-based prefilter before calling the LLM

## Suggested Repo Structure

```text
hackathon/
  backend/
    app/
      api/
      core/
      db/
      models/
      schemas/
      services/
      tasks/
      main.py
    requirements.txt
  frontend/
    src/
      components/
      components/ui/
      pages/
      routes/
      lib/
      hooks/
      types/
      App.tsx
      main.tsx
    package.json
  plan.md
```

## UI Direction

The UI should feel close to Forum in spirit:

- minimal, dark or neutral financial dashboard aesthetic
- strong tables, cards, and compact metric rows
- clear hierarchy with restrained color usage
- charts that support quick comparison
- subtle hover states and polished spacing
- avoid creator-economy cliches like loud gradients or playful social-app visuals

### Design rules

- Use one restrained accent color.
- Keep backgrounds layered but subtle.
- Use tabular numerals for metrics.
- Prefer dense, scannable cards over oversized marketing sections.
- Use tooltips for formulas and methodology.
- Keep labels plain and investor-facing.

## Information Architecture

### 1. Landing page

Purpose:
Introduce the product and route users into discovery.

Sections:

- headline
- subheadline
- CTA to explore creators
- sample creator cards
- short methodology teaser

Suggested messaging:

- "Back emerging creators with transparent engagement and monetization data."
- "Creator market data for investors."

### 2. Discovery page

Purpose:
Let users browse creators like investable profiles.

Components:

- top navigation
- search bar
- category filters
- platform filters
- sorting controls
- creator card grid or table

Creator card fields:

- avatar
- creator name
- category
- primary platforms
- total audience
- 30d growth
- engagement rate
- detected sponsored posts
- unique brand partners

### 3. Creator profile page

Purpose:
Serve as the core diligence page.

Sections:

- creator header
- platform overview cards
- audience and growth chart
- engagement metrics table
- recent content list
- brand deal history
- monetization history
- invest action panel
- methodology panel

### 4. Portfolio page

Purpose:
Show simulated positions and aggregate allocations.

Sections:

- total invested
- creators backed
- allocations by category
- recent activity
- positions table

### 5. Methodology page

Purpose:
Build trust and align with Forum-like transparency.

Sections:

- what we measure
- sources by platform
- update frequency
- metric definitions
- sponsored content detection methodology
- detected vs verified brand deal explanation
- limitations

## Data Model

### creators

- `id`
- `name`
- `slug`
- `bio`
- `category`
- `avatar_url`
- `location`
- `created_at`
- `updated_at`

### creator_platforms

- `id`
- `creator_id`
- `platform`
- `username`
- `profile_url`
- `followers`
- `avg_views`
- `avg_likes`
- `avg_comments`
- `avg_shares`
- `posts_per_week`
- `growth_7d`
- `growth_30d`
- `growth_90d`
- `last_updated_at`

### content_items

- `id`
- `creator_id`
- `platform`
- `external_id`
- `title`
- `caption`
- `content_url`
- `thumbnail_url`
- `published_at`
- `views`
- `likes`
- `comments`
- `shares`

### brand_deals

- `id`
- `creator_id`
- `content_item_id`
- `brand_name`
- `platform`
- `deal_date`
- `source_type`
- `confidence`
- `evidence_text`
- `campaign_type`
- `source_url`
- `created_at`

`source_type` values:

- `detected`
- `verified`
- `manual`

### investments

- `id`
- `user_id`
- `creator_id`
- `amount`
- `created_at`

### users

For MVP, authentication can be skipped or replaced with a single seeded demo user.

- `id`
- `email`
- `display_name`

## Metric Definitions

Keep all metrics interpretable.

### Discovery metrics

- `total audience`
  Sum of followers/subscribers across supported platforms

- `30d growth`
  Percentage change in audience over the last 30 days

- `engagement rate`
  `(avg_likes + avg_comments + avg_shares) / followers`
  Calculated per platform, with a simple aggregate shown on cards

- `detected sponsored posts`
  Count of content items flagged as likely sponsored in the selected time window

- `unique brand partners`
  Count of distinct brand names across detected and verified brand deals

### Profile metrics

- audience by platform
- 7d / 30d / 90d growth
- avg views per post
- avg likes / comments / shares
- posts per week
- top recent content
- last sponsorship date
- number of detected sponsored posts
- number of verified brand deals

## Brand Deal Detection Pipeline

### Goal

Identify likely sponsorships from creator content and convert them into structured, auditable brand-deal records.

### Input sources

- YouTube descriptions
- YouTube transcripts if available
- Instagram captions
- TikTok captions
- X posts
- newsletter text if available

### Detection strategy

1. Collect recent content for each creator.
2. Run rule-based heuristics to identify likely candidates.
3. Send candidates to the LLM for structured extraction.
4. Save structured outputs into `brand_deals`.
5. Surface evidence in the UI.

### Heuristic triggers

- `#ad`
- `#sponsored`
- `#partner`
- `paid partnership`
- `sponsored by`
- `in partnership with`
- promo code patterns
- known affiliate link domains
- tagged brand handles

### LLM extraction output

Return:

- `is_brand_deal`
- `brand_name`
- `confidence`
- `campaign_type`
- `evidence_text`
- `reasoning`

### UI display rules

Do not claim exact total lifetime sponsorships.

Prefer labels like:

- `Detected sponsored posts`
- `Verified brand deals`
- `Brands worked with`
- `Recent sponsorship activity`

## API Plan

### Public read endpoints

- `GET /api/creators`
  Returns creator cards with summary metrics

- `GET /api/creators/{slug}`
  Returns creator profile details

- `GET /api/creators/{slug}/content`
  Returns recent content items

- `GET /api/creators/{slug}/brand-deals`
  Returns detected and verified brand deal history

- `GET /api/portfolio`
  Returns portfolio summary and positions for demo user

- `GET /api/methodology`
  Returns metric definitions and source notes

### Mutating endpoints

- `POST /api/investments`
  Body:
  - `creator_id`
  - `amount`

  Creates a simulated investment

- `POST /api/brand-deals/detect`
  Runs or queues brand-deal detection for seeded content

## Frontend Component Plan

### Shared components

- `AppShell`
- `TopNav`
- `MetricCard`
- `SectionHeader`
- `DataTable`
- `GrowthChart`
- `PlatformBadge`
- `InvestDialog`
- `MethodologyTooltip`
- `BrandDealList`
- `CreatorCard`

### Discovery page components

- `DiscoveryFilters`
- `CreatorCardGrid`
- `SortControl`

### Creator page components

- `CreatorHeader`
- `PlatformOverview`
- `EngagementTable`
- `RecentContentTable`
- `BrandDealTimeline`
- `InvestSidebar`

### Portfolio components

- `PortfolioSummary`
- `PositionTable`
- `AllocationChart`

## Backend Service Plan

### Services

- `creator_service.py`
  Handles creator listing and detail aggregation

- `portfolio_service.py`
  Handles simulated investments and portfolio summary

- `brand_deal_service.py`
  Handles sponsorship detection and structured storage

- `content_service.py`
  Handles ingestion and normalization of creator content

### Tasks

- seed creators
- seed content
- run sponsorship detection over content
- recompute summary metrics

## Seeding Strategy

Use a seeded dataset for the MVP.

### Seed 8-12 creators

Each creator should have:

- 2-3 platforms
- growth metrics
- recent content items
- at least 1-3 detected brand deals for some creators
- category and bio

Suggested categories:

- music
- fashion
- gaming
- podcasts
- education
- fitness

### Why seeding is acceptable

The hackathon goal is to prove the product and methodology, not to solve every data integration challenge in one weekend.

## Implementation Phases

### Phase 1: Project setup

Goal:
Initialize frontend and backend skeleton.

Tasks:

- scaffold React app
- install shadcn/ui
- scaffold FastAPI app
- set up database
- define initial schema
- create seed scripts

### Phase 2: Core frontend shell

Goal:
Build navigation and page skeletons.

Tasks:

- app shell
- top nav
- discovery page layout
- creator profile layout
- portfolio page layout
- methodology page layout

### Phase 3: Seeded backend and APIs

Goal:
Serve creators, content, brand deals, and portfolio data.

Tasks:

- create tables
- add seed data
- implement creator list endpoint
- implement creator detail endpoint
- implement portfolio endpoints

### Phase 4: Discovery and profile UI

Goal:
Render real seeded data from APIs.

Tasks:

- creator card grid
- filters and sorting
- profile header
- platform metrics cards
- growth chart
- engagement metrics table
- content list

### Phase 5: Brand deal detection

Goal:
Make monetization history a standout feature.

Tasks:

- add heuristic sponsor detection
- add LLM classification endpoint or service
- store parsed deals
- render brand deal history and evidence

### Phase 6: Simulated investing

Goal:
Complete the investor loop.

Tasks:

- invest dialog
- create investment endpoint
- update portfolio page
- show recent activity

### Phase 7: Methodology and polish

Goal:
Make the product credible and presentation-ready.

Tasks:

- methodology page content
- tooltips for formulas
- table polish
- empty states
- loading states
- responsive behavior

## Timeline Recommendation

### Day 1

- project setup
- schema and seeds
- backend endpoints for creators
- discovery page
- creator profile structure

### Day 2

- brand deal pipeline
- invest flow
- portfolio page
- methodology page
- styling and polish

### Final hours

- seed stronger demo data
- test end-to-end flows
- tighten copy
- prepare judge demo script

## Demo Script

1. Open the discovery page and scan creator opportunities.
2. Filter by a category like fashion or music.
3. Open a creator profile with visible growth and sponsor activity.
4. Show transparent metrics across platforms.
5. Show detected and verified brand deals with evidence.
6. Simulate a `$25` investment.
7. Open portfolio and show the new position.
8. End on the methodology page to reinforce credibility.

## Success Criteria

The MVP is successful if:

- users can compare creators quickly
- brand deal history is visible and believable
- the investing loop works end to end
- the UI feels serious and investor-grade
- the methodology is transparent enough to build trust

## Post-MVP Extensions

- live integrations for creator platforms
- creator-claimed and verified profiles
- deeper monetization history
- real notifications and watchlists
- creator comparisons
- real money rails and legal structure
- investor profiles and multi-user auth

## Product Expansion Notes

These are product updates and design directions that should shape the next implementation pass.

### 1. Watchlist behavior

Current issue:

- creators added from discovery are not reliably visible in the watchlist experience

Plan update:

- make watchlist state first-class rather than incidental UI state
- decide whether watchlist should live in local storage, backend storage, or both
- ensure the same watchlist source is used by discovery cards, creator profile actions, and the watchlist page
- add a visible watchlist count in navigation
- make watchlist entries render with the same core creator-card data as discovery
- add empty-state guidance explaining how to add creators into the watchlist

Preferred product behavior:

- clicking `Add to watchlist` should immediately update the button state
- the creator should appear in the watchlist tab without refresh ambiguity
- the watchlist page should support the same filters and sort controls as discovery

### 2. What investors get in return

This needs to be explicitly defined in the product. Right now simulated investing exists, but the return mechanism is under-specified.

The product should choose and communicate one primary return model for the MVP.

Updated decision:

- remove the stock-like creator share framing from the core product
- move the product toward two concrete investment primitives:
  - revenue-share investing
  - project-based financing

#### Option A: Revenue-share model `Chosen`

- investors back a creator or creator project
- investors receive a modeled share of future revenue for a time window
- return is displayed as projected payout relative to capital invested

Good for product clarity because:

- it feels close to real finance
- it gives the portfolio page a reason to show projected return
- it works well with brand deals, merch launches, memberships, and digital products

#### Option B: Project financing model `Chosen`

- investors fund a specific creator campaign like a merch drop, podcast season, or content sprint
- return comes from the modeled performance of that specific project

Good for explainability because:

- users understand what they are funding
- expected outcome and payback are easier to narrate

Recommended product decision:

- for the next product version, center the product around:
  - backing a creator's future revenue stream
  - funding specific creator projects
- remove the synthetic stock-like framing from the main UX
- keep transparent market-style analytics, but use them for underwriting real deal opportunities rather than pricing pseudo-shares

### 3. Custom investment amounts

Current limitation:

- the investment flow only supports fixed amounts

Plan update:

- add a custom amount field alongside preset ticket sizes
- define valid min and max amounts for the MVP
- add inline validation and formatted currency input
- let the user see how the entered amount maps to simulated exposure
- update the confirmation UI so it shows:
  - amount invested
  - current index or entry price
  - units or exposure purchased

Preferred UX:

- presets stay for speed
- custom amount input is available for more serious investor behavior
- amount entry should feel closer to a funding commitment ticket than a donation prompt

### 4. Portfolio returns

Current gap:

- the portfolio page shows invested capital but not return

Plan update:

- define return in terms of payout participation, project performance, and expected distributions
- stop centering the portfolio around mark-to-market price changes
- show what has been returned so far versus what is still expected

For revenue-share positions:

- amount invested
- percentage of revenue share pool or contract participation
- total distributed so far
- next expected payout
- expected total return range
- remaining term or payout period

For project-finance positions:

- amount invested
- project funded
- project status
- capital returned so far
- projected payout at completion
- realized and unrealized return
- milestone progress

Minimum return metrics to add:

- total invested
- total returned so far
- outstanding expected return
- realized return
- expected total return
- best-performing deal
- most at-risk deal

Position-level metrics:

- amount invested
- instrument type
  - revenue share
  - project finance
- creator name
- project name if applicable
- amount returned so far
- projected remaining return
- expected total payout
- realized return
- total return percentage
- status

### 5. Larger creator dataset

Current limitation:

- the seeded creator set is too small to make discovery, watchlists, and comparison feel market-like

Plan update:

- expand from a small demo set to a broader seeded market
- target 25-50 creators for the next product pass
- increase category coverage:
  - music
  - fashion
  - gaming
  - podcasts
  - education
  - fitness
  - film
  - sports
  - food
  - beauty
  - finance
- ensure varied audience sizes:
  - early creators
  - mid-tier creators
  - breakout creators
- ensure varied monetization histories:
  - high sponsor density
  - low sponsor density
  - strong owned audience
  - launch-heavy creators

Data realism goals:

- enough names to make filtering feel real
- enough performance variance to make rankings meaningful
- enough sponsor diversity to support monetization analysis

### 6. Forum-style index and methodology view

The screenshot points toward a much stronger product surface that is closer to Forum.

The creator profile should still include a strong chart and methodology module, but it should support deal underwriting rather than pseudo-stock ownership.

The updated chart module should be used to answer:

- why this creator is financeable
- why this project is investable
- which signals are improving or deteriorating
- how the projected return story is formed

The creator or deal page should eventually include a dedicated chart module with:

- time-range toggles
  - `1D`
  - `1W`
  - `1M`
  - `1Y`
  - `ALL`
- view toggles
  - `Index`
  - `Price`
  - `Funding`
- a smooth line chart with soft area fill
- a methodology breakdown table beneath the chart

This chart module should become the centerpiece of the creator page.

#### 6a. Revenue view

Purpose:

- show creator revenue-related momentum over time

Possible inputs:

- cross-platform engagement
- audience growth
- sponsor activity
- owned audience momentum
- monetization events

Display:

- current revenue signal
- time-range change
- trend line
- source contribution breakdown

#### 6b. Project return view

Purpose:

- show expected return profile for a specific financed project

Display:

- projected payout curve
- capital deployed
- expected payback timing
- milestone-linked return assumptions

#### 6c. Funding view

Purpose:

- show investor participation and funding activity around a creator or creator project

Display ideas:

- total capital simulated into the creator
- number of backers
- funding velocity over time
- latest positions or rounds

### 7. Source methodology breakdown table

Inspired by the screenshot, add a table under the chart showing how the creator index is built.

Recommended columns:

- `Source`
- `Metrics`
- `Transformation`
- `Weighting`
- `Total Change`

Example rows for creators:

- YouTube
  - videos, views, likes, comments
  - `ln(metric + 1)`
  - weight percentage
  - total contribution change
- Instagram
  - posts, likes, comments, saves
  - `ln(metric + 1)`
  - weight percentage
  - total contribution change
- TikTok
  - posts, views, likes, comments, shares
  - `ln(metric + 1)`
  - weight percentage
  - total contribution change
- Newsletter
  - sends, opens, clicks, subscriber change
  - normalized growth + engagement mix
  - weight percentage
  - total contribution change
- Brand deals
  - detected sponsors, verified deals, repeat partners
  - frequency and recency normalization
  - weight percentage
  - total contribution change

This view is valuable because it makes the creator asset legible and inspectable, which is very aligned with Forum.

### 8. Proposed investment instrument model

To support returns, deal pages, and portfolio reporting, the next product pass should define two explicit instruments.

#### Instrument A: Creator revenue-share note

Users invest in:

- a slice of future creator revenue over a defined window

Users receive:

- periodic payouts from qualifying revenue streams

Qualifying revenue streams could include:

- brand deals
- memberships
- courses
- digital products
- merch
- ticketed experiences

Core fields:

- creator
- raise size
- investor pool share
- revenue streams included
- payout term
- return cap if needed
- distributions paid to date

#### Instrument B: Creator project finance round

Users invest in:

- a specific project or campaign with a clear use of funds

Users receive:

- a share of project profits or project-linked payout

Project examples:

- merch drop
- podcast season
- short film
- music release
- tour support
- editing team hire for output expansion

Core fields:

- project name
- creator
- funding goal
- use of funds
- milestones
- expected payout model
- distributions paid to date

### 9. Return calculation direction

The next iteration should define simple, explainable return systems for each instrument.

#### Revenue-share return logic

- investor contributes capital into a creator revenue-share pool
- investor owns a fraction of the pool
- eligible creator revenue is tracked over time
- payouts are distributed proportionally

Display metrics:

- invested amount
- share of revenue pool
- cumulative eligible revenue
- cumulative payout received
- expected future payout
- total return to date

#### Project-finance return logic

- investor contributes capital into a project round
- project performance determines payout size
- return is linked to project revenue or profit milestones

Display metrics:

- invested amount
- project status
- revenue generated so far
- cost recovery progress
- payout received
- projected remaining payout
- expected final return

### 10. UX upgrades for creator investing clarity

Add explicit explanatory panels for:

- what users are backing
- how revenue-share or project payout works
- what return means in the simulation or modeled contract
- how sponsor activity affects creator value

Recommended additions to creator page:

- `What you are investing in`
- `How payouts work`
- `Revenue streams included`
- `Project use of funds`
- `Why this opportunity looks attractive`
- `Source contribution`
- `Recent monetization events`
- `Funding activity`
- `Return scenario explainer`

### 11. Next planning pass priorities

Before the next implementation round, the plan should explicitly break the work into:

1. watchlist data model and persistence
2. revenue-share and project-finance instrument design
3. custom investment ticket UX
4. payout-based portfolio return calculation
5. expanded seed dataset
6. Forum-style chart and methodology table
7. sidebar and modal layout fixes
8. discovery genre pills

These should be treated as the next major milestone after the current MVP.

### 12. Discovery and creator-detail UX corrections

These changes should guide the next implementation pass and replace weaker interaction patterns that currently make the product feel less polished.

#### 12a. Remove sidebar investment CTA

Current issue:

- the detail sidebar includes a `Back this opportunity` CTA that adds clutter and duplicates the primary investment action already available on the deeper creator page

Plan update:

- remove the `Back this opportunity` action from the sidebar entirely
- reposition the sidebar as a lightweight diligence preview rather than a full transaction surface
- keep the sidebar focused on:
  - opportunity summary
  - funding goal and capital raised
  - payout timeline
  - what the investor is funding
  - what the investor gets back
  - `Know more`
  - `Close`

Preferred UX:

- opening the sidebar should feel like a quick read-only preview
- actual commitment should happen on the creator or opportunity detail surface, not in the preview layer

#### 12b. Fit the investment confirmation popup properly

Current issue:

- the investment popup can overflow the viewport and does not feel contained on shorter laptop screens or smaller browser heights

Plan update:

- constrain modal height to the visible viewport
- ensure the popup is vertically centered when space allows
- add internal scrolling inside the modal body rather than page-level overflow
- leave sufficient spacing from top and bottom edges on smaller screens
- verify stacking order relative to the sticky navbar and sidebar sheet

Implementation direction:

- set a max-height based on viewport height
- add a scrollable inner content container
- keep the title and primary confirmation controls visible and easy to reach
- validate behavior on desktop and mobile breakpoints

#### 12c. Replace the creator asset tile with relevant graphs

Current issue:

- the current creator asset tile does not communicate investor-relevant information clearly and feels more decorative than analytical

Plan update:

- remove the current asset tile treatment from the creator page
- replace it with graph modules tied to the actual investment story

Recommended graph modules:

- engagement trend over time
- capital raised versus funding goal
- projected payouts versus payouts returned to date
- revenue-stream contribution mix
- platform contribution or methodology breakdown

Preferred graph behavior:

- each chart should answer a specific investor question
- charts should use the same restrained Forum-like visual language
- charts should avoid fake market pricing if the product is now centered on revenue share and project finance

#### 12d. Use pills for genre filtering instead of a dropdown

Current issue:

- genre selection is hidden in a dropdown, which makes discovery feel slower and less market-like

Plan update:

- replace the discovery page category dropdown with pill-style filter tags
- keep pills horizontally scannable and wrap them cleanly on smaller screens
- show active, hover, and reset states clearly
- preserve URL-backed filter state so sharing and refresh still work

Preferred genre pill set:

- `All`
- `Fashion`
- `Music`
- `Education`
- `Gaming`
- `Podcasts`
- `Fitness`
- `Beauty`
- `Finance`
- `Food`
- `Sports`
- `Film`

Interaction notes:

- clicking a pill should immediately refresh the discovery results
- the selected pill should remain obvious in both light and dark contrast conditions
- the pill row should feel closer to market tabs than social tags

## Immediate Build Order

1. Set up `backend/` and `frontend/`
2. Define schema and seed creators
3. Build `GET /api/creators` and `GET /api/creators/{slug}`
4. Build discovery page
5. Build creator profile page
6. Add brand-deal UI with seeded records
7. Add invest flow and portfolio page
8. Add methodology page
9. Polish visuals to feel close to Forum's interface style

## Detailed Todo List

This section is the working checklist for the full MVP. It is intentionally detailed so implementation can be done phase by phase without having to re-scope work mid-build.

### Phase 0: Product and UX alignment `Completed`

- [x] Confirm the MVP story: discover creators, inspect transparent metrics, simulate investing, track portfolio.
- [x] Finalize the positioning statement so the product stays aligned with Forum's philosophy but remains creator-specific.
- [x] Confirm that the MVP will avoid black-box scores and use raw metrics plus methodology instead.
- [x] Decide the initial creator categories to support in the seed dataset.
- [x] Decide the first supported content sources for the MVP.
  Recommended: YouTube first, optional Instagram or TikTok second.
- [x] Decide whether the app will use a dark neutral theme or a light neutral theme inspired by Forum.
- [x] Define the exact navigation tabs and page names.
- [x] Write the short product copy for landing, discovery, profile, portfolio, and methodology pages.
- [x] Define the user-facing labels for all metrics so naming stays consistent throughout the app.

### Phase 1: Project scaffolding `Completed`

#### Repository setup

- [x] Create `backend/` directory structure.
- [x] Create `frontend/` directory structure.
- [x] Add a root `README` later if needed, but do not prioritize it now.
- [x] Decide whether to use a monorepo-style root workflow or separate frontend/backend commands.

#### Backend setup

- [x] Initialize FastAPI project.
- [x] Add dependency management for Python packages.
- [x] Create `app/main.py`.
- [x] Create `app/api/`, `app/models/`, `app/schemas/`, `app/services/`, `app/db/`, `app/core/`, and `app/tasks/`.
- [x] Configure environment variable loading.
- [x] Add local development settings.
- [x] Set up CORS for the frontend origin.
- [x] Decide on SQLite or Postgres for MVP.
  Recommended: SQLite if speed matters more than infra realism.

#### Frontend setup

- [x] Initialize React app.
- [x] Install Tailwind CSS.
- [x] Install and initialize shadcn/ui.
- [x] Add routing setup.
- [x] Add TanStack Query.
- [x] Add charting library.
- [x] Set up a base layout and theming foundation.
- [x] Add font setup and numeric display styles suitable for data-heavy UI.

### Phase 2: Data modeling and backend foundation `Completed`

#### Database design

- [x] Implement `creators` table/model.
- [x] Implement `creator_platforms` table/model.
- [x] Implement `content_items` table/model.
- [x] Implement `brand_deals` table/model.
- [x] Implement `investments` table/model.
- [x] Implement `users` table/model or create a seeded demo-user strategy.
- [x] Add timestamps where needed.
- [x] Add indexes on fields likely to be queried often.
  Examples: `slug`, `creator_id`, `platform`, `deal_date`.

#### Schemas and serialization

- [x] Create Pydantic schemas for creator list responses.
- [x] Create Pydantic schemas for creator detail responses.
- [x] Create Pydantic schemas for content items.
- [x] Create Pydantic schemas for brand deal responses.
- [x] Create Pydantic schemas for portfolio summary and positions.
- [x] Create request schema for posting a simulated investment.

#### Seed strategy

- [x] Define 8-12 sample creators.
- [x] Assign each creator a category and short bio.
- [x] Assign 2-3 platforms per creator.
- [x] Create realistic platform metrics for each creator.
- [x] Create 10-20 recent content items per creator.
- [x] Create seeded brand deal records for a subset of creators.
- [x] Create optional monetization history fields or placeholder structures.
- [x] Seed a demo user and a few sample investments.

### Phase 3: Core API implementation `Completed`

#### Read APIs

- [x] Implement `GET /api/creators`.
- [x] Add sorting support for `30d growth`, `engagement rate`, and `sponsored activity`.
- [x] Add optional category filtering.
- [x] Add optional platform filtering.
- [x] Add optional search by creator name or handle.
- [x] Implement `GET /api/creators/{slug}`.
- [x] Implement `GET /api/creators/{slug}/content`.
- [x] Implement `GET /api/creators/{slug}/brand-deals`.
- [x] Implement `GET /api/portfolio`.
- [x] Implement `GET /api/methodology`.

#### Mutation APIs

- [x] Implement `POST /api/investments`.
- [x] Validate fixed investment amounts for MVP.
- [x] Return updated portfolio summary after investment creation.
- [x] Add a placeholder or internal-only `POST /api/brand-deals/detect`.

#### API quality tasks

- [x] Add error handling for missing creators and invalid payloads.
- [x] Add response models consistently across endpoints.
- [x] Add lightweight logging.
- [x] Add sample health check endpoint.

### Phase 4: Metric computation and aggregation `Completed`

#### Aggregation logic

- [x] Define how `total audience` is computed across platforms.
- [x] Define how aggregate `engagement rate` is computed for discovery cards.
- [x] Define how `30d growth` is represented when creators have multiple platforms.
- [x] Define how `unique brand partners` is counted.
- [x] Define how `detected sponsored posts` is counted by time window.

#### Summary preparation

- [x] Create backend helpers to assemble creator cards.
- [x] Create backend helpers to assemble profile page datasets.
- [x] Create chart-friendly time series payloads for growth and engagement.
- [x] Create platform-specific metric blocks for the profile page.
- [x] Decide which calculations happen in seed scripts versus response assembly.

#### Methodology alignment

- [x] Write exact formulas for user-facing metrics.
- [x] Record which metrics are directly sourced and which are derived.
- [x] Add update-frequency metadata to the methodology response.
- [x] Add source labels to methodology content.

### Phase 5: Brand-deal detection pipeline design `Completed`

#### Detection rules

- [x] Define the keyword and pattern heuristics for likely sponsor content.
- [x] Define the rules for promo-code detection.
- [x] Define the rules for affiliate-link detection.
- [x] Define how tagged brands or mentions will be normalized.
- [x] Define which evidence text will be surfaced in the UI.

#### LLM extraction design

- [x] Define the structured output schema for sponsorship extraction.
- [x] Design the prompt for classifying sponsored content.
- [x] Design the prompt for extracting brand name and evidence.
- [x] Decide how confidence will be stored and displayed.
- [x] Decide which content sources will actually be passed to the LLM.

#### Data workflow

- [x] Design how candidate content is selected before LLM calls.
- [x] Design how extracted records map into the `brand_deals` table.
- [x] Define the difference between `detected`, `verified`, and `manual` source types.
- [x] Decide whether the MVP runs detection offline in a seed script or on demand via an endpoint.
  Recommended: run it offline or as a manual script for MVP.

### Phase 6: Frontend app shell and shared UI `Completed`

#### Layout and navigation

- [x] Build app shell with persistent top navigation.
- [x] Add routes for landing, discovery, creator profile, portfolio, and methodology.
- [x] Add active nav states.
- [x] Add responsive page containers.
- [x] Add loading and empty states for all major views.

#### Shared components

- [x] Build `MetricCard`.
- [x] Build `SectionHeader`.
- [x] Build `CreatorCard`.
- [x] Build `DataTable`.
- [x] Build `PlatformBadge`.
- [x] Build `GrowthChart`.
- [x] Build `BrandDealList`.
- [x] Build `MethodologyTooltip`.
- [x] Build `InvestDialog`.

#### Styling system

- [x] Define spacing scale for dense dashboard layouts.
- [x] Define color tokens for positive/neutral/alert states.
- [x] Define typography styles for headings, labels, and numeric values.
- [x] Add subtle panel, border, and hover styles to match a market-style product.

### Phase 7: Landing page implementation `Completed`

- [x] Build hero section with headline and subheadline.
- [x] Add CTA to explore creators.
- [x] Add a compact preview of sample creator cards.
- [x] Add a short section explaining the thesis of the product.
- [x] Add a short note about transparent methodology.
- [x] Keep the landing page lightweight and product-forward rather than marketing-heavy.

### Phase 8: Discovery page implementation `Completed`

#### Data and controls

- [x] Fetch creator summaries from `GET /api/creators`.
- [x] Implement search input.
- [x] Implement category filter.
- [x] Implement platform filter.
- [x] Implement sort selector.
- [x] Implement URL state for filters if time permits.

#### Presentation

- [x] Render creator cards or table rows.
- [x] Display avatar, category, platform badges, total audience, 30d growth, engagement rate, and sponsorship metrics.
- [x] Add consistent number formatting.
- [x] Add click-through to creator profile pages.
- [x] Add loading skeletons.
- [x] Add empty results state.

### Phase 9: Creator profile page implementation `Completed`

#### Header and overview

- [x] Build creator header section.
- [x] Show bio, category, and platform links.
- [x] Show overview cards for total audience, recent growth, engagement, and sponsorship activity.

#### Charts and metrics

- [x] Add audience growth chart.
- [x] Add engagement trend chart or compact time-series view.
- [x] Add platform overview cards.
- [x] Add engagement metrics table.
- [x] Add recent content table or feed.

#### Monetization and sponsorship

- [x] Add brand deal history section.
- [x] Show detected vs verified records clearly.
- [x] Display brand names, dates, platform, and evidence snippets.
- [x] Add recent sponsorship activity summary.
- [x] Add a placeholder monetization-history section if deeper monetization data is not yet seeded.

#### Methodology exposure

- [x] Add tooltips or inline labels for metric definitions.
- [x] Add a local methodology summary box on the profile page.
- [x] Link to the full methodology page.

### Phase 10: Simulated investment flow `Completed`

#### Investment UX

- [x] Add `Invest` action on creator profile page.
- [x] Build invest dialog with fixed amount buttons.
- [x] Add confirmation state.
- [x] Add disclaimer that the MVP uses simulated investing.

#### Integration

- [x] Wire dialog to `POST /api/investments`.
- [x] Refresh portfolio-related data after investment.
- [x] Show success toast or inline confirmation.
- [x] Prevent invalid submissions or duplicate rapid clicks.

### Phase 11: Portfolio page implementation `Completed`

#### Summary

- [x] Fetch portfolio data from `GET /api/portfolio`.
- [x] Show total invested.
- [x] Show total creators backed.
- [x] Show category allocation summary.
- [x] Show recent activity.

#### Positions

- [x] Render positions table with creator name, category, amount invested, and date.
- [x] Add links back to creator profiles.
- [x] Add empty state for a fresh portfolio if needed.

### Phase 12: Methodology page implementation `Completed`

- [x] Write a concise explanation of the product's measurement philosophy.
- [x] Add source-by-source breakdown.
- [x] Add update frequency section.
- [x] Add metric definitions section.
- [x] Add explanation of how `engagement rate`, `30d growth`, and `sponsored content detection` work.
- [x] Add explanation of `detected` versus `verified` brand deals.
- [x] Add limitations section so the app feels honest and rigorous.

### Phase 13: Data polish and realism `Completed`

- [x] Review all seeded creator metrics for realism.
- [x] Ensure different creator categories feel meaningfully distinct.
- [x] Make sure some creators have sponsor activity and some do not.
- [x] Make sure recent content feels believable and varied.
- [x] Ensure there is enough variance in growth and engagement to make discovery interesting.
- [x] Add realistic brand names and campaign examples where appropriate.

### Phase 14: Visual polish and Forum-style alignment `Completed`

- [x] Tighten spacing, typography, and chart styling.
- [x] Reduce unnecessary visual noise.
- [x] Make cards feel denser and more investor-facing.
- [x] Normalize border, shadow, and hover treatment across components.
- [x] Make tables easy to scan quickly.
- [x] Keep charts readable and restrained.
- [x] Review the app against Forum's UI tone and remove anything that feels too consumer-social.

### Phase 15: QA and end-to-end walkthrough `Completed`

#### Functional QA

- [x] Verify all routes load correctly.
- [x] Verify all seeded creators appear in discovery.
- [x] Verify creator profile navigation works.
- [x] Verify portfolio updates after a simulated investment.
- [x] Verify brand deal sections render without broken states.
- [x] Verify methodology page content is accurate and consistent with UI labels.

#### UX QA

- [x] Check responsive behavior on desktop and laptop sizes.
- [x] Check empty states, loading states, and error states.
- [x] Verify number formatting is consistent.
- [x] Verify date formatting is consistent.
- [x] Verify charts render cleanly with sample data.

#### Demo QA

- [x] Rehearse the main judge demo flow.
- [x] Confirm one strong creator profile for live demo use.
- [x] Confirm portfolio starts in a sensible demo state.
- [x] Confirm methodology page supports credibility questions.

### Phase 16: Optional stretch tasks `Completed`

- [x] Add creator comparison view.
- [x] Add watchlist functionality.
- [x] Add richer monetization history beyond brand deals.
- [x] Add creator-submitted verification flow.
- [x] Add import scripts for real public content data.
- [x] Add a richer sponsor timeline visualization.
- [x] Add market-style table view toggle on discovery page.

## Next Milestone Todo List

This section tracks the next product pass based on the current feedback and desired Forum-style evolution.

### Phase 17: Watchlist reliability and UX `Completed`

- [x] Audit the current watchlist data flow from discovery cards to watchlist page.
- [x] Decide whether watchlist state should be frontend-only, backend-backed, or hybrid.
- [x] Unify watchlist storage so all pages read from the same source.
- [x] Add optimistic updates for watchlist add/remove actions.
- [x] Add watchlist count badge in the top navigation.
- [x] Add watchlist sorting and filters.
- [x] Add empty-state guidance and quick links back to discovery.

### Phase 18: Investment return model `Completed`

- [x] Choose the primary return abstraction for the product:
  - revenue-share participation
  - project-finance returns
  - revenue-share simulation
- [x] Define what investors are buying:
  - revenue-share pool participation
  - project financing participation
- [x] Define entry price, current price, and current value formulas.
- [x] Define how sponsor activity, growth, and engagement affect price movement.
- [x] Add a plain-language explanation of how simulated returns work.

### Phase 19: Custom investment amounts `Completed`

- [x] Add custom investment amount input to the invest flow.
- [x] Define minimum and maximum allowed amounts.
- [x] Add currency formatting for custom inputs.
- [x] Add validation and helpful error states.
- [x] Show estimated exposure purchased before confirmation.
- [x] Update the confirmation summary to include entry price and exposure.

### Phase 20: Portfolio returns and performance `Completed`

- [x] Extend the investment data model with entry-price-like fields.
- [x] Add creator price history snapshots.
- [x] Compute current value for each position.
- [x] Compute total portfolio value.
- [x] Compute unrealized profit/loss.
- [x] Compute percent return at portfolio and position level.
- [x] Add best and worst performer summary cards.
- [x] Add portfolio performance chart.

### Phase 21: Expanded creator market dataset `Completed`

- [x] Increase seeded creators from the current small set to a larger market.
- [x] Add more creator categories and niches.
- [x] Add more platform combinations.
- [x] Add richer content histories.
- [x] Add more sponsor histories and partner diversity.
- [x] Add a mix of mature and emerging creator profiles.
- [x] Ensure enough records exist for comparison, watchlists, and rankings to feel real.

### Phase 22: Forum-style creator chart module `Completed`

- [x] Design a hero chart block for creator profiles.
- [x] Add time-range controls:
  - `1D`
  - `1W`
  - `1M`
  - `1Y`
  - `ALL`
- [x] Add mode controls:
  - `Index`
  - `Price`
  - `Funding`
- [x] Add a smoothed line chart with area fill.
- [x] Add current value and change labels above the chart.
- [x] Ensure the visual tone is much closer to the reference screenshot.

### Phase 23: Source contribution methodology table `Completed`

- [x] Add a methodology table under the main chart.
- [x] Define per-source metric lists.
- [x] Define transformation labels like `ln(metric + 1)` or normalized growth.
- [x] Define source weightings.
- [x] Define source-level change contribution.
- [x] Render positive and negative contribution states clearly.
- [x] Make the table legible and financial-product oriented.

### Phase 24: Creator asset engine `Completed`

- [x] Define a creator index calculation pipeline.
- [x] Define synthetic price calculation from creator index.
- [x] Define funding activity calculation.
- [x] Store historical snapshots for index, price, and funding.
- [x] Expose new backend endpoints for chart histories and contribution rows.
- [x] Update methodology documentation to explain the asset model clearly.

### Phase 25: Creator monetization and investor return clarity `Completed`

- [x] Add a dedicated `Investor Return` explainer section.
- [x] Show what monetization channels feed the model.
- [x] Show how brand deals affect creator cash-flow assumptions.
- [x] Show how owned audience affects durability.
- [x] Add scenario views for conservative, base, and upside outcomes if needed.
- [x] Keep the copy clear enough that judges can understand the model quickly.

## Revenue-Share and Project-Finance Pivot

This section replaces the stock-like creator framing with clearer investment products.

### Product Decision

The platform should no longer center itself around:

- creator stocks
- synthetic shares as the primary user story
- pseudo-trading language as the main explanation

The platform should instead center itself around two clear instruments:

1. `Creator Revenue-Share Notes`
2. `Creator Project Finance Rounds`

### New Core User Question

Instead of:

- "Which creator stock should I buy?"

The product should answer:

- "Which creator revenue stream should I back?"
- "Which creator project should I finance?"

### Updated Discovery Layer

Discovery should rank and filter actual opportunities, not only creators.

Recommended discovery object types:

- revenue-share opportunities
- project-finance opportunities
- creator profiles with active funding offers

Recommended filters:

- instrument type
- creator category
- payout timeline
- revenue stream type
- funding status
- capital raised
- expected return range

### Updated Creator / Deal Pages

Each investment page should clearly show:

- what the investor is funding
- what revenue streams are included
- how returns are generated
- what has been paid back so far
- what is projected next

For revenue-share pages, show:

- creator
- raise amount
- revenue streams covered
- share available to investors
- payout schedule
- historical monetization context

For project-finance pages, show:

- project name
- creator
- funding goal
- use of funds
- milestones
- projected revenue
- projected payout schedule

### Updated Portfolio Design

Portfolio should feel like a private markets or venture-income dashboard rather than a stock portfolio.

Top-line portfolio metrics:

- total invested
- total returned so far
- outstanding expected payout
- realized return
- expected total return
- active deals
- completed deals

Position rows should show:

- instrument type
- creator
- project or revenue-share name
- invested amount
- capital returned
- projected remaining payout
- total expected payout
- realized return percentage
- status

### UI Copy Direction

Use terms like:

- `Back`
- `Fund`
- `Revenue share`
- `Project finance`
- `Payout`
- `Capital returned`
- `Expected return`
- `Funding goal`

Avoid centering terms like:

- `buy shares`
- `trade creator stock`
- `price appreciation` as the main user explanation

### New Planning Phases

#### Phase 26: Remove creator-stock framing `Completed`

- [x] remove stock-like terminology from core UI
- [x] remove pseudo-trading language from invest flow
- [x] replace synthetic-share explanations with instrument-specific copy
- [x] update methodology and landing page language

#### Phase 27: Revenue-share instrument design `Completed`

- [x] define the exact revenue-share contract abstraction for the MVP
- [x] define eligible revenue streams
- [x] define payout term
- [x] define return cap or no-cap logic
- [x] define investor participation math

#### Phase 28: Project-finance instrument design `Completed`

- [x] define project types supported in the MVP
- [x] define milestone and use-of-funds structure
- [x] define payout logic for completed vs active projects
- [x] define status system for project lifecycle

#### Phase 29: Opportunity-first discovery `Completed`

- [x] redesign discovery around opportunities instead of only creator profiles
- [x] add instrument type cards
- [x] add expected payout and funding progress on cards
- [x] support switching between creator and opportunity views

#### Phase 30: Payout-first portfolio `Completed`

- [x] redesign portfolio around payouts and expected returns
- [x] show capital returned so far
- [x] show projected remaining payout
- [x] show realized vs projected return
- [x] support filtering by instrument type and status

#### Phase 31: Investment confirmation UX `Completed`

- [x] add a confirmation modal before submitting any investment
- [x] show instrument type, creator or project name, amount, and payout summary in the confirmation step
- [x] require an explicit confirm action before capital is committed
- [x] show a success toast after confirmation
- [x] include a direct path from the toast to the portfolio or active deal view

## Discovery Table UX Revision

This section captures the next round of discovery and terminology refinements. These changes are not implemented yet and should guide the next implementation pass.

### Product decisions

- remove the compare feature entirely
- make table view the default discovery experience
- treat the discovery table as the primary underwriting surface
- use clearer, less financial-jargon-heavy labels in the UI

### Terminology changes

Replace current labels as follows:

- `instrument type` -> `return model`
- `revenue_share` -> plain-English label such as `Share of creator revenue`
- `project_finance` -> plain-English label such as `Project-based return`
- `opportunity` -> `description`

These terms should be updated consistently across:

- discovery table
- sidebar detail view
- creator page
- investment modal
- portfolio page
- methodology content where relevant

### Table defaults

The discovery page should:

- open in table view by default
- no longer prioritize card view as the primary mode
- still optionally preserve card view only if it remains useful, but the default must be table

### Remove compare

The compare feature should be removed from:

- navigation
- discovery controls
- related routes
- supporting table actions
- any residual copy or internal state

### Table column order

The discovery table should be reordered to:

1. `Creator`
2. `Expected return`
3. `Description`

Then supporting columns after that, such as:

- `Return model`
- `Funding goal`
- `Capital raised`
- `Payout timeline`

### Creator interaction in table

Clicking the creator cell in the table should no longer immediately navigate away.

New desired behavior:

- clicking a creator opens a right-side detail sidebar
- the sidebar shows more details of the investment description
- the sidebar clearly explains:
  - what the investor is funding
  - return model
  - expected return
  - payout timeline
  - use of funds
  - revenue streams or project basis
- the sidebar should include a `Know more` button
- `Know more` should open the full creator metrics page

This allows the user to:

- inspect the investment from the table
- drill into creator analytics only when needed

### Expected return display

The table should no longer show a range as the primary return number.

Updated requirement:

- average the expected return range into one displayed value
- if backend still stores min/max, compute a midpoint for display
- optionally show the range inside the sidebar or tooltip

Example:

- if min is `18%` and max is `34%`
- show `26%` in the main table
- show the range and explanation in detail view

### Week-on-week arrows

All numerical columns where trend applies should visually indicate direction.

Requirements:

- use up/down arrows for week-on-week movement
- apply to relevant numeric columns such as:
  - expected return
  - funding progress
  - creator growth
  - engagement
  - capital raised momentum if available
- the arrow should indicate trend direction, not replace the actual number

Example display:

- `26% ↑`
- `$42K ↓`

### Engagement tooltip

The engagement column should include an information tooltip.

Tooltip content should explain:

- what engagement means in this product
- how it is calculated
- why it matters for underwriting

Suggested wording direction:

- “Engagement is calculated from likes, comments, and shares relative to total audience across supported platforms.”

### Expected return tooltip

The expected return column should include an information tooltip explaining how it is derived.

Tooltip should explain:

- whether the displayed number is an average of a modeled range
- what assumptions affect it
- how payout expectations differ between return models

Suggested content direction:

- for revenue-share:
  - expected creator revenue
  - investor participation share
  - payout window
- for project-based return:
  - project revenue assumptions
  - cost recovery
  - payout at completion or milestones

### Sidebar content requirements

The discovery sidebar should show:

- creator name
- description title
- return model in plain-English terms
- average expected return
- full expected return range
- funding goal
- capital raised
- payout timeline
- what the investor is funding
- what the investor receives back
- key revenue streams
- use of funds
- status
- `Know more` button to open creator metrics page

### Creator page role after this change

The creator metrics page should become:

- the deep diligence page
- where all creator analytics, brand deals, monetization history, and methodology details live

The discovery sidebar should become:

- the quick decision layer

### New implementation phases

#### Phase 32: Discovery table simplification `Completed`

- [x] remove compare feature from routes, nav, UI, and state
- [x] set table view as the default discovery mode
- [x] reorder the discovery table columns
- [x] move creator to the first column
- [x] move expected return to the second column
- [x] move description to the third column

#### Phase 33: Terminology cleanup `Completed`

- [x] rename `instrument type` to `return model`
- [x] rename raw instrument values into layman-friendly labels
- [x] rename `opportunity` to `description`
- [x] update labels across discovery, creator page, portfolio, investment modal, and methodology

#### Phase 34: Trend arrows and table clarity `Completed`

- [x] add week-on-week directional arrows to relevant numeric columns
- [x] define which backend metrics should power those arrows
- [x] ensure arrows and numeric values are shown together
- [x] keep the styling compact and easy to scan in table view

#### Phase 35: Discovery tooltips `Completed`

- [x] add engagement info tooltip with formula and rationale
- [x] add expected return info tooltip with methodology explanation
- [x] ensure tooltips are concise and readable
- [x] keep tooltip content aligned with the methodology page

#### Phase 36: Average expected return presentation `Completed`

- [x] compute average expected return for primary table display
- [x] preserve min/max return in detailed sidebar content
- [x] standardize return formatting across table, sidebar, and portfolio

#### Phase 37: Sidebar-first creator drill-in `Completed`

- [x] make creator cell open a right-side sidebar instead of direct navigation
- [x] populate sidebar with investment description details
- [x] add `Know more` CTA to open the full creator metrics page
- [x] ensure sidebar content is rich enough for fast underwriting

#### Phase 38: Sidebar and modal UX corrections `Completed`

- [x] remove `Back this opportunity` from the sidebar
- [x] keep the sidebar as a read-only diligence preview
- [x] constrain the investment popup to the viewport height
- [x] add internal scroll behavior to the investment popup instead of page overflow
- [x] verify popup layout against the sticky navbar and right-side sheet
- [x] verify the popup works on shorter laptop screens and mobile breakpoints

#### Phase 39: Creator detail visualization overhaul `Completed`

- [x] remove the current creator asset tile that does not map to the investment story
- [x] replace it with investor-relevant graph modules
- [x] add a chart for engagement trend over time
- [x] add a chart for capital raised versus funding goal
- [x] add a chart for payouts returned to date versus projected payouts
- [x] add a chart or table for revenue-stream or platform contribution breakdown
- [x] keep the chart language aligned with revenue-share and project-finance products rather than pseudo-stock pricing

#### Phase 40: Discovery genre filter pills `Completed`

- [x] replace the genre dropdown with pill-style category filters
- [x] keep the active pill state in the URL query params
- [x] support wrap behavior for pills on smaller screens
- [x] style pills to feel close to financial market tabs rather than social tags
- [x] preserve existing discovery filtering behavior for `All` and each category
