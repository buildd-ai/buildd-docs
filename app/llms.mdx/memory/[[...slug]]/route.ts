import { getMemoryLLMText, memorySource } from '@/lib/source';
import { notFound } from 'next/navigation';

export const revalidate = false;

export async function GET(_req: Request, { params }: RouteContext<'/llms.mdx/memory/[[...slug]]'>) {
  const { slug } = await params;
  const page = memorySource.getPage(slug);
  if (!page) notFound();

  return new Response(await getMemoryLLMText(page), {
    headers: {
      'Content-Type': 'text/markdown',
    },
  });
}

export function generateStaticParams() {
  return memorySource.generateParams();
}
