# GRC Risk Assessment Dashboard - Frontend Architecture Plan

## Executive Summary

This document outlines the frontend architecture for the **GRC Risk Assessment & Heatmap Dashboard** — a React-based single-page application that enables users to assess risks, visualize them via an interactive 5×5 heatmap, and manage risk data through a professional dashboard interface.

---

## 1. Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Framework** | React 18+ | Component-based UI library |
| **Language** | TypeScript (recommended) | Type safety and better developer experience |
| **Styling** | Tailwind CSS 3.x | Utility-first CSS framework |
| **State Management** | React Hooks (useState, useEffect, useContext) | Local and global state management |
| **HTTP Client** | Axios | API communication with backend |
| **Visualization** | Chart.js + react-chartjs-2 | Heatmap and data visualization |
| **Icons** | Lucide React | Professional icon library |
| **Build Tool** | Vite | Fast development and optimized builds |

---

## 2. Project Structure

```
frontend/
├── public/
│   └── favicon.ico
├── src/
│   ├── api/
│   │   └── riskApi.ts              # API service layer
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   └── Slider.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Layout.tsx
│   │   │   └── Navigation.tsx
│   │   ├── risk/
│   │   │   ├── RiskForm.tsx        # Risk input form
│   │   │   ├── RiskTable.tsx       # Data table with sorting/filtering
│   │   │   ├── RiskHeatmap.tsx     # 5x5 heatmap visualization
│   │   │   ├── RiskStats.tsx       # Summary statistics cards
│   │   │   └── MitigationHint.tsx  # Mitigation guidance display
│   │   └── dashboard/
│   │       ├── DashboardHeader.tsx
│   │       └── DashboardActions.tsx
│   ├── hooks/
│   │   ├── useRisks.ts             # Fetch and manage risks data
│   │   ├── useRiskForm.ts          # Form state and submission logic
│   │   └── useHeatmapData.ts       # Transform risks for heatmap
│   ├── types/
│   │   └── risk.ts                 # TypeScript interfaces
│   ├── utils/
│   │   ├── riskCalculator.ts       # Score/level calculation logic
│   │   ├── csvExporter.ts          # CSV export functionality
│   │   └── constants.ts            # App constants
│   ├── context/
│   │   └── RiskContext.tsx         # Global risk state (if needed)
│   ├── pages/
│   │   ├── HomePage.tsx            # Main dashboard view
│   │   └── AddRiskPage.tsx         # Risk entry form page
│   ├── styles/
│   │   └── globals.css
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 3. Core Data Models

### 3.1 Risk Interface

```typescript
interface Risk {
  id: number;
  asset: string;
  threat: string;
  likelihood: number;  // 1-5
  impact: number;      // 1-5
  score: number;       // likelihood × impact (1-25)
  level: RiskLevel;    // 'Low' | 'Medium' | 'High' | 'Critical'
}

type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';

interface RiskFormData {
  asset: string;
  threat: string;
  likelihood: number;
  impact: number;
}

interface HeatmapCell {
  likelihood: number;
  impact: number;
  count: number;
  assets: string[];
  score: number;
  level: RiskLevel;
}
```

### 3.2 API Response Types

```typescript
interface ApiResponse<T> {
  data: T;
  error?: string;
}

interface RiskFilterParams {
  level?: RiskLevel;
}
```

---

## 4. Component Architecture

### 4.1 Component Hierarchy

```
App
├── Layout
│   ├── Header
│   │   └── Navigation
│   └── Main Content (Routes)
│       ├── HomePage (Dashboard)
│       │   ├── DashboardHeader
│       │   │   └── DashboardActions (Export CSV, Add Risk button)
│       │   ├── RiskStats
│       │   │   ├── StatCard (Total Risks)
│       │   │   ├── StatCard (High/Critical Count)
│       │   │   └── StatCard (Average Score)
│       │   ├── RiskHeatmap
│       │   │   └── HeatmapCell[5×5 grid]
│       │   └── RiskTable
│       │       ├── TableHeader (with sort controls)
│       │       ├── FilterDropdown
│       │       └── TableRow[]
│       │           └── MitigationHint
│       └── AddRiskPage
│           └── RiskForm
│               ├── TextInput (Asset)
│               ├── TextInput (Threat)
│               ├── Slider (Likelihood)
│               ├── Slider (Impact)
│               ├── LivePreview (Score/Level)
│               └── SubmitButton
```

### 4.2 Key Component Specifications

#### RiskForm Component
| Property | Value |
|----------|-------|
| **Purpose** | Capture new risk assessment input |
| **Props** | `onSubmit: (risk: RiskFormData) => void`, `isLoading: boolean` |
| **State** | `formData: RiskFormData`, `preview: { score, level }` |
| **Features** | Real-time preview, validation, slider controls |

#### RiskTable Component
| Property | Value |
|----------|-------|
| **Purpose** | Display risks in sortable, filterable table |
| **Props** | `risks: Risk[]`, `onSort: (column: string) => void`, `filter: RiskLevel \| 'All'` |
| **State** | `sortColumn: string`, `sortDirection: 'asc' \| 'desc'` |
| **Features** | Column sorting, level filtering, mitigation hints |

#### RiskHeatmap Component
| Property | Value |
|----------|-------|
| **Purpose** | Visualize risk distribution on 5×5 matrix |
| **Props** | `risks: Risk[]` |
| **State** | `heatmapData: HeatmapCell[25]` |
| **Features** | Color-coded cells, hover tooltips, count display |

#### RiskStats Component
| Property | Value |
|----------|-------|
| **Purpose** | Display summary statistics |
| **Props** | `risks: Risk[]` |
| **Computed** | total, highCriticalCount, averageScore |

---

## 5. State Management Strategy

### 5.1 Local State (Component Level)

| Component | State | Purpose |
|-----------|-------|---------|
| `RiskForm` | `formData`, `preview` | Form input and real-time calculation |
| `RiskTable` | `sortConfig`, `filterLevel` | Table sorting and filtering |
| `RiskHeatmap` | `hoveredCell` | Tooltip display state |

### 5.2 Shared State (Custom Hooks)

```typescript
// useRisks.ts - Centralized risk data management
const useRisks = () => {
  const [risks, setRisks] = useState<Risk[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRisks = async (filter?: RiskLevel) => { ... };
  const addRisk = async (riskData: RiskFormData) => { ... };
  const refreshRisks = () => fetchRisks();

  return { risks, loading, error, fetchRisks, addRisk, refreshRisks };
};
```

### 5.3 Data Flow

```
User Action → Component → Hook → API Service → Backend
                                    ↓
                              State Update → Re-render
```

---

## 6. API Integration Layer

### 6.1 API Service Structure

```typescript
// api/riskApi.ts
const API_BASE_URL = 'http://localhost:8000';

export const riskApi = {
  // GET /risks - Fetch all risks (optional level filter)
  getRisks: (level?: RiskLevel): Promise<Risk[]> => { ... },

  // POST /assess-risk - Create new risk assessment
  createRisk: (riskData: RiskFormData): Promise<Risk> => { ... },
};
```

### 6.2 Error Handling Strategy

| Scenario | Handling |
|----------|----------|
| Network Error | Display "Connection failed. Please try again." |
| Validation Error (400) | Display specific field errors |
| Server Error (500) | Display "Server error. Please try again later." |
| Empty Response | Display "No risks found. Add your first risk!" |

---

## 7. Business Logic Implementation

### 7.1 Risk Score Calculation

```typescript
// utils/riskCalculator.ts
export const calculateRiskScore = (
  likelihood: number,
  impact: number
): { score: number; level: RiskLevel } => {
  const score = likelihood * impact;
  const level = getRiskLevel(score);
  return { score, level };
};

export const getRiskLevel = (score: number): RiskLevel => {
  if (score <= 5) return 'Low';
  if (score <= 12) return 'Medium';
  if (score <= 18) return 'High';
  return 'Critical';
};

export const getRiskColor = (level: RiskLevel): string => {
  const colors = {
    Low: '#00FF00',      // Green
    Medium: '#FFFF00',   // Yellow
    High: '#FFA500',     // Orange
    Critical: '#FF0000', // Red
  };
  return colors[level];
};
```

### 7.2 Heatmap Data Transformation

```typescript
// hooks/useHeatmapData.ts
export const useHeatmapData = (risks: Risk[]) => {
  return useMemo(() => {
    const grid: HeatmapCell[] = [];
    for (let l = 1; l <= 5; l++) {
      for (let i = 1; i <= 5; i++) {
        const cellRisks = risks.filter(
          r => r.likelihood === l && r.impact === i
        );
        grid.push({
          likelihood: l,
          impact: i,
          count: cellRisks.length,
          assets: cellRisks.map(r => r.asset),
          score: l * i,
          level: getRiskLevel(l * i),
        });
      }
    }
    return grid;
  }, [risks]);
};
```

### 7.3 CSV Export Logic

```typescript
// utils/csvExporter.ts
export const exportToCSV = (risks: Risk[], filename: string) => {
  const headers = ['ID', 'Asset', 'Threat', 'Likelihood', 'Impact', 'Score', 'Level'];
  const rows = risks.map(r =>
    [r.id, r.asset, r.threat, r.likelihood, r.impact, r.score, r.level].join(',')
  );
  const csv = [headers.join(','), ...rows].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
};
```

### 7.4 Mitigation Hints

```typescript
// utils/constants.ts
export const MITIGATION_HINTS: Record<RiskLevel, string> = {
  Low: 'Accept / Monitor',
  Medium: 'Plan mitigation within 6 months',
  High: 'Prioritize action + compensating controls (NIST PR.AC)',
  Critical: 'Immediate mitigation required + executive reporting',
};
```

---

## 8. UI/UX Design System

### 8.1 Color Palette (GRC Professional Theme)

| Purpose | Color | Hex |
|---------|-------|-----|
| Primary | Deep Blue | `#1E40AF` |
| Primary Hover | Darker Blue | `#1E3A8A` |
| Secondary | Slate Gray | `#64748B` |
| Background | Light Gray | `#F8FAFC` |
| Card Background | White | `#FFFFFF` |
| Border | Light Border | `#E2E8F0` |
| Text Primary | Dark Slate | `#1E293B` |
| Text Secondary | Medium Gray | `#64748B` |

### 8.2 Risk Level Colors

| Level | Background | Text |
|-------|------------|------|
| Low | `#DCFCE7` (Green-100) | `#166534` (Green-800) |
| Medium | `#FEF9C3` (Yellow-100) | `#854D0E` (Yellow-800) |
| High | `#FFEDD5` (Orange-100) | `#9A3412` (Orange-800) |
| Critical | `#FEE2E2` (Red-100) | `#991B1B` (Red-800) |

### 8.3 Typography Scale

| Element | Size | Weight |
|---------|------|--------|
| Page Title | 2rem (32px) | 700 (Bold) |
| Section Title | 1.5rem (24px) | 600 (Semibold) |
| Card Title | 1.125rem (18px) | 600 (Semibold) |
| Body | 1rem (16px) | 400 (Normal) |
| Small/Caption | 0.875rem (14px) | 400 (Normal) |

### 8.4 Spacing System

| Token | Value | Usage |
|-------|-------|-------|
| xs | 0.25rem (4px) | Tight spacing |
| sm | 0.5rem (8px) | Component internal |
| md | 1rem (16px) | Standard padding |
| lg | 1.5rem (24px) | Section padding |
| xl | 2rem (32px) | Page margins |
| 2xl | 3rem (48px) | Large sections |

---

## 9. Responsive Design Strategy

### 9.1 Breakpoints

| Breakpoint | Width | Target |
|------------|-------|--------|
| Mobile | < 640px | Phones |
| Tablet | 640px - 1024px | Tablets |
| Desktop | > 1024px | Laptops/Desktops |

### 9.2 Responsive Behaviors

| Component | Mobile | Tablet | Desktop |
|-----------|--------|--------|---------|
| **Layout** | Single column | Two columns | Full grid |
| **Stats Cards** | Stack vertically | 2×2 grid | Horizontal row |
| **Heatmap** | Scrollable container | Full width | Fixed 500px |
| **Table** | Horizontal scroll | Full width | Full width with padding |
| **Form** | Full width inputs | Centered (max-w-lg) | Centered (max-w-lg) |

### 9.3 Mobile-First CSS Pattern

```css
/* Mobile base styles */
.stats-grid {
  @apply grid grid-cols-1 gap-4;
}

/* Tablet */
@media (min-width: 640px) {
  .stats-grid {
    @apply grid-cols-2;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .stats-grid {
    @apply grid-cols-4;
  }
}
```

---

## 10. Page Specifications

### 10.1 Dashboard Page (HomePage)

**URL**: `/`

**Layout**:
```
┌─────────────────────────────────────────────────────────────┐
│  Header: GRC Risk Dashboard                    [Add Risk]   │
├─────────────────────────────────────────────────────────────┤
│  Stats Cards: [Total] [High/Critical] [Average]             │
├─────────────────────────────────────────────────────────────┤
│  Heatmap (5×5 Grid)                                         │
│  ┌───┬───┬───┬───┬───┐                                      │
│  │   │   │   │   │   │                                      │
│  ├───┼───┼───┼───┼───┤                                      │
│  │   │   │   │   │   │                                      │
│  └───┴───┴───┴───┴───┘                                      │
├─────────────────────────────────────────────────────────────┤
│  Risk Table                                                 │
│  [Filter: All ▼]                              [Export CSV]  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ ID │ Asset │ Threat │ L │ I │ Score │ Level │ Action │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

**Features**:
- Real-time data refresh after adding new risk
- Loading skeletons during data fetch
- Empty state: "No risks assessed yet — add one above"

### 10.2 Add Risk Page (AddRiskPage)

**URL**: `/add-risk`

**Layout**:
```
┌─────────────────────────────────────────────────────────────┐
│  Header: Add New Risk Assessment                            │
├─────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Asset Name                                            │  │
│  │ [________________________]                            │  │
│  │                                                       │  │
│  │ Threat Description                                    │  │
│  │ [________________________]                            │  │
│  │                                                       │  │
│  │ Likelihood: [====●====] 3                             │  │
│  │ Impact:     [======●==] 4                             │  │
│  │                                                       │  │
│  │ ┌─────────────────────────────────────────────────┐   │  │
│  │ │ Preview: Score = 12 | Level = Medium           │   │  │
│  │ └─────────────────────────────────────────────────┘   │  │
│  │                                                       │  │
│  │              [Submit Assessment]                      │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

**Features**:
- Real-time score preview updates on slider change
- Form validation before submission
- Success message and redirect to dashboard

---

## 11. Routing Structure

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `HomePage` | Main dashboard with table and heatmap |
| `/add-risk` | `AddRiskPage` | Risk assessment form |

**Note**: Simple client-side routing using `react-router-dom`.

---

## 12. Performance Considerations

| Strategy | Implementation |
|----------|----------------|
| **Memoization** | Use `useMemo` for heatmap data transformation |
| **Callback Optimization** | Use `useCallback` for event handlers |
| **Lazy Loading** | Lazy load Dashboard components if app grows |
| **Debouncing** | Debounce slider input for preview (optional) |
| **Pagination** | Implement if risk count exceeds 100 |

---

## 13. Error & Loading States

### 13.1 Loading States

| Component | Loading UI |
|-----------|------------|
| Dashboard | Skeleton cards, spinner in table area |
| Table | "Loading risks..." with spinner |
| Heatmap | Gray placeholder grid |
| Form Submit | Button disabled with "Submitting..." |

### 13.2 Error States

| Scenario | Error UI |
|----------|----------|
| API Failure | Red alert banner: "Failed to load risks" |
| Validation | Inline field errors |
| Network | Retry button with error message |

### 13.3 Empty States

| Component | Empty UI |
|-----------|----------|
| Table | "No risks yet. Add your first risk!" with CTA button |
| Heatmap | All cells show "0" with muted colors |

---

## 14. Accessibility (A11y) Considerations

| Requirement | Implementation |
|-------------|----------------|
| **Keyboard Navigation** | All interactive elements focusable |
| **ARIA Labels** | Descriptive labels for sliders, buttons |
| **Color Contrast** | WCAG AA compliance (4.5:1 for text) |
| **Screen Readers** | Semantic HTML, alt text for visual elements |
| **Reduced Motion** | Respect `prefers-reduced-motion` |

---

## 15. Development Workflow

### 15.1 Setup Commands

```bash
# Initialize project
npm create vite@latest frontend -- --template react-ts
cd frontend

# Install dependencies
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Install additional packages
npm install axios chart.js react-chartjs-2 lucide-react react-router-dom

# Start development
npm run dev
```

### 15.2 Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1E40AF',
          hover: '#1E3A8A',
        },
      },
    },
  },
  plugins: [],
};
```

---

## 16. Testing Strategy

| Type | Scope | Tools |
|------|-------|-------|
| **Unit Tests** | Utility functions (calculator, CSV export) | Vitest |
| **Component Tests** | Form validation, table sorting | React Testing Library |
| **Integration Tests** | API calls, data flow | MSW (Mock Service Worker) |
| **E2E Tests** | Complete user flows | Playwright (optional) |

---

## 17. Deployment Considerations

| Environment | Platform | Notes |
|-------------|----------|-------|
| **Development** | localhost:5173 | Vite dev server |
| **Production** | Vercel/Netlify | Static site deployment |
| **CORS** | Backend config | Allow frontend origin |

---

## 18. Summary Checklist

### Core Features (Required)
- [ ] Risk input form with sliders (1-5)
- [ ] Real-time score/level preview
- [ ] POST to `/assess-risk` endpoint
- [ ] Risk table with all columns
- [ ] Sortable table headers
- [ ] Level filter dropdown
- [ ] 5×5 heatmap with counts
- [ ] Color-coded heatmap cells
- [ ] Stats cards (Total, High/Critical, Average)
- [ ] Responsive design
- [ ] Loading and empty states

### Polish Features (Differentiators)
- [ ] CSV export functionality
- [ ] Mitigation hint column
- [ ] Heatmap hover tooltips
- [ ] Professional GRC styling
- [ ] Error handling and user feedback

---

## Appendix: API Contract Reference

| Endpoint | Method | Request | Response |
|----------|--------|---------|----------|
| `/risks` | GET | `?level=High` (optional) | `Risk[]` |
| `/assess-risk` | POST | `{ asset, threat, likelihood, impact }` | `Risk` |

**Backend Base URL**: `http://localhost:8000`

---

*Document Version: 1.0*
*Last Updated: 2026-02-05*
