#!/bin/bash

# Main repository path
MAIN_REPO="/Users/mac/Documents/GitHub/merislabs-official"

# List of nested git repositories to consolidate
NESTED_REPOS=(
  "$MAIN_REPO/orion_python_backend/mcp_servers/github.com/zcaceres/fetch-mcp"
  "$MAIN_REPO/orion_python_backend"
)

# Function to remove git directory but keep files
remove_git_repo() {
  local repo_path=$1
  echo "Removing git repository at $repo_path but keeping files..."
  rm -rf "$repo_path/.git"
  echo "Git repository removed from $repo_path"
}

# Process nested repositories from deepest to shallowest
for repo in "${NESTED_REPOS[@]}"; do
  remove_git_repo "$repo"
done

# Add all files to the main repository
cd "$MAIN_REPO"
git add .
echo "All files added to the main repository"
echo "You can now commit and push from the main repository"
