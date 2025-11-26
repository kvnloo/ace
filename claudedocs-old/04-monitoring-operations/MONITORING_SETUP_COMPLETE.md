# Continuous Error Monitoring - Setup Complete

Background monitoring agent successfully configured for continuous error detection during testing.

## What Was Created

### 1. Continuous Monitor Script
**File**: `scripts/continuous-monitor.sh`

Background daemon that runs indefinitely checking for browser errors every 5 seconds.

**Features**:
- Runs as background process with PID management
- Configurable check interval (default: 5s)
- Automatic error logging to multiple formats
- Graceful start/stop/restart controls
- Session statistics tracking
- No interference with manual testing

### 2. Status Dashboard Script
**File**: `scripts/monitor-status.sh`

Real-time dashboard for viewing monitoring data and analytics.

**Features**:
- Session summary with error statistics
- Recent checks overview (last 10 by default)
- Detailed error information
- Error pattern analysis
- Live watch mode (auto-refresh every 2s)
- JSON export for automation

### 3. NPM Scripts
**File**: `package.json` (updated)

Added convenient npm commands:
```json
{
  "monitor:start": "Start background monitoring",
  "monitor:stop": "Stop monitoring",
  "monitor:status": "View status dashboard",
  "monitor:watch": "Live dashboard (auto-refresh)",
  "monitor:restart": "Restart monitoring",
  "monitor:errors": "Show errors only"
}
```

### 4. Documentation
**Files**: `claudedocs/monitoring/`

- `README.md` - Complete system overview
- `quick_start_guide.md` - Get started in 60 seconds
- `continuous_monitoring.md` - Comprehensive reference
- `monitoring_architecture.md` - Visual system architecture

## Quick Start

### Start Monitoring
```bash
npm run monitor:start
```

Output:
```
╔════════════════════════════════════════════════════════════════╗
║           Continuous Error Monitoring Agent                   ║
╚════════════════════════════════════════════════════════════════╝

[SUCCESS] Monitoring started successfully (PID: 12345)

Monitor is now running in the background
```

The monitor now runs in the background, checking every 5 seconds.

### Check Status
```bash
npm run monitor:status
```

Shows:
- Monitoring active/inactive status
- Session statistics (total checks, errors, warnings)
- Recent checks with timestamps
- Error details and patterns

### Watch Live (Optional)
```bash
npm run monitor:watch
```

Auto-refreshing dashboard (updates every 2s). Press Ctrl+C to exit.

### Stop Monitoring
```bash
npm run monitor:stop
```

## Usage Workflow

### Typical Testing Session
```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Start monitoring
npm run monitor:start

# Use the website in your browser to test...
# Monitor runs silently in background

# Check for errors periodically
npm run monitor:status

# When done testing
npm run monitor:stop
```

### Live Monitoring Setup
```bash
# Terminal 1: Dev server
npm run dev

# Terminal 2: Background monitoring
npm run monitor:start

# Terminal 3: Live dashboard
npm run monitor:watch

# Test in browser, errors appear instantly in Terminal 3
```

## What Gets Monitored

The system detects:
1. **Console Errors** - `console.error()` calls
2. **Console Warnings** - `console.warn()` calls
3. **Page Errors** - Uncaught JavaScript exceptions
4. **Request Failures** - Failed HTTP requests
5. **Script Errors** - Runtime errors

## Where Data Is Stored

### logs/continuous-monitor.log
Human-readable activity log with timestamps:
```
[2025-01-21 14:23:15] [INFO] Starting continuous monitoring...
[2025-01-21 14:23:20] [SUCCESS] No errors detected
[2025-01-21 14:23:25] [ERROR] Found 2 error(s)
```

View live:
```bash
tail -f logs/continuous-monitor.log
```

### logs/error-stream.json
Structured JSON data for analysis:
```json
{
  "session_start": "2025-01-21 14:23:15",
  "url": "http://localhost:5173",
  "checks": [
    {
      "check": 1,
      "timestamp": "2025-01-21 14:23:20",
      "totalErrors": 0,
      "totalWarnings": 0,
      "errors": [],
      "warnings": []
    }
  ]
}
```

Query with jq:
```bash
# Total errors
jq '[.checks[].totalErrors] | add' logs/error-stream.json

# Unique error messages
jq '.checks[].errors[].text' logs/error-stream.json | sort -u

# Checks with errors
jq '.checks[] | select(.totalErrors > 0)' logs/error-stream.json
```

## Configuration

### Default Settings
```
URL:              http://localhost:5173
Check Interval:   5 seconds
Browser Mode:     Headless (invisible)
Timeout:          10 seconds per check
Wait After Load:  2 seconds
```

### Customization

Monitor different URL:
```bash
MONITOR_URL=http://localhost:3000 npm run monitor:start
```

Change check interval (10 seconds):
```bash
MONITOR_INTERVAL=10 npm run monitor:start
```

See browser window (debugging):
```bash
MONITOR_HEADLESS=false npm run monitor:start
```

Combine multiple settings:
```bash
MONITOR_URL=http://localhost:8080 \
MONITOR_INTERVAL=15 \
MONITOR_HEADLESS=false \
npm run monitor:start
```

## Available Commands

```bash
# Start monitoring in background
npm run monitor:start

# Stop monitoring
npm run monitor:stop

# Restart monitoring
npm run monitor:restart

# View status dashboard
npm run monitor:status

# Live dashboard (auto-refresh)
npm run monitor:watch

# Show only errors
npm run monitor:errors

# View live log stream
tail -f logs/continuous-monitor.log

# View error patterns
./scripts/monitor-status.sh --json | jq '.checks[].errors[].text' | sort | uniq -c
```

## Dashboard Overview

When you run `npm run monitor:status`:

```
╔════════════════════════════════════════════════════════════════╗
║              Error Monitoring Dashboard                       ║
╚════════════════════════════════════════════════════════════════╝

● Monitoring Active (PID: 12345, Uptime: 00:15:23)

Session Summary
────────────────────────────────────────────────────────────────
Started:           2025-01-21 14:23:15
URL:               http://localhost:5173
Total Checks:      184
Checks w/ Errors:  3
Total Errors:      5
Total Warnings:    2
Error Rate:        1.6%

Recent Checks (last 10)
────────────────────────────────────────────────────────────────
✓ Check #184 2025-01-21 14:38:38 - No issues
✓ Check #183 2025-01-21 14:38:33 - No issues
✗ Check #182 2025-01-21 14:38:28 - 1 errors, 0 warnings
✓ Check #181 2025-01-21 14:38:23 - No issues

Recent Error Details
────────────────────────────────────────────────────────────────
Check #182 (2025-01-21 14:38:28):
  [error] Uncaught TypeError: Cannot read property 'x' of undefined

Error Patterns (unique error messages)
────────────────────────────────────────────────────────────────
×3  Uncaught TypeError: Cannot read property 'x' of undefined
×2  Warning: Invalid prop type
```

## Troubleshooting

### Monitor won't start
```bash
# Check if already running
npm run monitor:status

# Check logs for errors
tail logs/continuous-monitor.log

# Ensure Playwright installed
npx playwright install chromium
```

### No errors showing
```bash
# Start with visible browser to debug
MONITOR_HEADLESS=false npm run monitor:start

# Watch logs in real-time
tail -f logs/continuous-monitor.log
```

### Monitor stops unexpectedly
```bash
# Check crash logs
tail -50 logs/continuous-monitor.log

# Verify dev server is running
curl http://localhost:5173

# Restart monitoring
npm run monitor:restart
```

### High CPU usage
```bash
# Increase interval to reduce frequency
npm run monitor:stop
MONITOR_INTERVAL=30 npm run monitor:start
```

## Performance Impact

| Metric | Value |
|--------|-------|
| Memory Usage | ~150MB (per browser instance) |
| CPU (Active) | ~5-10% during checks |
| CPU (Idle) | ~0% between checks |
| Disk per Check | ~10KB logged data |

## Best Practices

1. **Start monitoring at beginning of testing session**
2. **Check status periodically, not continuously**
3. **Stop monitoring when done to free resources**
4. **Archive error-stream.json for historical analysis**
5. **Use longer intervals (15-30s) for background monitoring**
6. **Review error patterns, not just counts**

## Advanced Features

### Error Pattern Analysis
```bash
# Find most common errors
jq -r '.checks[].errors[].text' logs/error-stream.json | \
  sort | uniq -c | sort -rn | head -10
```

### Custom Alerts
```bash
# Watch for specific errors
tail -f logs/continuous-monitor.log | \
  grep --line-buffered "TypeError" | \
  while read line; do
    notify-send "Error Alert" "$line"
  done
```

### Session Comparison
```bash
# Save session
cp logs/error-stream.json reports/session-$(date +%Y%m%d).json

# Compare with previous
diff <(jq '.checks[].errors[].text' reports/session-20250120.json | sort -u) \
     <(jq '.checks[].errors[].text' reports/session-20250121.json | sort -u)
```

## System Architecture

```
┌─────────────────────────────────────────────────────┐
│              Continuous Monitor                     │
│  ┌───────────────────────────────────────────────┐ │
│  │  Background Process (runs indefinitely)       │ │
│  │  ├─ Check browser console every 5s            │ │
│  │  ├─ Capture errors, warnings, page errors     │ │
│  │  ├─ Log to continuous-monitor.log             │ │
│  │  └─ Stream JSON to error-stream.json          │ │
│  └───────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│                  Log Files                          │
│  - logs/continuous-monitor.log (human-readable)     │
│  - logs/error-stream.json (structured data)         │
└─────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│              Status Dashboard                       │
│  ./scripts/monitor-status.sh                        │
│  ├─ Session summary                                 │
│  ├─ Recent checks                                   │
│  ├─ Error details                                   │
│  └─ Pattern analysis                                │
└─────────────────────────────────────────────────────┘
```

## Example Session

```bash
# 1. Start dev server
npm run dev
# ✓ Vite dev server running on http://localhost:5173

# 2. Start monitoring
npm run monitor:start
# ✓ Monitoring started (PID: 12345)

# 3. Test your website in browser
# (Monitor runs silently, checking every 5s)

# 4. Check for errors after 5 minutes
npm run monitor:status
# Shows: 60 checks, 0 errors ✓

# 5. Make a change that introduces error
# (Edit code, trigger error in browser)

# 6. Check status again
npm run monitor:status
# Shows: 65 checks, 2 errors ✗

# 7. View error details
npm run monitor:errors
# Shows: "Uncaught TypeError: Cannot read property..."

# 8. Fix the error
# (Update code)

# 9. Verify fix
npm run monitor:status
# Shows: No new errors since fix ✓

# 10. Stop monitoring
npm run monitor:stop
# Session Summary: 120 checks, 2 total errors
```

## Documentation

Complete documentation available in:
- `claudedocs/monitoring/README.md` - Full system overview
- `claudedocs/monitoring/quick_start_guide.md` - Quick start
- `claudedocs/monitoring/continuous_monitoring.md` - Complete reference
- `claudedocs/monitoring/monitoring_architecture.md` - Architecture

## Next Steps

You now have a production-ready continuous error monitoring system!

**Recommended workflow**:
1. Start monitoring: `npm run monitor:start`
2. Test your website normally
3. Check for errors: `npm run monitor:status`
4. Fix any issues found
5. Stop monitoring: `npm run monitor:stop`

**For detailed usage**, see: `claudedocs/monitoring/quick_start_guide.md`

**For troubleshooting**, see: `claudedocs/monitoring/continuous_monitoring.md#troubleshooting`

---

**Setup completed successfully!** The monitoring agent is ready to use.
