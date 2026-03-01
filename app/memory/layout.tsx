import { memorySource } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { memoryBaseOptions } from '@/lib/layout.shared';

export default function Layout({ children }: LayoutProps<'/memory'>) {
  return (
    <DocsLayout tree={memorySource.getPageTree()} {...memoryBaseOptions()}>
      {children}
    </DocsLayout>
  );
}
