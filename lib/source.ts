import { docs, memoryDocs } from 'fumadocs-mdx:collections/server';
import { type InferPageType, loader } from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

export const memorySource = loader({
  baseUrl: '/memory',
  source: memoryDocs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

export function getPageImage(page: InferPageType<typeof source>) {
  const segments = [...page.slugs, 'image.png'];

  return {
    segments,
    url: `/og/docs/${segments.join('/')}`,
  };
}

export function getMemoryPageImage(page: InferPageType<typeof memorySource>) {
  const segments = [...page.slugs, 'image.png'];

  return {
    segments,
    url: `/og/memory/${segments.join('/')}`,
  };
}

export async function getLLMText(page: InferPageType<typeof source>) {
  const processed = await page.data.getText('processed');

  return `# ${page.data.title}

${processed}`;
}

export async function getMemoryLLMText(page: InferPageType<typeof memorySource>) {
  const processed = await page.data.getText('processed');

  return `# ${page.data.title}

${processed}`;
}
