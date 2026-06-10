# LawNetics IP Docketing Portal — React Application

A production-ready React 18 + Vite + Tailwind CSS application converted from the LawNetics HTML portal.

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000)

**Demo credentials:** `admin@lawnetics.in` / `lawnetics`

---

## 📁 Project Structure

```
src/
├── assets/                    # Static assets
├── components/
│   ├── layout/
│   │   ├── Sidebar.jsx        # Collapsible sidebar with all nav links + badges
│   │   ├── Header.jsx         # Topbar with search, sync pill, quick-add
│   │   ├── DashboardLayout.jsx# Main layout wrapper (sidebar + header + outlet)
│   │   └── Breadcrumb.jsx     # Route-aware breadcrumb
│   ├── common/
│   │   ├── Modal.jsx          # Base modal with header/body/footer
│   │   ├── Button.jsx         # Multi-variant button (primary/outline/ghost/danger…)
│   │   ├── Card.jsx           # Card + CardHeader + CardTitle + CardBody
│   │   ├── Badge.jsx          # TypeBadge, StatusBadge, PriorityDot, Chip
│   │   ├── Table.jsx          # Table + THead + Th (sortable) + TBody + Tr + Td + Pagination
│   │   ├── Form.jsx           # Label, Input, Select, Textarea, FormGroup, FormGrid, InfoBox
│   │   ├── SearchInput.jsx    # Styled search input
│   │   ├── PageHeader.jsx     # Reusable page title + actions row
│   │   ├── DeadlineItem.jsx   # Deadline card with priority colour + days-left pill
│   │   ├── Calendar.jsx       # Interactive monthly calendar
│   │   ├── MatterPage.jsx     # Generic matter table (used by all 7 IP type pages)
│   │   ├── AddMatterModal.jsx # 7-type matter creation form
│   │   ├── AddClientModal.jsx # Client creation form
│   │   ├── AddDeadlineModal.jsx # Docket event form
│   │   ├── MatterDetailModal.jsx # Full matter view (details, folders, deadlines, docs)
│   │   ├── Toast.jsx          # Toast notification container
│   │   └── Loader.jsx         # Spinner
│   └── dashboard/
│       ├── StatCard.jsx       # Colour-accented KPI card
│       ├── ActivityFeed.jsx   # Activity timeline
│       └── PortfolioGrid.jsx  # Matter type grid
├── pages/
│   ├── Login/                 # Login + Google OAuth
│   ├── Dashboard/             # Stats, deadlines, portfolio, activity
│   ├── Clients/               # Client CRUD with matter counts
│   ├── Trademark/             # TM matter table (status filter + search)
│   ├── Patent/                # Patent table
│   ├── Copyright/             # Copyright table
│   ├── Design/                # Design table
│   ├── GI/                    # Geographical Indication table
│   ├── HighCourt/             # HC case table
│   ├── DistrictCourt/         # DC case table
│   ├── DocketCalendar/        # Calendar + Google Calendar sync
│   ├── GoogleDrive/           # Drive file explorer + folder tree
│   └── Reports/               # Analytics charts + export
├── routes/
│   └── index.jsx              # React Router v6 routes with PrivateRoute guard
├── store/
│   └── index.js               # Zustand stores: auth, UI, data, calendar, sync
├── hooks/
│   └── index.js               # useTable, useSearch, useSort, usePagination, useToast, useMattersByType
├── services/
│   └── index.js               # Mock API services (auth, client, matter, calendar, drive)
└── utils/
    ├── mockData.js             # All seed data + constants
    └── helpers.js              # daysDiff, formatDate, badge CSS, folder name gen
```

---

## 🎨 Design System

All colours from the original HTML are in `tailwind.config.js`:

| Token          | Hex       | Usage                        |
|----------------|-----------|------------------------------|
| `org`          | `#e85020` | Primary orange (brand)       |
| `org-dark`     | `#c04010` | Hover orange                 |
| `cyan`         | `#00aadd` | Patent, secondary accent     |
| `navy`         | `#0d2045` | Headings, sidebar active     |
| `dark`         | `#12192c` | Sidebar background           |
| `gold`         | `#c89b30` | Copyright, warning           |
| `green`        | `#1a7a4a` | Registered, success          |
| `red`          | `#c0392b` | Opposed, urgent              |
| `purple`       | `#7c3aed` | Design matters               |
| `bg`           | `#f0f4fb` | Page background              |
| `text-3`       | `#8a9bb5` | Muted label text             |

---

## 🗺️ Routes

| Path               | Page             |
|--------------------|------------------|
| `/login`           | Login            |
| `/dashboard`       | Dashboard        |
| `/clients`         | Clients          |
| `/trademark`       | Trademark        |
| `/patent`          | Patent           |
| `/copyright`       | Copyright        |
| `/design`          | Design           |
| `/gi`              | GI Tag           |
| `/high-court`      | High Court       |
| `/district-court`  | District Court   |
| `/docket-calendar` | Docket Calendar  |
| `/google-drive`    | Google Drive     |
| `/reports`         | Reports          |

---

## 🏪 State Management (Zustand)

| Store           | State                                |
|-----------------|--------------------------------------|
| `useAuthStore`  | `user`, `isAuthenticated`            |
| `useUIStore`    | `sidebarCollapsed`, `toasts`, `activeModal` |
| `useDataStore`  | `clients`, `matters`, `deadlines`, `documents`, `activity` |
| `useCalendarStore` | `year`, `month`                   |
| `useSyncStore`  | `status`, `lastSynced`               |

---

## 🔌 Real Backend Integration

Replace mock services in `src/services/index.js` with real Axios calls:

```js
// Example: replace mock with real API
import axios from 'axios'
const API = axios.create({ baseURL: import.meta.env.VITE_API_URL })

export const matterService = {
  getAll:  () => API.get('/matters'),
  create:  (data) => API.post('/matters', data),
  update:  (id, data) => API.put(`/matters/${id}`, data),
  delete:  (id) => API.delete(`/matters/${id}`),
}
```

Add your API base URL to `.env`:
```
VITE_API_URL=https://api.yourdomain.com
```

---

## 📋 Tech Stack

- **React 18** + **Vite 5**
- **Tailwind CSS 3** (custom design tokens)
- **React Router DOM v6** (nested routes, PrivateRoute)
- **Zustand** (global state)
- **React Hook Form** (form validation)
- **TanStack Query** (async data fetching)
- **Axios** (HTTP client)
- **React Icons** (icon library)
- **date-fns** (date utilities)
- **clsx** (conditional class merging)

---

## 🏢 About LawNetics

**LawNetics IP Docketing Portal** · www.lawnetics.in · info@lawnetics.in
