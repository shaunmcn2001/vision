#!/bin/bash
echo "Testing build configuration..."

# Check if autoprefixer is installed
echo "Checking autoprefixer..."
if npm list autoprefixer >/dev/null 2>&1; then
    echo "✓ autoprefixer is installed"
else
    echo "✗ autoprefixer is missing"
    exit 1
fi

# Check if tailwindcss-animate is installed
echo "Checking tailwindcss-animate..."
if npm list tailwindcss-animate >/dev/null 2>&1; then
    echo "✓ tailwindcss-animate is installed"
else
    echo "✗ tailwindcss-animate is missing"
    exit 1
fi

# Check critical files exist
echo "Checking critical files..."
if [ -f "src/main.css" ]; then
    echo "✓ main.css exists"
else
    echo "✗ main.css missing"
    exit 1
fi

if [ -f "src/styles/theme.css" ]; then
    echo "✓ theme.css exists"
else
    echo "✗ theme.css missing"
    exit 1
fi

if [ -f "postcss.config.js" ]; then
    echo "✓ postcss.config.js exists"
else
    echo "✗ postcss.config.js missing"
    exit 1
fi

if [ -f "tailwind.config.js" ]; then
    echo "✓ tailwind.config.js exists"
else
    echo "✗ tailwind.config.js missing"
    exit 1
fi

echo "All build dependencies check passed!"