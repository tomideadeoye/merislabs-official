# Vercel Setup for MerisLabs Monorepo

## apps/legal (legal.merislabs.com)

1. Go to the [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New...** > **Project**.
3. Select the `merislabs-official` repository.
4. In the **Configure Project** section:
   - **Project Name**: `merislabs-legal` (or preferred)
   - **Framework Preset**: `Next.js`
   - **Root Directory**: `apps/legal`
5. In the **Build and Output Settings** section:
   - **Build Command**: `pnpm build`
   - **Install Command**: `pnpm install`
6. In the **Environment Variables** section, add any necessary variables for the legal app.
7. Click **Deploy**.
8. Once deployed, go to **Settings** > **Domains** and add `legal.merislabs.com`.

## apps/main (merislabs.com)

If you need to update the existing project for the main site:
1. Go to the existing project in Vercel.
2. Go to **Settings** > **General**.
3. Update **Root Directory** to `apps/main`.
4. Ensure **Build Command** is `pnpm build` and **Install Command** is `pnpm install`.
5. Redeploy.
