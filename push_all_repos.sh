#!/bin/bash

# Function to push a git repository
push_repo() {
  local repo_path=$1
  local repo_name=$2
  
  echo "Processing repository: $repo_name"
  cd "$repo_path" || { echo "Failed to change to directory $repo_path"; return 1; }
  
  # Check if there are changes to commit
  if [[ -n $(git status --porcelain) ]]; then
    echo "Changes detected in $repo_name, committing..."
    git add .
    git commit -m "Auto commit from push script"
    echo "Committed changes in $repo_name"
  else
    echo "No changes to commit in $repo_name"
  fi
  
  # Check if there are commits to push
  local ahead=$(git rev-list --count @{u}..HEAD 2>/dev/null)
  if [[ $? -eq 0 && $ahead -gt 0 ]]; then
    echo "Pushing $ahead commit(s) to remote for $repo_name..."
    git push
    echo "Push completed for $repo_name"
  else
    echo "No commits to push for $repo_name or no upstream branch set"
  fi
}

# Main repository path
MAIN_REPO="/Users/mac/Documents/GitHub/merislabs-official"

# Push the nested repositories first
echo "=== Processing nested repositories ==="
push_repo "$MAIN_REPO/orion_python_backend/mcp_servers/github.com/zcaceres/fetch-mcp" "fetch-mcp"
push_repo "$MAIN_REPO/orion_python_backend" "orion_python_backend"

# Finally push the main repository
echo "=== Processing main repository ==="
push_repo "$MAIN_REPO" "merislabs-official"

echo "All repositories processed!"