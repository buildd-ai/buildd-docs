import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/**
 * The standalone Memory docs site (/memory/**) was retired when the
 * memory.buildd.dev service was folded into buildd itself. Keep the old URLs
 * alive so existing links, bookmarks, and agent configs don't 404.
 */
const memoryRedirects = [
  ['/memory', '/docs/features/memory'],
  ['/memory/getting-started/quickstart', '/docs/features/memory'],
  ['/memory/getting-started/self-hosting', '/docs/deployment/self-hosting'],
  ['/memory/guides/memory-types', '/docs/features/memory#memory-types'],
  ['/memory/guides/agent-workflows', '/docs/features/memory#how-agents-use-memory'],
  ['/memory/guides/api-keys', '/docs/integrations/mcp-server'],
  ['/memory/api/authentication', '/docs/integrations/mcp-server'],
  ['/memory/api/keys', '/docs/integrations/mcp-server'],
  ['/memory/api/memories', '/docs/features/memory#api-reference'],
  ['/memory/mcp/tools', '/docs/integrations/mcp-server#recall-and-learn--team-knowledge'],
].map(([source, destination]) => ({ source, destination, permanent: true }));

/**
 * Retired feature pages.
 *
 * - "Recipes" (workflow templates) was removed from the product in June 2026;
 *   its endpoints are gone. Planning mode is the surviving mechanism for
 *   turning one request into a dependency-wired tree of child tasks.
 * - "Objectives" was renamed to "missions". The concept survives under the new
 *   name, so the old URL points at the rewritten page.
 */
const retiredFeatureRedirects = [
  ['/docs/features/recipes', '/docs/features/planning-mode'],
  ['/docs/features/objectives', '/docs/features/missions'],
  // A second, pre-rename mission page lived in its own one-page section and
  // described Build/Watch/Brief "mission types" that never existed in the
  // product. features/missions is the only mission page now.
  ['/docs/missions/overview', '/docs/features/missions'],
  ['/docs/missions', '/docs/features/missions'],
  // The Slack and Discord slash-command integrations were removed — never
  // configured in production, and three of their documented behaviours could
  // not occur. See docs/design/chat-integrations.md in buildd-ai/buildd for the
  // rebuild notes. MCP is the supported way to drive buildd from elsewhere.
  ['/docs/features/slack', '/docs/integrations/mcp-server'],
  ['/docs/features/discord', '/docs/integrations/mcp-server'],
].map(([source, destination]) => ({ source, destination, permanent: true }));

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  async redirects() {
    return [
      ...memoryRedirects,
      ...retiredFeatureRedirects,
      // Anything else under /memory, including the old `.mdx` plaintext URLs.
      { source: '/memory/:path*', destination: '/docs/features/memory', permanent: true },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/docs/:path*.mdx',
        destination: '/llms.mdx/docs/:path*',
      },
    ];
  },
};

export default withMDX(config);
