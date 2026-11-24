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
  - `concepts/` - How buildd runs AI, access model, secrets
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

### Prose linting

`pnpm lint:prose` (`scripts/lint-prose.mjs`) scores every page under
`content/docs/` for AI-voice tells — long sentences, passive voice,
marketing words, banned verbs (leverage, utilize, ensure, ...), overused AI
words, hollow phrases, em dashes, and the "not X, it's Y" pivot. It skips
frontmatter, fenced code blocks and inline code, and any page whose
frontmatter sets `generated: true`.

Score is violations per 100 words (`per100w`), so file length doesn't skew
the comparison. `--max <n>` fails the run if any file is over `n`; CI runs it
report-only (`continue-on-error: true` in
`.github/workflows/docs-lint.yml`) so it annotates PRs without blocking
them, while the threshold is tight enough that new regressions still stand
out as warnings on the PR diff.

Current threshold: **6 per100w**, set just above the worst file in the
baseline below (`device-auth.mdx` at 5.25). Run `pnpm lint:prose` locally to
see the full per-file table.

Baseline (2026-10-03), worst 5 files:

| File | per100w |
| --- | --- |
| `features/device-auth.mdx` | 5.25 |
| `features/teams.mdx` | 4.93 |
| `features/worker-instructions.mdx` | 4.92 |
| `features/chat.mdx` | 3.91 |
| `features/attachments.mdx` | 3.86 |

Rules considered and deliberately **not** implemented, because they fire on
plain, correct writing in this docs set rather than on AI voice:

- **Banning contractions or semicolons** (ASD-STE100 Simplified Technical
  English rules, which the `techlang-lint.py` reference tool applies) — this
  docs set uses both correctly throughout, so the rule would flag normal
  prose, not slop.
- **Flagging "key" as an overused adjective** — buildd docs use "key"
  constantly as a literal noun (API key, model key), so the rule would
  swamp every page with unrelated noise.
- **Flagging "gate" / "gated" / "gating"** — a domain term here (mission
  gates, goal-criteria gating), not a figurative AI tell.
- **Flagging "robust"** — used about as often in a genuinely technical
  sense (robust error handling) as in the figurative AI sense; too
  ambiguous to score reliably.
- **Flagging "highlight" as a verb** — ordinary in UI instructions
  ("highlight the row"), not a reliable tell.

The source list behind the marketing/banned-verb/overused-word rules, and
the rationale for each, lives in `scripts/lint-prose.mjs`.

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
