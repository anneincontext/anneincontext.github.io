import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    lang: z.enum(['en', 'zh']).default('en'),
    tags: z.array(z.string()).default([]),
    category: z.string().default('Notes'),
    postType: z.enum(['professional', 'personal']).default('professional'),
    draft: z.boolean().default(false),
    legacyPath: z.string().optional()
  })
});

export const collections = { blog };
