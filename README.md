# Buildd Documentation

Official documentation for [Buildd](https://buildd.dev) - Task coordination for AI coding agents.

📚 **Live Docs**: [docs.buildd.dev](https://docs.buildd.dev)

## Local Development

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev
```

Visit `http://localhost:3000/docs`

## Content Structure

- `content/docs/` - All documentation content in MDX format
  - `index.mdx` - Introduction page
  - `getting-started/` - Setup and installation guides
  - `features/` - Skills, schedules, and feature documentation
  - `concepts/` - Architecture and access control
  - `deployment/` - Self-hosting and deployment guides

## Adding Documentation

1. Create a new `.mdx` file in the appropriate directory under `content/docs/`
2. Add frontmatter with `title` and `description`:
   ```mdx
   ---
   title: Page Title
   description: Brief description for SEO
   ---

   # Page Content
   ```
3. Update the relevant `meta.json` file to add the page to navigation
4. Run `pnpm dev` to see your changes

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel dashboard
3. Deploy - that's it! Vercel auto-detects Next.js

### Manual Build

```bash
pnpm build
pnpm start
```

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Documentation**: Fumadocs v16
- **Styling**: Tailwind CSS v4
- **Package Manager**: pnpm

## Links

- [Main Repo](https://github.com/buildlabs/buildd)
- [Dashboard](https://buildd.dev)
- [Documentation](https://docs.buildd.dev)
