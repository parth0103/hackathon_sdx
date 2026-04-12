# Overview + Discovery UI Implementation Plan

## Objective

Redesign the current overview screen and tighten the discovery UI so the product feels minimalist, confident, and high-trust, drawing from the strongest patterns in both `crowdsurf.xyz` and `app.forum.market`.

This plan is for the existing codebase in this repo:

- frontend: React + Vite + Tailwind
- backend: FastAPI
- current overview route: `frontend/src/pages/landing-page.tsx`
- current discovery route: `frontend/src/pages/discovery-page.tsx`

The goal is not to clone either reference. The goal is to borrow the qualities that make them effective:

- oversized headline
- sparse copy
- very few competing actions
- strong whitespace
- restrained palette
- serious, financial tone
- simple proof elements instead of noisy dashboards
- segmented controls and pill filters instead of form-heavy filter bars
- one dominant data surface per page instead of many equally loud cards

## What We Are Designing

We are redesigning:

1. the top-level overview experience at `/`
2. the discovery filtering and information hierarchy at `/discover`

The new screen should:

1. Explain the product in one glance.
2. Feel premium and intentional.
3. Push users toward discovery.
4. Introduce the product philosophy before showing dense data.
5. Bridge the current app design with a more minimal landing style.

The updated discovery screen should:

1. Replace the genre dropdown with filter pills.
2. Feel closer to a market terminal than a dashboard of stacked widgets.
3. Reduce information overload by making the table view the default primary surface.
4. Use compact, Forum-like segmented controls for sort, platform, and display mode.

## Reference Breakdown

From `crowdsurf.xyz`, the most useful patterns to adapt are:

1. A very large, uppercase hero statement that carries the whole page.
2. Extremely short supporting copy.
3. One primary action, with at most one secondary action.
4. Strong use of empty space so every block feels important.
5. Minimal visual clutter near the top of the page.
6. A simple proof or concept card near the hero instead of a full product UI dump.
7. A page structure that explains the idea in a few clear beats instead of many small sections.

From `app.forum.market`, the most useful UI patterns to adapt are:

1. Sparse global navigation with almost no decorative chrome.
2. A strong "market first" hierarchy where a single main data surface dominates the page.
3. Compact segmented controls such as `1D / 1W / 1M / 1Y / ALL`.
4. Tight tab-style groupings like `Index / Price / Funding` rather than stacked cards.
5. Short labels, dense rows, and restrained spacing.
6. A layout that makes scanning easier by reducing the number of simultaneous sections. citeturn0view0turn2view2

For this product, the translation should be:

- not "invest in the individual"
- but "back creators with transparent data"

This means the overview page should feel more like a serious market thesis page than a SaaS dashboard or creator social app.

This also means discovery should feel more like a clean market board than a creator catalog with form controls. citeturn0view0turn2view2

## Design Direction

### Tone

The page should feel:

- calm
- sharp
- high-contrast
- editorial
- institutional

It should not feel:

- playful
- startup-generic
- overly "social media"
- gradient-heavy
- overloaded with charts above the fold

### Visual System

Use the design language already present in the repo, but simplify it further for the overview page:

- background: very dark charcoal / near-black
- text: bright white and muted gray-blue
- accent: current pale blue can stay, but use it sparingly
- borders: faint, thin, quiet
- radius: keep existing rounded card system

Typography direction:

- hero: uppercase, tightly spaced, large, heavy
- body: short, clean, readable
- labels: tiny uppercase eyebrow text
- no long paragraphs near the top

### Layout Principle

The overview should read in large blocks:

1. Hero
2. Thesis / why now
3. How it works
4. Preview of creator market
5. Final CTA

Each section should have breathing room. Resist the urge to fill empty space.

For discovery, the layout principle should be:

1. Search first
2. Genre pills second
3. Compact secondary controls third
4. One dominant results surface

Not:

1. Large filter box
2. Multiple competing cards
3. Repeated section headers
4. High-density controls competing with results

## Proposed Page Architecture

## 1. Hero Section

### Purpose

Immediately communicate the core proposition.

### Content structure

- small eyebrow
- huge multi-line headline
- short explanatory paragraph
- primary CTA
- secondary CTA
- compact proof card or miniature market panel

### Suggested copy

Eyebrow:

`TRANSPARENT CREATOR MARKET DATA`

Headline:

`BACK THE NEXT GENERATION OF CREATORS`

or

`INVEST IN CREATORS WITH OPEN METRICS`

Supporting copy:

`Review growth, engagement, and sponsor history before taking a simulated position.`

CTA:

- Primary: `Explore creators`
- Secondary: `Read methodology`

### Layout behavior

Desktop:

- two-column layout
- left side carries the headline and actions
- right side holds one refined proof card

Mobile:

- stacked layout
- hero text first
- proof card second

### Proof card idea

Instead of showing multiple creator cards, show one summary block:

- total creators tracked
- sponsor records
- average 30d growth across the market
- categories covered

This will feel more minimal than the current three-card preview.

## 2. Thesis Section

### Purpose

Mirror the "new asset class" style argument from Crowdsurf, but adapted to creator economics.

### Content

Headline:

`CREATORS ARE BECOMING DURABLE BUSINESSES`

Short supporting lines:

- `Audiences now compound like owned distribution.`
- `Brand deals, products, and subscriptions create recurring upside.`
- `We surface the inputs instead of hiding them behind a score.`

### Design

- centered block
- lots of padding top and bottom
- no cards unless needed
- maybe one divider line or small label above it

## 3. How It Works

### Purpose

Explain the product in three clean steps.

### Structure

Three vertical or horizontal steps:

1. `DISCOVER`
   - Browse creators by growth, engagement, and category.
2. `DILIGENCE`
   - Inspect platform metrics, sponsor history, and monetization context.
3. `SIMULATE`
   - Take a position and track it in your portfolio.

### Design

- large step number
- uppercase label
- one sentence each
- thin separators
- avoid overly decorative icons

## 4. Market Preview

### Purpose

Transition from thesis into actual product data.

### Content

Show:

- section header
- one dense data table preview or a row of 2 curated creator cards
- link to full discovery

This section should prove the product is real without overwhelming the top of the page.

### Recommendation

Prefer a **compact market table** over large visual cards.

Why:

- it feels more financial
- it fits the minimalist direction better
- it differentiates the page from creator-app aesthetics

Suggested columns:

- Creator
- Category
- Audience
- 30d Growth
- Engagement
- Brand Partners

Only show top 4-5 rows.

## Discovery Redesign

## Objective

The current discovery page has too much "UI weight" in the controls area:

- a 4-column filter bar
- dropdowns for several decisions
- a second row of mode buttons
- optional cards or table, both given equal prominence

This creates information overload because the controls and the content fight for attention.

The redesigned discovery page should borrow from Forum's calmer hierarchy:

- the search and filters feel like trading controls
- the table becomes the primary default
- cards become secondary and optional
- pills replace the genre dropdown for faster scanning and better visual rhythm

## Discovery Structure

Recommended structure:

1. Page header
2. Search input
3. Genre pills
4. Secondary segmented controls
5. Results table
6. Optional card view toggle

### Recommended default state

- default `view = table`
- genre displayed as pills
- sort displayed as segmented chips or compact pills
- card view demoted to an alternate mode, not the visual default

## Genre Pills

### Why

Pills are better than a dropdown for category because:

- categories are few and known
- users can scan all options instantly
- one-tap switching is faster
- pills visually match a market-filter or leaderboard-tab pattern better than a select menu

### Categories

Use the existing categories:

- All
- Fashion
- Music
- Education
- Gaming
- Podcasts
- Fitness

### Interaction rules

1. Only one genre pill is active at a time.
2. Active pill uses a stronger fill and text color.
3. Inactive pills stay quiet but visible.
4. Selecting `All` clears the `category` query param.

### Example component

```tsx
type FilterPillGroupProps = {
  items: Array<{ label: string; value: string }>;
  activeValue: string;
  onChange: (value: string) => void;
};

export function FilterPillGroup({
  items,
  activeValue,
  onChange,
}: FilterPillGroupProps): JSX.Element {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => {
        const active = item.value === activeValue;

        return (
          <button
            key={item.value}
            type="button"
            onClick={() => onChange(item.value)}
            className={[
              "rounded-full border px-3 py-1.5 text-xs font-medium uppercase tracking-[0.14em] transition",
              active
                ? "border-white bg-white text-black"
                : "border-white/10 bg-white/[0.03] text-white/72 hover:border-white/20 hover:text-white",
            ].join(" ")}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
```

### Discovery integration example

```tsx
const categoryOptions = [
  { label: "All", value: "all" },
  { label: "Fashion", value: "fashion" },
  { label: "Music", value: "music" },
  { label: "Education", value: "education" },
  { label: "Gaming", value: "gaming" },
  { label: "Podcasts", value: "podcasts" },
  { label: "Fitness", value: "fitness" },
];

<FilterPillGroup
  items={categoryOptions}
  activeValue={category}
  onChange={(value) => updateParam("category", value)}
/>;
```

## Secondary Discovery Controls

Forum-like control systems work because they are compact and grouped by intent rather than rendered as a row of big form fields. `app.forum.market` visibly favors concise control clusters and segmented selectors over bulky filter forms. citeturn0view0turn2view2

For this product, split controls into:

### Primary control

- Search

### Secondary controls

- Platform
- Sort
- View

### Recommendation

Keep `platform` as a compact segmented chip row if the number of platforms stays small, or a minimal dropdown if it grows. Convert `sort` and `view` to pills/tabs.

## Suggested discovery top section

```tsx
<section className="space-y-4">
  <Input
    value={search}
    onChange={(event) => updateParam("search", event.target.value)}
    placeholder="Search creators"
    className="h-12 rounded-full border-white/10 bg-white/[0.03] px-5"
  />

  <FilterPillGroup
    items={categoryOptions}
    activeValue={category}
    onChange={(value) => updateParam("category", value)}
  />

  <div className="flex flex-wrap items-center gap-2">
    <FilterPillGroup
      items={[
        { label: "Growth", value: "growth_30d" },
        { label: "Engagement", value: "engagement_rate" },
        { label: "Sponsors", value: "sponsored_activity" },
        { label: "Audience", value: "audience" },
      ]}
      activeValue={sort}
      onChange={(value) => updateParam("sort", value)}
    />

    <FilterPillGroup
      items={[
        { label: "Table", value: "table" },
        { label: "Cards", value: "cards" },
      ]}
      activeValue={view}
      onChange={(value) => updateParam("view", value)}
    />
  </div>
</section>
```

## Discovery Information Hierarchy

### Current problem

Right now the page gives equal importance to:

- page intro
- filter container
- view toggle row
- compare CTA
- results surface

That makes the page feel busy before the user even reads the data.

### New hierarchy

1. Small page heading
2. One-line description
3. Search and pills
4. Main results table
5. Compare action integrated into the table surface or results header

This is much closer to Forum's design pattern, where the user is quickly oriented toward a central market surface rather than a stack of UI blocks. citeturn0view0turn2view2

## Table-First Recommendation

To reduce overload, make the table the default discovery mode.

Why this matters:

- tables compress information better than cards
- the product pitch is data-first
- the current cards duplicate information and expand the page vertically
- a table matches Forum's leaderboard and exchange-style framing better than a card grid does

Recommended table refinements:

- tighter row height
- muted headers
- hover state on rows
- creator name as the strongest text element
- metrics right-aligned where appropriate
- compare checkbox column visually minimized

### Example table treatment

```tsx
<DataTable
  rows={query.data?.items ?? []}
  columns={[
    {
      header: "",
      render: (row) => (
        <input
          type="checkbox"
          checked={compare.includes(row.slug)}
          onChange={() => toggleCompare(row.slug)}
          aria-label={`Compare ${row.name}`}
        />
      ),
    },
    {
      header: "Creator",
      render: (row) => (
        <Link
          to={`/creators/${row.slug}`}
          className="font-medium text-white transition hover:text-accent"
        >
          {row.name}
        </Link>
      ),
    },
    { header: "Genre", render: (row) => row.category },
    { header: "Audience", render: (row) => formatNumber(row.total_audience) },
    { header: "30d", render: (row) => formatPercent(row.growth_30d) },
    { header: "Eng.", render: (row) => formatPercent(row.engagement_rate) },
    { header: "Partners", render: (row) => row.unique_brand_partners },
  ]}
/>
```

## Overview Page Adjustments Based On Forum

The earlier overview direction still stands, but with one important refinement:

- make the page even more compressed
- remove anything that feels like stacked marketing sections
- treat the market preview table as the central proof element

### Specific changes

1. Reduce top-of-page copy even further.
2. Keep only one proof card near the hero.
3. Use fewer cards overall.
4. Prefer table and row structures over card grids.
5. Keep labels short and uppercase.
6. Use borders and spacing, not color, to create structure.

## Files To Update

Primary overview files:

- `frontend/src/pages/landing-page.tsx`

Primary discovery files:

- `frontend/src/pages/discovery-page.tsx`
- `frontend/src/components/data-table.tsx`

Likely new shared component:

- `frontend/src/components/filter-pill-group.tsx`

Optional cleanup:

- `frontend/src/components/creator-card.tsx`
- `frontend/src/index.css`
- `frontend/tailwind.config.ts`

## 5. Final CTA Section

### Purpose

Close the page with a clean conversion action.

### Content

Headline:

`START WITH THE SIGNALS, NOT THE STORY`

Body:

`Browse the creator market and review every input before adding a position.`

CTA:

- `Open discovery`

## Implementation Strategy

## Files To Update

Primary:

- `frontend/src/pages/landing-page.tsx`

Likely additions:

- `frontend/src/components/overview-hero.tsx`
- `frontend/src/components/overview-proof-card.tsx`
- `frontend/src/components/overview-step-list.tsx`
- `frontend/src/components/overview-market-preview.tsx`

Optional styling cleanup:

- `frontend/src/index.css`
- `frontend/tailwind.config.ts`

## Recommended Refactor Approach

Do not keep all landing logic inline in `landing-page.tsx`.

Instead:

1. Keep `LandingPage` as the composition layer.
2. Extract the hero and supporting sections into dedicated components.
3. Reuse existing primitives where possible:
   - `Button`
   - `Card`
   - `SectionHeader`
   - `DataTable`
4. Add a small shared pill-group component for discovery and any future segmented controls.
5. Add only a few overview-specific components.

This will keep the page maintainable and prevent one large JSX file.

## Section-by-Section Build Plan

## Phase 1: Replace Current Hero

### Current issue

The existing landing page is clear, but it still reads like a standard product hero with a sample-card grid below it.

For the new direction, it should feel more singular and more dramatic.

### Change

Replace the current hero with:

- larger type
- more whitespace
- fewer lines of supporting copy
- one proof panel instead of a generic "Approach" card

### Example component

```tsx
import { Link } from "react-router-dom";

import { Button } from "./ui/button";
import { Card } from "./ui/card";

type OverviewHeroProps = {
  creatorsTracked: number;
  sponsorRecords: number;
  averageGrowth30d: number;
};

export function OverviewHero({
  creatorsTracked,
  sponsorRecords,
  averageGrowth30d,
}: OverviewHeroProps): JSX.Element {
  return (
    <section className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
      <div className="space-y-6">
        <p className="text-xs uppercase tracking-[0.24em] text-accent">
          Transparent creator market data
        </p>

        <h1 className="max-w-4xl text-5xl font-semibold uppercase leading-[0.92] tracking-[-0.04em] text-white md:text-7xl">
          Back the next
          <br />
          generation of
          <br />
          creators
        </h1>

        <p className="max-w-xl text-base leading-7 text-muted md:text-lg">
          Review growth, engagement, and sponsor history before taking a simulated
          position.
        </p>

        <div className="flex flex-wrap gap-3">
          <Link to="/discover">
            <Button>Explore creators</Button>
          </Link>
          <Link to="/methodology">
            <Button variant="ghost">Read methodology</Button>
          </Link>
        </div>
      </div>

      <Card className="space-y-6 border-white/10 bg-white/[0.03] p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-muted">
          Market overview
        </p>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-muted">
              Creators
            </p>
            <p className="mt-2 text-3xl font-semibold text-white">
              {creatorsTracked}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-muted">
              Sponsor records
            </p>
            <p className="mt-2 text-3xl font-semibold text-white">
              {sponsorRecords}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-muted">
              Avg 30d growth
            </p>
            <p className="mt-2 text-3xl font-semibold text-white">
              +{averageGrowth30d.toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-muted">
              Mode
            </p>
            <p className="mt-2 text-3xl font-semibold text-white">Simulated</p>
          </div>
        </div>
      </Card>
    </section>
  );
}
```

## Phase 2: Add A Thesis Block

### Why

Crowdsurf works because it does not immediately dump product details. It establishes a worldview first.

This app should do the same.

### Example component

```tsx
export function OverviewThesis(): JSX.Element {
  return (
    <section className="mx-auto max-w-4xl space-y-6 py-12 text-center md:py-20">
      <p className="text-xs uppercase tracking-[0.22em] text-accent">
        Why now
      </p>
      <h2 className="text-3xl font-semibold uppercase leading-tight tracking-[-0.03em] text-white md:text-5xl">
        Creators are becoming durable businesses
      </h2>
      <div className="space-y-3 text-sm leading-7 text-muted md:text-base">
        <p>Audiences now behave like owned distribution.</p>
        <p>Brand deals, products, and subscriptions create monetization depth.</p>
        <p>We show the inputs directly instead of collapsing them into one score.</p>
      </div>
    </section>
  );
}
```

## Phase 3: Build A Clean Three-Step Explanation

### Why

This makes the page self-explanatory without adding too much text.

### Example component

```tsx
const steps = [
  {
    number: "01",
    title: "Discover",
    body: "Browse creators by category, audience growth, engagement, and sponsor activity.",
  },
  {
    number: "02",
    title: "Diligence",
    body: "Inspect platform metrics, recent content, and monetization context in one profile.",
  },
  {
    number: "03",
    title: "Simulate",
    body: "Add a fixed-size position and track allocations in your portfolio dashboard.",
  },
];

export function OverviewStepList(): JSX.Element {
  return (
    <section className="space-y-8 py-10">
      <div className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.22em] text-accent">
          How it works
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {steps.map((step) => (
          <div
            key={step.number}
            className="rounded-2xl border border-white/10 bg-white/[0.02] p-6"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-muted">
              Step {step.number}
            </p>
            <h3 className="mt-6 text-2xl font-semibold uppercase text-white">
              {step.title}
            </h3>
            <p className="mt-3 text-sm leading-7 text-muted">{step.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
```

## Phase 4: Replace The Card Grid With A Market Table Preview

### Why

The current landing page shows sample creator cards. That is functional, but a compact table is more aligned with the minimalist, market-like feel.

### Recommendation

Fetch creators the same way the landing page already does, then show only the top 4-5 in a compact table.

### Example component

```tsx
import { Link } from "react-router-dom";

import { DataTable } from "./data-table";
import { Card } from "./ui/card";
import { formatNumber, formatPercent } from "../lib/utils";
import type { CreatorCard } from "../types/api";

type OverviewMarketPreviewProps = {
  items: CreatorCard[];
};

export function OverviewMarketPreview({
  items,
}: OverviewMarketPreviewProps): JSX.Element {
  return (
    <section className="space-y-6 py-6">
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.22em] text-accent">
            Market preview
          </p>
          <h2 className="text-2xl font-semibold uppercase text-white md:text-4xl">
            A quick read on the market
          </h2>
          <p className="max-w-2xl text-sm leading-7 text-muted">
            Review a few creator profiles before opening the full discovery view.
          </p>
        </div>

        <Link
          to="/discover"
          className="text-sm uppercase tracking-[0.16em] text-white/80 transition hover:text-white"
        >
          Open discovery
        </Link>
      </div>

      <Card className="overflow-hidden border-white/10 bg-white/[0.02] p-0">
        <DataTable
          rows={items}
          columns={[
            {
              header: "Creator",
              render: (row) => (
                <Link to={`/creators/${row.slug}`} className="hover:text-accent">
                  {row.name}
                </Link>
              ),
            },
            { header: "Category", render: (row) => row.category },
            {
              header: "Audience",
              render: (row) => formatNumber(row.total_audience),
            },
            {
              header: "30d growth",
              render: (row) => formatPercent(row.growth_30d),
            },
            {
              header: "Engagement",
              render: (row) => formatPercent(row.engagement_rate),
            },
            {
              header: "Partners",
              render: (row) => String(row.unique_brand_partners),
            },
          ]}
        />
      </Card>
    </section>
  );
}
```

## Phase 5: Add A Closing CTA

### Example component

```tsx
import { Link } from "react-router-dom";

import { Button } from "./ui/button";

export function OverviewClosingCta(): JSX.Element {
  return (
    <section className="mx-auto max-w-4xl space-y-6 py-16 text-center">
      <p className="text-xs uppercase tracking-[0.22em] text-accent">
        Start here
      </p>
      <h2 className="text-3xl font-semibold uppercase leading-tight tracking-[-0.03em] text-white md:text-5xl">
        Start with the signals, not the story
      </h2>
      <p className="mx-auto max-w-2xl text-sm leading-7 text-muted md:text-base">
        Browse the creator market and review every input before adding a position.
      </p>
      <div className="flex justify-center">
        <Link to="/discover">
          <Button>Explore creators</Button>
        </Link>
      </div>
    </section>
  );
}
```

## Phase 6: Compose The New Landing Page

### Example page composition

```tsx
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { getCreators } from "../lib/api";
import { OverviewClosingCta } from "../components/overview-closing-cta";
import { OverviewHero } from "../components/overview-hero";
import { OverviewMarketPreview } from "../components/overview-market-preview";
import { OverviewStepList } from "../components/overview-step-list";
import { OverviewThesis } from "../components/overview-thesis";

export function LandingPage(): JSX.Element {
  const query = useQuery({
    queryKey: ["creators", "landing-overview"],
    queryFn: () => getCreators(new URLSearchParams({ sort: "growth_30d" })),
  });

  const items = query.data?.items ?? [];
  const previewItems = items.slice(0, 5);

  const stats = useMemo(() => {
    if (items.length === 0) {
      return {
        creatorsTracked: 0,
        sponsorRecords: 0,
        averageGrowth30d: 0,
      };
    }

    const totalDetectedDeals = items.reduce(
      (sum, item) => sum + item.detected_sponsored_posts,
      0,
    );

    const averageGrowth30d =
      items.reduce((sum, item) => sum + item.growth_30d, 0) / items.length;

    return {
      creatorsTracked: items.length,
      sponsorRecords: totalDetectedDeals,
      averageGrowth30d,
    };
  }, [items]);

  return (
    <div className="space-y-16 pb-10 md:space-y-24">
      <OverviewHero {...stats} />
      <OverviewThesis />
      <OverviewStepList />
      <OverviewMarketPreview items={previewItems} />
      <OverviewClosingCta />
    </div>
  );
}
```

## Styling Adjustments

## Forum-inspired UI rules

Follow these patterns consistently:

1. One dominant panel per page.
2. Controls should look like tabs or chips, not a form builder.
3. Use short labels: `30D`, `Eng.`, `Partners`, `Table`, `Cards`.
4. Prefer tight rows over tall cards.
5. Avoid multiple sections with equal visual weight stacked vertically.
6. Use quiet surfaces: `bg-white/[0.02]`, `border-white/10`.
7. Keep the number of accents low and let contrast do the work.

## 1. Tighten the hero typography

In `frontend/src/index.css`, add a utility class for the overview headline:

```css
.overview-headline {
  text-wrap: balance;
  font-variant-ligatures: none;
}
```

If needed, use it on the hero `h1`.

## 2. Make the page feel more minimal

Reduce the visual density of overview-specific cards:

- less border contrast
- subtler backgrounds
- fewer nested sections

Suggested Tailwind treatment:

- `border-white/10`
- `bg-white/[0.02]`
- `text-white`
- `text-muted`

## 3. Increase top-of-page space

In the landing page only, add more vertical spacing than internal pages.

Example:

```tsx
<div className="space-y-16 pt-4 pb-10 md:space-y-24 md:pt-8">
```

## 4. Keep motion minimal

If motion is added later, use only:

- fade-up on initial load
- staggered reveal for steps

Do not add:

- floating blobs
- noisy hover animations
- parallax

## Discovery spacing guidance

The discovery screen should feel denser than the overview page:

- less vertical padding
- fewer full-width cards
- controls close to results
- no oversized descriptive copy

Recommended page wrapper:

```tsx
<div className="space-y-6">
```

## Content Rules

To stay close to the intended minimalist feel:

- keep the hero paragraph under 2 lines on desktop
- keep each supporting section under 3 short sentences
- avoid more than 2 CTAs per section
- do not put charts above the fold
- do not show more than 5 preview creators on the overview page
- do not use dropdowns for genre/category filtering
- do not default discovery to cards

## Data Rules

For the overview screen, show only high-signal summary data:

- creators tracked
- sponsor records or detected sponsor posts
- average 30d growth
- curated preview rows

Do not bring in:

- full portfolio widgets
- large chart modules
- too many metric cards
- methodology details beyond one secondary CTA

## Mobile Behavior

### Hero

- stack vertically
- keep the headline large but reduce to `text-5xl`
- keep CTA buttons full-width if needed

### Market preview

- allow horizontal table scroll
- keep row count small

### Steps

- one column
- generous spacing between cards

## Accessibility Checklist

1. Maintain strong contrast between white text and dark background.
2. Do not rely on color alone for meaning.
3. Keep heading hierarchy valid:
   - one `h1`
   - section `h2`s
4. Ensure CTA buttons remain keyboard accessible.
5. Preserve readable line-height on supporting text.

## Engineering Checklist

1. Create `filter-pill-group.tsx`.
2. Replace the discovery category dropdown with genre pills.
3. Convert discovery view and sort controls to segmented pills.
4. Make discovery default to table view.
5. Tighten `DataTable` styling for a cleaner market feel.
6. Refactor `landing-page.tsx` to compose overview-specific components.
7. Replace creator-card preview with compact market preview table.
8. Tighten hero typography and spacing.
9. Reuse existing `getCreators()` query.
10. Keep zero new backend work unless new summary metrics are truly needed.
11. Run frontend typecheck and build after implementation.

## Nice-To-Have Enhancements

These are optional after the first pass:

### 1. Add a subtle dividing line between sections

This can help structure the page without adding visual noise.

### 2. Add a tiny trust strip

Example:

- `6 creators tracked`
- `18 recent content items`
- `detected + verified sponsor history`

This should stay small and quiet.

### 3. Add route-level animation

Only if the rest of the app supports it. Keep it understated.

## What Success Looks Like

The new overview screen should make a first-time user feel:

- "I understand the product immediately."
- "This feels serious and curated."
- "I want to click into discovery."
- "This is about transparent underwriting, not hype."

## Final Recommendation

The biggest shift should be:

- fewer components above the fold
- much stronger typography
- one proof panel instead of multiple sample cards
- a compact market preview instead of a busy landing grid
- pill filters instead of genre dropdowns
- a table-first discovery experience with tighter hierarchy

If we execute only those four changes well, the overview screen will move much closer to the minimalist confidence of the reference while still feeling native to this codebase.
