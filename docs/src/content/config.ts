import { defineCollection, z } from 'astro:content';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
  docs: defineCollection({
    schema: docsSchema({
      extend: z.object({
        componentId: z.string().optional(),
        fixtureId: z.string().optional(),
        relatedSymbols: z.array(z.string()).optional(),
      }),
    }),
  }),
};
