import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center py-16">
      <h1 className="text-3xl font-bold mb-2">Buildd Docs</h1>
      <p className="text-fd-muted-foreground mb-10">Choose a product to get started</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl w-full px-4">
        <Link
          href="/docs"
          className="flex flex-col gap-2 rounded-xl border bg-fd-card p-6 hover:bg-fd-accent transition-colors"
        >
          <span className="text-lg font-semibold">Task Queue</span>
          <span className="text-sm text-fd-muted-foreground">
            Task coordination for AI coding agents — create, claim, and track work.
          </span>
        </Link>
        <Link
          href="/memory"
          className="flex flex-col gap-2 rounded-xl border bg-fd-card p-6 hover:bg-fd-accent transition-colors"
        >
          <span className="text-lg font-semibold">Memory</span>
          <span className="text-sm text-fd-muted-foreground">
            Shared team memory for AI agents — persist knowledge across sessions.
          </span>
        </Link>
      </div>
    </main>
  );
}
