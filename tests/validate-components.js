#!/usr/bin/env node

/**
 * Component Validation Script
 *
 * Validates all React components in the project:
 * - Checks component files exist
 * - Validates exports
 * - Checks for syntax errors
 * - Runs without needing browser
 *
 * Usage: node tests/validate-components.js
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readdirSync, existsSync, readFileSync, statSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

// Validation results
const results = {
  total: 0,
  passed: 0,
  failed: 0,
  warningCount: 0,
  errors: [],
  warnings: [],
};

/**
 * Prints colored output to console
 */
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Prints section header
 */
function logSection(title) {
  log(`\n${'='.repeat(60)}`, 'cyan');
  log(`  ${title}`, 'bold');
  log('='.repeat(60), 'cyan');
}

/**
 * Checks if a file exists
 */
function checkFileExists(filePath) {
  return existsSync(filePath);
}

/**
 * Validates component has proper export
 */
function validateExports(filePath, componentName) {
  try {
    const content = readFileSync(filePath, 'utf-8');

    // Check for default export
    const hasDefaultExport =
      content.includes('export default') ||
      content.match(/export\s*{\s*\w+\s+as\s+default\s*}/);

    // Check for named export matching component name
    const hasNamedExport =
      content.includes(`export const ${componentName}`) ||
      content.includes(`export function ${componentName}`) ||
      content.includes(`export { ${componentName} }`);

    // Check for React import
    const hasReactImport =
      content.includes("from 'react'") ||
      content.includes('from "react"');

    return {
      hasDefaultExport,
      hasNamedExport,
      hasReactImport,
      isValid: (hasDefaultExport || hasNamedExport) && hasReactImport,
    };
  } catch (error) {
    return {
      hasDefaultExport: false,
      hasNamedExport: false,
      hasReactImport: false,
      isValid: false,
      error: error.message,
    };
  }
}

/**
 * Checks for common syntax errors
 */
function checkSyntaxErrors(filePath) {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const errors = [];

    // Check for unclosed brackets
    const openBraces = (content.match(/{/g) || []).length;
    const closeBraces = (content.match(/}/g) || []).length;
    if (openBraces !== closeBraces) {
      errors.push(`Mismatched braces: ${openBraces} open, ${closeBraces} close`);
    }

    // Check for unclosed parentheses
    const openParens = (content.match(/\(/g) || []).length;
    const closeParens = (content.match(/\)/g) || []).length;
    if (openParens !== closeParens) {
      errors.push(`Mismatched parentheses: ${openParens} open, ${closeParens} close`);
    }

    // Check for unclosed square brackets
    const openBrackets = (content.match(/\[/g) || []).length;
    const closeBrackets = (content.match(/]/g) || []).length;
    if (openBrackets !== closeBrackets) {
      errors.push(`Mismatched brackets: ${openBrackets} open, ${closeBrackets} close`);
    }

    // Check for unterminated strings (basic check)
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
      const singleQuotes = (line.match(/'/g) || []).length;
      const doubleQuotes = (line.match(/"/g) || []).length;
      const backticks = (line.match(/`/g) || []).length;

      if (singleQuotes % 2 !== 0 && !line.trim().startsWith('//')) {
        errors.push(`Line ${idx + 1}: Possible unterminated string (single quotes)`);
      }
      if (doubleQuotes % 2 !== 0 && !line.trim().startsWith('//')) {
        errors.push(`Line ${idx + 1}: Possible unterminated string (double quotes)`);
      }
      if (backticks % 2 !== 0 && !line.trim().startsWith('//')) {
        errors.push(`Line ${idx + 1}: Possible unterminated template literal`);
      }
    });

    return errors;
  } catch (error) {
    return [`Failed to read file: ${error.message}`];
  }
}

/**
 * Validates component dependencies
 */
function validateDependencies(filePath) {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const warnings = [];

    // Check for Three.js imports
    if (content.includes('@react-three/fiber') || content.includes('three')) {
      // Ensure proper Three.js setup
      if (!content.includes('Canvas') && content.includes('@react-three/fiber')) {
        warnings.push('Imports @react-three/fiber but does not use Canvas');
      }
    }

    // Check for missing prop types (TypeScript)
    if (filePath.endsWith('.tsx')) {
      const hasPropsInterface = content.match(/interface\s+\w+Props/);
      const hasPropsType = content.match(/type\s+\w+Props/);
      const hasFunctionComponent = content.match(/React\.FC|FC<|FunctionComponent/);

      if (hasFunctionComponent && !hasPropsInterface && !hasPropsType) {
        warnings.push('Functional component without typed props');
      }
    }

    // Check for console statements (should use proper logging)
    const consoleStatements = content.match(/console\.(log|error|warn)/g);
    if (consoleStatements && consoleStatements.length > 0) {
      warnings.push(`Contains ${consoleStatements.length} console statement(s)`);
    }

    return warnings;
  } catch (error) {
    return [`Failed to validate dependencies: ${error.message}`];
  }
}

/**
 * Gets file size in KB
 */
function getFileSize(filePath) {
  const stats = statSync(filePath);
  return (stats.size / 1024).toFixed(2);
}

/**
 * Validates a single component file
 */
function validateComponent(filePath, componentName) {
  results.total++;

  log(`\n${componentName}`, 'bold');
  log(`  Path: ${filePath}`, 'cyan');

  let passed = true;

  // Check file exists
  if (!checkFileExists(filePath)) {
    log(`  ✗ File does not exist`, 'red');
    results.errors.push(`${componentName}: File not found`);
    results.failed++;
    return;
  }

  log(`  ✓ File exists (${getFileSize(filePath)} KB)`, 'green');

  // Validate exports
  const exportValidation = validateExports(filePath, componentName);
  if (exportValidation.error) {
    log(`  ✗ Export validation failed: ${exportValidation.error}`, 'red');
    results.errors.push(`${componentName}: ${exportValidation.error}`);
    passed = false;
  } else if (!exportValidation.isValid) {
    log(`  ✗ Invalid or missing export`, 'red');
    if (!exportValidation.hasReactImport) {
      log(`    - Missing React import`, 'red');
    }
    if (!exportValidation.hasDefaultExport && !exportValidation.hasNamedExport) {
      log(`    - No default or named export found`, 'red');
    }
    results.errors.push(`${componentName}: Invalid exports`);
    passed = false;
  } else {
    log(`  ✓ Valid exports`, 'green');
    if (exportValidation.hasDefaultExport) {
      log(`    - Has default export`, 'cyan');
    }
    if (exportValidation.hasNamedExport) {
      log(`    - Has named export`, 'cyan');
    }
  }

  // Check for syntax errors
  const syntaxErrors = checkSyntaxErrors(filePath);
  if (syntaxErrors.length > 0) {
    log(`  ✗ Syntax errors detected:`, 'red');
    syntaxErrors.forEach((err) => log(`    - ${err}`, 'red'));
    results.errors.push(`${componentName}: ${syntaxErrors.join(', ')}`);
    passed = false;
  } else {
    log(`  ✓ No syntax errors`, 'green');
  }

  // Check dependencies
  const depWarnings = validateDependencies(filePath);
  if (depWarnings.length > 0) {
    log(`  ⚠ Warnings:`, 'yellow');
    depWarnings.forEach((warn) => log(`    - ${warn}`, 'yellow'));
    results.warnings.push(`${componentName}: ${depWarnings.join(', ')}`);
    results.warningCount++;
  }

  if (passed) {
    results.passed++;
    log(`  ✓ Component validation passed`, 'green');
  } else {
    results.failed++;
    log(`  ✗ Component validation failed`, 'red');
  }
}

/**
 * Scans directory for component files
 */
function scanDirectory(dirPath, extensions = ['.tsx', '.jsx']) {
  const components = [];

  try {
    const files = readdirSync(dirPath);

    files.forEach((file) => {
      const fullPath = join(dirPath, file);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        // Skip node_modules, tests, and hidden directories
        if (!file.startsWith('.') && file !== 'node_modules' && file !== 'tests') {
          components.push(...scanDirectory(fullPath, extensions));
        }
      } else if (extensions.some((ext) => file.endsWith(ext))) {
        // Extract component name from filename
        const componentName = file.replace(/\.(tsx|jsx)$/, '');
        components.push({ name: componentName, path: fullPath });
      }
    });
  } catch (error) {
    log(`Error scanning directory ${dirPath}: ${error.message}`, 'red');
  }

  return components;
}

/**
 * Main validation function
 */
function main() {
  logSection('Component Validation Suite');

  log('\nScanning for components...', 'cyan');

  const componentsDir = join(projectRoot, 'components');
  const components = scanDirectory(componentsDir);

  log(`\nFound ${components.length} component(s) to validate\n`, 'blue');

  logSection('Validating Components');

  components.forEach(({ name, path }) => {
    validateComponent(path, name);
  });

  // Print summary
  logSection('Validation Summary');

  log(`\nTotal components: ${results.total}`, 'blue');
  log(`Passed: ${results.passed}`, 'green');
  log(`Failed: ${results.failed}`, results.failed > 0 ? 'red' : 'green');
  log(`Warnings: ${results.warningCount}`, results.warningCount > 0 ? 'yellow' : 'green');

  if (results.errors.length > 0) {
    log('\n❌ Errors:', 'red');
    results.errors.forEach((err) => log(`  - ${err}`, 'red'));
  }

  if (results.warnings.length > 0) {
    log('\n⚠️  Warnings:', 'yellow');
    results.warnings.forEach((warn) => log(`  - ${warn}`, 'yellow'));
  }

  log('\n' + '='.repeat(60), 'cyan');

  // Exit with appropriate code
  if (results.failed > 0) {
    log('\n❌ Validation FAILED', 'red');
    process.exit(1);
  } else if (results.warningCount > 0) {
    log('\n⚠️  Validation passed with warnings', 'yellow');
    process.exit(0);
  } else {
    log('\n✅ All components validated successfully!', 'green');
    process.exit(0);
  }
}

// Run validation
main();
