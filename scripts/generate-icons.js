#!/usr/bin/env node

/**
 * PWA Icon Generator Script
 *
 * This script generates all required PWA icons from an SVG template.
 * It creates both standard and maskable icons in all required sizes.
 *
 * Requirements:
 *   npm install sharp (for PNG generation from SVG)
 *
 * Usage:
 *   node scripts/generate-icons.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// SVG icon template - Tennis ball with LawnTech branding
const iconSVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="512" height="512" fill="#2C5F2D" rx="96"/>

  <!-- Tennis ball -->
  <circle cx="256" cy="256" r="140" fill="#DFFF4F"/>

  <!-- Ball seam curves -->
  <path d="M 180 180 Q 220 220 256 256 Q 292 292 332 332"
        stroke="#2C5F2D"
        stroke-width="8"
        fill="none"
        stroke-linecap="round"/>
  <path d="M 332 180 Q 292 220 256 256 Q 220 292 180 332"
        stroke="#2C5F2D"
        stroke-width="8"
        fill="none"
        stroke-linecap="round"/>

  <!-- LT monogram -->
  <text x="256" y="440"
        font-family="Arial, sans-serif"
        font-size="48"
        font-weight="bold"
        fill="#DFFF4F"
        text-anchor="middle">LT</text>
</svg>`;

// Maskable icon SVG (with safe zone padding)
const maskableIconSVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <!-- Background (extends to edges for maskable) -->
  <rect width="512" height="512" fill="#2C5F2D"/>

  <!-- Tennis ball (centered in safe zone) -->
  <circle cx="256" cy="256" r="120" fill="#DFFF4F"/>

  <!-- Ball seam curves -->
  <path d="M 190 190 Q 220 220 256 256 Q 292 292 322 322"
        stroke="#2C5F2D"
        stroke-width="7"
        fill="none"
        stroke-linecap="round"/>
  <path d="M 322 190 Q 292 220 256 256 Q 220 292 190 322"
        stroke="#2C5F2D"
        stroke-width="7"
        fill="none"
        stroke-linecap="round"/>

  <!-- LT monogram -->
  <text x="256" y="400"
        font-family="Arial, sans-serif"
        font-size="40"
        font-weight="bold"
        fill="#DFFF4F"
        text-anchor="middle">LT</text>
</svg>`;

// Shortcut icons
const shortcut3DSVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="96" height="96" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
  <rect width="96" height="96" fill="#2C5F2D" rx="16"/>
  <text x="48" y="65"
        font-family="Arial, sans-serif"
        font-size="40"
        font-weight="bold"
        fill="#DFFF4F"
        text-anchor="middle">3D</text>
</svg>`;

const shortcutChatSVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="96" height="96" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
  <rect width="96" height="96" fill="#2C5F2D" rx="16"/>
  <circle cx="48" cy="40" r="20" fill="none" stroke="#DFFF4F" stroke-width="4"/>
  <path d="M 30 60 L 35 70 L 40 60 Z" fill="#DFFF4F"/>
  <circle cx="42" cy="38" r="2" fill="#DFFF4F"/>
  <circle cx="48" cy="38" r="2" fill="#DFFF4F"/>
  <circle cx="54" cy="38" r="2" fill="#DFFF4F"/>
</svg>`;

// Define all icon sizes and types
const icons = [
  { size: 72, name: 'icon-72x72.png', svg: iconSVG },
  { size: 96, name: 'icon-96x96.png', svg: iconSVG },
  { size: 128, name: 'icon-128x128.png', svg: iconSVG },
  { size: 144, name: 'icon-144x144.png', svg: iconSVG },
  { size: 152, name: 'icon-152x152.png', svg: iconSVG },
  { size: 192, name: 'icon-192x192.png', svg: iconSVG },
  { size: 384, name: 'icon-384x384.png', svg: iconSVG },
  { size: 512, name: 'icon-512x512.png', svg: iconSVG },
  { size: 192, name: 'icon-192x192-maskable.png', svg: maskableIconSVG },
  { size: 512, name: 'icon-512x512-maskable.png', svg: maskableIconSVG },
  { size: 96, name: 'shortcut-3d.png', svg: shortcut3DSVG },
  { size: 96, name: 'shortcut-chat.png', svg: shortcutChatSVG }
];

async function generateIcons() {
  // Check if sharp is available
  let sharp;
  try {
    const sharpModule = await import('sharp');
    sharp = sharpModule.default;
  } catch (err) {
    console.log('⚠️  Sharp not found. Installing is optional.');
    console.log('   To generate PNG icons automatically, run: npm install --save-dev sharp');
    console.log('');
    console.log('📝 Creating SVG placeholders instead...\n');
  }

  const iconsDir = path.join(__dirname, '../public/icons');

  // Ensure icons directory exists
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }

  if (sharp) {
    // Generate PNG icons using sharp
    console.log('🎨 Generating PWA icons with sharp...\n');

    for (const icon of icons) {
      const outputPath = path.join(iconsDir, icon.name);

      try {
        await sharp(Buffer.from(icon.svg))
          .resize(icon.size, icon.size)
          .png()
          .toFile(outputPath);

        console.log(`✅ Generated ${icon.name} (${icon.size}x${icon.size})`);
      } catch (err) {
        console.error(`❌ Failed to generate ${icon.name}:`, err.message);
      }
    }
  } else {
    // Create SVG placeholders
    console.log('Creating SVG placeholders...\n');

    for (const icon of icons) {
      const svgPath = path.join(iconsDir, icon.name.replace('.png', '.svg'));
      fs.writeFileSync(svgPath, icon.svg);
      console.log(`✅ Created ${icon.name.replace('.png', '.svg')}`);
    }

    console.log('\n📋 Next Steps:');
    console.log('   1. Install sharp: npm install --save-dev sharp');
    console.log('   2. Run this script again to generate PNG icons');
    console.log('   3. Or use an online tool to convert the SVG files to PNG');
    console.log('   4. Recommended: https://realfavicongenerator.net/');
  }

  console.log('\n✨ Icon generation complete!');
}

// Create placeholder screenshots
function createPlaceholderScreenshots() {
  const screenshotsDir = path.join(__dirname, '../public/screenshots');

  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const desktopScreenshot = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1920" height="1080" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
  <rect width="1920" height="1080" fill="#0f172a"/>
  <text x="960" y="540"
        font-family="Arial, sans-serif"
        font-size="72"
        font-weight="bold"
        fill="#DFFF4F"
        text-anchor="middle">LawnTech Dynamics</text>
  <text x="960" y="640"
        font-family="Arial, sans-serif"
        font-size="36"
        fill="#DFFF4F"
        text-anchor="middle"
        opacity="0.8">3D Facility View - Desktop</text>
</svg>`;

  const mobileScreenshot = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="750" height="1334" viewBox="0 0 750 1334" xmlns="http://www.w3.org/2000/svg">
  <rect width="750" height="1334" fill="#0f172a"/>
  <text x="375" y="667"
        font-family="Arial, sans-serif"
        font-size="48"
        font-weight="bold"
        fill="#DFFF4F"
        text-anchor="middle">LawnTech Dynamics</text>
  <text x="375" y="750"
        font-family="Arial, sans-serif"
        font-size="24"
        fill="#DFFF4F"
        text-anchor="middle"
        opacity="0.8">Mobile Experience</text>
</svg>`;

  fs.writeFileSync(path.join(screenshotsDir, 'desktop-1.svg'), desktopScreenshot);
  fs.writeFileSync(path.join(screenshotsDir, 'mobile-1.svg'), mobileScreenshot);

  console.log('\n📸 Screenshot placeholders created!');
  console.log('   Replace these with actual app screenshots for better PWA listing.');
}

// Run the generator
generateIcons()
  .then(() => createPlaceholderScreenshots())
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
