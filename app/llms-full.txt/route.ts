import { getLLMText, getMemoryLLMText, source, memorySource } from '@/lib/source';

export const revalidate = false;

export async function GET() {
  const docsScan = source.getPages().map(getLLMText);
  const memoryScan = memorySource.getPages().map(getMemoryLLMText);
  const scanned = await Promise.all([...docsScan, ...memoryScan]);

  return new Response(scanned.join('\n\n'));
}
