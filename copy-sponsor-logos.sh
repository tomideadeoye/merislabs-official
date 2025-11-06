#!/bin/bash

# Sponsor Logo Copy Script
# This script copies sponsor logo files from the Downloads folder to the project's sponsors directory

echo "Copying sponsor logo files to project directory..."

# Create the sponsors directory if it doesn't exist
mkdir -p /Users/mac/Documents/GitHub/merislabs-official/public/images/sponsors

# Copy GitHub logo
if [ -f "/Users/mac/Downloads/github-mark/github-mark.png" ]; then
    cp "/Users/mac/Downloads/github-mark/github-mark.png" /Users/mac/Documents/GitHub/merislabs-official/public/images/sponsors/github-mark.png
    echo "✓ Copied GitHub logo"
else
    echo "⚠ GitHub logo not found in Downloads"
fi

# Copy BVCC logo
if [ -f "/Users/mac/Downloads/bvcc.webp" ]; then
    cp "/Users/mac/Downloads/bvcc.webp" /Users/mac/Documents/GitHub/merislabs-official/public/images/sponsors/bvcc.webp
    echo "✓ Copied BVCC logo"
else
    echo "⚠ BVCC logo not found in Downloads"
fi

# Copy AWS logo
if [ -f "/Users/mac/Downloads/aws.png" ]; then
    cp "/Users/mac/Downloads/aws.png" /Users/mac/Documents/GitHub/merislabs-official/public/images/sponsors/aws.png
    echo "✓ Copied AWS logo"
else
    echo "⚠ AWS logo not found in Downloads"
fi

# Copy Timeless Venture Group logo
if [ -f "/Users/mac/Downloads/timeless_venture_group_llc_logo.jpeg" ]; then
    cp "/Users/mac/Downloads/timeless_venture_group_llc_logo.jpeg" /Users/mac/Documents/GitHub/merislabs-official/public/images/sponsors/timeless_venture_group_llc_logo.jpeg
    echo "✓ Copied Timeless Venture Group logo"
else
    echo "⚠ Timeless Venture Group logo not found in Downloads"
fi

# Copy Thurgood Marshall College Fund logo
if [ -f "/Users/mac/Downloads/logo-thurgood-marshall.webp" ]; then
    cp "/Users/mac/Downloads/logo-thurgood-marshall.webp" /Users/mac/Documents/GitHub/merislabs-official/public/images/sponsors/logo-thurgood-marshall.webp
    echo "✓ Copied Thurgood Marshall College Fund logo"
else
    echo "⚠ Thurgood Marshall College Fund logo not found in Downloads"
fi

# Copy HBCUvc logo
if [ -f "/Users/mac/Downloads/HBCUvc.png" ]; then
    cp "/Users/mac/Downloads/HBCUvc.png" /Users/mac/Documents/GitHub/merislabs-official/public/images/sponsors/hbcuvc.png
    echo "✓ Copied HBCUvc logo"
else
    echo "⚠ HBCUvc logo not found in Downloads"
fi

# Copy Microsoft logo
if [ -f "/Users/mac/Downloads/Microsoft_logo_(2012).svg.png" ]; then
    cp "/Users/mac/Downloads/Microsoft_logo_(2012).svg.png" /Users/mac/Documents/GitHub/merislabs-official/public/images/sponsors/microsoft.png
    echo "✓ Copied Microsoft logo"
else
    echo "⚠ Microsoft logo not found in Downloads"
fi

# Copy Google logo (common sponsor)
if [ -f "/Users/mac/Downloads/google.png" ]; then
    cp "/Users/mac/Downloads/google.png" /Users/mac/Documents/GitHub/merislabs-official/public/images/sponsors/google.png
    echo "✓ Copied Google logo"
else
    echo "⚠ Google logo not found in Downloads"
fi

# Copy Wolfram Alpha logo
if [ -f "/Users/mac/Downloads/wolfram.png" ]; then
    cp "/Users/mac/Downloads/wolfram.png" /Users/mac/Documents/GitHub/merislabs-official/public/images/sponsors/wolfram-alpha.png
    echo "✓ Copied Wolfram Alpha logo"
else
    echo "⚠ Wolfram Alpha logo not found in Downloads"
fi

# Copy Venture for THEM logo
if [ -f "/Users/mac/Downloads/venture for them.jpeg" ]; then
    cp "/Users/mac/Downloads/venture for them.jpeg" /Users/mac/Documents/GitHub/merislabs-official/public/images/sponsors/venture-for-them.jpeg
    echo "✓ Copied Venture for THEM logo"
else
    echo "⚠ Venture for THEM logo not found in Downloads"
fi

# Copy Gambix logo
if [ -f "/Users/mac/Downloads/gambix.jpeg" ]; then
    cp "/Users/mac/Downloads/gambix.jpeg" /Users/mac/Documents/GitHub/merislabs-official/public/images/sponsors/gambix.jpeg
    echo "✓ Copied Gambix logo"
else
    echo "⚠ Gambix logo not found in Downloads"
fi

echo "Logo copying process completed!"
echo "Please restart the development server for changes to take effect."
