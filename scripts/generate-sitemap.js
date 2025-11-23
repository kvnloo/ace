#!/usr/bin/env node

/**
 * Sitemap Generator Script
 * Automatically generates sitemap.xml for SEO purposes
 *
 * Usage:
 *   node scripts/generate-sitemap.js [baseUrl] [basePath]
 *
 * Examples:
 *   node scripts/generate-sitemap.js https://kvnloo.github.io /ace
 *   node scripts/generate-sitemap.js https://lawntech-dynamics.com /
 */

import fs from 'fs';
import path from 'path';

// Define routes from the application
const ROUTES = [
  {
    path: '/',
    name: 'Home',
    changeFreq: 'monthly',
    priority: 1.0,
    lastMod: new Date().toISOString().split('T')[0],
  },
  {
    path: '/#facility-demo',
    name: 'Facility Demo',
    changeFreq: 'weekly',
    priority: 0.9,
    lastMod: new Date().toISOString().split('T')[0],
  },
  {
    path: '/#amenities',
    name: 'Amenities',
    changeFreq: 'monthly',
    priority: 0.85,
    lastMod: new Date().toISOString().split('T')[0],
  },
  {
    path: '/#specifications',
    name: 'Specifications',
    changeFreq: 'weekly',
    priority: 0.9,
    lastMod: new Date().toISOString().split('T')[0],
  },
  {
    path: '/#invest',
    name: 'Investment',
    changeFreq: 'weekly',
    priority: 0.95,
    lastMod: new Date().toISOString().split('T')[0],
  },
];

/**
 * Generates XML for a single URL entry
 */
function generateUrlEntry(url, changeFreq, priority, lastMod) {
  return `  <url>
    <loc>${url}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>${changeFreq}</changefreq>
    <priority>${priority}</priority>
    <mobile:mobile/>
  </url>`;
}

/**
 * Generates the complete sitemap XML
 */
function generateSitemap(baseUrl, basePath = '/') {
  // Ensure basePath starts with / and doesn't end with /
  const normalizedBasePath = basePath.startsWith('/') ? basePath : `/${basePath}`;
  const cleanBasePath = normalizedBasePath.endsWith('/') && normalizedBasePath !== '/'
    ? normalizedBasePath.slice(0, -1)
    : normalizedBasePath;

  const urlEntries = ROUTES.map((route) => {
    const fullUrl = `${baseUrl}${cleanBasePath}${route.path}`.replace(/([^:]\/)\/+/g, '$1');
    return generateUrlEntry(fullUrl, route.changeFreq, route.priority, route.lastMod);
  }).join('\n\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0">

${urlEntries}

</urlset>`;
}

/**
 * Writes sitemap to a file
 */
function writeSitemap(content, outputPath = './public/sitemap.xml') {
  const dir = path.dirname(outputPath);

  // Create directory if it doesn't exist
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(outputPath, content, 'utf-8');
  console.log(`✓ Sitemap generated successfully at: ${outputPath}`);
  return outputPath;
}

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2);

  // Get baseUrl and basePath from arguments or use defaults
  const baseUrl = args[0] || 'https://kvnloo.github.io';
  const basePath = args[1] || '/ace';
  const outputPath = args[2] || './public/sitemap.xml';

  console.log('Generating sitemap.xml...');
  console.log(`Base URL: ${baseUrl}`);
  console.log(`Base Path: ${basePath}`);
  console.log(`Routes: ${ROUTES.length}`);

  const sitemapContent = generateSitemap(baseUrl, basePath);
  writeSitemap(sitemapContent, outputPath);

  console.log('\nSitemap URL examples:');
  ROUTES.slice(0, 2).forEach((route) => {
    const fullUrl = `${baseUrl}${basePath}${route.path}`.replace(/([^:]\/)\/+/g, '$1');
    console.log(`  - ${fullUrl}`);
  });
}

// Run the script
main();
