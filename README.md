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
  - `getting-started/` - Running a worker, Codex backend
  - `features/` - Missions, skills, schedules, memory, integrations
  - `integrations/` - MCP server, GitHub Actions
  - `concepts/` - Access model and secrets
  - `deployment/` - Self-hosting

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
3. **Update the directory's `meta.json` to list the page.** Fumadocs silently
   drops a `pages` entry that names a missing file, and a page absent from
   `pages` builds fine but never appears in the sidebar — neither shows up as a
   build error, so both are easy to miss.
4. Run `pnpm dev` to see your changes
5. Run `pnpm types:check` before opening a PR

### Writing conventions

Worth matching, since the existing pages are consistent about it:

- Two frontmatter keys only, `title` and `description`. Anything else is
  stripped by the schema without complaint.
- `<Callout type="warn">` for traps, `type="info"` for context. These are the
  only MDX components in use — `Tabs`, `Steps` and `Cards` would each need an
  explicit import.
- Document what does **not** happen, not just what does. Silent no-ops and
  fields that are ignored are the things readers actually get stuck on.
- Verify a claim against the code in `buildd-ai/buildd` before writing it. Pages
  here have previously described a security check that had been deleted and a
  settings UI that had been removed.

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
