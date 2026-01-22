# JIVS OCC - Migration Command Center

An enterprise-grade SAP S/4HANA migration management dashboard built with Next.js 15 and React 19. This application provides a visual command center for tracking, managing, and monitoring complex legacy system migrations.

## Features

- **Migration Health Dashboard** - Real-time system health score, error density tracking, integrity index monitoring, and stability trend analysis
- **Object Selection** - Browse and manage SAP migration objects with search, filtering, and detailed property views
- **Migration Lifecycle** - 5-stage ETL pipeline visualization (Extract → Transform → Validate → Reconcile → Load) with progress tracking
- **Dependency Graph** - Interactive React Flow visualization showing object dependencies and blocking chains
- **Reconciliation Intelligence** - Source vs target comparison with AI-powered recommendations and audit rules

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 15.3.5 | React framework with App Router |
| React | 19.0.0 | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | v4 | Styling |
| Shadcn/ui | - | UI component library |
| Recharts | 3.0.2 | Data visualization |
| @xyflow/react | 12.10.0 | Dependency graph |
| Framer Motion | 12.23.24 | Animations |

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- npm, yarn, pnpm, or bun

### Installation

```bash
# Install dependencies
npm install
# or
bun install
```

### Development

```bash
# Run the development server
npm run dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build

```bash
# Create production build
npm run build

# Start production server
npm run start
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Main dashboard page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Tailwind CSS configuration
│
├── components/
│   ├── migration/         # Core feature components
│   │   ├── Dashboard.tsx
│   │   ├── ObjectSelection.tsx
│   │   ├── Lifecycle.tsx
│   │   ├── DependencyGraph.tsx
│   │   └── Reconciliation.tsx
│   │
│   └── ui/                # Shadcn/ui primitives
│
├── lib/
│   ├── migration-data.ts  # Migration object definitions
│   ├── mock-data.ts       # Health & reconciliation data
│   └── utils.ts           # Utility functions
│
└── hooks/                 # Custom React hooks
```

## Current Status

This is a **frontend prototype** with mock data. The UI is production-quality with enterprise-grade styling. Backend integration points are prepared but not connected:

- Database: Drizzle ORM + LibSQL (configured, not active)
- Authentication: Better Auth (installed, not implemented)
- Payments: Stripe (dependency only)

## License

Private - Davos Hackathon 2026
