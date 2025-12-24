#!/bin/bash
set -e

# The repository directory (sibling to current folder)
REPO_DIR="../kr8tiv.io"
REPO_SLUG="kr8tiv-io/kr8tiv.io"

echo "---------------------------------------------------------"
echo "Optimizing Git settings and fixing push..."
echo "---------------------------------------------------------"

if [ ! -d "$REPO_DIR" ]; then
    echo "Error: Could not find directory $REPO_DIR"
    exit 1
fi

cd "$REPO_DIR"

# 1. Increase Git HTTP Buffer to 500MB to fix "HTTP 400" error
echo "Increasing git http.postBuffer to 500MB..."
git config http.postBuffer 524288000

# 2. Set the repository description
if command -v gh &> /dev/null; then
    echo "Setting repository description..."
    gh repo edit "$REPO_SLUG" --description "Evolve: Professional Commercial, Industrial, and Residential Surface Restoration Services." || echo "Could not set description (check permissions), skipping..."
fi

# 3. Ensure Remote is HTTPS
echo "Ensuring remote is HTTPS..."
git remote set-url origin "https://github.com/$REPO_SLUG.git"

# 4. Push
echo "Pushing files to GitHub (this might take a moment)..."
git push -u origin main

echo "---------------------------------------------------------"
echo "Success! Your files are live at:"
echo "https://github.com/$REPO_SLUG"
echo "---------------------------------------------------------"