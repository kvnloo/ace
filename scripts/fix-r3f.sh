#!/bin/bash

echo "Fixing React Three Fiber compatibility..."
echo "This will downgrade React to v18 which is compatible with R3F"
echo ""

# Backup package.json
cp package.json package.json.backup

# Downgrade React to v18
npm install react@18.3.1 react-dom@18.3.1 --save

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

echo ""
echo "Fix complete! React downgraded to v18 for R3F compatibility"
echo "Run 'npm run dev' to restart the server"