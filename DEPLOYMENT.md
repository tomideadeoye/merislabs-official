# Deployment Guide for Meris Labs Official Website

## Prerequisites
1. Node.js (version 20 or higher)
2. A Vercel account (free at [vercel.com](https://vercel.com))

## Option 1: Deploy using Vercel CLI

### Installation Troubleshooting
If you encounter issues installing Vercel CLI globally, try these alternatives:

#### Using npm instead of yarn:
```bash
npm install -g vercel
```

#### Using npx (no installation required):
```bash
npx vercel deploy
```

#### Using corepack (if available):
```bash
corepack enable
corepack prepare vercel@latest --activate
```

### Login to Vercel
```bash
vercel login
```

### Deploy to Vercel
Navigate to your project directory and run:
```bash
vercel
```

For production deployment:
```bash
vercel --prod
```

## Option 2: Deploy using GitHub Integration

1. Push your code to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click "Add New Project"
4. Import your GitHub repository
5. Configure the project:
   - Framework: Next.js
   - Build Command: `next build`
   - Output Directory: `.next`
6. Click "Deploy"

## Option 3: Manual Deployment using Vercel Dashboard

1. Build your project locally:
   ```bash
   npm run build:vercel
   ```
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click "Add New Project"
4. Select "Other" as the framework
5. Upload the contents of your project folder
6. Set the build command to `next build`
7. Set the output directory to `.next`
8. Click "Deploy"

## Project Configuration

This project includes:
- A `vercel.json` configuration file
- A `build:vercel` script in package.json
- Next.js standalone output configuration

## Environment Variables

If your project requires environment variables, add them in the Vercel dashboard under:
Project Settings > Environment Variables

## Custom Domain (Optional)

After deployment, you can add a custom domain in the Vercel dashboard:
Project Settings > Domains

## Troubleshooting

If you encounter issues:
1. Ensure Node.js version is 20 or higher
2. Check that all dependencies are installed (`npm install`)
3. Verify the build command works locally (`npm run build:vercel`)
4. Try clearing npm/yarn cache:
   ```bash
   npm cache clean --force
   # or
   yarn cache clean
   ```
5. Try using a different package manager (npm instead of yarn or vice versa)
