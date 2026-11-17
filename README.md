# CivicPulse AI (prototype)

A prototype civic feedback and issue-management dashboard concept for municipal staff reviewing complaints about roads, garbage, water, drainage and streetlights.

> **Prototype concept only.** It uses fictional sample data and is **not** connected to, endorsed by, or part of Rajkot Municipal Corporation or any government system.

## What it demonstrates
- Dashboard: summary cards, weekly trend, issue categories, sentiment split, ward hotspot tiles
- Complaint list: search plus filters for issue type, ward/location, sentiment, urgency, department and status; priority/status labels; repeat-report badges
- Complaint details: full sample record, AI suggestion panel, staff controls (department, status, final priority, internal notes)
- Principle: AI only *suggests*; staff review and decide

## Prerequisites
- Node.js 16 or newer (https://nodejs.org). No other dependencies; nothing to install.

## Run
```bash
cd civicpulse-ai
npm start
```
Then open http://localhost:3000 (use `PORT=4000 npm start` for another port; on Windows PowerShell: `$env:PORT=4000; npm start`).
No Node? Run `python3 -m http.server 3000 --directory public` instead. Opening `public/index.html` directly also works.

## Main screens
1. **Dashboard** (`#/dashboard`): select a ward tile to jump to its complaints.
2. **Complaints** (`#/complaints`): filter, then open any row.
3. **Complaint details** (`#/complaints/CP-1001`): change department/status/priority, add a note, and press *Save staff decision*.

## Mock data and simulated behavior
- 72 fictional complaints are generated in `public/data.js` with a seeded generator (no real citizens, no personal data). Ward names are labeled "Sample".
- AI category, priority, department and confidence are pre-assigned mock values; no AI model runs.
- The ward view is a schematic tile grid, not a real map.
- Staff edits are saved only in your browser's localStorage (clear site data to reset). There is no database, login or server API.

## Structure
`server.js` (static server) · `public/index.html` · `public/styles.css` · `public/data.js` · `public/app.js`
