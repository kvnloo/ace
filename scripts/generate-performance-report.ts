#!/usr/bin/env node

/**
 * Performance Report Generator
 *
 * Aggregates performance metrics from test runs and generates
 * comprehensive HTML reports with trend analysis.
 */

import * as fs from 'fs';
import * as path from 'path';

interface PerformanceMetric {
  name: string;
  value: number;
  budget: number;
  status: 'pass' | 'fail' | 'warning';
  timestamp: string;
}

interface TestResult {
  title: string;
  file: string;
  metrics: PerformanceMetric[];
  duration: number;
  status: 'passed' | 'failed';
}

interface PerformanceReport {
  generatedAt: string;
  summary: {
    totalTests: number;
    passed: number;
    failed: number;
    averagePerformanceScore: number;
  };
  results: TestResult[];
  trends: {
    metric: string;
    current: number;
    previous: number;
    change: number;
    changePercent: number;
  }[];
  budgets: {
    [key: string]: {
      budget: number;
      current: number;
      status: 'pass' | 'fail' | 'warning';
    };
  };
}

// Performance budgets
const BUDGETS = {
  tti: 3500,
  fcp: 1800,
  lcp: 2500,
  cls: 0.1,
  tbt: 300,
  fid: 100,
  avgFps: 50,
  minFps: 30,
  memoryMB: 200,
};

async function generateReport(): Promise<void> {
  console.log('🔍 Generating performance report...\n');

  const reportsDir = path.join(process.cwd(), 'tests/e2e/reports');
  const resultsPath = path.join(reportsDir, 'results.json');
  const historicalPath = path.join(reportsDir, 'performance-history.json');
  const outputPath = path.join(reportsDir, 'performance-report.html');

  // Check if results exist
  if (!fs.existsSync(resultsPath)) {
    console.error('❌ No test results found. Run tests first.');
    process.exit(1);
  }

  // Load test results
  const rawResults = JSON.parse(fs.readFileSync(resultsPath, 'utf-8'));
  const results = parseTestResults(rawResults);

  // Load historical data
  let historical: any[] = [];
  if (fs.existsSync(historicalPath)) {
    historical = JSON.parse(fs.readFileSync(historicalPath, 'utf-8'));
  }

  // Generate report data
  const report = buildReport(results, historical);

  // Save historical data
  historical.push({
    timestamp: report.generatedAt,
    metrics: extractMetricsForHistory(results),
  });

  // Keep only last 30 runs
  if (historical.length > 30) {
    historical = historical.slice(-30);
  }

  fs.writeFileSync(historicalPath, JSON.stringify(historical, null, 2));

  // Generate HTML report
  const html = generateHTML(report, historical);
  fs.writeFileSync(outputPath, html);

  console.log('✅ Performance report generated successfully!');
  console.log(`📊 Report: ${outputPath}\n`);

  // Print summary
  printSummary(report);
}

function parseTestResults(rawResults: any): TestResult[] {
  const results: TestResult[] = [];

  for (const suite of rawResults.suites || []) {
    for (const spec of suite.specs || []) {
      const result: TestResult = {
        title: spec.title,
        file: suite.file,
        metrics: extractMetrics(spec),
        duration: spec.results?.[0]?.duration || 0,
        status: spec.results?.[0]?.status === 'passed' ? 'passed' : 'failed',
      };

      results.push(result);
    }
  }

  return results;
}

function extractMetrics(spec: any): PerformanceMetric[] {
  const metrics: PerformanceMetric[] = [];

  // Extract from test output/attachments
  // This is a simplified version - actual implementation would parse logs
  const stdout = spec.results?.[0]?.stdout || '';

  const metricPatterns = [
    { name: 'First Contentful Paint', key: 'fcp', pattern: /First Contentful Paint: ([\d.]+)ms/ },
    { name: 'Largest Contentful Paint', key: 'lcp', pattern: /Largest Contentful Paint: ([\d.]+)ms/ },
    { name: 'Time to Interactive', key: 'tti', pattern: /Time to Interactive: ([\d.]+)ms/ },
    { name: 'Cumulative Layout Shift', key: 'cls', pattern: /Cumulative Layout Shift: ([\d.]+)/ },
    { name: 'Average FPS', key: 'avgFps', pattern: /Average FPS: ([\d.]+)/ },
    { name: 'Min FPS', key: 'minFps', pattern: /Min FPS: ([\d.]+)/ },
  ];

  for (const { name, key, pattern } of metricPatterns) {
    const match = stdout.match(pattern);
    if (match) {
      const value = parseFloat(match[1]);
      const budget = (BUDGETS as any)[key] || 0;

      metrics.push({
        name,
        value,
        budget,
        status: determineStatus(value, budget, key),
        timestamp: new Date().toISOString(),
      });
    }
  }

  return metrics;
}

function determineStatus(value: number, budget: number, key: string): 'pass' | 'fail' | 'warning' {
  if (key === 'avgFps' || key === 'minFps') {
    // Higher is better for FPS
    if (value >= budget) return 'pass';
    if (value >= budget * 0.9) return 'warning';
    return 'fail';
  } else {
    // Lower is better for timings
    if (value <= budget) return 'pass';
    if (value <= budget * 1.1) return 'warning';
    return 'fail';
  }
}

function buildReport(results: TestResult[], historical: any[]): PerformanceReport {
  const passed = results.filter(r => r.status === 'passed').length;
  const failed = results.length - passed;

  const allMetrics = results.flatMap(r => r.metrics);
  const passedMetrics = allMetrics.filter(m => m.status === 'pass').length;
  const averagePerformanceScore = allMetrics.length > 0
    ? (passedMetrics / allMetrics.length) * 100
    : 0;

  const trends = calculateTrends(results, historical);
  const budgets = buildBudgetComparison(allMetrics);

  return {
    generatedAt: new Date().toISOString(),
    summary: {
      totalTests: results.length,
      passed,
      failed,
      averagePerformanceScore,
    },
    results,
    trends,
    budgets,
  };
}

function calculateTrends(results: TestResult[], historical: any[]): any[] {
  if (historical.length < 2) return [];

  const current = extractMetricsForHistory(results);
  const previous = historical[historical.length - 1]?.metrics || {};

  const trends: any[] = [];

  for (const key in current) {
    if (previous[key] !== undefined) {
      const currentValue = current[key];
      const previousValue = previous[key];
      const change = currentValue - previousValue;
      const changePercent = (change / previousValue) * 100;

      trends.push({
        metric: key,
        current: currentValue,
        previous: previousValue,
        change,
        changePercent,
      });
    }
  }

  return trends;
}

function extractMetricsForHistory(results: TestResult[]): any {
  const metrics: any = {};

  for (const result of results) {
    for (const metric of result.metrics) {
      const key = metric.name.toLowerCase().replace(/\s+/g, '_');
      metrics[key] = (metrics[key] || 0) + metric.value;
    }
  }

  // Average the values
  const count = results.length || 1;
  for (const key in metrics) {
    metrics[key] /= count;
  }

  return metrics;
}

function buildBudgetComparison(metrics: PerformanceMetric[]): any {
  const budgets: any = {};

  for (const metric of metrics) {
    const key = metric.name.toLowerCase().replace(/\s+/g, '_');

    if (!budgets[key]) {
      budgets[key] = {
        budget: metric.budget,
        current: metric.value,
        status: metric.status,
      };
    }
  }

  return budgets;
}

function generateHTML(report: PerformanceReport, historical: any[]): string {
  const statusColor = (status: string) => {
    switch (status) {
      case 'pass': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'fail': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const trendArrow = (change: number) => {
    if (change > 0) return '▲';
    if (change < 0) return '▼';
    return '—';
  };

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Performance Report - ${new Date(report.generatedAt).toLocaleDateString()}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0f172a;
      color: #e2e8f0;
      padding: 2rem;
      line-height: 1.6;
    }
    .container { max-width: 1200px; margin: 0 auto; }
    h1 { font-size: 2rem; margin-bottom: 0.5rem; color: #f8fafc; }
    .timestamp { color: #94a3b8; margin-bottom: 2rem; }
    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .summary-card {
      background: #1e293b;
      padding: 1.5rem;
      border-radius: 0.5rem;
      border: 1px solid #334155;
    }
    .summary-card h3 { color: #cbd5e1; font-size: 0.875rem; margin-bottom: 0.5rem; }
    .summary-card .value { font-size: 2rem; font-weight: bold; color: #f8fafc; }
    .section { margin-bottom: 2rem; }
    .section h2 { font-size: 1.5rem; margin-bottom: 1rem; color: #f8fafc; }
    table {
      width: 100%;
      background: #1e293b;
      border-radius: 0.5rem;
      border-collapse: collapse;
      overflow: hidden;
    }
    th, td { padding: 0.75rem; text-align: left; }
    th {
      background: #334155;
      color: #cbd5e1;
      font-weight: 600;
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    tr:not(:last-child) { border-bottom: 1px solid #334155; }
    .status-badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }
    .metric-value { font-family: 'Courier New', monospace; }
    .trend-up { color: #ef4444; }
    .trend-down { color: #10b981; }
    .trend-neutral { color: #94a3b8; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🚀 Performance Test Report</h1>
    <div class="timestamp">Generated: ${new Date(report.generatedAt).toLocaleString()}</div>

    <div class="summary">
      <div class="summary-card">
        <h3>Total Tests</h3>
        <div class="value">${report.summary.totalTests}</div>
      </div>
      <div class="summary-card">
        <h3>Passed</h3>
        <div class="value" style="color: #10b981">${report.summary.passed}</div>
      </div>
      <div class="summary-card">
        <h3>Failed</h3>
        <div class="value" style="color: #ef4444">${report.summary.failed}</div>
      </div>
      <div class="summary-card">
        <h3>Performance Score</h3>
        <div class="value">${report.summary.averagePerformanceScore.toFixed(1)}%</div>
      </div>
    </div>

    <div class="section">
      <h2>📊 Performance Budgets</h2>
      <table>
        <thead>
          <tr>
            <th>Metric</th>
            <th>Current</th>
            <th>Budget</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${Object.entries(report.budgets).map(([key, data]: [string, any]) => `
            <tr>
              <td>${key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</td>
              <td class="metric-value">${data.current.toFixed(2)}</td>
              <td class="metric-value">${data.budget.toFixed(2)}</td>
              <td>
                <span class="status-badge" style="background: ${statusColor(data.status)}">
                  ${data.status}
                </span>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    ${report.trends.length > 0 ? `
    <div class="section">
      <h2>📈 Performance Trends</h2>
      <table>
        <thead>
          <tr>
            <th>Metric</th>
            <th>Previous</th>
            <th>Current</th>
            <th>Change</th>
          </tr>
        </thead>
        <tbody>
          ${report.trends.map(trend => `
            <tr>
              <td>${trend.metric.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}</td>
              <td class="metric-value">${trend.previous.toFixed(2)}</td>
              <td class="metric-value">${trend.current.toFixed(2)}</td>
              <td class="${trend.change > 0 ? 'trend-up' : trend.change < 0 ? 'trend-down' : 'trend-neutral'}">
                ${trendArrow(trend.change)} ${Math.abs(trend.changePercent).toFixed(1)}%
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    ` : ''}

    <div class="section">
      <h2>🧪 Test Results</h2>
      <table>
        <thead>
          <tr>
            <th>Test</th>
            <th>Duration</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${report.results.map(result => `
            <tr>
              <td>${result.title}</td>
              <td class="metric-value">${(result.duration / 1000).toFixed(2)}s</td>
              <td>
                <span class="status-badge" style="background: ${result.status === 'passed' ? '#10b981' : '#ef4444'}">
                  ${result.status}
                </span>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  </div>
</body>
</html>
  `.trim();
}

function printSummary(report: PerformanceReport): void {
  console.log('📊 Summary:');
  console.log(`   Total Tests: ${report.summary.totalTests}`);
  console.log(`   Passed: ${report.summary.passed}`);
  console.log(`   Failed: ${report.summary.failed}`);
  console.log(`   Performance Score: ${report.summary.averagePerformanceScore.toFixed(1)}%\n`);

  if (report.trends.length > 0) {
    console.log('📈 Top Trends:');
    report.trends.slice(0, 5).forEach(trend => {
      const arrow = trend.change > 0 ? '▲' : trend.change < 0 ? '▼' : '—';
      console.log(`   ${arrow} ${trend.metric}: ${trend.changePercent >= 0 ? '+' : ''}${trend.changePercent.toFixed(1)}%`);
    });
  }
}

// Run the generator
generateReport().catch(error => {
  console.error('❌ Error generating report:', error);
  process.exit(1);
});
