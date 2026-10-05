import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center py-16">
      <h1 className="text-3xl font-bold mb-2">Buildd Docs</h1>
      <p className="text-fd-muted-foreground mb-10">
        Task coordination for AI coding agents
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl w-full px-4">
        <Link
          href="/docs"
          className="flex flex-col gap-2 rounded-xl border bg-fd-card p-6 hover:bg-fd-accent transition-colors"
        >
          <span className="text-lg font-semibold">Documentation</span>
          <span className="text-sm text-fd-muted-foreground">
            Missions, runners, merge policies and the MCP server.
          </span>
        </Link>
        <Link
          href="/docs/getting-started/runner"
          className="flex flex-col gap-2 rounded-xl border bg-fd-card p-6 hover:bg-fd-accent transition-colors"
        >
          <span className="text-lg font-semibold">Install a runner</span>
          <span className="text-sm text-fd-muted-foreground">
            One command on your machine. It connects out to buildd and does the work.
          </span>
        </Link>
      </div>
    </main>
  );
}
