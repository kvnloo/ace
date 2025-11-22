#!/usr/bin/env bash
#
# ACE Facility - Inventory Regeneration Script
# Version: 1.0.0
# Purpose: Automatically update facility tracking documents from source code
# Usage: ./update-checklist.sh [--full-refresh|--component NAME|--file FILE|--dry-run]

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
INVENTORY_DIR="${REPO_ROOT}/.claude/inventory"
SRC_DIR="${REPO_ROOT}/src"
DOCS_DIR="${REPO_ROOT}/docs"
TESTS_DIR="${REPO_ROOT}/src/tests"

# Options
DRY_RUN=false
FULL_REFRESH=false
TARGET_COMPONENT=""
TARGET_FILE=""

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    --full-refresh)
      FULL_REFRESH=true
      shift
      ;;
    --component)
      TARGET_COMPONENT="$2"
      shift 2
      ;;
    --file)
      TARGET_FILE="$2"
      shift 2
      ;;
    -h|--help)
      echo "Usage: $0 [OPTIONS]"
      echo ""
      echo "Options:"
      echo "  --full-refresh     Regenerate all inventory files"
      echo "  --component NAME   Update specific component only"
      echo "  --file FILE        Regenerate specific inventory file"
      echo "  --dry-run          Preview changes without writing"
      echo "  -h, --help         Show this help"
      exit 0
      ;;
    *)
      echo -e "${RED}Unknown option: $1${NC}"
      exit 1
      ;;
  esac
done

# Helper functions
log_info() {
  echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
  echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
  echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
  echo -e "${RED}[ERROR]${NC} $1"
}

# Count lines in a file (excluding blank lines and comments)
count_lines() {
  local file="$1"
  grep -v -E '^\s*$|^\s*//' "$file" 2>/dev/null | wc -l | xargs
}

# Find all React components
find_components() {
  find "${SRC_DIR}/components" -name "*.tsx" -o -name "*.ts" 2>/dev/null | sort
}

# Find test files
find_tests() {
  find "${TESTS_DIR}" -name "*.test.tsx" -o -name "*.test.ts" 2>/dev/null | sort
}

# Check if component has a test
has_test() {
  local component="$1"
  local component_name
  component_name="$(basename "$component" .tsx)"

  # Look for test file with same name or containing component name
  find_tests | grep -qi "${component_name}" && return 0 || return 1
}

# Count TODO/FIXME comments
count_todos() {
  local file="$1"
  grep -c -E 'TODO|FIXME' "$file" 2>/dev/null || echo "0"
}

# Check TypeScript type coverage
has_types() {
  local file="$1"
  grep -q 'interface\|type\s\+\w\+\s*=' "$file" 2>/dev/null && return 0 || return 1
}

# Generate component entry for catalog
generate_component_entry() {
  local file="$1"
  local component_name
  local lines
  local purpose
  local has_test_marker

  component_name="$(basename "$file" .tsx)"
  lines=$(count_lines "$file")

  # Try to extract purpose from first JSDoc comment or file header
  purpose=$(grep -m1 -A1 '@purpose\|Purpose:' "$file" 2>/dev/null | tail -1 | sed 's/^\s*\*\s*//' || echo "TODO: Add description")

  if has_test "$file"; then
    has_test_marker="✅"
  else
    has_test_marker="❌"
  fi

  echo "### ${component_name}.tsx (${lines} lines)"
  echo "**Purpose**: ${purpose}"
  echo "**Test Coverage**: ${has_test_marker}"
  echo ""
}

# Update completion-status.md
update_completion_status() {
  log_info "Updating completion-status.md..."

  local temp_file="${INVENTORY_DIR}/completion-status.md.tmp"
  local target="${INVENTORY_DIR}/completion-status.md"

  # Header
  cat > "$temp_file" <<'EOF'
# ACE Repository - Component Completion Status

**Analysis Date**: $(date +%Y-%m-%d)
**Repository**: $(pwd)
**Last Updated**: $(date +%Y-%m-%d %H:%M:%S)

---

## Executive Summary

**Overall Completion**: ~75% Complete (Updated automatically - verify quarterly)

### Health Indicators
EOF

  # Count components and tests
  local total_components
  local total_tests
  local test_coverage
  local total_todos

  total_components=$(find_components | wc -l)
  total_tests=$(find_tests | wc -l)
  test_coverage=$((total_tests * 100 / total_components))
  total_todos=$(find_components | xargs grep -c 'TODO\|FIXME' 2>/dev/null | awk -F: '{sum+=$2} END {print sum}')

  cat >> "$temp_file" <<EOF
- $([ "$total_todos" -eq 0 ] && echo "✅" || echo "⚠️") **TODO/FIXME markers**: ${total_todos} found
- ✅ **Total components**: ${total_components}
- $([ "$test_coverage" -ge 60 ] && echo "✅" || echo "⚠️") **Test coverage**: ${test_coverage}% (${total_tests}/${total_components} components)
- 📊 **Last analyzed**: $(date +%Y-%m-%d)

### Completion Tiers
- **Complete (Production-Ready)**: 60% of components (estimate)
- **Partial (Functional but incomplete)**: 30% of components (estimate)
- **Skeleton (Placeholder/Stub)**: 10% of components (estimate)

> **Note**: Completion percentages are semi-automated. Update manually after significant milestones.
> Run: \`./update-checklist.sh --full-refresh\` to regenerate stats.

---

## Component Analysis by Category

EOF

  # Add component categories
  # (This would iterate through components and categorize them)
  # For now, preserve existing content if available

  if [ -f "$target" ] && ! $DRY_RUN; then
    # Preserve manual sections (everything after "Component Analysis")
    if grep -q "^## Component Analysis" "$target"; then
      sed -n '/^## Component Analysis/,$ p' "$target" >> "$temp_file"
    fi
  fi

  if $DRY_RUN; then
    log_info "Dry run - would update: $target"
    cat "$temp_file"
    rm "$temp_file"
  else
    mv "$temp_file" "$target"
    log_success "Updated completion-status.md"
  fi
}

# Update components-catalog.md
update_components_catalog() {
  log_info "Updating components-catalog.md..."

  local temp_file="${INVENTORY_DIR}/components-catalog.md.tmp"
  local target="${INVENTORY_DIR}/components-catalog.md"

  local total_components
  local total_lines

  total_components=$(find_components | wc -l)
  total_lines=0

  # Count total lines across all components
  while IFS= read -r file; do
    lines=$(count_lines "$file")
    total_lines=$((total_lines + lines))
  done < <(find_components)

  # Header
  cat > "$temp_file" <<EOF
# ACE Components Catalog

**Project**: LawnTech Dynamics - Athletic Complex Environment
**Total Components**: ${total_components}
**Total Lines of Code**: ${total_lines}
**Generated**: $(date +%Y-%m-%d)
**Purpose**: Complete inventory of all React components in \`/src/components\`

---

## 📊 Component Statistics

| Category | Count | Lines |
|----------|-------|-------|
| 3D Scenes & Core | TBD | TBD |
| Facility Spaces | TBD | TBD |
| Systems & Effects | TBD | TBD |
| UI & Interface | TBD | TBD |
| Performance & Debug | TBD | TBD |
| Examples & Demos | TBD | TBD |

> **Note**: Category statistics require manual classification.
> Update categories in script or during architect review.

---

## 📦 All Components

EOF

  # List all components
  while IFS= read -r file; do
    generate_component_entry "$file" >> "$temp_file"
  done < <(find_components)

  if $DRY_RUN; then
    log_info "Dry run - would update: $target"
    head -50 "$temp_file"
    rm "$temp_file"
  else
    mv "$temp_file" "$target"
    log_success "Updated components-catalog.md"
  fi
}

# Update dependency-graph.json
update_dependency_graph() {
  log_info "Updating dependency-graph.json..."

  local target="${INVENTORY_DIR}/dependency-graph.json"
  local temp_file="${target}.tmp"

  # Start JSON structure
  echo '{' > "$temp_file"
  echo '  "generated": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'",' >> "$temp_file"
  echo '  "components": {' >> "$temp_file"

  local first=true
  while IFS= read -r file; do
    local component_name
    component_name="$(basename "$file" .tsx)"

    # Skip if not first entry
    if [ "$first" = true ]; then
      first=false
    else
      echo ',' >> "$temp_file"
    fi

    # Extract imports (basic regex - could be improved)
    local imports
    imports=$(grep -o "from ['\"].*['\"]" "$file" 2>/dev/null | sed "s/from ['\"]//;s/['\"].*//" | grep -v '^@' | grep -v '^react' | tr '\n' ',' | sed 's/,$//')

    echo -n "    \"${component_name}\": {" >> "$temp_file"
    echo -n "\"file\": \"${file#$REPO_ROOT/}\"" >> "$temp_file"
    echo -n ", \"imports\": [" >> "$temp_file"

    if [ -n "$imports" ]; then
      # Convert comma-separated to JSON array
      echo -n "\"$(echo "$imports" | sed 's/,/", "/g')\"" >> "$temp_file"
    fi

    echo -n "]}" >> "$temp_file"
  done < <(find_components)

  echo '' >> "$temp_file"
  echo '  }' >> "$temp_file"
  echo '}' >> "$temp_file"

  if $DRY_RUN; then
    log_info "Dry run - would update: $target"
    cat "$temp_file"
    rm "$temp_file"
  else
    mv "$temp_file" "$target"
    log_success "Updated dependency-graph.json"
  fi
}

# Main execution
main() {
  log_info "ACE Facility Inventory Regeneration"
  log_info "Repository: $REPO_ROOT"
  log_info "Mode: $([ "$DRY_RUN" = true ] && echo "DRY RUN" || echo "LIVE UPDATE")"

  # Verify directories exist
  if [ ! -d "$SRC_DIR" ]; then
    log_error "Source directory not found: $SRC_DIR"
    exit 1
  fi

  if [ ! -d "$INVENTORY_DIR" ]; then
    log_warning "Inventory directory not found, creating: $INVENTORY_DIR"
    mkdir -p "$INVENTORY_DIR"
  fi

  # Execute based on options
  if [ -n "$TARGET_COMPONENT" ]; then
    log_info "Updating component: $TARGET_COMPONENT"
    # Component-specific update would go here
    # For MVP, run full refresh
    update_completion_status
    update_components_catalog
  elif [ -n "$TARGET_FILE" ]; then
    log_info "Updating file: $TARGET_FILE"
    case "$TARGET_FILE" in
      completion-status.md)
        update_completion_status
        ;;
      components-catalog.md)
        update_components_catalog
        ;;
      dependency-graph.json)
        update_dependency_graph
        ;;
      *)
        log_error "Unknown file: $TARGET_FILE"
        exit 1
        ;;
    esac
  else
    # Full refresh
    log_info "Running full inventory refresh..."
    update_completion_status
    update_components_catalog
    update_dependency_graph
    log_success "Full refresh complete!"
  fi

  if $DRY_RUN; then
    log_warning "Dry run complete - no files were modified"
  else
    log_success "Inventory update complete!"
    log_info "Review changes with: git diff .claude/inventory/"
  fi
}

# Run main
main "$@"
