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

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  async redirects() {
    return [
      ...memoryRedirects,
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
