# LawnTech Dynamics - Component Catalog

> Comprehensive documentation for all reusable React components in the LawnTech Dynamics application.

## Table of Contents

1. [Navigation Components](#navigation-components)
   - [NavBar](#navbar)
2. [3D & Visualization](#3d--visualization)
   - [ThreeScene](#threescene)
3. [Communication Components](#communication-components)
   - [AIChat](#aichat)
4. [Information Display](#information-display)
   - [Specifications](#specifications)
   - [LoadingSpinner](#loadingspinner)
5. [Utility & Error Handling](#utility--error-handling)
   - [OfflineIndicator](#offlineindicator)
   - [OfflineFallback](#offlinefallback)
   - [ErrorBoundary](#errorboundary)
   - [SEOHelmet](#seohelmet)

---

## Navigation Components

### NavBar

**File:** `/home/user/ace/components/NavBar.tsx`

**Purpose:** Main navigation header providing access to all primary application views with responsive desktop/mobile support.

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `currentView` | `View` | Yes | The currently active view/page being displayed |
| `onChangeView` | `(view: View) => void` | Yes | Callback fired when user navigates to a different view |

#### Features

- **Responsive Design:** Desktop navigation menu with full-width layout; collapses to mobile hamburger menu on screens below `md` breakpoint
- **Active State Highlighting:** Current view is highlighted in tennis-yellow color
- **Mobile Menu:** Full-screen overlay menu with auto-close on navigation
- **Keyboard Support:** Press Escape to close mobile menu
- **Accessibility:** Full ARIA labels and semantic HTML
- **Branding:** LawnTech Dynamics logo with pulsing yellow indicator
- **CTA Button:** "Join Waiting List" call-to-action button

#### Navigation Items

- **Vision** → `View.HOME`
- **Specs** → `View.SPECIFICATIONS`
- **3D Map** → `View.FACILITY_DEMO`
- **Amenities** → `View.AMENITIES`
- **Invest** → `View.INVEST`
- **Join Waiting List** → `View.INVEST`

#### Usage Example

```tsx
import NavBar from './components/NavBar';
import { useState } from 'react';
import { View } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<View>(View.HOME);

  return (
    <>
      <NavBar
        currentView={currentView}
        onChangeView={setCurrentView}
      />
      {/* Page content based on currentView */}
    </>
  );
}
```

#### Styling

- **Colors:** Uses brand colors (tennis-yellow, white, slate-900)
- **Layout:** Fixed position, top of viewport, z-index 40
- **Gradient:** Top-to-bottom gradient fade for visual depth
- **Mobile:** Hidden on desktop, visible on mobile hamburger menu

#### Complex Logic

**Mobile Menu Toggle & Escape Key:**
```tsx
// Closes mobile menu when Escape is pressed
React.useEffect(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  if (isMobileOpen) {
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }
}, [isMobileOpen]);
```

---

## 3D & Visualization

### ThreeScene

**File:** `/home/user/ace/components/ThreeScene.tsx`

**Purpose:** Interactive 3D architectural visualization of the LawnTech Dynamics facility with detailed floor layouts, sports courts, and autonomous systems.

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `onFeatureSelect` | `(feature: FeatureData) => void` | Yes | Callback fired when user clicks on a feature marker in the 3D scene |

#### Key Types

```typescript
type AnnotationMode = 'NONE' | 'LABELS' | 'MEASUREMENTS';
type FloorLevel = 'ALL' | 0 | 1 | 2 | 3;
```

#### Features

- **Full 3D Models:** Complete facility geometry with all sports courts and amenities
- **Multi-Level Navigation:** Switch between 4 floors + full facility overview
- **Annotation Modes:**
  - `NONE`: Clean view without overlays
  - `LABELS`: Feature labels and information overlay
  - `MEASUREMENTS`: CAD-style dimension annotations
- **Smooth Camera Animations:** Interpolated camera movements when switching floors
- **Orbital Controls:** Free exploration with mouse/touch controls
- **Advanced Lighting:** Directional shadows, ambient lighting, environmental reflections
- **Interactive Markers:** Clickable feature points with hover effects
- **Responsive:** Full-screen adaptive rendering

#### Facility Content

**Ground Floor (Level 0):** Tennis Arena
- 6 Hard courts
- 6 Clay courts
- 6 Grass courts
- 6 Wood courts
- Pro Shop and Locker areas

**Level 1:** Racquet Sports
- 16 Badminton courts
- 4 Squash courts
- 16 Table Tennis tables

**Level 2:** Social & Heritage Sports
- 8 Pickleball courts
- 1 Real Tennis court
- 360° glass viewing decks

**Level 3:** Vertical Farming
- 4 autonomous farming sectors (500m² each)
- Full-spectrum LED lighting
- Auto-hydroponics systems
- Robot fleet for patch management

**Outdoor Areas:** Plaza with landscaping and outdoor courts

#### Usage Example

```tsx
import ThreeScene from './components/ThreeScene';
import type { FeatureData } from './types';

export default function FacilityDemo() {
  const handleFeatureSelect = (feature: FeatureData) => {
    console.log(`Selected: ${feature.title}`);
    console.log(`Description: ${feature.description}`);
    // Update UI based on selected feature
  };

  return (
    <div className="w-full h-screen">
      <ThreeScene onFeatureSelect={handleFeatureSelect} />
    </div>
  );
}
```

#### Complex 3D Components

**CameraRig**
- Smooth interpolated camera movement between floor levels
- Tracks animation state to detect user interruption
- Auto-stops animation when target is reached (optimization)

**CadDimension**
- Renders architectural dimension lines with measurements
- Creates extension lines, dimension line, tick marks, and labels
- Uses 3D positioning and HTML overlay for text

**FloorPlate**
- Renders floor surface with ribbon edges
- Shows ceiling and lighting fixtures for active floor
- Displays CAD dimensions when in MEASUREMENTS mode

**Marker**
- Interactive 3D point markers for key features
- Hover effects and floating animation
- Label badges with glow effects when selected
- Cursor change on hover

#### Keyboard & Controls

- **Left Mouse/Touch Drag:** Rotate view
- **Scroll/Pinch:** Zoom in/out
- **Right Mouse Drag:** Pan
- **Floor Buttons:** Click to navigate to specific level
- **Annotation Buttons:** Toggle between view modes

#### Performance Optimizations

- **useMemo:** Caching expensive geometry calculations
- **Conditional Rendering:** Only render visible elements based on floor/annotation mode
- **OrbitControls:** Efficient camera manipulation
- **ContactShadows:** Lightweight shadow rendering

---

## Communication Components

### AIChat

**File:** `/home/user/ace/components/AIChat.tsx`

**Purpose:** Floating AI-powered concierge chatbot providing intelligent facility information through conversational interface.

#### Props

None - renders as a standalone floating widget.

#### Features

- **Floating Widget:** Fixed bottom-right position, z-index 50
- **Toggle Animation:** Smooth open/close animation with Framer Motion
- **Auto-Scroll:** Messages container automatically scrolls to latest message
- **Loading States:** Spinner animation while AI responds
- **Conversation History:** Maintains full message history for context-aware responses
- **Enter Key Support:** Quick send on Enter key
- **Responsive:** Adapts between 350px (mobile) and 400px (desktop) width
- **Accessibility:** Semantic HTML, ARIA labels, screen reader support

#### Messages

Messages are displayed in the format:

```typescript
interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
```

- **User Messages:** Right-aligned, green background (tennis-green)
- **AI Messages:** Left-aligned, white/translucent background
- **Loading State:** Shows spinner while waiting for response

#### Usage Example

```tsx
import AIChat from './components/AIChat';

export default function App() {
  return (
    <div>
      {/* App content */}
      <AIChat />
    </div>
  );
}
```

#### API Integration

Connects to Google Gemini API through `geminiService`:

```tsx
const responseText = await sendQueryToConcierge(history);
```

The service receives full conversation history formatted as:
```typescript
{
  role: 'user' | 'model',
  parts: [{ text: string }]
}[]
```

#### UI Components

| Section | Description |
|---------|-------------|
| Header | Bot icon, title "Facility AI Concierge", close button |
| Messages Container | Scrollable area with chat messages and loading indicator |
| Input Area | Text input field with placeholder text and send button |

#### Styling

- **Colors:** tennis-yellow button, tennis-green user messages, white text
- **Glass Effect:** Frosted glass panel with backdrop blur
- **Animations:** Framer Motion for window open/close, button hover/tap

#### Complex Logic

**Message Sending with Optimistic Updates:**
```tsx
const handleSend = async () => {
  if (!input.trim()) return;

  const userMsgText = input;
  setInput(''); // Clear input immediately

  const newUserMsg: ChatMessage = { role: 'user', text: userMsgText };

  // Optimistic update - show user message immediately
  const newMessages = [...messages, newUserMsg];
  setMessages(newMessages);
  setIsLoading(true);

  // Format history for API
  const history = newMessages.map((m) => ({
    role: m.role,
    parts: [{ text: m.text }],
  }));

  // Fetch AI response
  const responseText = await sendQueryToConcierge(history);

  // Update with AI response
  setMessages((prev) => [...prev, { role: 'model', text: responseText }]);
  setIsLoading(false);
};
```

---

## Information Display

### Specifications

**File:** `/home/user/ace/components/Specifications.tsx`

**Purpose:** Display comprehensive facility specifications and features across all facility levels.

#### Props

None - renders as a complete page/section component.

#### Features

- **5 Category Cards:** Organized by facility section
- **Animated Entrance:** Staggered card animations with Framer Motion
- **Icon Labels:** Distinct icons for each category
- **Responsive Grid:** 1 column (mobile) → 2 columns (tablet) → 3 columns (desktop)
- **Hover Effects:** Cards brighten on hover
- **Semantic Markup:** Proper heading hierarchy and structure

#### Categories

1. **Ground Floor: Tennis Arena** (Home icon, tennis-yellow)
   - 6 Hard Courts (DecoTurf)
   - 6 Clay Courts (Red Clay)
   - 6 Grass Courts (Organic)
   - 6 Wood Courts (Maple)
   - Pro Shop & Lockers

2. **Level 1: Racquet Sports** (Zap icon, blue)
   - 16 Badminton Courts
   - 4 Squash Courts
   - 16 Table Tennis Tables
   - Shock-Absorbent Synthetic Flooring

3. **Level 2: Social & Heritage** (Layers icon, purple)
   - 8 Pickleball Courts
   - 1 Historic Real Tennis Court
   - 360° Glass Walkways

4. **Level 3: Vertical Farming** (Droplets icon, green)
   - 4 × 500m² Sections
   - Auto-Hydroponics Technology
   - Full Spectrum LED Lighting
   - Patch Transporter Robot Fleet

5. **Autonomous Systems** (Server icon, red)
   - Biometric / Mobile App Access
   - Drone & Lidar Monitoring Fleet
   - Solar + Smart Building Management System
   - AI Predictive Water Irrigation

#### Usage Example

```tsx
import Specifications from './components/Specifications';

export default function SpecificationsPage() {
  return (
    <section className="min-h-screen bg-slate-950">
      <Specifications />
    </section>
  );
}
```

#### Styling

- **Grid Layout:** `grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8`
- **Cards:** White text on dark background with subtle borders
- **Icons:** Brand-colored icons in rounded containers
- **Typography:** Bold category names, gray labels, white values

#### Data Structure

```typescript
const specs = [
  {
    category: string;
    icon: React.ReactNode;
    items: Array<{
      label: string;
      value: string;
    }>;
  }
];
```

---

### LoadingSpinner

**File:** `/home/user/ace/components/LoadingSpinner.tsx`

**Purpose:** Context-aware loading indicator displayed while content is loading.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'threeScene' \| 'aiChat' \| 'specifications'` | `'default'` | Loading context determining icon and message |

#### Variants

| Variant | Icon Animation | Text | Subtext |
|---------|---|------|---------|
| `default` | Spinning loader | "Loading..." | "Please wait" |
| `threeScene` | Pulsing layers | "Building 3D Environment" | "Loading facility model and textures" |
| `aiChat` | Bouncing message | "Initializing AI Concierge" | "Connecting to chat service" |
| `specifications` | Pulsing document | "Loading Specifications" | "Preparing facility blueprints" |

#### Features

- **Animated Background:** Pulsing ping animation behind icon
- **Progress Bar:** Animated horizontal loading bar
- **Centered Layout:** Vertically and horizontally centered
- **Responsive:** Full-width height with minimum 400px
- **Styled Container:** Glass panel with border and backdrop blur

#### Usage Example

```tsx
import LoadingSpinner from './components/LoadingSpinner';
import { useState, useEffect } from 'react';

export default function MyPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    // Fetch data...
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <LoadingSpinner variant="specifications" />;
  }

  return <div>{/* Page content */}</div>;
}
```

#### Styling

- **Colors:** tennis-yellow for icons and progress bar
- **Background:** slate-950 with glass panel effect
- **Animations:** 1.5s loading bar loop, synchronized icon animations
- **Responsive:** Adapts to all screen sizes

---

## Utility & Error Handling

### OfflineIndicator

**File:** `/home/user/ace/components/OfflineIndicator.tsx`

**Purpose:** Display notification banners when network connectivity changes.

#### Props

None - renders automatically based on network status.

#### Features

- **Network Detection:** Monitors `online` and `offline` window events
- **Dual Banners:** Separate banners for offline and reconnected states
- **Auto-Dismiss:** Reconnected message auto-hides after 3 seconds
- **Smooth Animations:** Spring animations with Framer Motion
- **Non-Intrusive:** Uses `pointer-events-none` to avoid blocking interaction
- **Accessibility:** Semantic HTML with appropriate ARIA attributes

#### Behavior

1. **Offline:** Red banner with WiFi-off icon appears at top
2. **Reconnected:** Green banner with WiFi icon appears, auto-dismisses after 3 seconds

#### Usage Example

```tsx
import OfflineIndicator from './components/OfflineIndicator';

export default function App() {
  return (
    <div>
      <OfflineIndicator />
      {/* Rest of app */}
    </div>
  );
}
```

#### Styling

- **Offline:** Red background (#ef4444), red border
- **Reconnected:** Green background (#22c55e), green border
- **Both:** Rounded-full shape, backdrop blur, centered text

---

### OfflineFallback

**File:** `/home/user/ace/components/OfflineFallback.tsx`

**Purpose:** Full-page fallback UI displayed when app cannot function without internet.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | "No Internet Connection" | Custom error title |
| `message` | `string` | Default message | Custom error description |
| `onRetry` | `() => void` | `undefined` | Custom retry handler (page reload if undefined) |

#### Features

- **Animated Icon:** Scale and rotate animation on mount
- **Pulsing Ring:** Outer animation around icon
- **Status Indicators:** Shows network and server status
- **Retry Button:** Reloads page or calls custom handler
- **Troubleshooting Tips:** 4 helpful steps to restore connection
- **Responsive Design:** Adapts to all screen sizes
- **Smooth Animations:** Staggered content entrance

#### Usage Example

```tsx
import OfflineFallback from './components/OfflineFallback';

// Default usage
<OfflineFallback />

// Custom usage
<OfflineFallback
  title="Service Unavailable"
  message="Please check your connection and try again"
  onRetry={() => location.reload()}
/>
```

#### Styling

- **Icon:** Orange (#f97316) with animated pulsing ring
- **Layout:** Centered full-screen dark background
- **Buttons:** tennis-yellow retry button, white secondary button
- **Tips:** Styled list with yellow bullet points

---

### ErrorBoundary

**File:** `/home/user/ace/components/ErrorBoundary.tsx`

**Purpose:** Catch JavaScript errors in component tree and display fallback UI.

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `ReactNode` | Yes | Components to wrap and monitor for errors |
| `fallback` | `ReactNode` | No | Custom fallback UI to display on error |

#### Features

- **Error Catching:** Catches errors anywhere in child component tree
- **Development Debug Info:** Shows error stack trace in development mode only
- **Beautiful Fallback UI:** Professional error page matching brand aesthetics
- **Recovery Options:**
  - Refresh Page button
  - Go to Home button
  - Dev-only recovery attempt button
- **Error Logging:** Logs errors to console for debugging
- **Extensible:** Custom fallback UI support

#### Lifecycle Methods Used

- `getDerivedStateFromError()` - Catches errors and updates state
- `componentDidCatch()` - Logs error details

#### Usage Example

```tsx
import ErrorBoundary from './components/ErrorBoundary';
import ProblematicComponent from './ProblematicComponent';

export default function App() {
  return (
    <ErrorBoundary>
      <ProblematicComponent />
    </ErrorBoundary>
  );
}

// With custom fallback
<ErrorBoundary fallback={<CustomErrorPage />}>
  <MyContent />
</ErrorBoundary>
```

#### Error Display

**Development Mode:**
- Full error message
- Complete stack trace
- Component stack trace
- All details shown in scrollable panel

**Production Mode:**
- User-friendly message
- No technical details exposed
- Action buttons for recovery

#### Styling

- **Icon:** Red alert triangle (#ef4444)
- **Layout:** Centered full-screen dark background
- **Details Panel:** Dark red background with monospace font
- **Buttons:** tennis-yellow primary, white secondary

---

### SEOHelmet

**File:** `/home/user/ace/components/SEOHelmet.tsx`

**Purpose:** Dynamically manage meta tags and SEO properties without external library dependencies.

#### Props

Extends `SeoConfig` interface with additional options:

| Prop | Type | Description |
|------|------|-------------|
| `title` | `string` | Page title for `<title>` tag |
| `description` | `string` | Meta description |
| `ogImage` | `string` | Open Graph image URL |
| `ogTitle` | `string` | Open Graph title (defaults to title) |
| `ogDescription` | `string` | Open Graph description |
| `twitterCard` | `string` | Twitter card type |
| `canonical` | `string` | Canonical URL for this page |
| `structuredData` | `object` | JSON-LD structured data |
| `scrollToTop` | `boolean` | Auto-scroll to top when updated |

#### Features

- **No Dependencies:** Custom implementation without react-helmet
- **Meta Tags:** Title, description, OG tags, Twitter cards
- **Structured Data:** JSON-LD schema support
- **Canonical URLs:** Duplicate content prevention
- **Auto Scroll:** Optional scroll-to-top on tag update
- **Efficient:** Uses useEffect for updates

#### Usage Example

```tsx
import SEOHelmet, { useSEO } from './components/SEOHelmet';

// Component usage
export default function ProductPage() {
  return (
    <>
      <SEOHelmet
        title="LawnTech Dynamics | Autonomous Tennis Facility"
        description="Experience the future of tennis with AI-powered courts and vertical farming"
        ogImage="https://example.com/og-image.jpg"
        canonical="https://example.com/products/lawntech"
      />
      <ProductContent />
    </>
  );
}

// Hook usage
export default function AnotherPage() {
  const { setSEO, setStructuredData } = useSEO();

  useEffect(() => {
    setSEO({
      title: 'About LawnTech',
      description: 'Learn about our vision'
    });

    setStructuredData({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'LawnTech Dynamics'
    });
  }, []);

  return <PageContent />;
}
```

#### Exported Hook

**useSEO()** - Returns object with:
- `setSEO(config)` - Update SEO tags
- `setStructuredData(data)` - Update JSON-LD schema

#### Implementation Details

The component doesn't render anything (`return null`) but manages the document head:

```tsx
export const SEOHelmet: React.FC<SEOHelmetProps> = ({ scrollToTop = false, ...seoConfig }) => {
  useEffect(() => {
    updateSEO(seoConfig);
    if (scrollToTop) {
      window.scrollTo(0, 0);
    }
  }, [seoConfig, scrollToTop]);

  return null;
};
```

---

## Type Definitions

### View Enum

```typescript
enum View {
  HOME = 'HOME',
  FACILITY_DEMO = 'FACILITY_DEMO',
  AMENITIES = 'AMENITIES',
  INVEST = 'INVEST',
  SPECIFICATIONS = 'SPECIFICATIONS',
}
```

### FeatureData Interface

```typescript
interface FeatureData {
  id: string;           // Unique identifier (e.g., 'ground_tennis')
  title: string;        // Display title
  description: string;  // Description of the feature
  icon: string;         // Emoji icon
  position: [number, number, number]; // 3D world position [x, y, z]
}
```

### ChatMessage Interface

```typescript
interface ChatMessage {
  role: 'user' | 'model';  // Message sender type
  text: string;            // Message content
}
```

---

## Common Styling Patterns

### Brand Colors

```css
/* Tailwind custom colors */
--tennis-yellow: #DFFF4F    /* Primary action color */
--tennis-dark: #0f172a     /* Dark backgrounds */
--tennis-green: #059669    /* Secondary action */
```

### Glass Panel Effect

```css
.glass-panel {
  @apply bg-white/5 backdrop-blur-md border border-white/10 rounded-xl;
}
```

### Responsive Breakpoints

- Mobile: < `md` (768px)
- Tablet: `md` to `lg`
- Desktop: >= `lg` (1024px)
- Extra Large: >= `xl`

---

## Performance Optimization Tips

1. **Lazy Loading:** Use React.lazy() for code splitting
2. **Memoization:** Wrap expensive components with React.memo()
3. **useMemo Hook:** Cache expensive calculations
4. **useCallback Hook:** Memoize callback functions
5. **Image Optimization:** Use Next.js Image or similar
6. **CSS Modules:** Avoid duplicate styles

---

## Accessibility Checklist

- [ ] Semantic HTML (`<button>`, `<nav>`, `<main>`, etc.)
- [ ] ARIA labels for icon-only buttons
- [ ] `aria-live` regions for dynamic content
- [ ] `role` attributes where needed
- [ ] Keyboard navigation support
- [ ] Color contrast ratios > 4.5:1
- [ ] Focus indicators visible
- [ ] Screen reader testing

---

## Related Documentation

- **Types:** `/home/user/ace/types.ts` - TypeScript interfaces and enums
- **Services:** `/home/user/ace/services/` - API and utility services
- **Styles:** Tailwind CSS configuration in `tailwind.config.ts`
- **Tests:** Component tests in `*.test.tsx` files

---

## Version History

- **v1.0.0** - Initial component catalog documentation
  - Documented 9 components
  - Added usage examples
  - Included prop tables
  - Complex logic explanations
  - Styling and accessibility guidelines
