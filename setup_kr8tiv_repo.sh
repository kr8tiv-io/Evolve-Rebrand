#!/bin/bash
set -e

# --- CONFIGURATION ---
ORG_NAME="kr8tiv-io"
REPO_NAME="kr8tiv.io"
SUBFOLDER="Evolve"
# ---------------------

CURRENT_DIR=$(pwd)
PARENT_DIR=$(dirname "$CURRENT_DIR")
REPO_DIR="$PARENT_DIR/$REPO_NAME"
TARGET_DIR="$REPO_DIR/$SUBFOLDER"

echo "---------------------------------------------------------"
echo "Target Organization: $ORG_NAME"
echo "Target Repository:   $REPO_NAME"
echo "Target Folder:       $SUBFOLDER"
echo "---------------------------------------------------------"

# 1. Create the local directory structure
echo "Creating local directories..."
if [ -d "$TARGET_DIR" ]; then
    echo "Directory $TARGET_DIR already exists. Updating contents..."
else
    mkdir -p "$TARGET_DIR"
    echo "Created $TARGET_DIR"
fi

# 2. Copy content
echo "Copying files from current directory to $TARGET_DIR..."
# Exclude the script itself and .git if it exists
rsync -av --progress . "$TARGET_DIR" --exclude .git --exclude setup_kr8tiv_repo.sh

# 3. Initialize Git Repository
echo "Initializing Git repository..."
cd "$REPO_DIR"

# Increase Git HTTP Buffer to 500MB to prevent HTTP 400 errors during push
git config http.postBuffer 524288000

if [ ! -d ".git" ]; then
    git init
    git branch -M main
    echo "Git initialized."
else
    echo "Git repository already initialized."
fi

# 4. Add files and commit
echo "Committing files..."
git add .
git commit -m "Initial upload of Evolve project" || echo "Nothing to commit."

# 5. Create GitHub Repository and Push
if command -v gh &> /dev/null; then
    echo "GitHub CLI (gh) detected."
    
    # Check if repo already exists
    if gh repo view "$ORG_NAME/$REPO_NAME" &> /dev/null; then
        echo "Repository '$ORG_NAME/$REPO_NAME' already exists. Pushing updates..."
        
        # Ensure remote is correct
        if git remote | grep -q "^origin$"; then
            git remote set-url origin "https://github.com/$ORG_NAME/$REPO_NAME.git"
        else
            git remote add origin "https://github.com/$ORG_NAME/$REPO_NAME.git"
        fi
        git push -u origin main
    else
        echo "Creating repository '$ORG_NAME/$REPO_NAME'..."
        # Create private repo under the organization and push
        gh repo create "$ORG_NAME/$REPO_NAME" --private --source=. --remote=origin --push
    fi

    # Set repository description
    echo "Setting repository description..."
    gh repo edit "$ORG_NAME/$REPO_NAME" --description "Evolve: Professional Commercial, Industrial, and Residential Surface Restoration Services." || echo "Could not set description, skipping..."
else
    echo "---------------------------------------------------------"
    echo "WARNING: GitHub CLI ('gh') not found."
    echo "Please manually run these commands in your terminal:"
    echo "  cd $REPO_DIR"
    echo "  git remote add origin https://github.com/$ORG_NAME/$REPO_NAME.git"
    echo "  git push -u origin main"
    echo "---------------------------------------------------------"
fi

echo "Done! Your code should now be at: https://github.com/$ORG_NAME/$REPO_NAME"
