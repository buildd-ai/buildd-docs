import { getMemoryPageImage, memorySource } from '@/lib/source';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/mdx-components';
import type { Metadata } from 'next';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { LLMCopyButton, ViewOptions } from '@/components/ai/page-actions';
import { memoryGitConfig } from '@/lib/layout.shared';

export default async function Page(props: PageProps<'/memory/[[...slug]]'>) {
  const params = await props.params;
  const page = memorySource.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription className="mb-0">{page.data.description}</DocsDescription>
      <div className="flex flex-row gap-2 items-center border-b pb-6">
        <LLMCopyButton markdownUrl={`${page.url}.mdx`} />
        <ViewOptions
          markdownUrl={`${page.url}.mdx`}
          githubUrl={`https://github.com/${memoryGitConfig.user}/${memoryGitConfig.repo}/blob/${memoryGitConfig.branch}/content/memory/${page.path}`}
        />
      </div>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            a: createRelativeLink(memorySource, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return memorySource.generateParams();
}

export async function generateMetadata(props: PageProps<'/memory/[[...slug]]'>): Promise<Metadata> {
  const params = await props.params;
  const page = memorySource.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      images: getMemoryPageImage(page).url,
    },
  };
}
