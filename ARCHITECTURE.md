# Codefend Leaks - Architecture Documentation

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Technology Stack](#technology-stack)
3. [High-Level Architecture](#high-level-architecture)
4. [Project Structure](#project-structure)
5. [Core Architectural Patterns](#core-architectural-patterns)
6. [Data Flow Architecture](#data-flow-architecture)
7. [State Management](#state-management)
8. [Routing & Navigation](#routing--navigation)
9. [Component Architecture](#component-architecture)
10. [Service Layer](#service-layer)
11. [Tauri Desktop Integration](#tauri-desktop-integration)
12. [Build & Development](#build--development)
13. [Security Considerations](#security-considerations)

---

## Executive Summary

**Codefend Leaks** is a specialized **data breach detection and intelligence platform** built as a hybrid web/desktop solution. This streamlined application focuses on **leak detection and dark web monitoring** through four focused modules:

### Core Modules (Primary Focus)

- **INX (Intelligence Search)**: Dark web monitoring, threat intelligence gathering, and comprehensive data breach analysis. Primary interface for searching leaked data across dark web sources.
- **SNS (Social Network Security)**: Data leak detection, exposed credentials search, and breach database monitoring. Focuses on social engineering vulnerabilities and exposed personal data.

Unlike the full Codefend Platform, Codefend Leaks is purpose-built for organizations that need focused leak detection capabilities without attack surface management, issue tracking, or resource management features. The platform has been streamlined to focus exclusively on INX and SNS modules.

### Key Characteristics

- **Dual Platform Support**: Web (Vite) and Desktop (Tauri v2)
- **Architecture Pattern**: Feature-first, modular organization
- **State Management**: React Context + Zustand (legacy migration)
- **Data Strategy**: SWR-based caching with custom hooks
- **UI Framework**: React 18 with TypeScript, SCSS Modules
- **Build System**: Vite 7 with SWC compiler

---

## Technology Stack

### Frontend Core

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.1.0 | UI framework |
| **TypeScript** | 5.8.3 | Type safety |
| **Vite** | 7.1.4 | Build tool & dev server |
| **React Router** | 7.6.2 | Client-side routing |
| **SCSS** | 1.86.2 | Styling (modular) |
| **Lightning CSS** | 1.30.1 | CSS transformer |

### State & Data Management

| Library | Purpose |
|---------|---------|
| **SWR** (2.3.6) | Server state caching |
| **Zustand** (5.0.5) | Client state (legacy) |
| **React Context** | Primary global state |
| **Axios** (1.11.0) | HTTP client |

### Desktop Runtime

| Technology | Version | Purpose |
|------------|---------|---------|
| **Tauri** | 2.8.0 | Desktop wrapper |
| **Rust** | - | Backend runtime |
| **Tauri Plugins** | Various | Native capabilities |

### UI & Visualization

- **Framer Motion** (12.23.3) - Animations
- **Chart.js** (4.4.9) - Data visualization
- **D3.js** (7.8.5) - Advanced visualizations
- **React Window** (1.8.11) - Virtualization

### Code Quality

- **ESLint** (9.26.0) - Linting
- **Prettier** (3.4.2) - Code formatting
- **Husky** - Git hooks
- **CSpell** - Spell checking

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                       CODEFEND LEAKS                             │
│            Data Breach Detection & Intelligence Platform         │
│                                                                   │
│  ┌─────────────┬───────────────────────────┬─────────────────┐ │
│  │   SIDEBAR   │     MAIN CONTENT AREA     │  RIGHT PANEL    │ │
│  │  (Navbar    │    (Dynamic Pages)        │  (Context       │ │
│  │  Vertical)  │                           │   Info)         │ │
│  │             │                           │                 │ │
│  │  • INX      │  • INX (Intelligence)     │  • Search Info  │ │
│  │    (Home)   │    - Dark Web Monitor     │  • Previous     │ │
│  │             │    - Threat Intelligence  │    Searches     │ │
│  │  • SNS      │    - File Preview         │  • Credits      │ │
│  │    (Leaks)  │                           │    Remaining    │ │
│  │             │  • SNS (Data Leaks)       │                 │ │
│  │             │    - Breach Database      │                 │ │
│  │             │    - Credential Search    │                 │ │
│  └─────────────┴───────────────────────────┴─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Two-Column Layout

1. **Left Sidebar** (Fixed, Collapsible)
   - Navigation menu (2 main routes: INX and SNS)
   - Minimal navigation
   - Active page indication
   - Theme toggle
   - Logout button

2. **Main Content Area** (Full width)
   - Dynamic content based on route
   - INX: Intelligence search with file preview
   - SNS: Leak detection and data breach search
   - Integrated right panel for contextual information (search history, credits)

---

## Project Structure

```
codefend-leaks/
├── src/
│   ├── app/
│   │   ├── constants/              # App-wide constants, texts, validations
│   │   │   ├── app-texts.ts       # UI text constants
│   │   │   ├── empty.ts           # Empty state definitions
│   │   │   └── events.ts          # Event type constants
│   │   │
│   │   ├── data/                   # Business Logic Layer
│   │   │   ├── hooks/             # Custom React hooks (feature-organized)
│   │   │   │   ├── common/        # Shared utility hooks
│   │   │   │   ├── modules/       # Feature modules (ONLY: inx, sns)
│   │   │   │   │   ├── inx/       # Intelligence Search (6 hooks)
│   │   │   │   │   ├── sns/       # Social Network Security (2 hooks)
│   │   │   │   │   └── usePreviousSearch.ts  # Shared search history
│   │   │   │   ├── orders/        # Order/subscription management
│   │   │   │   ├── table/         # Table-related hooks (7 hooks)
│   │   │   │   ├── tracking/      # Page tracking hooks
│   │   │   │   └── users/         # User management hooks
│   │   │   │       ├── auth/      # Authentication hooks (9 hooks)
│   │   │   │       ├── common/    # Common user hooks (5 hooks)
│   │   │   │       └── admins/    # Admin-specific hooks (6 hooks)
│   │   │   │
│   │   │   ├── interfaces/        # TypeScript interfaces/types
│   │   │   ├── services/          # API communication layer
│   │   │   │   ├── axiosHTTP.service.ts
│   │   │   │   ├── fetchHTTP.service.ts
│   │   │   │   └── http.service.ts
│   │   │   │
│   │   │   ├── store/             # Zustand stores
│   │   │   │   ├── modal.store.ts
│   │   │   │   ├── credential.store.ts
│   │   │   │   ├── orders.store.ts
│   │   │   │   ├── orderScope.store.ts
│   │   │   │   ├── provider.store.ts
│   │   │   │   └── updating.store.ts
│   │   │   │
│   │   │   ├── utils/             # Utility functions
│   │   │   └── mocks/             # Mock data for development
│   │   │
│   │   ├── router/                # React Router configuration
│   │   │   ├── Routes.tsx         # Main route definitions (simplified)
│   │   │   └── ProtectedRoute.tsx # Auth guards
│   │   │
│   │   └── views/                 # UI Layer
│   │       ├── components/        # Reusable UI components
│   │       │   ├── buttons/       # Button components
│   │       │   ├── forms/         # Form components
│   │       │   ├── modals/        # Modal dialogs
│   │       │   ├── sidebar/       # Sidebar navigation (simplified)
│   │       │   ├── Table/         # Table components (v2, v3)
│   │       │   └── [UI components]
│   │       │
│   │       ├── pages/             # Page-level components
│   │       │   ├── auth/          # Authentication pages
│   │       │   │   ├── NewAuthPage.tsx
│   │       │   │   ├── newLayouts/
│   │       │   │   │   ├── NewSigninForm/
│   │       │   │   │   ├── NewSignupForm/
│   │       │   │   │   ├── NewSignupInvitation/
│   │       │   │   │   └── NewPasswordRecovery/
│   │       │   │   └── layouts/   # Legacy confirmation/invitation flows
│   │       │   │
│   │       │   ├── panel/         # Main application pages
│   │       │   │   ├── layouts/   # Feature layouts (ONLY 2 modules)
│   │       │   │   │   ├── inx/   # Intelligence Search
│   │       │   │   │   ├── sns/   # Data Leaks
│   │       │   │   │   └── EmptyLayout.tsx
│   │       │   │   └── PanelPage.tsx  # Root layout
│   │       │   │
│   │       │   └── help-center/   # Public help pages
│   │       │
│   │       ├── contexts/          # React Context providers
│   │       │   ├── AppContextProvider.tsx    # Global state
│   │       │   ├── FastContextProvider.tsx   # Performance-optimized context
│   │       │   └── ThemeContext.tsx          # Theme management
│   │       │
│   │       └── styles/            # Global styles (SCSS)
│   │           ├── index.scss     # Main stylesheet
│   │           └── settings/      # SCSS variables
│
├── src-tauri/                     # Tauri desktop backend
│   ├── src/                       # Rust source code
│   ├── icons/                     # App icons
│   ├── Cargo.toml                # Rust dependencies
│   └── tauri.conf.json           # Tauri configuration
│
├── public/                        # Static assets
├── _machinas/                     # Documentation (mapa.md)
├── .github/                       # GitHub workflows
├── .cursor/                       # Cursor IDE config
├── vite.config.ts                # Vite configuration
├── tsconfig.json                 # TypeScript root config
├── tsconfig.app.json             # App TypeScript config
├── package.json                  # Dependencies
└── [config files]                # ESLint, Prettier, etc.
```

### Path Aliases (tsconfig.app.json)

```typescript
{
  "#commonUserHooks/*": "./src/app/data/hooks/users/common/*",
  "@userHooks/*": "./src/app/data/hooks/users/*",
  "@moduleHooks/*": "./src/app/data/hooks/modules/*",
  "#commonHooks/*": "./src/app/data/hooks/common/*",
  "@hooks/*": "./src/app/data/hooks/*",
  "@interfaces/*": "./src/app/data/interfaces/*",
  "@stores/*": "./src/app/data/store/*",
  "@utils/*": "./src/app/data/utils/*",
  "@services/*": "./src/app/data/services/*",
  "@buttons/*": "./src/app/views/components/buttons/*",
  "@modals/*": "./src/app/views/components/modals/*",
  "@icons": "./src/app/views/components/icons/index.tsx",
  "@table/*": "./src/app/views/components/Table/*",
  "@styles/*": "./src/app/views/styles/*",
  "@/*": "./src/*"
}
```

---

## Core Architectural Patterns

### 1. Feature-First Organization

Code is organized by **feature modules** rather than technical layers, promoting:
- **Discoverability**: Easy to find related code
- **Maintainability**: Changes are localized
- **Scalability**: Features can be added independently

**Example: INX (Intelligence Search) Module**
```
src/app/data/hooks/modules/inx/
├── useIntelSearch.ts       # Main search hook
├── useIntelPreview.ts      # File preview
├── useInxReadFile.ts       # File reading
├── useInitialSearch.ts     # Auto-search on mount
├── useHighlightLinesWithUrl.ts  # Syntax highlighting
└── index.ts                # Module exports
```

### 2. Separation of Concerns

**Three-Layer Architecture:**

```
┌──────────────────────────────────┐
│      PRESENTATION LAYER          │  (views/)
│  • React Components              │  • Pages
│  • UI Logic                      │  • Components
│  • Styling (SCSS Modules)        │  • Layouts
├──────────────────────────────────┤
│      BUSINESS LOGIC LAYER        │  (data/)
│  • Custom Hooks                  │  • Hooks (feature-based)
│  • State Management              │  • Stores
│  • Data Transformations          │  • Interfaces
├──────────────────────────────────┤
│      DATA ACCESS LAYER           │  (services/)
│  • HTTP Services                 │  • Axios/Fetch
│  • API Communication             │  • SWR integration
│  • Event-Driven Services         │  • WebSocket (if any)
└──────────────────────────────────┘
```

### 3. Composition Over Inheritance

Components are built using **composition patterns**:
```tsx
// Example: Table composition
<Tablev3
  columns={columns}
  rows={rows}
  renderRow={(row) => <CustomRow data={row} />}
  actions={<TableActions />}
/>
```

### 4. Performance Optimization Strategies

- **Code Splitting**: Lazy loading with React.lazy()
- **Virtualization**: react-window for large lists
- **Memoization**: useMemo, useCallback, React.memo
- **Fast Context**: Custom context provider with selective re-renders
- **SWR Caching**: Automatic request deduplication and caching

---

## Data Flow Architecture

### Request Flow Diagram

```
┌──────────────┐
│  Component   │  1. Triggers action
└──────┬───────┘
       │
       v
┌──────────────┐
│ Custom Hook  │  2. Business logic
│ (useResource)│     • Validation
└──────┬───────┘     • Transformation
       │
       v
┌──────────────┐
│ HTTP Service │  3. API call
│ (Axios/SWR) │     • Authentication
└──────┬───────┘     • Error handling
       │
       v
┌──────────────┐
│   Backend    │  4. Server processing
│     API      │
└──────┬───────┘
       │
       v (Response)
┌──────────────┐
│  SWR Cache   │  5. Cache update
└──────┬───────┘
       │
       v
┌──────────────┐
│  Component   │  6. Re-render with new data
│   Update     │
└──────────────┘
```

### Data Fetching Pattern (SWR)

**Standard Hook Structure:**
```typescript
// Example: src/app/data/hooks/resources/web/useWeb.ts
export const useWeb = () => {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/v1/resources/web',
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // 1 minute
    }
  );

  const addWebResource = async (resource: WebResource) => {
    // Optimistic update
    mutate(async () => {
      const result = await httpService.post({ /* ... */ });
      return result;
    }, { revalidate: true });
  };

  return {
    webResources: data,
    isLoading,
    error,
    addWebResource,
  };
};
```

---

## State Management

### Dual State Management Strategy

The application uses a **hybrid approach** during migration from Zustand to React Context:

#### 1. React Context (Primary - Current Standard)

**Implementation: FastContextProvider**

```typescript
// src/app/views/context/FastContextProvider.tsx
// High-performance context with field-level subscriptions

const createFastContext = <Store,>(initialState: Store) => {
  // Creates a context that only re-renders components
  // when specific fields change
  const FastContextProvider = ({ children }) => {
    // Store implementation with selective updates
  };

  const useFastField = <K extends keyof Store>(key: K) => {
    // Subscribe to specific field only
    return { get, set };
  };

  return { FastContextProvider, useFastField };
};
```

**GlobalStore (AppContextProvider.tsx)**

```typescript
export interface GlobalStore {
  // User & Session
  user: any;
  session: string;
  company: CompanyUser;
  companies: any[];

  // UI State
  isOpenNetworkSetting: boolean;
  openModal: boolean;
  resourceType: RESOURCE_CLASS;
  resourceID: string;

  // Scan Progress
  scanProgress: number;
  subdomainProgress: number;
  webScanProgress: number;
  leaksScanProgress: number;

  // Scanning State
  isScanning: boolean;
  currentScan: any;
  autoScanState: AUTO_SCAN_STATE;

  // Location & Preferences
  country: string;
  city: string;
  region: string;
  planPreference: 'small' | 'medium' | 'advanced';
}
```

**Persistence Strategy:**
- Debounced localStorage writes (100ms)
- Immediate persistence on login
- Quota management (5MB limit)
- Essential data fallback on errors

#### 2. Zustand Stores (Legacy - Being Migrated)

**Usage Pattern:**
```typescript
// src/app/data/store/modal.store.ts
interface ModalStore {
  isOpen: boolean;
  modalId: string;
  setModalId: (state: string) => void;
  setIsOpen: (state: boolean) => void;
}

const useModalStore = create<ModalStore>(set => ({
  isOpen: false,
  modalId: '',
  setModalId: state => set({ modalId: state }),
  setIsOpen: state => set({ isOpen: state }),
}));
```

**Active Zustand Stores:**
- `modal.store.ts` - Modal state
- `credential.store.ts` - Credentials
- `orders.store.ts` - Order management
- `provider.store.ts` - Provider data
- `updating.store.ts` - Update flags

### State Access Patterns

**Reading State:**
```typescript
// React Context (preferred)
const session = useGlobalFastField('session');
const user = useGlobalFastField('user');

// Zustand (legacy)
const { modalId, setModalId } = useModalStore();
```

**Updating State:**
```typescript
// React Context
session.set('new-session-token');

// Zustand
setModalId('order-modal');
```

---

## Routing & Navigation

### Route Structure

**Simplified Route Configuration** (`src/app/router/Routes.tsx`)

The application routes have been **drastically simplified** to focus exclusively on leak detection:

```typescript
const routes = [
  {
    path: '/',
    element: <PanelPage />,  // Root layout with session management
    children: [
      // Intelligence Search (Default/Home Page)
      {
        index: true,
        element: <ProtectedRoute isAllowed={true}>
          <InxPanel />  // INX is the default page
        </ProtectedRoute>
      },

      // Core Leak Detection Modules (only 2 routes!)
      { path: 'inx', element: <InxPanel /> },   // Intelligence Search (Dark Web)
      { path: 'sns', element: <SnsPanel /> },   // Social Network Security (Data Leaks)
    ],
  },

  // Authentication Routes
  {
    path: 'auth/*',
    element: <NewAuthPage />,
    children: [
      { index: true, element: <Navigate to="signin" replace /> },
      { path: 'signin', element: <NewSigninForm /> },
      { path: 'signup', element: <NewSignupForm /> },
      { path: 'signup/:ref', element: <NewSignupForm /> },
      { path: 'signup/invitation', element: <NewSignupInvitation /> },
      { path: 'signup/invitation/:ref', element: <NewSignupInvitation /> },
      { path: 'confirmation', element: <ConfirmationSignUp /> },
      { path: 'recovery', element: <PasswordRecovery /> },
      { path: 'recovery/:ref', element: <PasswordRecovery /> },
    ],
  },

  // Public Help Center
  {
    path: 'help/*',
    element: <HelpCenter />,
    children: [
      { path: 'terms-and-condition', element: <TermsAndCondition /> },
      { path: 'security-and-privacy-policy', element: <SecurityAndPrivacyPolicy /> },
      { path: '*', element: <HelpNotfound /> },
    ],
  },
];
```

**Key Simplifications:**
- ✅ **Only 2 main application routes**: `/inx` and `/sns`
- ✅ `/` (root) redirects to INX panel (Intelligence Search)
- ✅ All authentication routes preserved
- ✅ Help center for public documentation

**Completely Removed Routes:**
- ❌ `/dashboard` - No dashboard page
- ❌ `/admin/*` - No admin panel
- ❌ `/provider/*` - No provider routes
- ❌ `/reseller/*` - No reseller routes
- ❌ `/web`, `/mobile`, `/network`, `/social` - No resource management
- ❌ `/issues/*` - No vulnerability tracking
- ❌ `/ai-surveillance` - No AI scanning
- ❌ `/ask-a-hacker` - No support system
- ❌ `/team-members` - No team management
- ❌ `/user-profile` - No user profile page
- ❌ `/orders-payments` - No order management
- ❌ `/preferences` - No preferences page
- ❌ `/report/*` - No report generation

### Role-Based Access Control (RBAC)

**ProtectedRoute Component:**
```typescript
// src/app/router/ProtectedRoute.tsx
const ProtectedRoute = ({ isAllowed, children }) => {
  return isAllowed ? children : <Navigate to="/" />;
};
```

**Simplified Access:** With only 2 main routes, RBAC is minimal. All authenticated users have access to both INX and SNS panels.

---

### Page Catalog

The application now consists of only **4 main page types**:

#### 1. Authentication Routes (`/auth/*`)

**Base Layout**: `NewAuthPage.tsx`
- Redirects to home if already authenticated
- Theme toggle button
- Clean layout without sidebar

**Child Routes**:

| Route | Component | Purpose | Access |
|-------|-----------|---------|--------|
| `/auth/signin` | `NewSigninForm` | User login | Public |
| `/auth/signup` | `NewSignupForm` | User registration | Public |
| `/auth/signup/:ref` | `NewSignupForm` | Registration with referral | Public |
| `/auth/signup/invitation` | `NewSignupInvitation` | Team invitation signup | Public |
| `/auth/signup/invitation/:ref` | `NewSignupInvitation` | Team invitation with ref | Public |
| `/auth/confirmation` | `ConfirmationSignUp` | Email confirmation | Public |
| `/auth/recovery` | `PasswordRecovery` | Password reset | Public |
| `/auth/recovery/:ref` | `PasswordRecovery` | Password reset with token | Public |

---

#### 2. Main Application Routes (`/`)

**Root Layout**: `PanelPage.tsx` (src/app/views/pages/panel/PanelPage.tsx)
- Session management (1.5s delay for stability after login)
- Global modals: `NetworkSettingModal`, `ErrorConnection`, `OrderV2`
- Global components: `Sidebar` (lazy), `ScanWraper`
- Keyboard shortcuts (Ctrl+Alt+Ñ for network settings, Escape handling)
- Authentication redirect to `/auth/signup` if not logged in

**Core Pages (Only 2!):**

##### 2.1 Intelligence Search - INX (`/` and `/inx`)

**Component**: `InxPanel.tsx` (src/app/views/pages/panel/layouts/inx/InxPanel.tsx)
**Hooks**:
- `useIntelSearch()` - Main search functionality
- `useIntelPreview()` - File preview
- `useInxReadFile()` - File content reading
- `usePreviousSearch('inx')` - Search history
- `useInitialSearch()` - Auto-search on mount

**Features**:
- **Dark web intelligence search**: Search across dark web sources
- **File preview**: View leaked file contents before downloading
- **Search history**: Previous searches with SWR caching
- **Syntax highlighting**: URL highlighting in file content
- **Credits tracking**: Remaining search credits display

**Components**:
- `InxSearchBar` - Search input interface
- `InxSearchAndData` - Main search results display
- `InxPreviousSearches` - Search history sidebar
- `InxPreviewIntelData` - File preview modal
- `InxPreviousContentData` - Previous content viewer

---

##### 2.2 Social Network Security - SNS (`/sns`)

**Component**: `SnsPanel.tsx` (src/app/views/pages/panel/layouts/sns/SnsPanel.tsx)
**Hooks**:
- `useSns()` - Main SNS search functionality with automatic data type detection
- `useLeakedData()` - Leaked data management
- `usePreviousSearch('sns')` - Search history

**Features**:
- **Data breach database search**: Search across massive breach databases
- **Automatic type detection**: Detects emails, IPs, domains, and full names automatically
- **Multi-class search**: Supports email, IP address, domain, and name searches
- **Search history**: Previous searches with SWR caching
- **Credits tracking**: Remaining search credits display
- **URL parameter sync**: Search state synchronized with URL for shareable searches

**Search Classes Supported**:
- `email` - Email address validation and search
- `lastip` - IP address detection (both internal and external)
- `_domain` - Domain/URL extraction and search
- `name` - Full name detection (requires space separation)
- `unknown` - Fallback for unrecognized patterns

**Components**:
- `SearchBarContainer` - Search input with type dropdown
- `SnsSearchAndData` - Main search results display
- `SnPreviousSearches` - Search history sidebar
- `SnsLeakedDataModal` - Detailed leak data modal
- `SnsCardTitle` - Description card
- `IntelCard` - Individual leak result card

**Layout**:
```
Left Column:
├── SnsCardTitle (mobile only)
├── SearchBarContainer
└── SnsSearchAndData (results)

Right Column:
├── Navbar
├── SnsCardTitle (description)
├── Remaining searches badge
└── SnPreviousSearches (history)
```

**State Management**:
- `searchData` - Current search keyword (preserved exactly as typed)
- `searchClass` - Auto-detected search type
- `intelData` - Search results array
- `disponibles_sns` - Available searches remaining
- Previous searches cached with SWR

**Data Type Detection Logic**:
```typescript
// Automatic detection priority:
1. Email validation (regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/)
2. IP address validation (IPv4 with octet range check)
3. Domain extraction (from URLs or plain domains)
4. Full name validation (requires space + valid name characters)
5. Unknown (fallback)
```

---

#### 3. Help Center Routes (`/help/*`)

**Base Layout**: `HelpCenter.tsx`
**Access**: Public (no authentication required)

**Purpose**: Public documentation and legal information

**Child Routes**:

| Route | Component | Purpose |
|-------|-----------|---------|
| `/help/terms-and-condition` | `TermsAndCondition` | Terms of service |
| `/help/security-and-privacy-policy` | `SecurityAndPrivacyPolicy` | Privacy policy |
| `/help/*` | `HelpNotfound` | 404 page |

**Features**:
- Clean layout without authentication
- Responsive design for mobile and desktop
- SEO-friendly static pages
- No sidebar navigation



---

## Component Architecture

### Component Hierarchy

```
PanelPage (Root Layout)
├── Sidebar (Fixed Navigation)
│   ├── SidebarDesktop
│   └── SidebarMobile
│
├── Outlet (Dynamic Content)
│   ├── InxPanel (Intelligence Search)
│   │   ├── InxSearchBar
│   │   ├── InxSearchAndData
│   │   ├── InxPreviousSearches
│   │   ├── InxPreviewIntelData (Modal)
│   │   └── InxPreviousContentData
│   │
│   └── SnsPanel (Data Leaks)
│       ├── SearchBarContainer
│       ├── SnsSearchAndData
│       ├── SnPreviousSearches
│       ├── SnsLeakedDataModal (Modal)
│       ├── SnsCardTitle
│       └── IntelCard
│
└── Global Components
    ├── NetworkSettingModal
    ├── ErrorConnection
    └── ScanWraper
```

### Component Categories

#### 1. Layout Components
- **PanelPage**: Root layout with authentication and session management
- **Sidebar**: Navigation (desktop/mobile variants)
- **Navbar**: Top bar rendered as card in right panel

#### 2. Page Components (`src/app/views/pages/panel/layouts/`)
- **InxPanel**: Intelligence Search (dark web monitoring)
- **SnsPanel**: Data leaks explorer (breach database search)

#### 3. Reusable Components (`src/app/views/components/`)

**Data Display:**
- `Tablev3` - Advanced table with virtualization
- `CardSkeleton` - Skeleton loaders
- `EmptyScreenView` - Empty states

**Forms & Inputs:**
- `SearchBar` - Global search component
- `SelectDropdown` - Custom select dropdown
- `AuthInput` - Styled input fields for forms

**Feedback & Loading:**
- `Loader` - Loading spinner
- `ProgressBar`, `ProgressCircle` - Progress indicators
- `Toast` notifications (react-toastify)

**Modals:**
- `ModalWrapper` - Base modal component
- `NetworkSettingModal` - Network configuration
- `ErrorConnection` - Connection error modal
- `OrderV2` - Order/payment modal

### Component Pattern Example

**Standard Page Component Structure:**
```tsx
// src/app/views/pages/panel/layouts/sns/SnsPanel.tsx
export const SnsPanel: FC = () => {
  // 1. Hooks & State
  const [showScreen] = useShowScreen(); // Animation hook
  const { previousSearches, isLoading, refetch } = usePreviousSearch('sns');
  const { appEvent } = useGlobalFastFields(['appEvent']);
  const isDesktop = useMediaQuery('(min-width: 1230px)');

  // 2. Effects
  useEffect(() => {
    refetch();
    appEvent.set(APP_EVENT_TYPE.DATALEAK_PAGE_CONDITION);
  }, []);

  // 3. Render
  return (
    <main className={`sb ${showScreen ? 'actived' : ''}`}>
      {/* Left: Main Content */}
      <section className="left">
        <div className="mobile-cards">
          <SnsCardTitle title="Dataleaks search" description="..." />
        </div>
        <SnsSearchAndData refetch={refetch} />
      </section>

      {/* Right: Sidebar */}
      <section className="right">
        <Navbar />
        <SnsCardTitle title="Dataleaks search" description="..." />
        <div className="card remaining-searches">
          Remaining searches: {company.get.disponibles_sns}
        </div>
        <SnPreviousSearches previousSearches={previousSearches} />
      </section>
    </main>
  );
};
```

### Styling Convention

**SCSS Modules:**
```scss
// sns.scss
.sb {
  display: flex;
  padding: var(--card-space);

  .left {
    flex: 1 1 70%;
    padding-right: var(--card-space);
  }

  .right {
    flex: 1 1 45%;
    display: flex;
    flex-direction: column;
    gap: var(--card-space);
  }

  // Mobile adaptations
  @media (max-width: 1230px) {
    flex-direction: column;

    .left, .right {
      flex: 1 1 100%;
      padding-right: 0;
    }
  }
}
```

**CSS Variables** (`src/app/views/styles/settings/_colors.scss`):
```scss
:root {
  --sidebar-width: 240px;
  --nav-height: 50px;
  --card-space: 12px;
  --max-height-layout: min(calc(100dvh - 10px), 1016px);
  --primary-color: #ffffff;
  --tertiary-color-700: #1a1a1a;
  --brd-radius: 8px;
}
```

### Mobile Responsiveness

**Breakpoint**: 1230px (tablet) and 600px (mobile)

**Responsive Strategy**:
```typescript
const isDesktop = useMediaQuery('(min-width: 1230px)');
const isMobile = useMediaQuery('(max-width: 600px)');
```

**Mobile Adaptations**:
1. **Sidebar**: Converts to hamburger menu (`SidebarMobile`)
2. **Right Column**: Content moves below main content on mobile
3. **Cards**: Stack vertically
4. **Mobile-only cards**: Show description cards on mobile view

**Mobile-specific CSS classes**:
```scss
.sidebar-mobile-active {
  padding-inline-start: 0; // Remove sidebar spacing
}

.mobile-cards {
  display: none;
  @media (max-width: 600px) {
    display: block;
  }
}

.mobile-bottom-card {
  display: none;
  @media (max-width: 600px) {
    display: block;
  }
}
```

---

## Service Layer

### HTTP Service Architecture

**Abstraction Hierarchy:**

```
┌─────────────────────────────┐
│  http.service.ts            │  Interface definition
│  HttpServiceInterface       │
└─────────────┬───────────────┘
              │
    ┌─────────┴──────────┐
    │                    │
┌───v──────────────┐  ┌─v──────────────────┐
│ axiosHTTP        │  │ fetchHTTP          │
│ (Primary)        │  │ (Alternative)      │
└──────────────────┘  └────────────────────┘
```

### AxiosHTTP Service

**Singleton Pattern Implementation:**

```typescript
// src/app/data/services/axiosHTTP.service.ts
export class AxiosHttpService implements HttpServiceInterface {
  private static instance: AxiosHttpService;
  private axiosInstance: AxiosInstance;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = import.meta.env.VITE_APP_API_URL;
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      timeout: 30000,
    });
    this.setupInterceptors();
  }

  static getInstance(): AxiosHttpService {
    if (!AxiosHttpService.instance) {
      AxiosHttpService.instance = new AxiosHttpService();
    }
    return AxiosHttpService.instance;
  }

  private setupInterceptors() {
    // Request interceptor: Add auth headers
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const session = localStorage.getItem('session');
        if (session) {
          config.headers.Authorization = `Bearer ${session}`;
        }
        return config;
      }
    );

    // Response interceptor: Handle errors
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Trigger logout event
          window.dispatchEvent(new Event('unauthorized'));
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(options: HttpRequestOptions): Promise<T> {
    const response = await this.axiosInstance.get(options.path, {
      params: options.params,
      headers: options.headers,
    });
    return response.data;
  }

  async post<T>(options: HttpRequestOptions): Promise<T> {
    const response = await this.axiosInstance.post(
      options.path,
      options.body,
      { headers: options.headers }
    );
    return response.data;
  }
}
```

### SWR Integration

**Custom Fetcher:**

```typescript
// src/app/data/services/swr.ts
import { AxiosHttpService } from './axiosHTTP.service';

export const swrFetcher = async (url: string) => {
  const httpService = AxiosHttpService.getInstance();
  return httpService.get({ path: url });
};

// Usage in hooks
const { data, error } = useSWR('/api/v1/resources', swrFetcher);
```

### Event-Driven Service

**Global Event Bus:**

```typescript
// src/app/data/services/EventDriven.service.ts
export class EventDrivenService {
  private listeners: Map<string, Set<Function>>;

  subscribe(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  publish(event: string, data?: any) {
    this.listeners.get(event)?.forEach(callback => callback(data));
  }

  unsubscribe(event: string, callback: Function) {
    this.listeners.get(event)?.delete(callback);
  }
}
```

---

## Tauri Desktop Integration

### Configuration

**tauri.conf.json:**

```json
{
  "productName": "Codefend Security App",
  "version": "25.1.0",
  "identifier": "com.codefend.app",

  "app": {
    "windows": [{
      "title": "Codefend App",
      "width": 800,
      "height": 600,
      "resizable": true,
      "center": true
    }]
  },

  "build": {
    "beforeDevCommand": "bun dev",
    "devUrl": "http://localhost:5173",
    "beforeBuildCommand": "bun run build",
    "frontendDist": "../dist"
  },

  "bundle": {
    "targets": ["deb", "appimage", "nsis", "app", "dmg"],
    "createUpdaterArtifacts": true
  },

  "plugins": {
    "updater": {
      "active": true,
      "endpoints": [
        "https://raw.githubusercontent.com/codefen/codefend-user/update-latest-json/latest.json"
      ]
    }
  }
}
```

### Tauri Plugins

**Installed Plugins:**
- `@tauri-apps/api` - Core API
- `@tauri-apps/plugin-dialog` - Native dialogs
- `@tauri-apps/plugin-notification` - System notifications
- `@tauri-apps/plugin-process` - Process management
- `@tauri-apps/plugin-shell` - Shell commands
- `@tauri-apps/plugin-updater` - Auto-updates
- `@tauri-apps/plugin-upload` - File uploads

### Platform Detection

**Conditional Logic:**

```typescript
// Check if running in Tauri
const isTauri = '__TAURI__' in window;

if (isTauri) {
  // Use Tauri API
  const { invoke } = await import('@tauri-apps/api/core');
  await invoke('some_command');
} else {
  // Fallback to web API
  await fetch('/api/endpoint');
}
```

### Build Targets

**Windows:**
- **NSIS Installer** with code signing
- WebView2 offline installer

**macOS:**
- **DMG** and **.app** bundles
- Code signing with Apple Developer ID

**Linux:**
- **DEB** packages
- **AppImage** bundles

---

## Build & Development

### Development Workflow

**Start Development Server:**
```bash
bun dev              # Vite dev server (web)
bun tauri dev        # Tauri dev mode (desktop)
```

**Code Quality Checks:**
```bash
bun run checking     # Run all checks (lint + format + types)
bun lint:fix         # Fix ESLint issues
bun format:fix       # Fix Prettier formatting
bun types:check      # TypeScript type checking
```

**Build for Production:**
```bash
bun run build        # Web production build
bun tauri build      # Desktop app build (all platforms)
```

### Vite Configuration

**Key Features:**

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],

  // Path aliases from tsconfig
  resolve: { alias: aliases },

  // Lightning CSS for transforms
  css: {
    transformer: 'lightningcss',
    lightningcss: {
      drafts: {
        nesting: true,
        customMedia: true,
      },
    },
  },

  // Server configuration
  server: {
    port: 5173,
    host: '0.0.0.0',  // Allow LAN access
    strictPort: true,
  },

  // Build optimizations
  build: {
    target: 'chrome105', // or 'safari13' for macOS
    cssMinify: 'lightningcss',
    minify: 'esbuild',
    sourcemap: false,
  },
});
```

### TypeScript Configuration

**Strict Mode Enabled:**
```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true,
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx"
  }
}
```

### Environment Variables

**Required Variables** (`.env`):
```bash
VITE_APP_API_URL=https://api.codefend.com
VITE_PORT=5173
TAURI_PLATFORM=windows
TAURI_DEBUG=false
```

---

## Security Considerations

### Authentication Flow

```
1. User Login
   ↓
2. JWT Token Received
   ↓
3. Store in localStorage + GlobalStore
   ↓
4. Axios Interceptor adds to headers
   ↓
5. Protected routes check isAuth
   ↓
6. 401 Response → Logout event
```

### Security Features

**1. Route Protection**
```typescript
// All protected routes require authentication
if (!isAuth) {
  return <Navigate to="/auth/signup" />;
}
```

**2. Role-Based Authorization**
```typescript
const haveAccessToResources = !isProvider() && !isReseller();
const haveAccessToCreateIssue = isProvider() || isAdmin();
```

**3. XSS Protection**
- DOMPurify for sanitizing HTML (`isomorphic-dompurify`)
- CSP headers in Tauri configuration

**4. CSRF Protection**
- Session tokens in headers
- Origin validation

**5. Secure Storage**
- Sensitive data in memory only
- localStorage for non-critical state
- Session timeout handling

### API Security

**Request Security:**
```typescript
// All requests include authentication
config.headers.Authorization = `Bearer ${session}`;

// Timeout protection (30s)
timeout: 30000

// Automatic retry logic (SWR)
revalidateOnError: true
```

**Response Validation:**
```typescript
// Type-safe responses
const data = await httpService.get<ResponseType>(options);

// Error boundary handling
<ErrorBoundary fallback={<ErrorPage />}>
  <App />
</ErrorBoundary>
```

---

## Application Feature Modules

### Core Modules (Actively Maintained)

#### 1. INX (Intelligence Search) - Primary Module
- **Dark web monitoring**: Track mentions on dark web forums and marketplaces
- **Data breach search**: Advanced search capabilities for leaked data
- **Threat intelligence**: Gather intelligence on emerging threats
- **Comprehensive analysis**: Deep analysis of breach sources and impact
- **File preview**: View leaked file contents before downloading
- **Search history**: Previous searches with SWR caching
- **Syntax highlighting**: URL highlighting in file content

#### 2. SNS (Social Network Security) - Primary Module
- **Data leak detection**: Search across massive breach databases
- **Exposed credentials search**: Find compromised emails, usernames, passwords
- **Breach database monitoring**: Track historical and new data breaches
- **Automatic type detection**: Detects emails, IPs, domains, and full names
- **Multi-class search**: Supports email, IP address, domain, and name searches
- **Search history**: Previous searches with SWR caching
- **URL parameter sync**: Search state synchronized with URL for shareable searches

### Supporting Features

#### Order & Subscription Management
- **Credit purchase system**: Buy search credits through OrderV2 modal
- **Subscription management**: Handle user subscriptions
- **Payment integration**: Multiple payment methods support

### Removed Features (Cleaned Up)
The following modules have been completely removed from the codebase:
- ❌ **ENP** (External Network Penetration) - Network scanning capabilities
- ❌ **VDB** (Vulnerability Database) - CVE and vulnerability search
- ❌ **Dashboard** - Overview and analytics page
- ❌ **Resource Management** - Web, Mobile, Network, Social resource tracking
- ❌ **Issue/Vulnerability Tracking** - Vulnerability management system
- ❌ **Attack Surface Management** - Comprehensive security posture monitoring

---

## Performance Optimization Strategies

### 1. Code Splitting
```typescript
// Lazy loading pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const WebApplication = lazy(() => import('./pages/WebApplication'));

// Suspense boundaries
<Suspense fallback={<Loader />}>
  <Outlet />
</Suspense>
```

### 2. Virtualization
```tsx
// Large lists with react-window
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={items.length}
  itemSize={50}
  width="100%"
>
  {Row}
</FixedSizeList>
```

### 3. Memoization
```typescript
// Expensive calculations
const processedData = useMemo(() => {
  return expensiveOperation(data);
}, [data]);

// Stable callbacks
const handleClick = useCallback(() => {
  doSomething(value);
}, [value]);
```

### 4. SWR Caching
```typescript
// Automatic deduplication and caching
const { data } = useSWR('/api/data', fetcher, {
  dedupingInterval: 60000,    // 1 minute
  revalidateOnFocus: false,   // Don't refetch on window focus
  revalidateOnReconnect: true, // Refetch on reconnect
});
```

### 5. Fast Context Provider
```typescript
// Field-level subscriptions prevent unnecessary re-renders
const session = useGlobalFastField('session'); // Only re-renders when session changes
const user = useGlobalFastField('user');       // Only re-renders when user changes
```


## Deployment Architecture

### Web Deployment
```
GitHub Repository
    ↓
GitHub Actions CI/CD
    ↓
Build Process (Vite)
    ↓
Static Files (dist/)
    ↓
Web Hosting (Vercel/Netlify/etc.)
```

### Desktop Deployment
```
GitHub Repository
    ↓
Tauri Build Process
    ↓
Platform-Specific Binaries
    ├── Windows (NSIS installer)
    ├── macOS (DMG/app)
    └── Linux (DEB/AppImage)
    ↓
GitHub Releases
    ↓
Auto-Updater (Tauri Plugin)
```

## Glossary

| Term | Definition |
|------|------------|
| **INX** | Intelligence Search - Dark web/threat intelligence module |
| **SNS** | Social Network Security - Data leak detection module |
| **SWR** | stale-while-revalidate - Data fetching library |
| **RBAC** | Role-Based Access Control |
| **Tauri** | Desktop app framework (Rust + WebView) |
| **FastContext** | Performance-optimized React Context |
| **OrderV2** | Credit purchase and subscription management system |

---

**Document Version**: 2.0.0
**Last Updated**: November 1, 2025
**Maintained by**: Codefend Development Team

**Changelog (v2.0.0)**:
- Removed ENP (External Network Penetration) module completely
- Removed VDB (Vulnerability Database) module completely  
- Removed Dashboard module and related components
- Updated project structure to reflect only INX and SNS modules
- Cleaned up legacy exports and unused components
- Updated sidebar to show only active modules
