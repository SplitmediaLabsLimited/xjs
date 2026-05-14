import { defineCollection, z } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      extend: z.object({
        componentId: z.string().optional(),
        fixtureId: z.string().optional(),
        relatedSymbols: z.array(z.string()).optional(),
      }),
    }),
  }),
};
