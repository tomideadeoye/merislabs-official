#!/bin/bash

# MorganHacks Gallery Image Copy Script
# This script copies event pictures from the Downloads folder to the project's gallery directory

echo "Copying MorganHacks gallery images to project directory..."

# Create the gallery directory if it doesn't exist
mkdir -p /Users/mac/Documents/GitHub/merislabs-official/public/images/morganhacks/gallery

# Copy images from MorganHacks Pictures folder
if [ -d "/Users/mac/Downloads/MorganHacks Pictures" ]; then
    cp -r "/Users/mac/Downloads/MorganHacks Pictures"/* /Users/mac/Documents/GitHub/merislabs-official/public/images/morganhacks/gallery/
    echo "✓ Copied MorganHacks Pictures"
else
    echo "⚠ MorganHacks Pictures folder not found in Downloads"
fi

echo "Gallery image copying process completed!"
echo "Please restart the development server for changes to take effect."
