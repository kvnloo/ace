import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Validating Component Imports in ThreeScene.tsx\n');

// Read ThreeScene.tsx
const threeScenePath = path.join(__dirname, '../components/ThreeScene.tsx');
const threeSceneContent = fs.readFileSync(threeScenePath, 'utf-8');

// Extract all imports
const importRegex = /import\s+(?:{[^}]*}|[\w\s,{}]*)\s+from\s+['"]([^'"]+)['"]/g;
const imports = [];
let match;

while ((match = importRegex.exec(threeSceneContent)) !== null) {
  const importPath = match[1];
  if (importPath.startsWith('.')) {
    imports.push(importPath);
  }
}

console.log(`Found ${imports.length} local imports to validate:\n`);

const missingFiles = [];
const foundFiles = [];

// Check each import
imports.forEach(importPath => {
  // Convert relative import to absolute path
  let fullPath = path.join(__dirname, '../components', importPath);

  // Add extensions to try
  const extensions = ['', '.tsx', '.ts', '.jsx', '.js', '/index.tsx', '/index.ts'];
  let found = false;

  for (const ext of extensions) {
    const testPath = fullPath + ext;
    if (fs.existsSync(testPath)) {
      foundFiles.push({ import: importPath, resolved: testPath });
      found = true;
      break;
    }
  }

  if (!found) {
    missingFiles.push(importPath);
    console.log(`❌ MISSING: ${importPath}`);
  } else {
    console.log(`✅ Found: ${importPath}`);
  }
});

console.log('\n' + '='.repeat(50));
console.log('VALIDATION SUMMARY');
console.log('='.repeat(50));
console.log(`✅ Found: ${foundFiles.length} components`);
console.log(`❌ Missing: ${missingFiles.length} components`);

if (missingFiles.length > 0) {
  console.log('\n🚨 MISSING COMPONENTS THAT NEED TO BE CREATED:');
  missingFiles.forEach((file, i) => {
    console.log(`${i + 1}. ${file}`);
  });

  // Check if these are among the new components we created
  console.log('\n🔍 Checking if these are the recently created components...');

  const newComponents = [
    'BiometricLab', 'MovementStudio', 'RecoverySuite', 'CognitiveLab',
    'PerformanceMetrics', 'HeatMapOverlay', 'AnalyticsDashboard',
    'CharacterSystem', 'LightingSystem', 'WeatherSystem', 'SupportSpaces'
  ];

  missingFiles.forEach(file => {
    const fileName = path.basename(file, path.extname(file));
    if (newComponents.includes(fileName)) {
      console.log(`⚠️  ${fileName} is a new component that should exist - checking...`);
      const expectedPath = path.join(__dirname, `../components/${fileName}.tsx`);
      if (fs.existsSync(expectedPath)) {
        console.log(`   ✅ Actually exists at: ${expectedPath}`);
      } else {
        console.log(`   ❌ Confirmed missing: ${expectedPath}`);
      }
    }
  });
} else {
  console.log('\n✅ All component imports are valid!');
  console.log('The 3D map should be working correctly.');
}

// Also check for the specific components mentioned in errors
console.log('\n📋 Checking specific components from error reports:');
const specificChecks = [
  'ReceptionArea',
  'ParkingLot',
  'BMSControlRoom',
  'RoboticGrassSystem',
  'TransportPods',
  'HydroponicsSystem',
  'MechanicalRooms',
  'LockerRoom'
];

specificChecks.forEach(comp => {
  const compPath = path.join(__dirname, `../components/${comp}.tsx`);
  if (fs.existsSync(compPath)) {
    // Check if it has a default export
    const content = fs.readFileSync(compPath, 'utf-8');
    const hasDefaultExport = content.includes(`export default ${comp}`) ||
                            content.includes(`export { ${comp} as default }`) ||
                            content.includes(`export const ${comp}`) ||
                            content.includes(`export function ${comp}`);

    if (hasDefaultExport || content.includes(`export const ${comp}`) || content.includes(`export function ${comp}`)) {
      console.log(`✅ ${comp}: File exists and has export`);
    } else {
      console.log(`⚠️  ${comp}: File exists but might have export issues`);
    }
  } else {
    console.log(`❌ ${comp}: File not found`);
  }
});