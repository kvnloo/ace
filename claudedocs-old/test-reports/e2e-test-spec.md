# E2E Test Specification - ACE Tennis Management System

## Overview
Comprehensive end-to-end test specifications for Sprint 1 critical user journeys.

---

## Test Scenario 1: Court Status Display & Real-time Updates

### Objective
Verify real-time court availability monitoring and status transitions.

### User Journey Flow
```
┌─────────────┐
│ User Visits │
│  Dashboard  │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│ All Courts Display  │
│ - ID, Name, Status  │
│ - Last Updated      │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ WebSocket Connected │
│ Real-time Updates   │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Status Changes:     │
│ Available → Playing │
│ Playing → Available │
│ Any → Maintenance   │
└─────────────────────┘
```

### Test Steps
1. **Initial Load**
   - Navigate to `/courts`
   - Verify all courts render with correct initial status
   - Verify timestamp displays relative time (e.g., "2 minutes ago")
   - Check loading states during data fetch

2. **Real-time Status Updates**
   - Simulate court status change via WebSocket
   - Verify status badge updates within 500ms
   - Verify timestamp updates automatically
   - Check visual indicators (colors, icons) update correctly

3. **Multiple Simultaneous Updates**
   - Trigger 5 court status changes simultaneously
   - Verify all updates render without race conditions
   - Verify no flickering or layout shifts

### Success Criteria
- ✅ Court list renders within 2 seconds
- ✅ Status updates appear within 500ms of WebSocket event
- ✅ No duplicate entries or missing courts
- ✅ Correct color coding: Available (green), Playing (blue), Maintenance (orange)
- ✅ Timestamps update and display correctly
- ✅ No console errors or warnings

### Edge Cases
- **Slow Network**: Simulate 3G connection, verify graceful degradation
- **WebSocket Disconnection**: Verify reconnection logic and user notification
- **Malformed Data**: Send invalid court status, verify error handling
- **Large Dataset**: Test with 100+ courts, verify performance
- **Rapid Updates**: Send 10 updates/second, verify UI stability

### Expected vs Actual Behavior Matrix
| Scenario | Expected | Actual | Pass/Fail |
|----------|----------|--------|-----------|
| Initial load time | <2s | _____ | _____ |
| Status update latency | <500ms | _____ | _____ |
| WebSocket reconnect | <5s | _____ | _____ |
| Memory leak (10min) | <50MB | _____ | _____ |

---

## Test Scenario 2: Weather Integration Display

### Objective
Verify real-time weather data display and environmental condition monitoring.

### User Journey Flow
```
┌──────────────┐
│ Open Weather │
│    Widget    │
└──────┬───────┘
       │
       ▼
┌──────────────────────┐
│ Current Conditions   │
│ - Temperature        │
│ - Humidity           │
│ - Wind Speed         │
│ - UV Index           │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Court Recommendations│
│ - Playability Status │
│ - Risk Warnings      │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Auto-refresh (5 min) │
│ Manual Refresh Button│
└──────────────────────┘
```

### Test Steps
1. **Weather Data Load**
   - Navigate to dashboard with weather widget
   - Verify API call to weather service
   - Verify all weather metrics display
   - Check unit conversions (°C/°F, km/h/mph)

2. **Playability Recommendations**
   - Test various weather conditions:
     - Ideal: 20°C, 50% humidity, 10 km/h wind
     - Warning: 35°C, 80% humidity, 30 km/h wind
     - Unsafe: Rain detected, extreme heat >40°C
   - Verify color-coded status indicators
   - Verify warning messages display correctly

3. **Auto-refresh Mechanism**
   - Wait 5 minutes, verify data auto-refreshes
   - Click manual refresh, verify immediate update
   - Verify loading indicator during refresh

### Success Criteria
- ✅ Weather data loads within 3 seconds
- ✅ All metrics display with correct units
- ✅ Playability status updates based on conditions
- ✅ Auto-refresh works every 5 minutes
- ✅ Manual refresh completes within 2 seconds
- ✅ Error handling for API failures

### Edge Cases
- **API Timeout**: Simulate 10s timeout, verify fallback to cached data
- **Invalid API Response**: Send malformed JSON, verify error message
- **Network Failure**: Disconnect network, verify offline message
- **Extreme Values**: Test with -40°C and +50°C, verify UI handles gracefully
- **Location Change**: Change location, verify weather updates

### Expected vs Actual Behavior Matrix
| Scenario | Expected | Actual | Pass/Fail |
|----------|----------|--------|-----------|
| Initial load | <3s | _____ | _____ |
| Auto-refresh interval | 5min ±5s | _____ | _____ |
| Manual refresh | <2s | _____ | _____ |
| API error handling | Cached data shown | _____ | _____ |

---

## Test Scenario 3: BMS Sensor Monitoring Dashboard

### Objective
Verify comprehensive building management system sensor monitoring and alerting.

### User Journey Flow
```
┌────────────┐
│ BMS Panel  │
└─────┬──────┘
      │
      ▼
┌─────────────────────┐
│ Sensor Grid Display │
│ - Type (Light, Temp)│
│ - Value             │
│ - Status            │
│ - Last Reading      │
└─────┬───────────────┘
      │
      ▼
┌─────────────────────┐
│ Alert Detection     │
│ - Threshold Breach  │
│ - Visual Indicator  │
│ - Notification      │
└─────┬───────────────┘
      │
      ▼
┌─────────────────────┐
│ Historical Chart    │
│ - 24h Graph         │
│ - Min/Max/Avg       │
└─────────────────────┘
```

### Test Steps
1. **Sensor Grid Load**
   - Navigate to BMS dashboard
   - Verify all sensor types display (temperature, light, humidity, motion)
   - Check grid layout responsiveness
   - Verify real-time value updates

2. **Alert Threshold Testing**
   - Simulate sensor value exceeding threshold
   - Verify alert badge appears
   - Verify visual indicator (red border, icon)
   - Verify alert notification triggers

3. **Historical Data Visualization**
   - Load 24-hour historical chart
   - Verify data points render correctly
   - Check min/max/average calculations
   - Test chart interactions (zoom, pan)

### Success Criteria
- ✅ All sensors display within 2 seconds
- ✅ Real-time updates every 30 seconds
- ✅ Alerts trigger within 1 second of threshold breach
- ✅ Historical chart loads within 4 seconds
- ✅ Accurate min/max/avg calculations
- ✅ No data loss during updates

### Edge Cases
- **Missing Sensors**: Some sensors offline, verify placeholder display
- **Invalid Readings**: Sensor sends NaN or null, verify error handling
- **High-frequency Updates**: 1 update/second for 5 minutes, verify performance
- **Large Historical Dataset**: 30 days of data, verify pagination/lazy loading
- **Simultaneous Alerts**: 10 sensors breach threshold, verify all alerts show

### Expected vs Actual Behavior Matrix
| Scenario | Expected | Actual | Pass/Fail |
|----------|----------|--------|-----------|
| Grid load time | <2s | _____ | _____ |
| Update frequency | 30s ±2s | _____ | _____ |
| Alert latency | <1s | _____ | _____ |
| Chart load time | <4s | _____ | _____ |

---

## Test Scenario 4: AI Chat Interface Interaction

### Objective
Verify AI chatbot functionality, response quality, and conversation flow.

### User Journey Flow
```
┌──────────────┐
│ Open Chat    │
│ Widget       │
└──────┬───────┘
       │
       ▼
┌──────────────────────┐
│ Welcome Message      │
│ Example Prompts      │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ User Types Query     │
│ "What courts are     │
│  available?"         │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ AI Processes Request │
│ - Typing Indicator   │
│ - Response Generated │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Display Response     │
│ - Formatted Text     │
│ - Action Buttons     │
│ - Follow-up Prompts  │
└──────────────────────┘
```

### Test Steps
1. **Chat Initialization**
   - Click chat icon to open widget
   - Verify welcome message displays
   - Check example prompts render
   - Test open/close animations

2. **Message Exchange**
   - Type query: "What courts are available?"
   - Verify typing indicator appears
   - Verify response arrives within 5 seconds
   - Check response formatting (markdown, code blocks)
   - Verify conversation history persists

3. **Context Awareness**
   - Ask follow-up question: "Book court 1"
   - Verify AI maintains conversation context
   - Check if previous messages are referenced
   - Test multi-turn conversation flow

4. **Action Buttons**
   - Verify "Book Court" button in response
   - Click action button, verify correct action triggers
   - Check button states (loading, success, error)

### Success Criteria
- ✅ Chat opens/closes smoothly (<300ms animation)
- ✅ Messages send and display correctly
- ✅ AI response within 5 seconds
- ✅ Typing indicator shows during processing
- ✅ Conversation history persists across sessions
- ✅ Action buttons work correctly
- ✅ No message duplication or loss

### Edge Cases
- **Long Messages**: Send 1000-word message, verify UI handles gracefully
- **Special Characters**: Send emojis, code snippets, verify rendering
- **Rapid Messages**: Send 5 messages quickly, verify queue handling
- **API Timeout**: Simulate 30s timeout, verify error message
- **Network Disconnection**: Send message while offline, verify retry logic
- **Concurrent Conversations**: Open multiple chat instances, verify isolation

### Expected vs Actual Behavior Matrix
| Scenario | Expected | Actual | Pass/Fail |
|----------|----------|--------|-----------|
| Chat open animation | <300ms | _____ | _____ |
| AI response time | <5s | _____ | _____ |
| Message send latency | <200ms | _____ | _____ |
| History persistence | 100% | _____ | _____ |

---

## Test Scenario 5: Theme Toggle (Light/Dark Mode)

### Objective
Verify seamless theme switching and persistence across sessions.

### User Journey Flow
```
┌──────────────┐
│ Initial Load │
│ (System Pref)│
└──────┬───────┘
       │
       ▼
┌──────────────────────┐
│ Light/Dark Toggle    │
│ in Header            │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Theme Transition     │
│ - Smooth Animation   │
│ - All Components     │
│ - No Flicker         │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Persist to           │
│ LocalStorage         │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Reload Page          │
│ Theme Preserved      │
└──────────────────────┘
```

### Test Steps
1. **Default Theme Detection**
   - Clear localStorage
   - Visit site with OS set to dark mode
   - Verify dark theme loads by default
   - Repeat with light mode OS setting

2. **Manual Toggle**
   - Click theme toggle button
   - Verify smooth transition animation (200ms)
   - Check all components update (charts, cards, text)
   - Verify no flash of unstyled content (FOUC)

3. **Persistence**
   - Toggle to dark mode
   - Refresh page
   - Verify dark mode persists
   - Clear localStorage, verify reverts to system preference

4. **Component Coverage**
   - Verify theme applies to:
     - Navigation bar
     - Cards and panels
     - Charts and graphs
     - Modals and overlays
     - Form inputs
     - Buttons and icons

### Success Criteria
- ✅ System preference detection works
- ✅ Toggle animation smooth and fast (<200ms)
- ✅ 100% component coverage (no missed elements)
- ✅ No FOUC on page load
- ✅ Theme persists across sessions
- ✅ Accessibility: WCAG AA contrast ratios

### Edge Cases
- **Mid-transition Toggle**: Click toggle during animation, verify state consistency
- **Browser Storage Disabled**: Disable localStorage, verify fallback to system pref
- **Multiple Tabs**: Toggle in one tab, verify other tabs update
- **Print Mode**: Trigger print, verify print-friendly theme
- **High Contrast Mode**: Enable OS high contrast, verify override

### Expected vs Actual Behavior Matrix
| Scenario | Expected | Actual | Pass/Fail |
|----------|----------|--------|-----------|
| Toggle animation | <200ms | _____ | _____ |
| Component coverage | 100% | _____ | _____ |
| Persistence | 100% | _____ | _____ |
| Contrast ratio | ≥4.5:1 | _____ | _____ |

---

## Test Scenario 6: Responsive Layout (Mobile/Tablet/Desktop)

### Objective
Verify responsive design across all device sizes and orientations.

### User Journey Flow
```
┌──────────────┐
│ Desktop View │
│ (1920x1080)  │
└──────┬───────┘
       │
       ▼
┌──────────────────────┐
│ Resize to Tablet     │
│ (768x1024)           │
│ - Layout Adjusts     │
│ - Navigation Collapse│
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Resize to Mobile     │
│ (375x667)            │
│ - Single Column      │
│ - Hamburger Menu     │
│ - Touch Targets ≥44px│
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Rotate Device        │
│ (Landscape)          │
│ - Layout Adapts      │
└──────────────────────┘
```

### Test Steps
1. **Desktop Layout (≥1024px)**
   - Verify multi-column grid layout
   - Check sidebar navigation expanded
   - Verify charts display full width
   - Test hover interactions

2. **Tablet Layout (768px - 1023px)**
   - Verify 2-column layout
   - Check collapsible sidebar
   - Verify touch-friendly controls
   - Test orientation change

3. **Mobile Layout (<768px)**
   - Verify single-column layout
   - Check hamburger menu navigation
   - Verify bottom navigation bar
   - Test swipe gestures
   - Verify minimum touch target size (44x44px)

4. **Breakpoint Transitions**
   - Slowly resize from desktop to mobile
   - Verify smooth layout transitions
   - Check no content overflow or clipping
   - Verify images scale appropriately

### Success Criteria
- ✅ All breakpoints render correctly
- ✅ No horizontal scroll on any device
- ✅ Touch targets ≥44px on mobile
- ✅ Readable text without zooming
- ✅ Navigation accessible on all devices
- ✅ Charts and images responsive

### Edge Cases
- **Ultra-wide (2560px)**: Verify content doesn't stretch excessively
- **Small Mobile (320px)**: Verify content readable and accessible
- **Landscape Mobile**: Verify layout adapts correctly
- **Foldable Devices**: Test various fold states
- **Browser Zoom (200%)**: Verify layout remains functional

### Expected vs Actual Behavior Matrix
| Scenario | Expected | Actual | Pass/Fail |
|----------|----------|--------|-----------|
| Desktop layout | Multi-col | _____ | _____ |
| Tablet layout | 2-col | _____ | _____ |
| Mobile layout | 1-col | _____ | _____ |
| Touch targets | ≥44px | _____ | _____ |

---

## Test Scenario 7: Performance Under Load

### Objective
Verify system performance with realistic data volumes and concurrent users.

### User Journey Flow
```
┌──────────────┐
│ Baseline Test│
│ (Empty State)│
└──────┬───────┘
       │
       ▼
┌──────────────────────┐
│ Load 50 Courts       │
│ Measure Performance  │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Load 100 Sensors     │
│ Real-time Updates    │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Simulate 10 Users    │
│ Concurrent Actions   │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Measure Metrics:     │
│ - FPS, Memory, Load  │
└──────────────────────┘
```

### Test Steps
1. **Baseline Performance**
   - Load empty dashboard
   - Measure: FPS, Memory, Page Load Time
   - Establish performance baseline

2. **Data Volume Testing**
   - Load 50 courts with real-time updates
   - Measure FPS (target: ≥55 fps)
   - Measure memory usage (target: <250MB)
   - Load 100 BMS sensors with updates
   - Measure render time (target: <3s)

3. **Concurrent User Simulation**
   - Simulate 10 concurrent users
   - Each user performs:
     - View courts
     - Check weather
     - Send chat message
     - Toggle theme
   - Measure server response times
   - Check for race conditions

4. **Long-running Session**
   - Keep dashboard open for 2 hours
   - Measure memory leak (target: <50MB growth)
   - Verify WebSocket stability
   - Check CPU usage (target: <30% average)

### Success Criteria
- ✅ Page load time <3 seconds
- ✅ FPS ≥55 during animations
- ✅ Memory usage <250MB
- ✅ No memory leaks (growth <50MB/2hr)
- ✅ CPU usage <30% average
- ✅ All interactions <100ms response time

### Edge Cases
- **Massive Dataset**: 500 courts, 1000 sensors, verify performance
- **Slow Network**: Simulate 3G, verify graceful degradation
- **High Update Frequency**: 100 updates/second, verify UI stability
- **Memory Stress**: Run for 24 hours, verify no crash
- **CPU Throttling**: Simulate mobile CPU, verify usability

### Expected vs Actual Behavior Matrix
| Scenario | Expected | Actual | Pass/Fail |
|----------|----------|--------|-----------|
| Page load | <3s | _____ | _____ |
| FPS (animations) | ≥55 | _____ | _____ |
| Memory usage | <250MB | _____ | _____ |
| Memory leak (2hr) | <50MB | _____ | _____ |
| CPU usage | <30% | _____ | _____ |

---

## Test Scenario 8: Error Handling & Recovery

### Objective
Verify graceful error handling and system recovery across failure modes.

### User Journey Flow
```
┌──────────────┐
│ Normal State │
└──────┬───────┘
       │
       ▼
┌──────────────────────┐
│ Trigger Error:       │
│ - API Failure        │
│ - Network Loss       │
│ - Invalid Data       │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Error Detected       │
│ - User Notification  │
│ - Fallback UI        │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Recovery Attempt     │
│ - Retry Logic        │
│ - Cache Fallback     │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ System Restored      │
│ - Success Message    │
└──────────────────────┘
```

### Test Steps
1. **API Error Handling**
   - Simulate 500 server error
   - Verify error toast notification
   - Check retry mechanism (3 attempts, exponential backoff)
   - Verify fallback to cached data
   - Test error boundary prevents crash

2. **Network Disconnection**
   - Disconnect network
   - Verify "Offline" banner appears
   - Check offline-first features work (cached data)
   - Reconnect network
   - Verify auto-sync and "Online" message

3. **Invalid Data Handling**
   - Send malformed JSON response
   - Verify parsing error caught
   - Check default/placeholder data shown
   - Verify no console errors logged to production

4. **WebSocket Connection Loss**
   - Kill WebSocket connection
   - Verify reconnection logic (max 5 attempts)
   - Check exponential backoff (1s, 2s, 4s, 8s, 16s)
   - Verify user notified of connection status

5. **Form Validation Errors**
   - Submit empty form
   - Verify inline validation errors
   - Check error messages are clear
   - Verify focus moves to first error

### Success Criteria
- ✅ All errors caught and handled gracefully
- ✅ User notified with clear error messages
- ✅ No application crashes or white screens
- ✅ Retry logic works (max 3 attempts)
- ✅ Fallback to cached data when available
- ✅ Network status indicators accurate

### Edge Cases
- **CORS Error**: Trigger CORS failure, verify user-friendly message
- **Rate Limiting**: Exceed API rate limit, verify 429 handling
- **Timeout**: Simulate 60s timeout, verify abort and retry
- **Partial Failure**: Some API endpoints fail, verify partial UI render
- **Browser Compatibility**: Test error handling on IE11, Safari

### Expected vs Actual Behavior Matrix
| Scenario | Expected | Actual | Pass/Fail |
|----------|----------|--------|-----------|
| API error notification | User notified | _____ | _____ |
| Retry attempts | Max 3 | _____ | _____ |
| WebSocket reconnect | Max 5 | _____ | _____ |
| Offline banner | Shown | _____ | _____ |

---

## Test Scenario 9: Accessibility Compliance (WCAG 2.1 AA)

### Objective
Verify full accessibility compliance for screen readers and keyboard navigation.

### User Journey Flow
```
┌──────────────┐
│ Keyboard Nav │
│ (Tab Order)  │
└──────┬───────┘
       │
       ▼
┌──────────────────────┐
│ Screen Reader Test   │
│ - NVDA/JAWS/VoiceOver│
│ - ARIA Labels        │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Color Contrast       │
│ - WCAG AA (4.5:1)    │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Focus Management     │
│ - Visible Indicators │
│ - Logical Order      │
└──────────────────────┘
```

### Test Steps
1. **Keyboard Navigation**
   - Tab through entire page
   - Verify logical tab order
   - Check all interactive elements accessible
   - Test keyboard shortcuts (if any)
   - Verify skip links ("Skip to main content")
   - Test escape key closes modals/dropdowns

2. **Screen Reader Testing**
   - Test with NVDA (Windows)
   - Test with JAWS (Windows)
   - Test with VoiceOver (macOS)
   - Verify all images have alt text
   - Check ARIA labels on interactive elements
   - Verify form labels associated correctly

3. **Color Contrast**
   - Run axe DevTools audit
   - Verify all text meets WCAG AA (4.5:1)
   - Check interactive elements meet contrast requirements
   - Test in high contrast mode
   - Verify focus indicators visible (3:1 contrast)

4. **Focus Management**
   - Open modal, verify focus trapped
   - Close modal, verify focus returns to trigger
   - Check focus visible on all interactive elements
   - Verify no keyboard traps
   - Test custom focus indicators

### Success Criteria
- ✅ 100% keyboard accessible
- ✅ All images have alt text
- ✅ ARIA labels on all interactive elements
- ✅ Color contrast ≥4.5:1 (WCAG AA)
- ✅ Focus indicators visible (≥3:1)
- ✅ Screen reader announces all content correctly
- ✅ No accessibility violations in axe audit

### Edge Cases
- **Zoom 200%**: Verify layout and readability
- **Windows High Contrast**: Verify theme compatibility
- **Reduced Motion**: Verify animations respect `prefers-reduced-motion`
- **Speech Input**: Test Dragon NaturallySpeaking compatibility
- **Custom Color Schemes**: Test with user-defined colors

### Expected vs Actual Behavior Matrix
| Scenario | Expected | Actual | Pass/Fail |
|----------|----------|--------|-----------|
| Keyboard navigation | 100% | _____ | _____ |
| Color contrast | ≥4.5:1 | _____ | _____ |
| Screen reader | No errors | _____ | _____ |
| axe violations | 0 | _____ | _____ |

---

## Test Scenario 10: Cross-Browser Compatibility

### Objective
Verify consistent functionality across major browsers and versions.

### User Journey Flow
```
┌──────────────┐
│ Chrome Test  │
│ (Latest)     │
└──────┬───────┘
       │
       ▼
┌──────────────────────┐
│ Firefox Test         │
│ (Latest + ESR)       │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Safari Test          │
│ (Latest macOS + iOS) │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Edge Test            │
│ (Latest)             │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Mobile Browsers      │
│ (Chrome/Safari iOS)  │
└──────────────────────┘
```

### Test Steps
1. **Desktop Browsers**
   - **Chrome (latest)**: Full feature test
   - **Firefox (latest + ESR)**: Full feature test
   - **Safari (latest)**: Full feature test
   - **Edge (latest)**: Full feature test
   - For each browser:
     - Verify all features work
     - Check CSS rendering
     - Test JavaScript functionality
     - Verify WebSocket support

2. **Mobile Browsers**
   - **Safari iOS (latest)**: Touch interactions, gestures
   - **Chrome Android (latest)**: Touch interactions, gestures
   - **Samsung Internet**: Basic functionality
   - For each:
     - Verify responsive layout
     - Test touch events
     - Check viewport meta tag
     - Verify no horizontal scroll

3. **Legacy Support**
   - **Chrome (n-2)**: Basic functionality
   - **Firefox ESR**: Basic functionality
   - Verify graceful degradation
   - Check polyfills load correctly

4. **Feature Detection**
   - Verify Modernizr/feature detection works
   - Check fallbacks for unsupported features
   - Test with browser features disabled (JS, cookies)

### Success Criteria
- ✅ 100% feature parity on latest browsers
- ✅ 90% feature parity on n-2 versions
- ✅ Graceful degradation on legacy browsers
- ✅ No browser-specific bugs
- ✅ Consistent visual appearance
- ✅ Mobile browsers fully functional

### Edge Cases
- **Private/Incognito Mode**: Verify functionality with restricted storage
- **Browser Extensions**: Test with ad blockers, privacy extensions
- **Developer Tools Open**: Verify no impact on performance
- **Browser Zoom**: Test at 50%, 100%, 200% zoom
- **Multiple Tabs**: Verify cross-tab state management

### Expected vs Actual Behavior Matrix
| Browser | Feature Parity | Visual Accuracy | Pass/Fail |
|---------|----------------|-----------------|-----------|
| Chrome | 100% | 100% | _____ |
| Firefox | 100% | 100% | _____ |
| Safari | 100% | 100% | _____ |
| Edge | 100% | 100% | _____ |
| Mobile Safari | 100% | 100% | _____ |
| Mobile Chrome | 100% | 100% | _____ |

---

## Test Execution Guidelines

### Pre-requisites
- Local development environment running
- Test data fixtures loaded
- Mock API servers configured
- Browser automation tools setup (Playwright)

### Test Data Reset
Before each test run:
```bash
npm run test:reset-data
npm run test:seed-fixtures
```

### Parallel vs Sequential
- **Parallel**: Scenarios 1-6, 9-10 (independent)
- **Sequential**: Scenarios 7-8 (performance sensitive)

### Test Reporting
- Generate HTML report: `npm run test:e2e:report`
- Screenshot failures automatically
- Video record on failure
- Performance metrics logged to CSV

### Debugging
- Use `test.only()` to run single test
- Set `headless: false` to watch tests
- Use `page.pause()` for breakpoints
- Enable verbose logging: `DEBUG=pw:api npm run test:e2e`

---

## Maintenance & Updates

### When to Update Tests
- ✅ After UI redesign
- ✅ After major feature additions
- ✅ After bug fixes that require new test coverage
- ✅ Quarterly review and update

### Test Data Freshness
- Regenerate fixtures monthly
- Update API mock responses with production changes
- Refresh visual regression baselines after design updates

### Performance Budget Review
- Review budgets quarterly
- Update based on user feedback and analytics
- Adjust thresholds as infrastructure improves
