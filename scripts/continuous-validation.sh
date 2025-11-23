#!/bin/bash

echo "🔄 Starting continuous validation loop..."
echo "📊 Running smoke tests every 5 minutes with console error checking"
echo ""

iteration=1

while true; do
  echo "========================================"
  echo "🔄 Validation Iteration #$iteration"
  echo "⏰ $(date)"
  echo "========================================"

  # Run smoke tests with console monitoring
  npx playwright test tests/e2e/smoke.spec.ts \
    tests/e2e/console-errors.spec.ts \
    tests/e2e/user-journey.spec.ts \
    --reporter=list \
    --max-failures=3 \
    2>&1 | tee "/tmp/validation-$iteration.log"

  exit_code=$?

  if [ $exit_code -eq 0 ]; then
    echo "✅ All tests passed - No console errors"
  else
    echo "❌ Tests failed - Check console errors"
    echo "📄 Log saved to: /tmp/validation-$iteration.log"

    # Alert if critical failures
    grep -i "console error\|404\|TypeError" "/tmp/validation-$iteration.log" && {
      echo "🚨 CRITICAL ERRORS DETECTED!"
    }
  fi

  echo ""
  echo "⏳ Waiting 5 minutes before next iteration..."
  echo ""

  sleep 300 # 5 minutes
  iteration=$((iteration + 1))
done
