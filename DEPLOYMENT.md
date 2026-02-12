# Deployment Guide

## Quick Deploy to Vercel

1. **Push to GitHub**
   ```bash
   cd buildd-docs
   git add .
   git commit -m "Initial docs setup"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings
   - Click "Deploy"

3. **Configure Domain**
   - In Vercel project settings → Domains
   - Add custom domain: `docs.buildd.dev`
   - Add CNAME record in your DNS:
     ```
     CNAME docs cname.vercel-dns.com
     ```

## Environment Variables

This project doesn't require any environment variables for basic deployment. All content is static.

## Build Settings (Auto-detected)

- **Framework**: Next.js
- **Build Command**: `pnpm build`
- **Output Directory**: `.next`
- **Install Command**: `pnpm install`
- **Development Command**: `pnpm dev`

## Manual Deployment

If deploying to a different platform:

```bash
# Build
pnpm build

# Start production server
pnpm start
```

The built site will be in `.next/` directory.

## Vercel CLI (Alternative)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project root
cd buildd-docs
vercel

# Production deployment
vercel --prod
```

## Post-Deployment

1. Test the live site at your Vercel URL
2. Verify all documentation pages load correctly
3. Check search functionality works
4. Configure custom domain DNS
5. Set up automatic deployments (should work by default with GitHub integration)

## Troubleshooting

### Build Fails
- Check `pnpm build` works locally first
- Ensure all MDX files have valid frontmatter
- Verify `meta.json` files are valid JSON

### Pages Not Found
- Make sure all MDX files are in `content/docs/`
- Check `meta.json` references correct file names (without `.mdx`)
- Regenerate source: `pnpm run postinstall`

### Search Not Working
- Search requires the Next.js API route at `/api/search`
- Check Vercel function logs for errors
- Ensure `fumadocs-mdx` generated search index

## Monitoring

- **Vercel Dashboard**: View deployment logs and analytics
- **Build Logs**: Check for any warnings during build
- **Function Logs**: Monitor API route performance (search endpoint)
