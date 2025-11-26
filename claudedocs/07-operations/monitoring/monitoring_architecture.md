# Monitoring System Architecture

Visual overview of the continuous error monitoring system.

## System Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER INTERACTION                            │
└─────────────────────────────────────────────────────────────────────┘
                                │
                    ┌───────────┴───────────┐
                    │                       │
            ┌───────▼────────┐    ┌────────▼──────────┐
            │  npm run       │    │  Manual Testing   │
            │  monitor:start │    │  in Browser       │
            └───────┬────────┘    └────────┬──────────┘
                    │                      │
                    │                      │
┌───────────────────▼──────────────────────▼───────────────────────────┐
│                    CONTINUOUS MONITOR AGENT                          │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  Background Process (PID in logs/monitor.pid)                  │ │
│  │  ┌──────────────────────────────────────────────────────────┐ │ │
│  │  │  Loop (every MONITOR_INTERVAL seconds):                   │ │ │
│  │  │  1. Launch Playwright browser (chromium)                  │ │ │
│  │  │  2. Navigate to MONITOR_URL                               │ │ │
│  │  │  3. Capture console messages                              │ │ │
│  │  │  4. Wait for async operations                             │ │ │
│  │  │  5. Close browser                                          │ │ │
│  │  │  6. Log results                                            │ │ │
│  │  │  7. Sleep until next check                                │ │ │
│  │  └──────────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────┬───────────────────────────────────────┘
                               │
                 ┌─────────────┴─────────────┐
                 │                           │
        ┌────────▼─────────┐       ┌────────▼──────────┐
        │  ERROR CHECKER   │       │  EVENT LISTENERS  │
        │  (Node.js)       │       │  (Playwright)     │
        └────────┬─────────┘       └────────┬──────────┘
                 │                           │
                 └─────────────┬─────────────┘
                               │
                  ┌────────────▼────────────┐
                  │   ERROR CLASSIFICATION  │
                  │  - Console errors       │
                  │  - Console warnings     │
                  │  - Page errors          │
                  │  - Request failures     │
                  └────────────┬────────────┘
                               │
                 ┌─────────────┴─────────────┐
                 │                           │
        ┌────────▼─────────┐       ┌────────▼──────────┐
        │  STRUCTURED LOG  │       │  ACTIVITY LOG     │
        │  error-stream    │       │  continuous-      │
        │  .json           │       │  monitor.log      │
        └────────┬─────────┘       └────────┬──────────┘
                 │                           │
                 └─────────────┬─────────────┘
                               │
                    ┌──────────▼──────────┐
                    │  STATUS DASHBOARD   │
                    │  (monitor-status)   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │  USER INTERFACE     │
                    │  - Summary stats    │
                    │  - Recent checks    │
                    │  - Error details    │
                    │  - Pattern analysis │
                    └─────────────────────┘
```

## Component Interaction

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   Scripts    │         │   Monitor    │         │     Logs     │
│              │         │   Process    │         │              │
│  continuous- │  fork   │              │  write  │  continuous- │
│  monitor.sh  ├────────►│   Running    ├────────►│  monitor.log │
│              │         │   in         │         │              │
│  monitor-    │         │   Background │         │  error-      │
│  status.sh   │  read   │              │  write  │  stream.json │
│              │◄────────┤              ├────────►│              │
└──────────────┘         └──────┬───────┘         └──────────────┘
                                │
                                │ controls
                                │
                         ┌──────▼───────┐
                         │              │
                         │  check-      │
                         │  console-    │
                         │  errors.js   │
                         │              │
                         └──────┬───────┘
                                │
                                │ uses
                                │
                         ┌──────▼───────┐
                         │              │
                         │  Playwright  │
                         │  Chromium    │
                         │              │
                         └──────┬───────┘
                                │
                                │ navigates to
                                │
                         ┌──────▼───────┐
                         │              │
                         │  Your Web    │
                         │  Application │
                         │              │
                         └──────────────┘
```

## Data Flow

```
Browser Events → Playwright Listeners → Node.js Script → Log Files → Dashboard

┌─────────────┐
│  Browser    │
│  console.   │
│  error()    │
└──────┬──────┘
       │
       ▼
┌─────────────┐    ┌──────────────┐    ┌──────────────┐
│ Playwright  │    │  check-      │    │  Structured  │
│ page.on(    │───►│  console-    │───►│  Error Data  │
│ 'console')  │    │  errors.js   │    │  (JSON)      │
└─────────────┘    └──────────────┘    └──────┬───────┘
                                              │
┌─────────────┐    ┌──────────────┐          │
│ Playwright  │    │  check-      │          │
│ page.on(    │───►│  console-    │──────────┤
│ 'pageerror')│    │  errors.js   │          │
└─────────────┘    └──────────────┘          │
                                              │
┌─────────────┐    ┌──────────────┐          │
│ Playwright  │    │  check-      │          │
│ page.on(    │───►│  console-    │──────────┤
│ 'request-   │    │  errors.js   │          │
│  failed')   │    │              │          │
└─────────────┘    └──────────────┘          │
                                              ▼
                                   ┌──────────────────┐
                                   │  continuous-     │
                                   │  monitor.sh      │
                                   │  aggregates      │
                                   └────────┬─────────┘
                                            │
                          ┌─────────────────┴─────────────────┐
                          │                                   │
                   ┌──────▼──────────┐            ┌──────────▼────────┐
                   │  error-stream   │            │  continuous-      │
                   │  .json          │            │  monitor.log      │
                   │  (machine)      │            │  (human)          │
                   └──────┬──────────┘            └──────────┬────────┘
                          │                                   │
                          └─────────────────┬─────────────────┘
                                            │
                                     ┌──────▼─────────┐
                                     │  monitor-      │
                                     │  status.sh     │
                                     │  processes     │
                                     └──────┬─────────┘
                                            │
                                     ┌──────▼─────────┐
                                     │  Dashboard     │
                                     │  Display       │
                                     └────────────────┘
```

## Process Lifecycle

```
START
  │
  ├─► Check if already running (PID file)
  │   ├─ Yes → Exit with warning
  │   └─ No  → Continue
  │
  ├─► Create logs directory
  │
  ├─► Fork background process
  │   ├─► Save PID to file
  │   └─► Detach from terminal (nohup)
  │
  ├─► Background Process Loop:
  │   │
  │   ├─► Increment check counter
  │   │
  │   ├─► Log check start
  │   │
  │   ├─► Execute check-console-errors.js
  │   │   ├─► Launch Playwright
  │   │   ├─► Navigate to URL
  │   │   ├─► Capture events
  │   │   ├─► Wait for async
  │   │   ├─► Close browser
  │   │   └─► Return results
  │   │
  │   ├─► Parse results
  │   │
  │   ├─► Update error-stream.json
  │   │
  │   ├─► Log to continuous-monitor.log
  │   │
  │   ├─► Sleep MONITOR_INTERVAL seconds
  │   │
  │   └─► Loop (continue indefinitely)
  │
STOP (when user runs monitor:stop)
  │
  ├─► Read PID from file
  │
  ├─► Send SIGTERM to process
  │
  ├─► Wait for graceful shutdown (max 10s)
  │
  ├─► Force kill if needed (SIGKILL)
  │
  ├─► Remove PID file
  │
  ├─► Display session summary
  │
  └─► END
```

## Error Classification Tree

```
Browser Event
    │
    ├─► console.error()
    │   ├─ Type: "error"
    │   ├─ Log to: errors array
    │   └─ Increment: totalErrors
    │
    ├─► console.warn()
    │   ├─ Type: "warning"
    │   ├─ Log to: warnings array
    │   └─ Increment: totalWarnings
    │
    ├─► page.on('pageerror')
    │   ├─ Type: "pageerror"
    │   ├─ Capture: error.message + stack
    │   ├─ Log to: errors array
    │   └─ Increment: totalErrors
    │
    ├─► page.on('requestfailed')
    │   ├─ Type: "request_failed"
    │   ├─ Capture: URL + error text
    │   ├─ Log to: errors array
    │   └─ Increment: totalErrors
    │
    └─► console.log/info/debug
        ├─ Type: "log"/"info"/"debug"
        ├─ Log to: logs array (if verbose)
        └─ No increment
```

## File Structure

```
project-root/
├── scripts/
│   ├── continuous-monitor.sh      # Main monitoring agent
│   ├── monitor-status.sh          # Status dashboard
│   └── check-console-errors.js    # Error checker core
│
├── logs/                          # Auto-created
│   ├── monitor.pid                # Process ID file
│   ├── continuous-monitor.log     # Human-readable log
│   └── error-stream.json          # Structured data
│
└── claudedocs/monitoring/
    ├── README.md                  # Overview
    ├── quick_start_guide.md       # Quick start
    ├── continuous_monitoring.md   # Full documentation
    └── monitoring_architecture.md # This file
```

## State Machine

```
┌─────────────┐
│   STOPPED   │◄──────────────────────┐
└──────┬──────┘                       │
       │ start                        │
       │                              │ stop
       ▼                              │
┌─────────────┐                       │
│  STARTING   │                       │
└──────┬──────┘                       │
       │ fork success                 │
       │                              │
       ▼                              │
┌─────────────┐                       │
│   RUNNING   │───────────────────────┘
│  (Active)   │
└──────┬──────┘
       │ error/crash
       │
       ▼
┌─────────────┐
│   STOPPED   │
│  (Failed)   │
└─────────────┘

Status Checks:
- PID file exists? → Check process
- Process running? → RUNNING
- No PID file?     → STOPPED
- PID but no proc? → STOPPED (clean up)
```

## Monitoring Modes Comparison

```
┌───────────────────────────────────────────────────────────────────┐
│                        MONITORING MODES                           │
├───────────────────┬───────────────────┬───────────────────────────┤
│   ONE-TIME CHECK  │  CONTINUOUS MODE  │    CI/CD INTEGRATION     │
├───────────────────┼───────────────────┼───────────────────────────┤
│ Duration:         │ Duration:         │ Duration:                │
│   Single run      │   Indefinite      │   Per build              │
│                   │                   │                          │
│ Execution:        │ Execution:        │ Execution:               │
│   Manual/script   │   Background      │   Automated              │
│                   │                   │                          │
│ Use Case:         │ Use Case:         │ Use Case:                │
│   Quick check     │   Testing session │   Build validation       │
│   Pre-commit      │   Development     │   Deployment gate        │
│   Debug           │   QA testing      │   Regression check       │
│                   │                   │                          │
│ Resource:         │ Resource:         │ Resource:                │
│   Low (temp)      │   Medium (24/7)   │   Low (temp)             │
│                   │                   │                          │
│ Output:           │ Output:           │ Output:                  │
│   Console/JSON    │   Logs + JSON     │   Build logs             │
│                   │                   │                          │
│ History:          │ History:          │ History:                 │
│   Single snapshot │   Time-series     │   Per-build archive      │
└───────────────────┴───────────────────┴───────────────────────────┘
```

## Scalability Architecture

```
Single URL Monitoring (Current):
┌─────────────────────┐
│  Continuous Monitor │
│  → URL 1            │
└─────────────────────┘

Multi-URL Monitoring (Future):
┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐
│  Monitor Instance 1 │     │  Monitor Instance 2 │     │  Monitor Instance 3 │
│  → URL 1            │     │  → URL 2            │     │  → URL 3            │
│  PID: monitor-1.pid │     │  PID: monitor-2.pid │     │  PID: monitor-3.pid │
│  Log: stream-1.json │     │  Log: stream-2.json │     │  Log: stream-3.json │
└─────────────────────┘     └─────────────────────┘     └─────────────────────┘
          │                           │                           │
          └───────────────────────────┴───────────────────────────┘
                                      │
                          ┌───────────▼──────────┐
                          │  Aggregator Service  │
                          │  (Future Enhancement)│
                          └──────────────────────┘
```

## Performance Metrics

```
Resource Utilization Over Time:

CPU %
  15│                    ╭╮
  10│          ╭╮       │││    ╭╮
   5│   ╭╮    │││  ╭╮  │││   │││
   0│───┴┴────┴┴┴──┴┴──┴┴┴───┴┴┴───────
     0   5   10  15  20  25  30  35  (seconds)
     └── Check Execution ──┘
         └── Idle Period ──────────┘

Memory MB
 200│  ┌────────────────────────────┐
 150│  │  Browser Instance          │
 100│  │                            │
  50│  │                            │
   0│──┴────────────────────────────┴───
     Launch → Check → Close → Idle

Check Duration:
  Browser Launch:     ~500ms
  Page Navigation:    ~1000-2000ms
  Event Capture:      ~2000ms
  Browser Close:      ~200ms
  Processing:         ~100ms
  ────────────────────────────
  Total per Check:    ~4-5 seconds
```

## Error Flow Visualization

```
Browser → Playwright → Node.js → JSON → Dashboard

User Action
    │
    ▼
┌──────────────┐
│  JS Error    │
│  Triggered   │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  console.    │
│  error()     │
└──────┬───────┘
       │
       ▼ (captured by)
┌──────────────┐
│  Playwright  │
│  Listener    │
└──────┬───────┘
       │
       ▼ (parsed by)
┌──────────────┐
│  Error       │
│  Checker     │
│  Script      │
└──────┬───────┘
       │
       ▼ (stored in)
┌──────────────┐
│  JSON        │
│  Structure   │
│  {           │
│   type,      │
│   text,      │
│   timestamp  │
│  }           │
└──────┬───────┘
       │
       ▼ (displayed in)
┌──────────────┐
│  Dashboard   │
│  [ERROR]     │
│  Message     │
└──────────────┘
```

## Integration Points

```
┌─────────────────────────────────────────────────────────────┐
│                    External Integrations                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌────────────┐       ┌────────────┐      ┌────────────┐  │
│  │   Slack    │       │  Discord   │      │   Email    │  │
│  │  Webhooks  │       │  Webhooks  │      │   SMTP     │  │
│  └─────▲──────┘       └─────▲──────┘      └─────▲──────┘  │
│        │                    │                    │         │
│        └────────────────────┴────────────────────┘         │
│                             │                              │
│                    ┌────────▼─────────┐                    │
│                    │  Alert Service   │                    │
│                    │  (Future)        │                    │
│                    └────────┬─────────┘                    │
│                             │                              │
└─────────────────────────────┼──────────────────────────────┘
                              │
                    ┌─────────▼──────────┐
                    │  Continuous        │
                    │  Monitor           │
                    └─────────┬──────────┘
                              │
┌─────────────────────────────┼──────────────────────────────┐
│                    Monitoring Tools                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌────────────┐       ┌────────────┐      ┌────────────┐  │
│  │ Prometheus │       │  Grafana   │      │    ELK     │  │
│  │  Metrics   │       │ Dashboard  │      │   Stack    │  │
│  └─────▲──────┘       └─────▲──────┘      └─────▲──────┘  │
│        │                    │                    │         │
│        └────────────────────┴────────────────────┘         │
│                             │                              │
│                    ┌────────▼─────────┐                    │
│                    │  Metrics Export  │                    │
│                    │  (Future)        │                    │
│                    └──────────────────┘                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

This architecture provides a scalable, maintainable foundation for continuous error monitoring with clear separation of concerns and extensibility for future enhancements.
