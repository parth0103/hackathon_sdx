# Creator Market

Creator Market is a demo investing interface for backing creator businesses through revenue-share notes and project-finance rounds.

Video demo: https://youtu.be/BpEsExCKLKk?si=I8_vohyxoi_RNn8P

## What it includes

- A minimalist landing page and overview flow
- A discovery screen for browsing creator investment opportunities
- Creator detail pages with audience, growth, sponsor, and opportunity data
- A portfolio view for tracking demo investments
- A FastAPI backend with seeded demo data

## Tech stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, React Query, Recharts
- Backend: FastAPI, SQLModel, SQLite-style seeded demo data

## Run locally

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Frontend runs on `http://localhost:5173` and the API runs on `http://localhost:8000`.

## Main routes

- `/` landing page
- `/discover` opportunity discovery
- `/creators/:slug` creator detail
- `/portfolio` portfolio tracking
- `/watchlist` saved creators
- `/methodology` scoring and methodology

## Notes

- This project is built around demo data and local development flows.
- Investments and portfolio activity are simulated for product exploration.
