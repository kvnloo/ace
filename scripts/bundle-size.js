#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_PATH = path.join(__dirname, '../dist');
const HISTORY_PATH = path.join(__dirname, '../tests/performance/bundle-history.json');

function getFileInfo(filePath) {
  const stats = fs.statSync(filePath);
  let gzipSize = 0;
  try {
    const gzipContent = execSync(`gzip -c "${filePath}" | wc -c`, { encoding: 'utf8' });
    gzipSize = parseInt(gzipContent.trim());
  } catch (error) {}
  return {
    path: path.relative(DIST_PATH, filePath),
    size: stats.size,
    gzipSize: gzipSize,
    compressionRatio: gzipSize > 0 ? ((1 - gzipSize / stats.size) * 100).toFixed(2) : 0
  };
}

function analyzeDirectory(dir) {
  const files = { js: [], css: [], assets: [], html: [] };
  let totalSize = 0, totalGzipSize = 0;

  function traverse(currentDir) {
    fs.readdirSync(currentDir).forEach(item => {
      const itemPath = path.join(currentDir, item);
      const stats = fs.statSync(itemPath);
      if (stats.isDirectory()) {
        traverse(itemPath);
      } else {
        const fileInfo = getFileInfo(itemPath);
        totalSize += fileInfo.size;
        totalGzipSize += fileInfo.gzipSize;
        if (item.endsWith('.js')) files.js.push(fileInfo);
        else if (item.endsWith('.css')) files.css.push(fileInfo);
        else if (item.endsWith('.html')) files.html.push(fileInfo);
        else files.assets.push(fileInfo);
      }
    });
  }

  traverse(dir);
  Object.keys(files).forEach(type => files[type].sort((a, b) => b.size - a.size));
  return {
    files,
    totalSize,
    totalGzipSize,
    compressionRatio: totalGzipSize > 0 ? ((1 - totalGzipSize / totalSize) * 100).toFixed(2) : 0
  };
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

function printAnalysis(analysis) {
  console.log('\n📦 Bundle Size Analysis\n═══════════════════════════════════════════════════════════\n');
  console.log('📊 Total Size:');
  console.log(`   Raw: ${formatBytes(analysis.totalSize)}`);
  console.log(`   Gzipped: ${formatBytes(analysis.totalGzipSize)}`);
  console.log(`   Compression: ${analysis.compressionRatio}%\n`);

  if (analysis.files.js.length > 0) {
    const jsTotal = analysis.files.js.reduce((sum, f) => sum + f.size, 0);
    const jsGzipTotal = analysis.files.js.reduce((sum, f) => sum + f.gzipSize, 0);
    console.log('📜 JavaScript Files:');
    console.log(`   Total: ${formatBytes(jsTotal)} (${formatBytes(jsGzipTotal)} gzipped)`);
    console.log(`   Files: ${analysis.files.js.length}\n`);
    analysis.files.js.forEach((file, i) => {
      if (i < 10) {
        console.log(`   ${(i + 1).toString().padStart(2)}. ${file.path.padEnd(40)} ${formatBytes(file.size).padStart(12)} (${formatBytes(file.gzipSize).padStart(12)} gzipped)`);
      }
    });
    if (analysis.files.js.length > 10) console.log(`   ... and ${analysis.files.js.length - 10} more files`);
    console.log();
  }

  if (analysis.files.css.length > 0) {
    const cssTotal = analysis.files.css.reduce((sum, f) => sum + f.size, 0);
    const cssGzipTotal = analysis.files.css.reduce((sum, f) => sum + f.gzipSize, 0);
    console.log('🎨 CSS Files:');
    console.log(`   Total: ${formatBytes(cssTotal)} (${formatBytes(cssGzipTotal)} gzipped)`);
    console.log(`   Files: ${analysis.files.css.length}\n`);
    analysis.files.css.forEach((file, i) => {
      console.log(`   ${(i + 1).toString().padStart(2)}. ${file.path.padEnd(40)} ${formatBytes(file.size).padStart(12)} (${formatBytes(file.gzipSize).padStart(12)} gzipped)`);
    });
    console.log();
  }

  if (analysis.files.assets.length > 0) {
    const assetsTotal = analysis.files.assets.reduce((sum, f) => sum + f.size, 0);
    console.log('🖼️  Asset Files:');
    console.log(`   Total: ${formatBytes(assetsTotal)}`);
    console.log(`   Files: ${analysis.files.assets.length}\n`);
    analysis.files.assets.forEach((file, i) => {
      if (i < 5) console.log(`   ${(i + 1).toString().padStart(2)}. ${file.path.padEnd(40)} ${formatBytes(file.size).padStart(12)}`);
    });
    if (analysis.files.assets.length > 5) console.log(`   ... and ${analysis.files.assets.length - 5} more files`);
    console.log();
  }

  console.log('═══════════════════════════════════════════════════════════\n');
}

function saveToHistory(analysis) {
  let history = [];
  if (fs.existsSync(HISTORY_PATH)) history = JSON.parse(fs.readFileSync(HISTORY_PATH, 'utf8'));
  
  const entry = {
    timestamp: new Date().toISOString(),
    totalSize: analysis.totalSize,
    totalGzipSize: analysis.totalGzipSize,
    compressionRatio: parseFloat(analysis.compressionRatio),
    js: {
      count: analysis.files.js.length,
      size: analysis.files.js.reduce((sum, f) => sum + f.size, 0),
      gzipSize: analysis.files.js.reduce((sum, f) => sum + f.gzipSize, 0)
    },
    css: {
      count: analysis.files.css.length,
      size: analysis.files.css.reduce((sum, f) => sum + f.size, 0),
      gzipSize: analysis.files.css.reduce((sum, f) => sum + f.gzipSize, 0)
    },
    assets: {
      count: analysis.files.assets.length,
      size: analysis.files.assets.reduce((sum, f) => sum + f.size, 0)
    }
  };

  history.push(entry);
  if (history.length > 100) history = history.slice(-100);
  const historyDir = path.dirname(HISTORY_PATH);
  if (!fs.existsSync(historyDir)) fs.mkdirSync(historyDir, { recursive: true });
  fs.writeFileSync(HISTORY_PATH, JSON.stringify(history, null, 2));
  return entry;
}

function showTrends() {
  if (!fs.existsSync(HISTORY_PATH)) {
    console.log('⚠️  No history available yet. Run bundle analysis first.\n');
    return;
  }

  const history = JSON.parse(fs.readFileSync(HISTORY_PATH, 'utf8'));
  if (history.length < 2) {
    console.log('⚠️  Need at least 2 history entries to show trends.\n');
    return;
  }

  console.log('\n📈 Bundle Size Trends\n═══════════════════════════════════════════════════════════\n');
  const latest = history[history.length - 1];
  const previous = history[history.length - 2];

  const totalChange = latest.totalSize - previous.totalSize;
  const totalChangePercent = ((totalChange / previous.totalSize) * 100).toFixed(2);
  const totalIcon = totalChange > 0 ? '📈' : totalChange < 0 ? '📉' : '➡️';

  console.log(`${totalIcon} Total Size Change:`);
  console.log(`   Previous: ${formatBytes(previous.totalSize)}`);
  console.log(`   Latest: ${formatBytes(latest.totalSize)}`);
  console.log(`   Change: ${totalChange > 0 ? '+' : ''}${formatBytes(totalChange)} (${totalChangePercent}%)\n`);

  const jsChange = latest.js.size - previous.js.size;
  const jsChangePercent = ((jsChange / previous.js.size) * 100).toFixed(2);
  const jsIcon = jsChange > 0 ? '📈' : jsChange < 0 ? '📉' : '➡️';

  console.log(`${jsIcon} JavaScript Size Change:`);
  console.log(`   Previous: ${formatBytes(previous.js.size)}`);
  console.log(`   Latest: ${formatBytes(latest.js.size)}`);
  console.log(`   Change: ${jsChange > 0 ? '+' : ''}${formatBytes(jsChange)} (${jsChangePercent}%)\n`);

  const cssChange = latest.css.size - previous.css.size;
  const cssChangePercent = previous.css.size > 0 ? ((cssChange / previous.css.size) * 100).toFixed(2) : '0.00';
  const cssIcon = cssChange > 0 ? '📈' : cssChange < 0 ? '📉' : '➡️';

  console.log(`${cssIcon} CSS Size Change:`);
  console.log(`   Previous: ${formatBytes(previous.css.size)}`);
  console.log(`   Latest: ${formatBytes(latest.css.size)}`);
  console.log(`   Change: ${cssChange > 0 ? '+' : ''}${formatBytes(cssChange)} (${cssChangePercent}%)\n`);

  const recent = history.slice(-10);
  console.log('📊 Last 10 Builds:\n');
  console.log('   Date                    Total Size    JS Size       CSS Size');
  console.log('   ─────────────────────────────────────────────────────────────');

  recent.forEach(entry => {
    const date = new Date(entry.timestamp).toLocaleString();
    console.log(`   ${date.padEnd(24)} ${formatBytes(entry.totalSize).padEnd(14)} ${formatBytes(entry.js.size).padEnd(14)} ${formatBytes(entry.css.size)}`);
  });

  console.log('\n═══════════════════════════════════════════════════════════\n');
}

function main() {
  const args = process.argv.slice(2);
  const showTrendsOnly = args.includes('--trends');

  if (showTrendsOnly) {
    showTrends();
    return;
  }

  if (!fs.existsSync(DIST_PATH)) {
    console.error('❌ Dist folder not found. Run "npm run build" first.');
    process.exit(1);
  }

  const analysis = analyzeDirectory(DIST_PATH);
  printAnalysis(analysis);
  const entry = saveToHistory(analysis);
  console.log(`✅ Bundle analysis saved to history (${new Date(entry.timestamp).toLocaleString()})\n`);

  const history = JSON.parse(fs.readFileSync(HISTORY_PATH, 'utf8'));
  if (history.length > 1) showTrends();
}

main();
