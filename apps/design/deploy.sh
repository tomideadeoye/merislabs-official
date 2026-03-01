#!/bin/bash
# Deploy MerisLabs Design App to Vercel
# This script handles the monorepo deployment properly

set -e

echo "🚀 Deploying MerisLabs Design App to Vercel..."

# Navigate to project root
cd "$(dirname "$0")/../.."

# Check if pnpm lock file exists
if [ ! -f "pnpm-lock.yaml" ]; then
    echo "❌ Error: pnpm-lock.yaml not found in root"
    exit 1
fi

echo "✅ Found pnpm-lock.yaml"

# Navigate to design app
cd apps/design

# Check if vercel.json exists
if [ ! -f "vercel.json" ]; then
    echo "⚠️  Creating vercel.json..."
    cat > vercel.json << 'EOF'
{
  "framework": "nextjs",
  "installCommand": "cd ../.. && pnpm install",
  "buildCommand": "cd ../.. && pnpm --filter=@merislabs/design run build",
  "devCommand": "pnpm run dev",
  "regions": ["fra1"]
}
EOF
fi

echo "📦 Starting deployment..."
npx vercel --prod --yes

echo "✅ Deployment complete!"
echo ""
echo "🌐 Check deployment status at:"
echo "   https://vercel.com/tomideadeoyes-projects/design"
