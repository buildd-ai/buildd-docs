import { source, memorySource } from '@/lib/source';
import { createSearchAPI } from 'fumadocs-core/search/server';

export const { GET } = createSearchAPI('advanced', {
  indexes: async () => {
    const results = [];

    for (const page of source.getPages()) {
      results.push({
        id: page.url,
        title: page.data.title,
        description: page.data.description,
        url: page.url,
        structuredData: page.data.structuredData,
      });
    }

    for (const page of memorySource.getPages()) {
      results.push({
        id: page.url,
        title: page.data.title,
        description: page.data.description,
        url: page.url,
        structuredData: page.data.structuredData,
      });
    }

    return results;
  },
  language: 'english',
});
